import { useState, useEffect, useCallback } from 'react'
import { ProcessInfo } from '../../../shared/types'

const POLL_INTERVAL = 3000

export function useProcessList(): {
  processes: ProcessInfo[]
  loading: boolean
  error: string | null
  refresh: () => void
} {
  const [processes, setProcesses] = useState<ProcessInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false

    async function fetchProcesses(): Promise<void> {
      try {
        const result = await window.api.getNodeProcesses()
        if (!cancelled) {
          setProcesses(result)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) setError(String(e))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProcesses()
    const id = setInterval(fetchProcesses, POLL_INTERVAL)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [tick])

  return { processes, loading, error, refresh }
}
