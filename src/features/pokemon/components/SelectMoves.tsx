import { Droppable } from '@/components/Dnd/Dropable'

type Props = {
  pokemonId: number
  playerId?: string
  onMoveSelect: (moveName: string) => void
  moves: { name: string }[]
  disabled: boolean
  winner?: string | null
}

export function SelectMoves({
  pokemonId,
  onMoveSelect,
  moves,
  disabled,
  winner,
}: Props) {
  return (
    <Droppable id={`moves-${pokemonId}`}>
      <div className="mt-4 grid grid-cols-2 gap-2 height-24 overflow-y-auto">
        {moves.map((move) => (
          <button
            key={`-${pokemonId}-${move.name}`}
            onClick={() => onMoveSelect(move.name)}
            className={`px-2 py-1 rounded capitalize transition-colors text-white  ${
              disabled || winner
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
