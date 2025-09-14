import { supabase } from '@/lib/supabase'
import { Move } from '../types/pokemon'
import { MoveButton } from './MoveButton'

type Props = {
  pokemonId: number
  moves: Move[]
  disabled: boolean
  roomCode?: string
  userId?: string
}

export function PokemonSelectedMoves({
  pokemonId,
  moves,
  disabled,
  roomCode,
  userId,
}: Props) {
  function handleMoveClick(move: Move) {
    if (disabled || !roomCode || !userId) return
    
    const damage = move.power || 0
    
    supabase
      .channel(`room-${roomCode}`)
      .send({
        type: 'broadcast',
        event: 'attack',
        payload: {
          damage,
          moveName: move.name,
          attackerId: userId,
          pokemonId,
        },
      })
    
    console.log('Attack broadcasted:', { damage, moveName: move.name })
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
