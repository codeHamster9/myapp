import { Draggable } from '@/components/Dnd/Draggable'

import type { Move } from '../types/pokemon'

import { MoveButton } from './MoveButton'

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
          <MoveButton move={move} onDoubleClick={onClick} draggable={true} />
        </Draggable>
      ))}
    </div>
  )
}
