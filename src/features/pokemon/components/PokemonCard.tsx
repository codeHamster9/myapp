import { Skeleton } from '@/components/ui/skeleton'

import { usePokemonCard } from '../hooks/usePokemonCard'
import type { Move } from '../types/pokemon'

import { HpBar } from './HpBar'
import { PokemonImage } from './PokemonImage'
import { PokemonName } from './PokemonName'
import { PokemonSelectedMoves } from './PokemonSelectedMoves'

interface Props {
  type: 'player' | 'opponent'
  pokemonId?: number
  roomCode?: string
  userId?: string
}

function PokemonCard({ pokemonId = 1, roomCode, userId }: Props) {
  const { pokemon, availableMoves, hp, isLoading } = usePokemonCard(
    pokemonId,
    roomCode || '',
    userId || '',
  )

  // Auto-select first 6 moves when available
  const preSelectedMoves = availableMoves.slice(0, 6)

  if (isLoading) {
    return (
      <div className="border rounded-lg bg-card shadow-md p-4">
        <Skeleton className="w-32 h-32 mx-auto" />
        <Skeleton className="h-6 mt-2" />
        <Skeleton className="h-4 mt-2" />
      </div>
    )
  }

  if (!pokemon) return null

  return (
    <div className="border rounded-lg bg-card shadow-md p-4">
      <PokemonImage src={pokemon.sprites.front_default} alt={pokemon.name} />
      <PokemonName name={pokemon.name} />
      <HpBar hp={hp} maxHp={pokemon.stats[0].base_stat} />
      <PokemonSelectedMoves
        pokemonId={pokemonId}
        moves={preSelectedMoves}
        disabled={false}
        roomCode={roomCode}
        userId={userId}
      />
    </div>
  )
}

export default PokemonCard
