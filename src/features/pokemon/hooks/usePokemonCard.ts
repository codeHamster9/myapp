import { useState, useEffect } from 'react'

import useBattleStore from '@/store/battleStore'

import { usePokemon, useMoves } from '../services/pokemonService'
import type { Move } from '../types/pokemon'

export function usePokemonCard(type: 'player' | 'opponent') {
  const winner = useBattleStore((state) => state.winner)
  const isMyTurn = useBattleStore((state) => state.isMyTurn)
  const player = useBattleStore((state) =>
    type === 'player' ? state.player : state.opponent,
  )
  const otherPlayer = useBattleStore((state) =>
    type === 'player' ? state.opponent : state.player,
  )
  const updatePlayer = useBattleStore((state) => state.updatePlayer)
  const clearAttackState = useBattleStore((state) => state.clearAttackState)
  const clearDefeatState = useBattleStore((state) => state.clearDefeatState)

  const { data: pokemon, isLoading: pokemonLoading } = usePokemon(
    player?.id || 0,
  )
  const { movesWithData, isLoading: movesLoading } = useMoves(pokemon?.moves)

  const [availableMoves, setAvailableMoves] = useState<Move[]>([])

  const isLoading = pokemonLoading || movesLoading
  const maxMoves = Math.min(6, movesWithData.length)
  const otherPlayerReady = otherPlayer?.ready || false
  const canStartGame = (player?.ready || false) && otherPlayerReady
  const isWinner = winner === (type === 'player' ? 'You' : 'Opponent')
  const isDefeated = player?.isDefeated || false

  useEffect(() => {
    if (movesWithData.length > 0) {
      setAvailableMoves(movesWithData)
      if (type === 'player') {
        console.log('HP updated to init')

        updatePlayer({
          hp: pokemon?.stats[0].base_stat || 0,
        })
      }
    }
  }, [movesWithData, type, pokemon?.stats, updatePlayer])

  useEffect(() => {
    if (player?.isAttacked) {
      const timer = setTimeout(() => {
        clearAttackState(type)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [player?.isAttacked, type, clearAttackState])

  return {
    player,
    pokemon,
    availableMoves,
    setAvailableMoves,
    updatePlayer,
    isLoading,
    maxMoves,
    canStartGame,
    isWinner,
    isDefeated,
    isMyTurn,
    winner,
    clearDefeatState,
  }
}
