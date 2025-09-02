import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

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
  currentPlayer: number
}

interface BattleActions {
  initGame: () => void
  isPlayerReady: (pokemonId: number) => boolean
  canStartGame: () => boolean
  updatePlayer: (playerId: number, updates: Partial<Omit<Player, 'id'>>) => void
  handleMove: (move: Move, playerId: number) => void
}

const getRandomPokemonId = () => Math.floor(Math.random() * 151) + 1

const initialState = {
  players: {
    1: { id: getRandomPokemonId(), ready: false, hp: 0, moves: [] },
    2: { id: getRandomPokemonId(), ready: false, hp: 0, moves: [] },
  },
  isPlayer1Turn: true,
  gameLog: [],
  winner: null,
  currentPlayer: 1,
}

const useBattleStore = create<BattleState & BattleActions>()(
  devtools(
    immer((set, get) => ({
      ...initialState,
      // Actions
      initGame: () => {
        set((state) => {
          state.players[1].id = getRandomPokemonId()
          state.players[2].id = getRandomPokemonId()
          state.players[1].ready = false
          state.players[2].ready = false
          state.players[1].hp = 0
          state.players[2].hp = 0
          state.players[1].moves = []
          state.players[2].moves = []
          state.isPlayer1Turn = true
          state.gameLog = []
          state.winner = null
          state.currentPlayer = 1
        })
      },

      updatePlayer: (
        playerId: number,
        updates: Partial<Omit<Player, 'id'>>,
      ) => {
        set((state) => {
          Object.assign(state.players[playerId], updates)
        })
      },

      handleMove: (move: Move, playerId: number) => {
        const { players, isPlayer1Turn } = get()
        const player = players[playerId]
        const opponent = players[playerId === 1 ? 2 : 1]

        if (!player || !opponent) return

        // Calculate damage between 0 and maxDamage (move power)
        const maxDamage = move.power || 40
        const damage = Math.floor(Math.random() * maxDamage)
        const newHp = Math.max(0, opponent.hp - damage)

        set((state) => {
          state.players[playerId === 1 ? 2 : 1].hp = newHp
          state.gameLog.push(
            `${playerId === 1 ? 'Player 1' : 'Player 2'} used ${move.name} for ${damage} damage!`,
          )
          state.isPlayer1Turn = !isPlayer1Turn
          state.currentPlayer = isPlayer1Turn ? 2 : 1
          if (newHp <= 0) {
            state.winner = playerId === 1 ? 'Player 1' : 'Player 2'
          }
        })
      },

      isPlayerReady: (playerId: number) => {
        const player = get().players[playerId]
        return player.ready
      },

      canStartGame: () => {
        const { players } = get()
        return players[1].ready && players[2].ready
      },
    })),
    { name: 'battle-store' },
  ),
)

export default useBattleStore
