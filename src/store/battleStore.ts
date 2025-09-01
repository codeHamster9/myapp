import { create } from 'zustand'

import type { Move } from '@/features/pokemon/types/pokemon'

interface Player {
  id: number
  ready: boolean
  hp: number
  moves: Move[]
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
  setPlayerMoves: (playerId: number, moves: Move[]) => void
  handleMove: (move: Move, playerId: number) => void
}

const getRandomPokemonId = () => Math.floor(Math.random() * 151) + 1

const useBattleStore = create<BattleState & BattleActions>(
  (set, get, store) => ({
    players: {
      1: { id: getRandomPokemonId(), ready: true, hp: 0, moves: [] },
      2: { id: getRandomPokemonId(), ready: true, hp: 0, moves: [] },
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

    handleMove: (move: Move, playerId: number) => {
      const { players, isPlayer1Turn, gameLog, setPokemonHp } = get()
      const player = players[playerId]
      const opponent = players[playerId === 1 ? 2 : 1]

      if (!player || !opponent) return

      // Calculate damage based on move power
      const baseDamage = move.power || 40
      const randomFactor = Math.random() * 0.4 + 0.8 // 0.8 to 1.2 multiplier
      const damage = Math.floor(baseDamage * randomFactor)
      const newHp = Math.max(0, opponent.hp - damage)
      
      setPokemonHp(playerId === 1 ? 2 : 1, newHp)
      const log = `${playerId === 1 ? 'Player 1' : 'Player 2'} used ${move.name} for ${damage} damage!`

      set((state) => ({
        ...state,
        gameLog: [...gameLog, log],
        isPlayer1Turn: !isPlayer1Turn,
        currentPlayer: isPlayer1Turn ? 'Player 2' : 'Player 1',
        winner: newHp <= 0 ? (playerId === 1 ? 'Player 1' : 'Player 2') : state.winner
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

    setPlayerMoves: (playerId: number, moves: Move[]) => {
      set((state) => ({
        ...state,
        players: {
          ...state.players,
          [playerId]: {
            ...state.players[playerId],
            moves: moves,
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
