import { Droppable } from '@/components/Dnd/Dropable'
import useBattleStore from '@/store/battleStore'
import { Move } from '../types/pokemon'
import { MoveButton } from './MoveButton'

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
          <MoveButton
            key={`-${pokemonId}-${move.name}`}
            move={move}
            onClick={handleMoveClick}
            disabled={disabled}
          />
        ))}
      </div>
    </Droppable>
  )
}
