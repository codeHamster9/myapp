import { Move } from '../types/pokemon'
import { MoveButton } from './MoveButton'

type Props = {
  pokemonId: number
  moves: Move[]
  disabled: boolean
}

export function PokemonSelectedMoves({
  pokemonId,
  moves,
  disabled,
}: Props) {
  function handleMoveClick(move: Move) {
    if (disabled) return
    console.log('Move clicked:', move.name)
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-2 gap-y-1 min-h-32 overflow-y-auto">
      {moves.map((move) => (
        <MoveButton
          key={`${pokemonId}-${move.name}`}
          move={move}
          onClick={handleMoveClick}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
