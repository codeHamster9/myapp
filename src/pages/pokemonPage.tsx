import { useAtom, useAtomValue } from 'jotai'
import React, { useEffect } from 'react'

import { PlayersBanner } from '../components/PlayersBanner'
import BattleLog from '../features/pokemon/components/BattleLog'
import PokemonCard from '../features/pokemon/components/PokemonCard'
import { usePokemon } from '../features/pokemon/services/pokemonService'
import type { Pokemon } from '../features/pokemon/types/pokemon'
import {
  handleMoveAtom,
  updatePokemonAtom,
  player1IdAtom,
  player2IdAtom,
  initGameAtom,
} from '../store/battleAtoms'

export default function PokemonPage() {
  // Read-only atoms

  const [, handleMove] = useAtom(handleMoveAtom)
  const [, updatePokemon] = useAtom(updatePokemonAtom)

  const player1Id = useAtomValue(player1IdAtom)
  const player2Id = useAtomValue(player2IdAtom)

  const [, initGame] = useAtom(initGameAtom)

  // Fetch Pokemon data using React Query
  const { data: pokemon1Data, isLoading: isLoading1 } = usePokemon(player1Id)
  const { data: pokemon2Data, isLoading: isLoading2 } = usePokemon(player2Id)
  // // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      initGame()
    }
  }, [initGame])

  if (isLoading1 || isLoading2) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>
  }
  // Update Pokemon data when loaded
  if (pokemon1Data) {
    updatePokemon({ pokemon: pokemon1Data as Pokemon })
  }
  if (pokemon2Data) {
    updatePokemon({ pokemon: pokemon2Data as Pokemon })
  }
  return (
    <main className="container mx-auto p-4">
      <PlayersBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PokemonCard
          pokemonId={player1Id}
          playerId={'Player 1'}
          onMoveSelect={(moveName) => handleMove(moveName, player2Id)}
        />
        <PokemonCard
          pokemonId={player2Id}
          playerId={'Player 2'}
          onMoveSelect={(moveName) => handleMove(moveName, player1Id)}
        />
      </div>

      <BattleLog />
    </main>
  )
}
