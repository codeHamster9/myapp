import { Draggable } from '@/components/Dnd/Draggable'

interface MoveButtonsProps {
  moves: string[]
  pokemonId: number
}

export function SelectMoves({ moves, pokemonId }: MoveButtonsProps) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 border rounded-lg bg-white shadow-md p-4 h-62 overflow-y-auto">
      {moves.map((move) => (
        <Draggable key={`-${pokemonId}-${move}`} id={`${move}`}>
          <button
            className={`w-full bg-gray-500 hover:bg-gray-600 px-2 py-1 rounded capitalize transition-colors text-white shadow-lg border-b-4 border-gray-800 active:border-b-2 active:translate-y-1
                          hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[6rem] `}
            disabled={true}
          >
            {move}
          </button>
        </Draggable>
      ))}
    </div>
  )
}
