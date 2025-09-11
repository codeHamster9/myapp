import { supabase } from '@/lib/supabase'

export const roomService = {
  async createRoom(code: string, userId: string) {
    // Create room
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .insert({ 
        code, 
        status: 'waiting',
        player_ids: [userId]
      })
      .select()
      .single()

    if (roomError) throw roomError

    // Create game for this room
    const { data: game, error: gameError } = await supabase
      .from('games')
      .insert({
        room_id: room.id,
        status: 'setup'
      })
      .select()
      .single()

    if (gameError) throw gameError

    // Add creator as first player
    const pokemonId = Math.floor(Math.random() * 151) + 1
    const { data: player, error: playerError } = await supabase
      .from('players')
      .insert({
        game_id: game.id,
        user_id: userId,
        pokemon_id: pokemonId,
      })
      .select()
      .single()

    if (playerError) throw playerError
    return { room, game, player }
  },

  async joinRoom(roomCode: string, userId: string) {
    try {
      // Check if room exists
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', roomCode)
        .single()

      if (roomError) throw roomError

      // Check if user already in room
      if (room.player_ids.includes(userId)) {
        // Get current game and player
        const { data: game } = await supabase
          .from('games')
          .select('*')
          .eq('room_id', room.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        const { data: player } = await supabase
          .from('players')
          .select('*')
          .eq('game_id', game?.id)
          .eq('user_id', userId)
          .single()

        return { room, game, player }
      }

      // Add user to room
      const updatedPlayerIds = [...room.player_ids, userId]
      const { error: updateError } = await supabase
        .from('rooms')
        .update({ 
          player_ids: updatedPlayerIds,
          status: updatedPlayerIds.length === 2 ? 'active' : 'waiting'
        })
        .eq('id', room.id)

      if (updateError) throw updateError

      // Get current game
      const { data: game } = await supabase
        .from('games')
        .select('*')
        .eq('room_id', room.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      // Add player to game
      const pokemonId = Math.floor(Math.random() * 151) + 1
      const { data: player, error: playerError } = await supabase
        .from('players')
        .insert({
          game_id: game?.id,
          user_id: userId,
          pokemon_id: pokemonId,
        })
        .select()
        .single()

      if (playerError) throw playerError

      return { room: { ...room, player_ids: updatedPlayerIds }, game, player }
    } catch (error) {
      console.error('Error in joinRoom:', error)
      throw error
    }
  },

  async getGamePlayers(gameId: string) {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('game_id', gameId)

    if (error) throw error
    return data
  },

  async updatePlayer(playerId: string, updates: any) {
    const { data, error } = await supabase
      .from('players')
      .update(updates)
      .eq('id', playerId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async subscribeToGame(gameId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`game:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `game_id=eq.${gameId}`,
        },
        callback,
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        callback,
      )
      .subscribe()
  },
}
