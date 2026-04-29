import { useState } from 'react'
import { useProcessList } from './hooks/useProcessList'
import { ProcessTable } from './components/ProcessTable'
import { ZombieBanner } from './components/ZombieBanner'
import { DetailPanel } from './components/DetailPanel'
import { KillDialog } from './components/KillDialog'
import { ProcessInfo } from '../../shared/types'

function App(): JSX.Element {
  const { processes, loading, error, refresh } = useProcessList()
  const [selected, setSelected] = useState<ProcessInfo | null>(null)
  const [killTarget, setKillTarget] = useState<ProcessInfo | null>(null)

  const zombies = processes.filter((p) => p.state === 'zombie')

  // 선택된 프로세스가 목록에서 사라지면 해제
  const currentSelected = selected && processes.find((p) => p.pid === selected.pid)
    ? processes.find((p) => p.pid === selected.pid)!
    : null

  async function handleKillConfirm(): Promise<void> {
    if (!killTarget) return
    setKillTarget(null)
    setSelected(null)
    await window.api.killProcess(killTarget.pid, killTarget.state)
    refresh()
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
        <span className="font-semibold text-white">NodeMoniter</span>
        <span className="text-xs text-gray-500">
          {loading ? '불러오는 중...' : `${processes.length}개 프로세스`}
        </span>
      </header>

      <ZombieBanner zombies={zombies} />

      {error ? (
        <div className="flex flex-1 items-center justify-center text-red-400 text-sm">{error}</div>
      ) : (
        <div className="flex flex-1 min-h-0">
          <ProcessTable
            processes={processes}
            selectedPid={currentSelected?.pid ?? null}
            onSelect={setSelected}
          />
          {currentSelected && (
            <DetailPanel
              proc={currentSelected}
              onKill={() => setKillTarget(currentSelected)}
            />
          )}
        </div>
      )}

      {killTarget && (
        <KillDialog
          proc={killTarget}
          onConfirm={handleKillConfirm}
          onCancel={() => setKillTarget(null)}
        />
      )}
    </div>
  )
}

export default App
