import { Droppable } from '@/components/Dnd/Dropable'
import useBattleStore from '@/store/battleStore'

type Props = {
  pokemonId: number
  playerId?: string

  moves: { name: string }[]
  disabled: boolean
}

export function MoveButtons({ pokemonId, moves, disabled }: Props) {
  const selectMove = useBattleStore((state) => state.selectMove)

  function handleMoveClick(moveName: string) {
    if (disabled) return
    selectMove(pokemonId, moveName)
  }

  return (
    <Droppable id={`moves-${pokemonId}`}>
      <div className="mt-4 grid grid-cols-2 gap-2 h-24 overflow-y-auto">
        {moves.map((move) => (
          <button
            key={`-${pokemonId}-${move.name}`}
            onClick={() => handleMoveClick(move.name)}
            className={`w-full px-2 py-1 rounded capitalize transition-colors text-white shadow-lg border-b-4 ${
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
