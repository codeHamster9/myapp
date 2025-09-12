import { supabase } from '@/lib/supabase'

export const roomService = {
  async createRoom(code: string, userId: string) {
    // Create game with room code
    const { data: game, error: gameError } = await supabase
      .from('games')
      .insert({
        code,
        status: 'waiting',
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
    return { game, player }
  },

  async joinRoom(roomCode: string, userId: string) {
    try {
      console.log('Joining room:', roomCode, 'User:', userId)

      // Check if game exists
      const { data: game, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('code', roomCode)
        .single()

      if (gameError) throw gameError
      console.log('Found game:', game)

      // Check if user already has a player in this game
      const { data: existingPlayer } = await supabase
        .from('players')
        .select('*')
        .eq('game_id', game.id)
        .eq('user_id', userId)
        .single()

      if (existingPlayer) {
        console.log('Player already exists in game')
        return { game, player: existingPlayer }
      }

      // Add player to game
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

      // Update game status if second player joined
      const players = await this.getGamePlayers(game.id)
      if (players.length === 2) {
        await supabase
          .from('games')
          .update({ status: 'in_progress' })
          .eq('id', game.id)
      }

      return { game, player }
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

  async leaveRoom(userId: string, gameId: string) {
    // Remove player from current game
    // const { error } = await supabase
    //   .from('players')
    //   .delete()
    //   .eq('game_id', gameId)
    //   .eq('user_id', userId)

    // if (error) throw error

    const { error: gamesError } = await supabase
      .from('games')
      .update({ status: 'ended' })
      .eq('id', gameId)

    if (gamesError) throw gamesError
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
