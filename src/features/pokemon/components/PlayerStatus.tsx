interface PlayerStatusProps {
  playerId: number
  isReady: boolean
  isWinner: boolean
}

export function PlayerStatus({
  playerId,
  isReady,
  isWinner,
}: PlayerStatusProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-amber-500">{playerId}</h2>
      <span
        className={`px-2 py-1 rounded text-sm font-medium ${
          isWinner
            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold animate-pulse'
            : isReady
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        }`}
      >
        {isWinner ? '🏆 WINNER!' : isReady ? 'Ready' : 'Selecting moves...'}
      </span>
    </div>
  )
}
