import { create } from 'zustand'

import type { Pokemon } from '../features/pokemon/types/pokemon'

interface PokemonPlayer {
  pokemon: Pokemon | null
  hp: number
  id: number
  selectedMoves: string[]
  offeredMoves: string[]
}

interface BattleState {
  pokemons: Record<number, PokemonPlayer>
  player1Id: number
  player2Id: number
  isPlayer1Turn: boolean
  gameLog: string[]
  winner: string | null
  currentPlayer: string
}

interface BattleActions {
  initGame: () => void
  handleMove: (moveName: string, pokemonId: number) => void
  updatePokemon: (pokemon: Pokemon, hp?: number) => void
  selectMove: (pokemonId: number, moveName: string) => void
  isPlayerReady: (pokemonId: number) => boolean
  canStartGame: () => boolean
}

const getRandomPokemonId = () => Math.floor(Math.random() * 151) + 1

const useBattleStore = create<BattleState & BattleActions>((set, get) => ({
  // Initial state
  pokemons: {},
  player1Id: getRandomPokemonId(),
  player2Id: getRandomPokemonId(),
  isPlayer1Turn: true,
  gameLog: [],
  winner: null,
  currentPlayer: 'Player 1',

  // Actions
  initGame: () => {
    set({
      pokemons: {},
      player1Id: getRandomPokemonId(),
      player2Id: getRandomPokemonId(),
      isPlayer1Turn: true,
      gameLog: [],
      winner: null,
      currentPlayer: 'Player 1',
    })
  },

  handleMove: (moveName: string, pokemonId: number) => {
    const { winner, pokemons, isPlayer1Turn, currentPlayer } = get()
    if (winner) return

    const targetPokemon = pokemons[pokemonId]
    if (!targetPokemon) return

    const damage = Math.floor(Math.random() * 50) + 10
    const newHP = Math.max(0, targetPokemon.hp - damage)

    set((state) => ({
      pokemons: {
        ...state.pokemons,
        [pokemonId]: { ...targetPokemon, hp: newHP },
      },
      gameLog: [
        ...state.gameLog,
        `${currentPlayer} used ${moveName} for ${damage} damage!`,
      ],
      winner: newHP <= 0 ? currentPlayer : null,
      isPlayer1Turn: newHP <= 0 ? isPlayer1Turn : !isPlayer1Turn,
      currentPlayer:
        newHP <= 0 ? currentPlayer : isPlayer1Turn ? 'Player 2' : 'Player 1',
    }))

    if (newHP <= 0) {
      set((state) => ({
        gameLog: [...state.gameLog, `${currentPlayer} wins the battle!`],
      }))
    }
  },

  updatePokemon: (pokemon: Pokemon, hp?: number) => {
    set((state) => ({
      pokemons: {
        ...state.pokemons,
        [pokemon.id]: {
          pokemon,
          hp: hp || pokemon.stats[0].base_stat,
          id: pokemon.id,
          selectedMoves: [],
          offeredMoves: pokemon?.moves.slice(0, 10).map((m) => m.move.name),
        },
      },
    }))
  },

  selectMove: (pokemonId: number, moveName: string) => {
    set((state) => {
      const pokemon = state.pokemons[pokemonId]
      if (!pokemon || pokemon.selectedMoves.length >= 6) return state

      return {
        pokemons: {
          ...state.pokemons,
          [pokemonId]: {
            ...pokemon,
            selectedMoves: [...pokemon.selectedMoves, moveName],
          },
        },
      }
    })
  },

  isPlayerReady: (pokemonId: number) => {
    const pokemon = get().pokemons[pokemonId]
    return pokemon?.selectedMoves.length === 6
  },

  canStartGame: () => {
    const { pokemons, player1Id, player2Id } = get()
    return (
      pokemons[player1Id]?.selectedMoves.length === 6 &&
      pokemons[player2Id]?.selectedMoves.length === 6
    )
  },
}))

export default useBattleStore
