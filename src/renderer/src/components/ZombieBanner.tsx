import { ProcessInfo } from '../../../shared/types'

interface Props {
  zombies: ProcessInfo[]
}

export function ZombieBanner({ zombies }: Props): JSX.Element | null {
  if (zombies.length === 0) return null

  return (
    <div className="flex items-center gap-3 bg-red-900/60 border border-red-700 text-red-200 px-4 py-3 text-sm">
      <span className="text-red-400 text-base">⚠</span>
      <span>
        좀비 프로세스 {zombies.length}개 감지됨 —{' '}
        {zombies.map((z) => `${z.projectName ?? 'node'} (PID ${z.pid})`).join(', ')}
      </span>
    </div>
  )
}
