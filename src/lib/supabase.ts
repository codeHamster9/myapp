import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string | null
          wins: number
          losses: number
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          wins?: number
          losses?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          wins?: number
          losses?: number
          created_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          code: string
          status: 'waiting' | 'active' | 'finished'
          player_ids: string[]
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          status?: 'waiting' | 'active' | 'finished'
          player_ids?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          status?: 'waiting' | 'active' | 'finished'
          player_ids?: string[]
          created_at?: string
        }
      }
      games: {
        Row: {
          id: string
          room_id: string
          status: 'setup' | 'playing' | 'finished'
          current_player_id: string | null
          winner_id: string | null
          turn_number: number
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          status?: 'setup' | 'playing' | 'finished'
          current_player_id?: string | null
          winner_id?: string | null
          turn_number?: number
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          status?: 'setup' | 'playing' | 'finished'
          current_player_id?: string | null
          winner_id?: string | null
          turn_number?: number
          created_at?: string
        }
      }
      players: {
        Row: {
          id: string
          game_id: string
          user_id: string
          pokemon_id: number
          hp: number
          ready: boolean
          created_at: string
        }
        Insert: {
          id?: string
          game_id: string
          user_id: string
          pokemon_id: number
          hp?: number
          ready?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          user_id?: string
          pokemon_id?: number
          hp?: number
          ready?: boolean
          created_at?: string
        }
      }
    }
  }
}