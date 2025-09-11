import { supabase } from '@/lib/supabase'

export const roomService = {
  async createRoom(code: string) {
    const { data, error } = await supabase
      .from('game_rooms')
      .insert({ code, status: 'waiting' })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async joinRoom(roomCode: string, playerId: string) {
    // Check if room exists
    const { data: room, error: roomError } = await supabase
      .from('game_rooms')
      .select('*')
      .eq('code', roomCode)
      .single()
    
    if (roomError) throw roomError

    // Check if player already in room
    const { data: existingPlayer } = await supabase
      .from('room_players')
      .select('*')
      .eq('room_id', room.id)
      .eq('player_id', playerId)
      .single()
    
    if (existingPlayer) {
      return { room, player: existingPlayer }
    }

    // Add player to room
    const { data, error } = await supabase
      .from('room_players')
      .insert({
        room_id: room.id,
        player_id: playerId,
        pokemon_id: Math.floor(Math.random() * 151) + 1,
      })
      .select()
      .single()
    
    if (error) throw error
    return { room, player: data }
  },

  async getRoomPlayers(roomId: string) {
    const { data, error } = await supabase
      .from('room_players')
      .select('*')
      .eq('room_id', roomId)
    
    if (error) throw error
    return data
  },

  async updatePlayer(playerId: string, updates: any) {
    const { data, error } = await supabase
      .from('room_players')
      .update(updates)
      .eq('player_id', playerId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async subscribeToRoom(roomId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'room_players', filter: `room_id=eq.${roomId}` },
        callback
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'game_rooms', filter: `id=eq.${roomId}` },
        callback
      )
      .subscribe()
  }
}