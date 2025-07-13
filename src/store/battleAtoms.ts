import { atom } from 'jotai'
import { atomWithReset } from 'jotai/utils'

import type { Pokemon } from '../features/pokemon/types/pokemon'

interface PokemonPlayer {
  pokemon: Pokemon | null
  hp: number
  id: number
}

// Helper function to get random Pokemon ID
//TODO: prevent duplicates
export const getRandomPokemonId = () => Math.floor(Math.random() * 151) + 1

export const player1IdAtom = atom<number>(getRandomPokemonId())
export const player2IdAtom = atom<number>(getRandomPokemonId())
export const pokemonsAtom = atomWithReset<{ [id: number]: PokemonPlayer }>({})
export const isPlayer1TurnAtom = atom<boolean>(true)
export const gameLogAtom = atom<string[]>([])
export const winnerAtom = atom<string | null>(null)

// Derived atom for current turn display
export const currentTurnAtom = atom((get) =>
  get(isPlayer1TurnAtom) ? 'Player 1' : 'Player 2',
)

// Action atoms
export const initGameAtom = atom(null, (_, set) => {
  // Reset both players with new IDs
  set(pokemonsAtom, {})
  set(player1IdAtom, getRandomPokemonId())
  set(player2IdAtom, getRandomPokemonId())
  // Reset game state
  set(isPlayer1TurnAtom, true)
  set(gameLogAtom, [])
  set(winnerAtom, null)
})

export const handleMoveAtom = atom(
  null,
  (get, set, moveName: string, pokemonId: number) => {
    const winner = get(winnerAtom)
    if (winner) return

    const damage = Math.floor(Math.random() * 50) + 10
    const isPlayer1Turn = get(isPlayer1TurnAtom)
    const currentPlayer = get(currentTurnAtom)
    const { pokemon, hp } = get(pokemonById)(pokemonId)
    const newHP = Math.max(0, hp - damage)
    set(updatePokemonAtom, { pokemon: pokemon!, hp: newHP })
    set(gameLogAtom, (prev) => [
      ...prev,
      `${currentPlayer} used ${moveName} for ${damage} damage!`,
    ])

    if (newHP <= 0) {
      set(winnerAtom, currentPlayer)
      set(gameLogAtom, (prev) => [...prev, `${currentPlayer} wins the battle!`])
    } else {
      set(isPlayer1TurnAtom, !isPlayer1Turn)
    }
  },
)

export const pokemonById = atom((get) => (id: number) => get(pokemonsAtom)[id])

// Action to update Pokemon data when loaded
export const updatePokemonAtom = atom(
  null,
  (get, set, { pokemon, hp }: { pokemon: Pokemon; hp?: number }) => {
    console.log('pokemonUpdated', pokemon.name)
    set(pokemonsAtom, {
      ...get(pokemonsAtom),
      [pokemon.id]: {
        pokemon,
        hp: hp || pokemon.stats[0].base_stat,
        id: pokemon.id,
      },
    })
  },
)
