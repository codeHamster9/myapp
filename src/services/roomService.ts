import { supabase } from '@/lib/supabase'

export const roomService = {
  async createRoom(code: string, userId: string) {
    // Create game
    const { data: game, error: gameError } = await supabase
      .from('games')
      .insert({ code, status: 'waiting' })
      .select()
      .single()

    if (gameError) throw gameError

    // Add creator as player
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
    return { game, player }
  },

  async joinRoom(roomCode: string, userId: string) {
    // Find game
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('code', roomCode)
      .single()

    if (gameError) throw gameError

    // Add or update player (UPSERT)
    const pokemonId = Math.floor(Math.random() * 151) + 1
    const { data: player, error: playerError } = await supabase
      .from('players')
      .upsert(
        {
          game_id: game.id,
          user_id: userId,
          pokemon_id: pokemonId,
        },
        {
          onConflict: 'game_id,user_id',
        },
      )
      .select()
      .single()

    if (playerError) throw playerError

    // Start game if 2 players
    const players = await this.getGamePlayers(game.id)
    if (players.length === 2) {
      await supabase
        .from('games')
        .update({ status: 'in_progress' })
        .eq('id', game.id)
    }

    // Broadcast player joined event
    await supabase.channel(`game-${game.id}`).send({
      type: 'broadcast',
      event: 'player_joined',
      payload: {
        userId,
        pokemonId,
        playerCount: players.length,
      },
    })

    return { game, player }
  },

  async getGamePlayers(gameId: string) {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('game_id', gameId)

    if (error) throw error
    return data
  },

  async leaveRoom(userId: string, gameId: string) {
    // Remove player
    await supabase
      .from('players')
      .delete()
      .eq('game_id', gameId)
      .eq('user_id', userId)

    // End game
    await supabase.from('games').update({ status: 'ended' }).eq('id', gameId)
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
      .subscribe((status) => {
        console.log('🔔 Subscription status:', status)
      })

    return channel
  },
}
