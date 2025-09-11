import { supabase } from '@/lib/supabase'

export const roomService = {
  async createRoom(code: string, userId: string) {
    const { data: room, error: roomError } = await supabase
      .from('game_rooms')
      .insert({ code, status: 'waiting' })
      .select()
      .single()
    
    if (roomError) throw roomError

    // Add creator as first player with random Pokemon
    const pokemonId = Math.floor(Math.random() * 151) + 1
    const { data: player, error: playerError } = await supabase
      .from('room_players')
      .insert({
        room_id: room.id,
        player_id: userId,
        pokemon_id: pokemonId,
      })
      .select()
      .single()
    
    if (playerError) throw playerError
    return { room, player }
  },

  async joinRoom(roomCode: string, playerId: string) {
    try {
      // Check if room exists
      const { data: room, error: roomError } = await supabase
        .from('game_rooms')
        .select('*')
        .eq('code', roomCode)
        .single()
      
      if (roomError) throw roomError

      // Check if player already in room
      const { data: existingPlayers } = await supabase
        .from('room_players')
        .select('*')
        .eq('room_id', room.id)
        .eq('player_id', playerId)
      
      if (existingPlayers && existingPlayers.length > 0) {
        console.log('Player already exists in room')
        return { room, player: existingPlayers[0] }
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
      
      if (error) {
        // If duplicate key error, try to fetch existing player
        if (error.code === '23505') {
          const { data: existingPlayer } = await supabase
            .from('room_players')
            .select('*')
            .eq('room_id', room.id)
            .eq('player_id', playerId)
            .single()
          
          if (existingPlayer) {
            return { room, player: existingPlayer }
          }
        }
        throw error
      }
      
      return { room, player: data }
    } catch (error) {
      console.error('Error in joinRoom:', error)
      throw error
    }
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