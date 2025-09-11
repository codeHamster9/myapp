import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import type { Move } from '@/features/pokemon/types/pokemon'

interface Player {
  id: number
  ready: boolean
  hp: number
  moves: Move[]
  isAttacked: boolean
  isDefeated: boolean
}

interface BattleState {
  player: Player | null
  opponent: Player | null
  isMyTurn: boolean
  gameLog: string[]
  winner: string | null
}

interface BattleActions {
  initPlayer: () => void
  setOpponent: (opponentData: Player) => void
  canStartGame: () => boolean
  updatePlayer: (updates: Partial<Omit<Player, 'id'>>) => void
  updateOpponent: (updates: Partial<Omit<Player, 'id'>>) => void
  handleMove: (move: Move) => void
  clearAttackState: (target: 'player' | 'opponent') => void
  clearDefeatState: (target: 'player' | 'opponent') => void
}

const getRandomPokemonId = () => Math.floor(Math.random() * 151) + 1

const initialState = {
  player: null,
  opponent: null,
  isMyTurn: true,
  gameLog: [],
  winner: null,
}

const useBattleStore = create<BattleState & BattleActions>()(
  devtools(
    immer((set, get) => ({
      ...initialState,
      // Actions
      initPlayer: () => {
        set((state) => {
          state.player = {
            id: getRandomPokemonId(),
            ready: false,
            hp: 0,
            moves: [],
            isAttacked: false,
            isDefeated: false,
          }
          state.opponent = null
          state.isMyTurn = true
          state.gameLog = []
          state.winner = null
        })
      },

      setOpponent: (opponentData: Player | null) => {
        set((state) => {
          state.opponent = opponentData
        })
      },

      updatePlayer: (updates: Partial<Omit<Player, 'id'>>) => {
        set((state) => {
          if (state.player) {
            Object.assign(state.player, updates)
          }
        })
      },

      updateOpponent: (updates: Partial<Omit<Player, 'id'>>) => {
        set((state) => {
          if (state.opponent) {
            Object.assign(state.opponent, updates)
          }
        })
      },

      handleMove: (move: Move) => {
        const { player, opponent } = get()

        if (!player || !opponent) return

        // Calculate damage between 0 and maxDamage (move power)
        const maxDamage = move.power || 40
        const damage = Math.floor(Math.random() * maxDamage)
        const newHp = Math.max(0, opponent.hp - damage)

        set((state) => {
          if (state.opponent) {
            state.opponent.hp = newHp
            state.opponent.isAttacked = true
          }
          state.gameLog.push(`You used ${move.name} for ${damage} damage!`)
          state.isMyTurn = false
          if (newHp <= 0) {
            if (state.opponent) {
              state.opponent.isDefeated = true
            }
            state.winner = 'You'
          }
        })
      },

      canStartGame: () => {
        const { player, opponent } = get()
        return player?.ready && opponent?.ready
      },

      clearAttackState: (target: 'player' | 'opponent') => {
        set((state) => {
          if (target === 'player' && state.player) {
            state.player.isAttacked = false
          } else if (target === 'opponent' && state.opponent) {
            state.opponent.isAttacked = false
          }
        })
      },

      clearDefeatState: (target: 'player' | 'opponent') => {
        set((state) => {
          if (target === 'player' && state.player) {
            state.player.isDefeated = false
          } else if (target === 'opponent' && state.opponent) {
            state.opponent.isDefeated = false
          }
        })
      },
    })),
    { name: 'battle-store' },
  ),
)

export default useBattleStore
