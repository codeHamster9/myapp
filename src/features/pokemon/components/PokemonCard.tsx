import { DndContext } from '@dnd-kit/core'
import { useState, useEffect, useMemo } from 'react'

import useBattleStore from '@/store/battleStore'

import { usePokemon } from '../services/pokemonService'

import { HpBar } from './HpBar'
import { PokemonAvailableMoves } from './PokemonAvailableMoves'
import { PokemonImage } from './PokemonImage'
import { PokemonName } from './PokemonName'
import { PokemonSelectedMoves } from './PokemonSelectedMoves'

interface Props {
  pokemonId: number
  playerId: number
}

export type SimpleMove = {
  name: string
}

export default function PokemonCard({ pokemonId, playerId }: Props) {
  const { data: pokemon } = usePokemon(pokemonId)
  const movesOffset = 10

  const [availableMoves, setAvailableMoves] = useState<SimpleMove[]>([])
  const [selectedMoves, setSelectedMoves] = useState<SimpleMove[]>([])
  const [randomOffset] = useState(() =>
    Math.floor(Math.random() * (pokemon?.moves.length || 100)),
  )

  const { setPlayerReady, winner, canStartGame, setPokemonHp, players } =
    useBattleStore((state) => state)

  const player = players[playerId]

  const offeredMoves = useMemo(() => {
    if (!pokemon?.moves) return []
    return pokemon.moves
      .slice(randomOffset, randomOffset + movesOffset)
      .map((m) => ({ name: m.move.name }))
  }, [pokemon?.moves, randomOffset, movesOffset])

  useEffect(() => {
    if (offeredMoves.length > 0) {
      setAvailableMoves(offeredMoves)
      setPokemonHp(playerId, pokemon?.stats[0].base_stat || 0)
    }
  }, [offeredMoves])

  // const notMyTurn = currentPlayer !== playerId

  if (!pokemon) return null

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (over && active.id !== over.id && selectedMoves.length < 6) {
      const newSelectedMoves = [...selectedMoves, { name: active.id }]
      setAvailableMoves([...availableMoves.filter((m) => m.name !== active.id)])
      setSelectedMoves(newSelectedMoves)

      // Set player ready when they reach exactly 6 moves
      if (newSelectedMoves.length === 6) {
        setPlayerReady(playerId)
      }
    }
  }

  function handleClick(move: SimpleMove) {
    if (selectedMoves.length >= 6) return // Prevent selecting more than 6 moves

    const newSelectedMoves = [...selectedMoves, move]
    setAvailableMoves([...availableMoves.filter((m) => m.name !== move.name)])
    setSelectedMoves(newSelectedMoves)

    // Set player ready when they reach exactly 6 moves
    if (newSelectedMoves.length === 6) {
      setPlayerReady(playerId)
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
            moves={selectedMoves}
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
