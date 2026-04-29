import { execFile } from 'child_process'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { promisify } from 'util'
import type { ProcessInfo } from '../../shared/types'

const execFileAsync = promisify(execFile)

export async function enrichWithProjectInfo(processes: ProcessInfo[]): Promise<ProcessInfo[]> {
  return Promise.all(processes.map(async (proc) => {
    const cwd = await getCwd(proc.pid)
    const projectName = cwd ? await getProjectName(cwd) : null
    return { ...proc, cwd: cwd ?? '', projectName }
  }))
}

async function getCwd(pid: number): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync('lsof', ['-p', String(pid), '-d', 'cwd', '-Fn'])
    for (const line of stdout.split('\n')) {
      if (line.startsWith('n')) return line.slice(1).trim()
    }
    return null
  } catch {
    return null
  }
}

async function getProjectName(cwd: string): Promise<string | null> {
  try {
    const content = await readFile(join(cwd, 'package.json'), 'utf8')
    const pkg = JSON.parse(content)
    return typeof pkg.name === 'string' && pkg.name ? pkg.name : null
  } catch {
    return null
  }
}
