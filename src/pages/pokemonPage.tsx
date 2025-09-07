import React, { useEffect } from 'react'

import useBattleStore from '@/store/battleStore'

import { PlayersBanner } from '../components/PlayersBanner'
import BattleLog from '../features/pokemon/components/BattleLog'
import PokemonCard from '../features/pokemon/components/PokemonCard'

export default function PokemonPage() {
  const initGame = useBattleStore((state) => state.initGame)

  useEffect(() => {
    return () => {
      initGame()
    }
  }, [initGame])

  return (
    <main className="container mx-auto p-4 ">
      <PlayersBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PokemonCard playerId={1} />
        <PokemonCard playerId={2} />
      </div>

      <BattleLog />
    </main>
  )
}
