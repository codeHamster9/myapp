import { useState, useEffect } from 'react'

import { usePokemon, useMoves } from '../services/pokemonService'
import type { Move } from '../types/pokemon'

export function usePokemonCard(pokemonId: number) {
  const { data: pokemon, isLoading: pokemonLoading } = usePokemon(pokemonId)
  const { movesWithData, isLoading: movesLoading } = useMoves(pokemon?.moves)
  const [availableMoves, setAvailableMoves] = useState<Move[]>([])
  const [selectedMoves, setSelectedMoves] = useState<Move[]>([])
  const [hp, setHp] = useState(0)

  const isLoading = pokemonLoading || movesLoading
  const maxMoves = Math.min(6, movesWithData.length)

  useEffect(() => {
    if (movesWithData.length > 0) {
      setAvailableMoves(movesWithData)
    }
  }, [movesWithData])

  useEffect(() => {
    if (pokemon) {
      setHp(pokemon.stats[0].base_stat)
    }
  }, [pokemon])

  return {
    pokemon,
    availableMoves,
    setAvailableMoves,
    selectedMoves,
    setSelectedMoves,
    hp,
    setHp,
    isLoading,
    maxMoves,
  }
}
