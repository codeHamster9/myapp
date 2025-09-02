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
  pokemonId: number
  playerId: number
}

export default function PokemonCard({ pokemonId, playerId }: Props) {
  const { updatePlayer, winner, canStartGame, players } = useBattleStore(
    (state) => state,
  )

  const player = players[playerId]
  const { data: pokemon } = usePokemon(pokemonId)
  const { movesWithData } = useMoves(pokemon?.moves)
  const [availableMoves, setAvailableMoves] = useState<Move[]>(
    movesWithData || [],
  )
  const [selectedMoves, setSelectedMoves] = useState<Move[]>([])

  useEffect(() => {
    if (movesWithData.length > 0) {
      updatePlayer(playerId, {
        moves: movesWithData,
        hp: pokemon?.stats[0].base_stat || 0,
      })
    }
  }, [movesWithData, playerId, pokemon?.stats, updatePlayer])

  // const notMyTurn = currentPlayer !== playerId

  if (!pokemon) return null

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (over && active.id !== over.id && selectedMoves.length < 6) {
      const draggedMove = availableMoves.find((m) => m.name === active.id)
      if (!draggedMove) return

      const newSelectedMoves = [...selectedMoves, draggedMove]
      setAvailableMoves([...availableMoves.filter((m) => m.name !== active.id)])
      setSelectedMoves(newSelectedMoves)

      // Set player ready when they reach exactly 6 moves
      if (newSelectedMoves.length === 6) {
        updatePlayer(playerId, { ready: true })
      }
    }
  }

  function handleClick(move: Move) {
    if (selectedMoves.length >= 6) return // Prevent selecting more than 6 moves

    const newSelectedMoves = [...selectedMoves, move]
    setAvailableMoves([...availableMoves.filter((m) => m.name !== move.name)])
    setSelectedMoves(newSelectedMoves)

    // Set player ready when they reach exactly 6 moves
    if (newSelectedMoves.length === 6) {
      updatePlayer(playerId, { ready: true })
    }
  }

  return (
    <div className="flex flex-col gap-">
      <DndContext onDragEnd={handleDragEnd}>
        <div className={`border rounded-lg bg-white shadow-md p-4`}>
          <h2 className="text-amber-500">{playerId}</h2>
          <PokemonImage
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
          />
          <PokemonName name={pokemon.name} />
          <HpBar hp={player.hp} maxHp={pokemon.stats[0].base_stat} />
          <PokemonSelectedMoves
            pokemonId={pokemonId}
            moves={player.moves || []}
            playerId={playerId}
            disabled={!canStartGame() && !winner}
          />
        </div>
        <PokemonAvailableMoves
          moves={availableMoves}
          pokemonId={pokemonId}
          onClick={handleClick}
        />
      </DndContext>
    </div>
  )
}
