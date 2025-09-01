import { create } from 'zustand'

import type { Pokemon } from '../features/pokemon/types/pokemon'

interface Player {
  id: number
  ready: boolean
  hp: number
}

interface BattleState {
  players: Record<number, Player>
  isPlayer1Turn: boolean
  gameLog: string[]
  winner: string | null
  currentPlayer: string
}

interface BattleActions {
  initGame: () => void
  isPlayerReady: (pokemonId: number) => boolean
  canStartGame: () => boolean
  setPlayerReady: (playerId: number) => void
  setPokemonHp: (playerId: number, hp: number) => void
  handleMove: (move: string, playerId: number) => void
}

const getRandomPokemonId = () => Math.floor(Math.random() * 151) + 1

const useBattleStore = create<BattleState & BattleActions>(
  (set, get, store) => ({
    players: {
      1: { id: getRandomPokemonId(), ready: false, hp: 0 },
      2: { id: getRandomPokemonId(), ready: false, hp: 0 },
    },

    isPlayer1Turn: true,
    gameLog: [],
    winner: null,
    currentPlayer: 'Player 1',

    // Actions
    initGame: () => {
      set(store.getInitialState())
    },

    setPokemonHp: (playerId: number, hp: number) => {
      set((state) => ({
        ...state,
        players: {
          ...state.players,
          [playerId]: {
            ...state.players[playerId],
            hp: hp,
          },
        },
      }))
    },

    handleMove: (move: string, playerId: number) => {
      const { players, isPlayer1Turn, gameLog, setPokemonHp } = get()
      const player = players[playerId]
      const opponent = players[playerId === 1 ? 2 : 1]

      if (!player || !opponent) return

      setPokemonHp(playerId === 1 ? 2 : 1, opponent.hp - 10)
      const log = `${playerId === 1 ? 'Player 1' : 'Player 2'} used ${move}`

      set((state) => ({
        ...state,
        gameLog: [...gameLog, log],
        isPlayer1Turn: !isPlayer1Turn,
        currentPlayer: isPlayer1Turn ? 'Player 2' : 'Player 1',
      }))
    },

    isPlayerReady: (playerId: number) => {
      const player = get().players[playerId]
      return player.ready
    },
    setPlayerReady: (playerId: number) => {
      set((state) => ({
        ...state,
        players: {
          ...state.players,
          [playerId]: {
            ...state.players[playerId],
            ready: true,
          },
        },
      }))
    },

    canStartGame: () => {
      const { players } = get()
      return players[1].ready && players[2].ready
    },
  }),
)

export default useBattleStore
