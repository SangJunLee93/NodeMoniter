import { ElectronAPI } from '@electron-toolkit/preload'
import { ProcessInfo } from '../shared/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getNodeProcesses: () => Promise<ProcessInfo[]>
      getProcessDetail: (pid: number) => Promise<{ ports: number[]; uptimeSeconds: number }>
      killProcess: (pid: number, state: string) => Promise<{ success: boolean; error?: string }>
    }
  }
}
