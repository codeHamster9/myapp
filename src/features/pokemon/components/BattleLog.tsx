import { useEffect, useRef } from 'react'

import useBattleStore from '@/store/battleStore'

export default function BattleLog() {
  const logContainerRef = useRef<HTMLDivElement>(null)
  const logs = useBattleStore((state) => state.gameLog)

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div
      ref={logContainerRef}
      className="mt-8 border p-4 rounded-lg bg-card shadow-inner max-h-64 min-h-32 overflow-y-auto scroll-smooth"
    >
      <h3 className="font-semibold mb-2 text-foreground">Battle Log</h3>
      {logs.map((log, i) => (
        <p
          key={i}
          className={`py-1 ${
            log.includes('wins')
              ? 'text-green-600 dark:text-green-400 font-semibold'
              : 'text-muted-foreground'
          }`}
        >
          {log}
        </p>
      ))}
    </div>
  )
}
