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
      games: {
        Row: {
          id: string
          code: string
          status: 'waiting' | 'in_progress' | 'ended'
          player1_user_id: string | null
          player1_pokemon_id: number | null
          player2_user_id: string | null
          player2_pokemon_id: number | null
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          status?: 'waiting' | 'in_progress' | 'ended'
          player1_user_id?: string | null
          player1_pokemon_id?: number | null
          player2_user_id?: string | null
          player2_pokemon_id?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          status?: 'waiting' | 'in_progress' | 'ended'
          player1_user_id?: string | null
          player1_pokemon_id?: number | null
          player2_user_id?: string | null
          player2_pokemon_id?: number | null
          created_at?: string
        }
      }
    }
  }
}