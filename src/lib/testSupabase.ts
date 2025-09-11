import { supabase } from './supabase'

export async function testConnection() {
  try {
    const { data, error } = await supabase.from('game_rooms').select('count').limit(1)
    if (error) throw error
    console.log('✅ Supabase connection successful')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return false
  }
}