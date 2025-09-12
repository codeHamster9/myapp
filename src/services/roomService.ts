import { supabase } from '@/lib/supabase'

export const roomService = {
  async createRoom(code: string, userId: string) {
    const pokemonId = Math.floor(Math.random() * 151) + 1

    const { data: game, error: gameError } = await supabase
      .from('games')
      .insert({
        code,
        status: 'waiting',
        player1_user_id: userId,
        player1_pokemon_id: pokemonId,
      })
      .select()
      .single()

    if (gameError) throw gameError
    return { game }
  },

  async joinRoom(roomCode: string, userId: string) {
    // Find game
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('code', roomCode)
      .single()

    if (gameError) throw gameError

    // Check if user is already in game
    if (game.player1_user_id === userId) {
      return { game, isPlayer1: true }
    }
    if (game.player2_user_id === userId) {
      return { game, isPlayer1: false }
    }

    // Join as player2 if slot available
    if (!game.player2_user_id) {
      const pokemonId = Math.floor(Math.random() * 151) + 1

      const { data: updatedGame, error: updateError } = await supabase
        .from('games')
        .update({
          player2_user_id: userId,
          player2_pokemon_id: pokemonId,
          status: 'in_progress',
        })
        .eq('id', game.id)
        .select()
        .single()

      if (updateError) throw updateError

      // Broadcast player joined event
      await supabase.channel(`game-${game.id}`).send({
        type: 'broadcast',
        event: 'player_joined',
        payload: { userId, pokemonId },
      })

      return { game: updatedGame, isPlayer1: false }
    }

    throw new Error('Game is full')
  },

  async getGame(gameId: string) {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single()

    if (error) throw error
    return data
  },

  async leaveRoom(userId: string, gameId: string) {
    // Get current game
    const game = await this.getGame(gameId)

    const updates: any = { status: 'ended' }

    // Clear player data
    if (game.player1_user_id === userId) {
      updates.player1_user_id = null
      updates.player1_pokemon_id = null
    } else if (game.player2_user_id === userId) {
      updates.player2_user_id = null
      updates.player2_pokemon_id = null
    }

    await supabase.from('games').update(updates).eq('id', gameId)

    // Broadcast player left event
    await supabase.channel(`game-${gameId}`).send({
      type: 'broadcast',
      event: 'player_left',
      payload: { userId },
    })
  },

  async broadcastMoveSelected(gameId: string, userId: string, move: any) {
    console.log('📡 Sending move_selected broadcast:', { gameId, userId, move: move.name })
    const result = await supabase.channel(`game-${gameId}`).send({
      type: 'broadcast',
      event: 'move_selected',
      payload: { userId, move },
    })
    console.log('📡 Broadcast result:', result)
  },

  async subscribeToGame(gameId: string, callback: (payload: any) => void) {
    console.log('🔔 Creating subscription for game:', gameId)

    const channel = supabase
      .channel(`game-${gameId}`, {
        config: {
          broadcast: { self: false },
        },
      })
      .on('broadcast', { event: 'player_joined' }, (payload) => {
        console.log('🔥 Player joined broadcast:', payload)
        callback({ ...payload, table: 'broadcast', eventType: 'player_joined' })
      })
      .on('broadcast', { event: 'player_left' }, (payload) => {
        console.log('🔥 Player left broadcast:', payload)
        callback({ ...payload, table: 'broadcast', eventType: 'player_left' })
      })
      .on('broadcast', { event: 'move_selected' }, (payload) => {
        console.log('🔥 Move selected broadcast:', payload)
        callback({ ...payload, table: 'broadcast', eventType: 'move_selected' })
      })
      .subscribe((status) => {
        console.log('🔔 Subscription status:', status)
      })

    return channel
  },
}
