import { execFileSync } from 'child_process'
import type { ProcessInfo } from '../../shared/types'

export function scanNodeProcesses(): ProcessInfo[] {
  let output: string
  try {
    output = execFileSync('ps', ['-A', '-o', 'pid=,pcpu=,rss=,stat=,command='], {
      encoding: 'utf8'
    })
  } catch {
    return []
  }

  const processes: ProcessInfo[] = []

  for (const line of output.split('\n')) {
    const parts = line.trim().split(/\s+/)
    if (parts.length < 5) continue

    const [pidStr, cpuStr, rssStr, stat, ...cmdParts] = parts
    const command = cmdParts.join(' ')
    // node 또는 /path/to/node 바이너리만 필터
    const bin = cmdParts[0] ?? ''
    if (bin !== 'node' && !bin.endsWith('/node')) continue

    processes.push({
      pid: parseInt(pidStr, 10),
      cpuPercent: parseFloat(cpuStr),
      memoryMB: Math.round(parseInt(rssStr, 10) / 1024),
      state: parseState(stat),
      name: 'node',
      command,
      cwd: '',
      projectName: null
    })
  }

  return processes
}

function parseState(stat: string): ProcessInfo['state'] {
  if (stat.startsWith('Z')) return 'zombie'
  if (stat.startsWith('R')) return 'running'
  return 'sleeping'
}
