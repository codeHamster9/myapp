import { DndContext } from '@dnd-kit/core'
import { useAtom, useAtomValue } from 'jotai'
import { useState } from 'react'

import { Draggable } from '@/components/Dnd/Draggable'
import { Droppable } from '@/components/Dnd/Dropable'

import {
  currentTurnAtom,
  pokemonById,
  winnerAtom,
} from '../../../store/battleAtoms'

import { HpBar } from './HpBar'
import { PokemonImage } from './PokemonImage'
import { PokemonName } from './PokemonName'
import { SelectMoves } from './SelectMoves'
import { Move } from 'lucide-react'
import { MoveButtons } from './MoveButtons'

interface Props {
  pokemonId: number
  playerId: string
  onMoveSelect: (moveName: string) => void
}

export default function PokemonCard({
  pokemonId,
  playerId,
  onMoveSelect,
}: Props) {
  const [getPokemon] = useAtom(pokemonById)
  const winner = useAtomValue(winnerAtom)
  const currentTurn = useAtomValue(currentTurnAtom)
  const notMyTurn = currentTurn !== playerId

  const { pokemon, hp } = getPokemon(pokemonId)
  const [moves, setMoves] = useState<{ name: string }[]>([])

  const [offerdMoves, setOfferedMoves] = useState<{ name: string }[]>(
    pokemon.moves.slice(0, 10).map((move) => ({ name: move.move.name })),
  )
  if (!pokemon) return null

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (over && active.id !== over.id && moves.length < 6) {
      setMoves([...moves, { name: active.id as string }])
      setOfferedMoves(
        offerdMoves.filter(
          (move) => move.name !== active.id.replace('move-', ''),
        ),
      )
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-4">
        <div
          className={`border rounded-lg bg-white shadow-md p-4 ${
            winner === playerId ? 'animate-pulse' : ''
          }`}
        >
          <h2 className="text-amber-500">{playerId}</h2>
          <PokemonImage
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
          />
          <PokemonName name={pokemon.name} />
          <HpBar hp={hp} maxHp={pokemon.stats[0].base_stat} />
          <SelectMoves
            pokemonId={pokemonId}
            onMoveSelect={onMoveSelect}
            moves={moves}
            disabled={notMyTurn}
            winner={winner}
          />
        </div>
        <MoveButtons moves={offerdMoves} pokemonId={pokemonId} />
      </div>
    </DndContext>
  )
}
