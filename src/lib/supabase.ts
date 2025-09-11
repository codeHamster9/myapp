import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      game_rooms: {
        Row: {
          id: string
          code: string
          status: 'waiting' | 'playing' | 'finished'
          current_player_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          status?: 'waiting' | 'playing' | 'finished'
          current_player_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          status?: 'waiting' | 'playing' | 'finished'
          current_player_id?: string | null
          created_at?: string
        }
      }
      room_players: {
        Row: {
          id: string
          room_id: string
          player_id: string
          pokemon_id: number
          hp: number
          moves: any[]
          ready: boolean
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          player_id: string
          pokemon_id: number
          hp?: number
          moves?: any[]
          ready?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          player_id?: string
          pokemon_id?: number
          hp?: number
          moves?: any[]
          ready?: boolean
          created_at?: string
        }
      }
      game_actions: {
        Row: {
          id: string
          room_id: string
          player_id: string
          action_type: string
          action_data: any
          turn_number: number
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          player_id: string
          action_type: string
          action_data: any
          turn_number: number
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          player_id?: string
          action_type?: string
          action_data?: any
          turn_number?: number
          created_at?: string
        }
      }
    }
  }
}