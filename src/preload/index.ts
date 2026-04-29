import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  getNodeProcesses: () => ipcRenderer.invoke('get-node-processes'),
  getProcessDetail: (pid: number) => ipcRenderer.invoke('get-process-detail', pid),
  killProcess: (pid: number, state: string) => ipcRenderer.invoke('kill-process', pid, state)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}
