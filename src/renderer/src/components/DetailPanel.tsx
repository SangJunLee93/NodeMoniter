import { useState, useEffect } from 'react'
import { ProcessInfo } from '../../../shared/types'

interface Props {
  proc: ProcessInfo
  onKill: () => void
}

interface Detail {
  ports: number[]
  uptimeSeconds: number
}

function formatUptime(seconds: number): string {
  if (seconds === 0) return '-'
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (d > 0) return `${d}일 ${h}시간 ${m}분`
  if (h > 0) return `${h}시간 ${m}분 ${s}초`
  if (m > 0) return `${m}분 ${s}초`
  return `${s}초`
}

function getDisplayName(p: ProcessInfo): string {
  if (p.projectName) return p.projectName
  if (p.cwd && p.cwd !== '/') return p.cwd.split('/').filter(Boolean).pop() ?? 'node'
  return 'node'
}

export function DetailPanel({ proc, onKill }: Props): JSX.Element {
  const [detail, setDetail] = useState<Detail | null>(null)

  useEffect(() => {
    setDetail(null)
    window.api.getProcessDetail(proc.pid).then(setDetail).catch(() => setDetail({ ports: [], uptimeSeconds: 0 }))
  }, [proc.pid])

  return (
    <div className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col shrink-0">
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="font-semibold text-white truncate">{getDisplayName(proc)}</div>
        <div className="text-xs text-gray-500 font-mono mt-0.5">PID {proc.pid}</div>
      </div>

      <div className="flex-1 overflow-auto px-4 py-3 space-y-4 text-sm">
        <Row label="상태" value={
          <span className={proc.state === 'zombie' ? 'text-red-400' : proc.state === 'running' ? 'text-green-400' : 'text-gray-400'}>
            {proc.state === 'zombie' ? '좀비' : proc.state === 'running' ? '실행 중' : '대기'}
          </span>
        } />
        <Row label="CPU" value={`${proc.cpuPercent.toFixed(1)}%`} />
        <Row label="메모리" value={`${proc.memoryMB.toFixed(0)} MB`} />
        <Row label="업타임" value={detail ? formatUptime(detail.uptimeSeconds) : '...'} />
        <Row
          label="포트"
          value={detail
            ? detail.ports.length > 0 ? detail.ports.join(', ') : '없음'
            : '...'}
        />
        <div>
          <div className="text-gray-500 text-xs mb-1">명령어</div>
          <div className="text-gray-300 font-mono text-xs break-all leading-relaxed">{proc.command}</div>
        </div>
        {proc.cwd && proc.cwd !== '/' && (
          <div>
            <div className="text-gray-500 text-xs mb-1">경로</div>
            <div className="text-gray-400 text-xs break-all">{proc.cwd}</div>
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-800">
        <button
          onClick={onKill}
          className="w-full py-1.5 text-sm bg-red-600/80 hover:bg-red-600 text-white rounded transition-colors"
        >
          프로세스 종료
        </button>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }): JSX.Element {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="text-gray-300 text-right">{value}</span>
    </div>
  )
}
