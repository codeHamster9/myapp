import { DndContext } from '@dnd-kit/core'

import ElectricBorder from '@/components/ElectricBorder'
import { Skeleton } from '@/components/ui/skeleton'
import { roomService } from '@/services/roomService'

import { useDefeatAnimation } from '../hooks/useDefeatAnimation'
import { usePokemonCard } from '../hooks/usePokemonCard'
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
  gameId?: string
  userId?: string
}

function PokemonCard({ type, gameId, userId }: Props) {
  const {
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
  } = usePokemonCard(type)

  const defeatColor = useDefeatAnimation(isDefeated, clearDefeatState, type)

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

    if (gameId && userId) {
      roomService.broadcastMoveSelected(gameId, userId, move)
    }

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

      if (gameId && userId) {
        randomMoves.forEach(async (move) =>
          roomService.broadcastMoveSelected(gameId, userId, move),
        )
      }
    }
  }

  const isDisabled =
    type !== 'player' ||
    !isMyTurn ||
    !canStartGame ||
    !!winner ||
    player?.isAttacked ||
    isDefeated

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
            disabled={isDisabled}
            gameId={gameId}
            userId={userId}
          />
        </div>
        <PokemonAvailableMoves
          moves={availableMoves}
          pokemonId={player?.id || 0}
          onClick={handleClick}
          onRandomSelectAll={handleRandomSelectAll}
          isVisible={
            type === 'player' &&
            availableMoves.length > 0 &&
            (player?.moves.length || 0) < maxMoves
          }
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
