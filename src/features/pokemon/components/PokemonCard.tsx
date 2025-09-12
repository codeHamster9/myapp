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
  type: 'player' | 'opponent'
  playerId?: string
}

function PokemonCard({ type }: Props) {
  const winner = useBattleStore((state) => state.winner)
  const isMyTurn = useBattleStore((state) => state.isMyTurn)
  const player = useBattleStore((state) =>
    type === 'player' ? state.player : state.opponent,
  )
  const otherPlayer = useBattleStore((state) =>
    type === 'player' ? state.opponent : state.player,
  )
  const otherPlayerReady = otherPlayer?.ready || false
  const clearAttackState = useBattleStore((state) => state.clearAttackState)
  const clearDefeatState = useBattleStore((state) => state.clearDefeatState)

  const isWinner = winner === (type === 'player' ? 'You' : 'Opponent')
  const isDefeated = player?.isDefeated || false

  // Calculate canStartGame locally
  const canStartGame = (player?.ready || false) && otherPlayerReady
  const { data: pokemon, isLoading: pokemonLoading } = usePokemon(
    player?.id || 0,
  )
  const { movesWithData, isLoading: movesLoading } = useMoves(pokemon?.moves)

  const [availableMoves, setAvailableMoves] = useState<Move[]>([])
  const [defeatColor, setDefeatColor] = useState('#ff0000')
  const defeatColors = [
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#ff00ff',
    '#00ffff',
    '#ffa500',
  ]
  const updatePlayer = useBattleStore((state) => state.updatePlayer)

  const isLoading = pokemonLoading || movesLoading
  const maxMoves = Math.min(6, movesWithData.length)

  useEffect(() => {
    if (movesWithData.length === 9) {
      console.log('move set', pokemon?.id)

      setAvailableMoves(movesWithData)
      if (player) {
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

  useEffect(() => {
    if (isDefeated) {
      let colorIndex = 0
      const colorInterval = setInterval(() => {
        setDefeatColor(defeatColors[colorIndex])
        colorIndex = (colorIndex + 1) % defeatColors.length
      }, 300)

      const clearTimer = setTimeout(() => {
        clearDefeatState(type)
      }, 5000)

      return () => {
        clearInterval(colorInterval)
        clearTimeout(clearTimer)
      }
    } else {
      setDefeatColor('#ff0000')
    }
  }, [isDefeated, type, clearDefeatState])

  if (isLoading) {
    return (
      <div className="border rounded-lg bg-card shadow-md p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-amber-500">
            {type === 'player' ? 'You' : 'Opponent'}
          </h2>
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

    if (
      over &&
      active.id !== over.id &&
      player &&
      player.moves.length < maxMoves
    ) {
      const draggedMove = availableMoves.find((m) => m.name === active.id)
      if (!draggedMove) return

      setAvailableMoves([...availableMoves.filter((m) => m.name !== active.id)])
      if (type === 'player') {
        updatePlayer({ moves: [...player.moves, draggedMove] })
      }

      if (player.moves.length === maxMoves - 1 && type === 'player') {
        updatePlayer({ ready: true })
      }
    }
  }

  function handleClick(move: Move) {
    if (!player || player.moves.length >= maxMoves || type !== 'player') return

    const moves = [...player.moves, move]
    setAvailableMoves([...availableMoves.filter((m) => m.name !== move.name)])
    updatePlayer({ moves })

    if (moves.length === maxMoves) {
      updatePlayer({ ready: true })
    }
  }

  function handleRandomSelectAll() {
    const remainingSlots = maxMoves - (player?.moves.length || 0)
    const shuffled = [...availableMoves].sort(() => Math.random() - 0.5)
    const randomMoves = shuffled.slice(0, remainingSlots)

    const newMoves = [...(player?.moves || []), ...randomMoves]
    setAvailableMoves(availableMoves.filter((m) => !randomMoves.includes(m)))
    if (type === 'player') {
      updatePlayer({
        moves: newMoves,
        ready: newMoves.length === maxMoves,
      })
    }
  }

  const cardContent = (
    <div className="flex flex-col">
      <DndContext onDragEnd={handleDragEnd}>
        <div className={`border rounded-lg bg-card shadow-md p-4`}>
          <PlayerStatus
            playerId={type === 'player' ? 1 : 2}
            isReady={player?.ready || false}
            isWinner={isWinner}
          />
          <PokemonImage
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
          />
          <PokemonName name={pokemon.name} />
          <HpBar hp={player?.hp || 0} maxHp={pokemon.stats[0].base_stat} />
          <PokemonSelectedMoves
            pokemonId={player?.id || 0}
            moves={player?.moves || []}
            disabled={
              !isMyTurn ||
              !canStartGame ||
              !!winner ||
              player?.isAttacked ||
              isDefeated
            }
          />
        </div>
        <PokemonAvailableMoves
          moves={availableMoves}
          pokemonId={player?.id || 0}
          onClick={handleClick}
          onRandomSelectAll={handleRandomSelectAll}
          isVisible={true}
        />
      </DndContext>
    </div>
  )

  if (player?.isAttacked) {
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

  if (isDefeated) {
    return (
      <ElectricBorder
        color={defeatColor}
        speed={4}
        chaos={3}
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
