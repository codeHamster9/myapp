import { useAtom, useAtomValue } from 'jotai'

import {
  currentTurnAtom,
  pokemonById,
  winnerAtom,
} from '../../../store/battleAtoms'

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
  if (!pokemon) return null
  const notMyTurn = currentPlayer !== playerId
  return (
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
                hp < pokemon.stats[0].base_stat * 0.2 ? '#ef4444' : undefined,
            }}
          />
        </div>
        <p className="text-center mt-1">
          HP: {hp}/{pokemon.stats[0].base_stat}
        </p>
      </div>
      {
        <div className="mt-4 grid grid-cols-2 gap-2">
          {pokemon.moves.slice(0, 4).map((move) => (
            <button
              key={move.move.name}
              onClick={() => onMoveSelect(move.move.name)}
              disabled={notMyTurn}
              className={`px-2 py-1 rounded capitalize transition-colors ${
                notMyTurn || winner
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {move.move.name}
            </button>
          ))}
        </div>
      }
    </div>
  )
}
