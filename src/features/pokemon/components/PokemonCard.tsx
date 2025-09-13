import { Skeleton } from '@/components/ui/skeleton'

import { usePokemonCard } from '../hooks/usePokemonCard'
import type { Move } from '../types/pokemon'

import { HpBar } from './HpBar'
import { PokemonImage } from './PokemonImage'
import { PokemonName } from './PokemonName'

interface Props {
  type: 'player' | 'opponent'
  pokemonId?: number
}

function PokemonCard({ type, pokemonId = 1 }: Props) {
  const {
    pokemon,
    availableMoves,
    setAvailableMoves,
    selectedMoves,
    setSelectedMoves,
    hp,
    isLoading,
    maxMoves,
  } = usePokemonCard(pokemonId)

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
    </div>
  )
}

export default PokemonCard
