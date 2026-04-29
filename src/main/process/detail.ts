import { execFileSync } from 'child_process'
import type { ProcessInfo } from '../../shared/types'

export function getPortsForPid(pid: number): number[] {
  try {
    const out = execFileSync('lsof', ['-p', String(pid), '-i', '-sTCP:LISTEN', '-Fn'], {
      encoding: 'utf8'
    })
    const ports: number[] = []
    for (const line of out.split('\n')) {
      if (line.startsWith('n')) {
        const match = line.match(/:(\d+)$/)
        if (match) ports.push(parseInt(match[1], 10))
      }
    }
    return [...new Set(ports)]
  } catch {
    return []
  }
}

export function getUptimeForPid(pid: number): number {
  try {
    const raw = execFileSync('ps', ['-p', String(pid), '-o', 'etime='], {
      encoding: 'utf8'
    }).trim()
    return parseEtime(raw)
  } catch {
    return 0
  }
}

// etime format: [[DD-]HH:]MM:SS
function parseEtime(etime: string): number {
  const parts = etime.split(':')
  if (parts.length === 3) {
    const first = parts[0]
    if (first.includes('-')) {
      const [days, hours] = first.split('-')
      return parseInt(days) * 86400 + parseInt(hours) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
    }
    return parseInt(first) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
  }
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1])
  }
  return 0
}

export function killProcess(pid: number, state: ProcessInfo['state']): void {
  if (state === 'zombie') {
    process.kill(pid, 'SIGKILL')
    return
  }
  try {
    process.kill(pid, 'SIGTERM')
  } catch {
    process.kill(pid, 'SIGKILL')
  }
}
