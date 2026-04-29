import { scanNodeProcesses } from './scanner'
import { enrichWithProjectInfo } from './projectMapper'
import type { ProcessInfo } from '../../shared/types'

export async function getNodeProcesses(): Promise<ProcessInfo[]> {
  const raw = scanNodeProcesses()
  return enrichWithProjectInfo(raw)
}
