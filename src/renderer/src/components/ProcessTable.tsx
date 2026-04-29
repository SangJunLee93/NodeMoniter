import { ProcessInfo } from '../../../shared/types'

interface Props {
  processes: ProcessInfo[]
  selectedPid: number | null
  onSelect: (proc: ProcessInfo) => void
}

const STATE_BADGE: Record<ProcessInfo['state'], { label: string; className: string }> = {
  running: { label: '실행 중', className: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  sleeping: { label: '대기', className: 'bg-gray-700/50 text-gray-400 border border-gray-600/30' },
  zombie: { label: '좀비', className: 'bg-red-500/20 text-red-400 border border-red-500/30 font-semibold' }
}

function getDisplayName(p: ProcessInfo): string {
  if (p.projectName) return p.projectName
  if (p.cwd && p.cwd !== '/') return p.cwd.split('/').filter(Boolean).pop() ?? 'node'
  return 'node'
}

function getScriptLabel(command: string): string {
  const parts = command.split(' ')
  if (parts.length <= 1) return ''
  const firstArg = parts[1]
  if (firstArg.startsWith('/')) {
    const filename = firstArg.split('/').pop() ?? firstArg
    return [filename, ...parts.slice(2)].join(' ')
  }
  return parts.slice(1).join(' ')
}

export function ProcessTable({ processes, selectedPid, onSelect }: Props): JSX.Element {
  if (processes.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-500 text-sm">
        실행 중인 Node.js 프로세스가 없습니다
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-sm text-left">
        <thead className="sticky top-0 bg-gray-900 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
          <tr>
            <th className="px-4 py-3">프로젝트</th>
            <th className="px-4 py-3">PID</th>
            <th className="px-4 py-3">CPU %</th>
            <th className="px-4 py-3">메모리</th>
            <th className="px-4 py-3">상태</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/60">
          {processes.map((p) => {
            const badge = STATE_BADGE[p.state]
            const scriptLabel = getScriptLabel(p.command)
            const isSelected = p.pid === selectedPid
            return (
              <tr
                key={p.pid}
                onClick={() => onSelect(p)}
                className={`cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-900/40 border-l-2 border-blue-500'
                    : p.state === 'zombie'
                      ? 'bg-red-950/20 hover:bg-red-950/30'
                      : 'hover:bg-gray-800/40'
                }`}
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{getDisplayName(p)}</div>
                  {scriptLabel && (
                    <div className="text-xs text-gray-500 font-mono mt-0.5 truncate max-w-xs" title={p.command}>
                      {scriptLabel}
                    </div>
                  )}
                  {p.cwd && p.cwd !== '/' && (
                    <div className="text-xs text-gray-600 truncate max-w-xs mt-0.5" title={p.cwd}>
                      {p.cwd}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.pid}</td>
                <td className="px-4 py-3 text-gray-300">{p.cpuPercent.toFixed(1)}%</td>
                <td className="px-4 py-3 text-gray-300">{p.memoryMB.toFixed(0)} MB</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${badge.className}`}>
                    {badge.label}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
