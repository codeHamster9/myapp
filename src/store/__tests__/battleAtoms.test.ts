import { getDefaultStore } from 'jotai'
import { describe, it, expect, beforeEach } from 'vitest'

import type { Pokemon } from '@/features/pokemon/types/pokemon'

import {
  pokemonsAtom,
  player1IdAtom,
  player2IdAtom,
  initGameAtom,
  handleMoveAtom,
  updatePokemonAtom,
  isPlayer1TurnAtom,
  winnerAtom,
} from '../battleAtoms'

describe('battleAtoms', () => {
  const store = getDefaultStore()

  beforeEach(() => {
    store.set(pokemonsAtom, {})
    store.set(player1IdAtom, 1)
    store.set(player2IdAtom, 2)
  })

  it('initializes game state', () => {
    store.set(initGameAtom)

    expect(store.get(pokemonsAtom)).toEqual({})
    expect(store.get(player1IdAtom)).toBeDefined()
    expect(store.get(player2IdAtom)).toBeDefined()
  })

  it('updates pokemon data', () => {
    const mockPokemon: Pokemon = {
      id: 1,
      name: 'Bulbasaur',
      stats: [{ base_stat: 100, stat: { name: 'hp' } }],
      sprites: { front_default: '' },
      moves: [],
    }

    store.set(updatePokemonAtom, { pokemon: mockPokemon })

    const pokemons = store.get(pokemonsAtom)
    expect(pokemons[1]).toEqual({
      pokemon: mockPokemon,
      hp: 100,
      id: 1,
    })
  })

  it('handles a move and updates game state', () => {
    const mockPokemon1: Pokemon = {
      id: 1,
      name: 'Bulbasaur',
      stats: [{ base_stat: 100, stat: { name: 'hp' } }],
      sprites: { front_default: '' },
      moves: [],
    }

    const mockPokemon2: Pokemon = {
      id: 2,
      name: 'Charmander',
      stats: [{ base_stat: 100, stat: { name: 'hp' } }],
      sprites: { front_default: '' },
      moves: [],
    }

    // Set up initial game state
    store.set(updatePokemonAtom, { pokemon: mockPokemon1 })
    store.set(updatePokemonAtom, { pokemon: mockPokemon2 })
    store.set(isPlayer1TurnAtom, true)
    store.set(winnerAtom, null)

    // Execute a move
    store.set(handleMoveAtom, 'Tackle', 2)

    // Check that damage was dealt
    const pokemons = store.get(pokemonsAtom)
    expect(pokemons[2].hp).toBeLessThan(100)

    // Check that turn switched
    expect(store.get(isPlayer1TurnAtom)).toBe(false)
  })

  it('handles a winning move', () => {
    const mockPokemon: Pokemon = {
      id: 2,
      name: 'Charmander',
      stats: [{ base_stat: 10, stat: { name: 'hp' } }],
      sprites: { front_default: '' },
      moves: [],
    }

    // Set up pokemon with low HP
    store.set(updatePokemonAtom, { pokemon: mockPokemon })

    // Execute move that should win
    store.set(handleMoveAtom, 'Tackle', 2)

    // Check winner was set
    expect(store.get(winnerAtom)).toBe('Player 2')
  })
})
