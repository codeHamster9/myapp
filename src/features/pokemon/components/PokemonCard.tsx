import { DndContext } from '@dnd-kit/core'
import { useState } from 'react'

import useBattleStore from '@/store/battleStore'

import { HpBar } from './HpBar'
import { PokemonAvailableMoves } from './PokemonAvailableMoves'
import { PokemonImage } from './PokemonImage'
import { PokemonName } from './PokemonName'
import { PokemonSelectedMoves } from './PokemonSelectedMoves'

interface Props {
  pokemonId: number
  playerId: string
}

export default function PokemonCard({ pokemonId, playerId }: Props) {
  const pokemonData = useBattleStore((state) => state.pokemons[pokemonId])
  const pokemon = pokemonData?.pokemon
  const offeredMoves = pokemonData?.offeredMoves || []
  const hp = useBattleStore((state) => state.pokemons[pokemonId]?.hp || 0)
  const { currentPlayer, winner, canStartGame } = useBattleStore(
    (state) => state,
  )

  const notMyTurn = currentPlayer !== playerId
  const [moves, setMoves] = useState<{ name: string }[]>([])
  const [usedMoves, setUsedMoves] = useState<string[]>([])

  if (!pokemon) return null

  const availableMoves = offeredMoves.filter(
    (move) => !usedMoves.includes(move),
  )

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (over && active.id !== over.id && moves.length < 6) {
      setMoves([...moves, { name: active.id as string }])
      setUsedMoves([...usedMoves, active.id as string])
    }
  }

  function handleClick(move: string) {
    setMoves([...moves, { name: move }])
    setUsedMoves([...usedMoves, move])
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
          <HpBar hp={hp} maxHp={pokemon.stats[0].base_stat} />
          <PokemonSelectedMoves
            pokemonId={pokemonId}
            moves={moves}
            disabled={canStartGame() && notMyTurn && !winner}
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
