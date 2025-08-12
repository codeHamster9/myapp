import React, { useEffect } from 'react'

import useBattleStore from '@/store/battleStore'

import { PlayersBanner } from '../components/PlayersBanner'
import BattleLog from '../features/pokemon/components/BattleLog'
import PokemonCard from '../features/pokemon/components/PokemonCard'
import { usePokemon } from '../features/pokemon/services/pokemonService'
import type { Pokemon } from '../features/pokemon/types/pokemon'

export default function PokemonPage() {
  const { player1Id, player2Id, initGame, updatePokemon, pokemons } =
    useBattleStore((state) => state)

  const pokemon1Ready = pokemons[player1Id]?.pokemon !== null
  const pokemon2Ready = pokemons[player2Id]?.pokemon !== null

  // Fetch Pokemon data using React Query
  const {
    data: pokemon1Data,
    isLoading: isLoading1,
    isSuccess: isSuccess1,
  } = usePokemon(player1Id)
  const {
    data: pokemon2Data,
    isLoading: isLoading2,
    isSuccess: isSuccess2,
  } = usePokemon(player2Id)

  useEffect(() => {
    return () => {
      initGame()
    }
  }, [initGame])

  useEffect(() => {
    if (isSuccess1) {
      updatePokemon(pokemon1Data as Pokemon, pokemon1Data.stats[0].base_stat)
    }
    if (isSuccess2) {
      updatePokemon(pokemon2Data as Pokemon, pokemon2Data.stats[0].base_stat)
    }
  }, [isSuccess1, isSuccess2, pokemon1Data, pokemon2Data, updatePokemon])

  if (isLoading1 || isLoading2) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>
  }

  if (!pokemon1Ready || !pokemon2Ready) {
    return (
      <div className="container mx-auto p-4 text-center">
        Initializing battle...
      </div>
    )
  }

  return (
    <main className="container mx-auto p-4">
      <PlayersBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PokemonCard pokemonId={player1Id} playerId={'Player 1'} />
        <PokemonCard pokemonId={player2Id} playerId={'Player 2'} />
      </div>

      <BattleLog />
    </main>
  )
}
