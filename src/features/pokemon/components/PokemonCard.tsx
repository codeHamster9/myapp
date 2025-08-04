import { DndContext } from '@dnd-kit/core'
import { useEffect, useState } from 'react'

import useBattleStore from '@/store/battleStore'

import { HpBar } from './HpBar'
import { MoveButtons } from './MoveButtons'
import { PokemonImage } from './PokemonImage'
import { PokemonName } from './PokemonName'
import { SelectMoves } from './SelectMoves'

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
  // const [offeredMoves, setOfferedMoves] = useState<{ name: string }[]>([])

  if (!pokemon) return null

  // console.log('PokemonCard', offeredMoves)

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (over && active.id !== over.id && moves.length < 6) {
      setMoves([...moves, { name: active.id as string }])
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-">
        <div className={`border rounded-lg bg-white shadow-md p-4`}>
          <h2 className="text-amber-500">{playerId}</h2>
          <PokemonImage
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
          />
          <PokemonName name={pokemon.name} />
          <HpBar hp={hp} maxHp={pokemon.stats[0].base_stat} />
          <MoveButtons
            pokemonId={pokemonId}
            moves={moves}
            disabled={canStartGame() && notMyTurn && !winner}
          />
        </div>
        <SelectMoves moves={offeredMoves} pokemonId={pokemonId} />
      </div>
    </DndContext>
  )
}
