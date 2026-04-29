export interface ProcessInfo {
  pid: number
  name: string
  command: string
  cpuPercent: number
  memoryMB: number
  state: 'running' | 'sleeping' | 'zombie'
  cwd: string
  projectName: string | null
}

export interface ProcessDetail extends ProcessInfo {
  ports: number[]
  uptimeSeconds: number
}
