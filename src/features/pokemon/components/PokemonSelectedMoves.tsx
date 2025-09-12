import { Droppable } from '@/components/Dnd/Dropable'
import useBattleStore from '@/store/battleStore'
import { Move } from '../types/pokemon'
import { MoveButton } from './MoveButton'

type Props = {
  pokemonId: number
  moves: Move[]
  disabled: boolean
  gameId?: string
  userId?: string
}

export function PokemonSelectedMoves({
  pokemonId,
  moves,
  disabled,
  gameId,
  userId,
}: Props) {
  const handleMove = useBattleStore((state) => state.handleMove)

  function handleMoveClick(move: Move) {
    if (disabled) return
    console.log('🎯 Attack initiated:', { move: move.name, gameId, userId })
    handleMove(move, gameId, userId)
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
