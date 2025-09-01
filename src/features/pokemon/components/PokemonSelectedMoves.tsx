import { Droppable } from '@/components/Dnd/Dropable'
import useBattleStore from '@/store/battleStore'
import { Move } from '../types/pokemon'

type Props = {
  pokemonId: number
  playerId?: number
  moves: Move[]
  disabled: boolean
}

export function PokemonSelectedMoves({
  pokemonId,
  moves,
  disabled,
  playerId,
}: Props) {
  const handleMove = useBattleStore((state) => state.handleMove)

  function handleMoveClick(move: Move) {
    if (disabled) return
    handleMove(move, playerId)
  }

  return (
    <Droppable id={`moves-${pokemonId}`}>
      <div className="mt-4 grid grid-cols-2 gap-2 gap-y-1 min-h-32 overflow-y-auto">
        {moves.map((move) => (
          <button
            key={`-${pokemonId}-${move.name}`}
            onClick={() => handleMoveClick(move)}
            className={`h-9 w-full px-2 py-1 rounded capitalize transition-colors text-white shadow-lg border-b-4 ${
              disabled
                ? 'bg-gray-400 cursor-not-allowed border-gray-600'
                : 'bg-blue-500 hover:bg-blue-600 border-blue-700 hover:-translate-y-0.5 hover:shadow-xl active:border-b-2 active:translate-y-0.5'
            }`}
          >
            {move.name}
          </button>
        ))}
      </div>
    </Droppable>
  )
}
