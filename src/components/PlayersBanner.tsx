import { useAtomValue, useSetAtom } from 'jotai'

import {
  winnerAtom,
  isPlayer1TurnAtom,
  initGameAtom,
} from '../store/battleAtoms'

export const PlayersBanner = () => {
  const winner = useAtomValue(winnerAtom)
  const currentTurn = useAtomValue(isPlayer1TurnAtom)
  const initGame = useSetAtom(initGameAtom)
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
          Current Turn: {currentTurn}
        </div>
      )}
    </>
  )
}
