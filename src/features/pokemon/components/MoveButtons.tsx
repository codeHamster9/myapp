import { useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { Droppable } from '@/components/Dnd/Dropable'
import { player1ReadyAtom, player2ReadyAtom } from '@/store/battleAtoms'

type Props = {
  pokemonId: number
  playerId?: string
  onMoveSelect: (moveName: string) => void
  moves: { name: string }[]
  disabled: boolean
}

export function MoveButtons({
  pokemonId,
  playerId,
  onMoveSelect,
  moves,
  disabled,
}: Props) {
  const setPlayer1Ready = useSetAtom(player1ReadyAtom)
  const setPlayer2Ready = useSetAtom(player2ReadyAtom)

  function handleMoveClick(moveName: string) {
    if (disabled) return
    onMoveSelect(moveName)
  }

  useEffect(() => {
    if (moves.length === 6) {
      if (playerId === '1') setPlayer1Ready(true)
      if (playerId === '2') setPlayer2Ready(true)
    } else {
      console.log('Moves not ready yet', moves.length)

      if (playerId === '1') setPlayer1Ready(false)
      if (playerId === '2') setPlayer2Ready(false)
    }
  }, [moves.length, playerId, setPlayer1Ready, setPlayer2Ready])

  return (
    <Droppable id={`moves-${pokemonId}`}>
      <div className="mt-4 grid grid-cols-2 gap-2 height-24 overflow-y-auto">
        {moves.map((move) => (
          <button
            key={`-${pokemonId}-${move.name}`}
            onClick={() => handleMoveClick(move.name)}
            className={`px-2 py-1 rounded capitalize transition-colors text-white  ${
              disabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {move.name}
          </button>
        ))}
      </div>
    </Droppable>
  )
}
