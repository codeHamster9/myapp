import { Draggable } from '@/components/Dnd/Draggable'
import type { Move } from '../types/pokemon'

interface MoveButtonsProps {
  moves: Move[]
  pokemonId: number
  onClick: (move: Move) => void
}

export function PokemonAvailableMoves({
  moves,
  pokemonId,
  onClick,
}: MoveButtonsProps) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 gap-y-2 border rounded-lg bg-white shadow-md p-4 min-h-20 overflow-y-auto">
      {moves.map((move) => (
        <Draggable key={`-${pokemonId}-${move.name}`} id={`${move.name}`}>
          <button
            className={`w-full bg-gray-500 hover:bg-gray-600 px-2 py-1 rounded capitalize transition-colors text-white shadow-lg border-b-4 border-gray-800 active:border-b-2 active:translate-y-1
                          hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[6rem] `}
            disabled={false}
            onDoubleClick={() => onClick(move)}
          >
            {move.name}
          </button>
        </Draggable>
      ))}
    </div>
  )
}
