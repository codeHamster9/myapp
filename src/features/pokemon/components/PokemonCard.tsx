import { DndContext } from '@dnd-kit/core'
import { useAtom, useAtomValue } from 'jotai'

import {
  currentTurnAtom,
  pokemonById,
  winnerAtom,
} from '../../../store/battleAtoms'
import { Droppable } from '@/components/Dnd/Dropable'
import { Draggable } from '@/components/Dnd/Draggable'
import { useState } from 'react'

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
  const currentPlayer = useAtomValue(currentTurnAtom)
  const { pokemon, hp } = getPokemon(pokemonId)
  const [moves, setMoves] = useState<{ name: string }[]>([])
  const notMyTurn = currentPlayer !== playerId

  if (!pokemon) return null

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setMoves([...moves, { name: active.id as string }])
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
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-32 h-32 mx-auto"
          />
          <h2 className="text-xl capitalize text-center font-semibold text-gray-800">
            {pokemon.name}
          </h2>
          <div className="mt-2">
            <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(hp / pokemon.stats[0].base_stat) * 100}%`,
                  backgroundColor:
                    hp < pokemon.stats[0].base_stat * 0.2
                      ? '#ef4444'
                      : undefined,
                }}
              />
            </div>
            <p className="text-center mt-1">
              HP: {hp}/{pokemon.stats[0].base_stat}
            </p>
          </div>
          {
            <Droppable id={`moves-${pokemonId}`}>
              <div className="mt-4 grid grid-cols-2 gap-2 height-24 overflow-y-auto">
                {moves.map((move) => (
                  <button
                    key={`-${pokemonId}-${move.name}`}
                    onClick={() => onMoveSelect(move.name)}
                    className="px-2 py-1 rounded capitalize transition-colors bg-gray-400 cursor-not-allowed text-white"
                  >
                    {move.name}
                  </button>
                ))}
              </div>
            </Droppable>
          }
        </div>
        <div className="mt-4mt-4 grid grid-cols-2 gap-2 border rounded-lg bg-white shadow-md p-4">
          {pokemon.moves.slice(0, 10).map((move) => (
            <Draggable
              key={`-${pokemonId}-${move.move.name}`}
              id={`-${pokemonId}-${move.move.name}`}
            >
              <button className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded capitalize transition-colors">
                {move.move.name}
              </button>
            </Draggable>
          ))}
        </div>
      </div>
    </DndContext>
  )
}
