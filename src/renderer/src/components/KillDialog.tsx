import { ProcessInfo } from '../../../shared/types'

interface Props {
  proc: ProcessInfo
  onConfirm: () => void
  onCancel: () => void
}

function getDisplayName(p: ProcessInfo): string {
  if (p.projectName) return p.projectName
  if (p.cwd && p.cwd !== '/') return p.cwd.split('/').filter(Boolean).pop() ?? 'node'
  return 'node'
}

export function KillDialog({ proc, onConfirm, onCancel }: Props): JSX.Element {
  const isZombie = proc.state === 'zombie'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-80 p-5 shadow-xl">
        <h2 className="text-white font-semibold mb-1">프로세스 종료</h2>
        <p className="text-gray-400 text-sm mb-4">
          <span className="text-white font-medium">{getDisplayName(proc)}</span>
          {' '}(PID {proc.pid})을 종료하시겠습니까?
          {isZombie && (
            <span className="block mt-1 text-red-400">좀비 프로세스로 SIGKILL이 적용됩니다.</span>
          )}
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            종료
          </button>
        </div>
      </div>
    </div>
  )
}
