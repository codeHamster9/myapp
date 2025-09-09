import { DndContext } from '@dnd-kit/core'
import { useState, useEffect } from 'react'

import ElectricBorder from '@/components/ElectricBorder'
import { Skeleton } from '@/components/ui/skeleton'
import useBattleStore from '@/store/battleStore'

import { usePokemon, useMoves } from '../services/pokemonService'
import type { Move } from '../types/pokemon'

import { HpBar } from './HpBar'
import { PlayerStatus } from './PlayerStatus'
import { PokemonAvailableMoves } from './PokemonAvailableMoves'
import { PokemonImage } from './PokemonImage'
import { PokemonName } from './PokemonName'
import { PokemonSelectedMoves } from './PokemonSelectedMoves'

interface Props {
  playerId: number
}

function PokemonCard({ playerId }: Props) {
  const winner = useBattleStore((state) => state.winner)
  const currentPlayer = useBattleStore((state) => state.currentPlayer)
  const player = useBattleStore((state) => state.players[playerId])
  const otherPlayerReady = useBattleStore(
    (state) => state.players[playerId === 1 ? 2 : 1].ready,
  )
  const clearAttackState = useBattleStore((state) => state.clearAttackState)
  
  const isWinner = winner === `Player ${playerId}`

  // Calculate canStartGame locally
  const canStartGame = player.ready && otherPlayerReady
  const { data: pokemon, isLoading: pokemonLoading } = usePokemon(player.id)
  const { movesWithData, isLoading: movesLoading } = useMoves(pokemon?.moves)
  const [availableMoves, setAvailableMoves] = useState<Move[]>([])
  const [showWinnerBorder, setShowWinnerBorder] = useState(false)
  const updatePlayer = useBattleStore((state) => state.updatePlayer)

  const isLoading = pokemonLoading || movesLoading
  const maxMoves = Math.min(6, movesWithData.length)

  useEffect(() => {
    if (movesWithData.length > maxMoves) {
      setAvailableMoves(movesWithData)
      updatePlayer(playerId, {
        hp: pokemon?.stats[0].base_stat || 0,
      })
    }
  }, [movesWithData, playerId, pokemon?.stats, updatePlayer])

  useEffect(() => {
    if (player.isAttacked) {
      const timer = setTimeout(() => {
        clearAttackState(playerId)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [player.isAttacked, playerId, clearAttackState])

  useEffect(() => {
    if (isWinner && !player.isAttacked) {
      setShowWinnerBorder(true)
      const timer = setTimeout(() => {
        setShowWinnerBorder(false)
      }, 5000)
      return () => clearTimeout(timer)
    } else {
      setShowWinnerBorder(false)
    }
  }, [isWinner, player.isAttacked])

  if (isLoading) {
    return (
      <div className="border rounded-lg bg-card shadow-md p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-amber-500">Player {playerId}</h2>
          <span className="px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Loading...
          </span>
        </div>
        <Skeleton className="w-32 h-32 mx-auto" />
        <Skeleton className="h-6 mt-2" />
        <Skeleton className="h-4 mt-2" />
        <div className="mt-4 grid grid-cols-2 gap-2 gap-y-1 min-h-32">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-9" />
          ))}
        </div>
      </div>
    )
  }

  if (!pokemon) return null

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (over && active.id !== over.id && player.moves.length < maxMoves) {
      const draggedMove = availableMoves.find((m) => m.name === active.id)
      if (!draggedMove) return

      setAvailableMoves([...availableMoves.filter((m) => m.name !== active.id)])
      updatePlayer(playerId, { moves: [...player.moves, draggedMove] })

      if (player.moves.length === maxMoves - 1) {
        updatePlayer(playerId, { ready: true })
      }
    }
  }

  function handleClick(move: Move) {
    if (player.moves.length >= maxMoves) return

    const moves = [...player.moves, move]
    setAvailableMoves([...availableMoves.filter((m) => m.name !== move.name)])
    updatePlayer(playerId, { moves })

    if (moves.length === maxMoves) {
      updatePlayer(playerId, { ready: true })
    }
  }

  function handleRandomSelectAll() {
    const remainingSlots = maxMoves - player.moves.length
    const shuffled = [...availableMoves].sort(() => Math.random() - 0.5)
    const randomMoves = shuffled.slice(0, remainingSlots)

    const newMoves = [...player.moves, ...randomMoves]
    setAvailableMoves(availableMoves.filter((m) => !randomMoves.includes(m)))
    updatePlayer(playerId, {
      moves: newMoves,
      ready: newMoves.length === maxMoves,
    })
  }

  const cardContent = (
    <div className="flex flex-col">
      <DndContext onDragEnd={handleDragEnd}>
        <div className={`border rounded-lg bg-card shadow-md p-4`}>
          <PlayerStatus
            playerId={playerId}
            isReady={player.ready}
            isWinner={isWinner}
          />
          <PokemonImage
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
          />
          <PokemonName name={pokemon.name} />
          <HpBar hp={player.hp} maxHp={pokemon.stats[0].base_stat} />
          <PokemonSelectedMoves
            pokemonId={player.id}
            moves={player.moves}
            disabled={currentPlayer !== playerId || !canStartGame || !!winner || player.isAttacked || showWinnerBorder}
          />
        </div>
        <PokemonAvailableMoves
          moves={availableMoves}
          pokemonId={player.id}
          onClick={handleClick}
          onRandomSelectAll={handleRandomSelectAll}
          isVisible={
            availableMoves.length > 0 && player.moves.length < maxMoves
          }
        />
      </DndContext>
    </div>
  )

  if (player.isAttacked) {
    return (
      <ElectricBorder
        color="#ff0000"
        speed={3}
        chaos={2}
        thickness={2}
        style={{ borderRadius: 16 }}
      >
        {cardContent}
      </ElectricBorder>
    )
  }

  if (showWinnerBorder) {
    return (
      <ElectricBorder
        color="#ffd700"
        speed={2}
        chaos={1.5}
        thickness={3}
        style={{ borderRadius: 16 }}
      >
        {cardContent}
      </ElectricBorder>
    )
  }

  return cardContent
}

export default PokemonCard
