import { DndContext } from '@dnd-kit/core'
import { useState, useEffect } from 'react'

import useBattleStore from '@/store/battleStore'

import { usePokemon, useMoves } from '../services/pokemonService'
import type { Move } from '../types/pokemon'

import { HpBar } from './HpBar'
import { PokemonAvailableMoves } from './PokemonAvailableMoves'
import { PokemonImage } from './PokemonImage'
import { PokemonName } from './PokemonName'
import { PokemonSelectedMoves } from './PokemonSelectedMoves'

interface Props {
  playerId: number
}

export default function PokemonCard({ playerId }: Props) {
  const updatePlayer = useBattleStore((state) => state.updatePlayer)
  const winner = useBattleStore((state) => state.winner)
  const canStartGame = useBattleStore((state) => state.canStartGame)
  const players = useBattleStore((state) => state.players)
  const currentPlayer = useBattleStore((state) => state.currentPlayer)

  const player = players[playerId]
  const { data: pokemon } = usePokemon(player.id)
  const { movesWithData } = useMoves(pokemon?.moves)
  const [availableMoves, setAvailableMoves] = useState<Move[]>([])

  useEffect(() => {
    if (movesWithData.length === 10) {
      setAvailableMoves(movesWithData)
      updatePlayer(playerId, {
        hp: pokemon?.stats[0].base_stat || 0,
      })
    }
  }, [movesWithData, playerId, pokemon?.stats, updatePlayer])

  if (!pokemon) return null

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (over && active.id !== over.id && player.moves.length < 6) {
      const draggedMove = availableMoves.find((m) => m.name === active.id)
      if (!draggedMove) return

      setAvailableMoves([...availableMoves.filter((m) => m.name !== active.id)])
      updatePlayer(playerId, { moves: [...player.moves, draggedMove] })

      if (player.moves.length === 6) {
        updatePlayer(playerId, { ready: true })
      }
    }
  }

  function handleClick(move: Move) {
    if (player.moves.length >= 6) return

    const moves = [...player.moves, move]
    setAvailableMoves([...availableMoves.filter((m) => m.name !== move.name)])
    updatePlayer(playerId, { moves })

    if (moves.length === 6) {
      updatePlayer(playerId, { ready: true })
    }
  }

  return (
    <div className="flex flex-col gap-">
      <DndContext onDragEnd={handleDragEnd}>
        <div className={`border rounded-lg bg-white shadow-md p-4`}>
          <div className="flex items-center justify-between">
            <h2 className="text-amber-500">{playerId}</h2>
            <span
              className={`px-2 py-1 rounded text-sm font-medium ${
                player.ready
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {player.ready ? 'Ready' : 'Selecting moves...'}
            </span>
          </div>
          <PokemonImage
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
          />
          <PokemonName name={pokemon.name} />
          <HpBar hp={player.hp} maxHp={pokemon.stats[0].base_stat} />
          <PokemonSelectedMoves
            pokemonId={player.id}
            moves={player.moves}
            playerId={playerId}
            disabled={currentPlayer !== playerId && !canStartGame() && !winner}
          />
        </div>
        {availableMoves.length ? (
          <PokemonAvailableMoves
            moves={availableMoves}
            pokemonId={player.id}
            onClick={handleClick}
          />
        ) : null}
      </DndContext>
    </div>
  )
}
