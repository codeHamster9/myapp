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
  gameState: any | null
  userId: string | null
  isPlayer1: boolean
}

interface BattleActions {
  setGameState: (gameState: any) => void
  setUser: (userId: string, isPlayer1: boolean) => void
  getPlayer: () => Player | null
  getOpponent: () => Player | null
  isMyTurn: () => boolean
  canStartGame: () => boolean
  getWinner: () => string | null
}

const getRandomPokemonId = () => Math.floor(Math.random() * 151) + 1

const initialState = {
  gameState: null,
  userId: null,
  isPlayer1: false,
}

const useBattleStore = create<BattleState & BattleActions>()(
  devtools(
    immer((set, get) => ({
      ...initialState,
      
      setGameState: (gameState: any) => {
        set((state) => {
          state.gameState = gameState
        })
      },
      
      setUser: (userId: string, isPlayer1: boolean) => {
        set((state) => {
          state.userId = userId
          state.isPlayer1 = isPlayer1
        })
      },
      
      getPlayer: () => {
        const { gameState, userId, isPlayer1 } = get()
        if (!gameState || !userId) return null
        
        return {
          id: isPlayer1 ? gameState.player1_pokemon_id : gameState.player2_pokemon_id,
          hp: isPlayer1 ? gameState.player1_hp : gameState.player2_hp,
          moves: isPlayer1 ? gameState.player1_moves : gameState.player2_moves,
          ready: isPlayer1 ? gameState.player1_ready : gameState.player2_ready,
          isAttacked: false,
          isDefeated: (isPlayer1 ? gameState.player1_hp : gameState.player2_hp) <= 0,
        }
      },
      
      getOpponent: () => {
        const { gameState, userId, isPlayer1 } = get()
        if (!gameState || !userId) return null
        
        return {
          id: !isPlayer1 ? gameState.player1_pokemon_id : gameState.player2_pokemon_id,
          hp: !isPlayer1 ? gameState.player1_hp : gameState.player2_hp,
          moves: !isPlayer1 ? gameState.player1_moves : gameState.player2_moves,
          ready: !isPlayer1 ? gameState.player1_ready : gameState.player2_ready,
          isAttacked: false,
          isDefeated: (!isPlayer1 ? gameState.player1_hp : gameState.player2_hp) <= 0,
        }
      },
      
      isMyTurn: () => {
        const { gameState, isPlayer1 } = get()
        if (!gameState) return false
        return (gameState.current_turn === 1 && isPlayer1) || (gameState.current_turn === 2 && !isPlayer1)
      },
      
      canStartGame: () => {
        const { gameState } = get()
        return gameState?.player1_ready && gameState?.player2_ready
      },
      
      getWinner: () => {
        const { gameState, userId } = get()
        if (!gameState?.winner_user_id) return null
        return gameState.winner_user_id === userId ? 'You' : 'Opponent'
      },
    })),
    { name: 'battle-store' },
  ),
)

export default useBattleStore
export type { Player }
