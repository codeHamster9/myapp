import useBattleStore from '@/store/battleStore'

export const PlayersBanner = () => {
  const winner = useBattleStore((state) => state.winner)
  const currentPlayer = useBattleStore((state) => state.currentPlayer)
  const initGame = useBattleStore((state) => state.initGame)
  return (
    <>
      {winner && (
        <div className="mb-8 p-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">{winner} Wins!</h2>
          <button
            onClick={initGame}
            className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-50 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      {!winner && (
        <div className="mb-8 text-center text-xl font-semibold text-gray-700">
          Current Turn: {currentPlayer}
        </div>
      )}
    </>
  )
}
