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
        player1_hp: 0,
        player1_moves: [],
        player1_ready: false,
        current_turn: 1,
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
          player2_hp: 0,
          player2_moves: [],
          player2_ready: false,
          status: 'in_progress',
        })
        .eq('id', game.id)
        .select()
        .single()

      if (updateError) throw updateError
      return { game: updatedGame, isPlayer1: false }
    }

    throw new Error('Game is full')
  },

  async initializePlayerHp(gameId: string, userId: string, hp: number) {
    const game = await this.getGame(gameId)
    const isPlayer1 = game.player1_user_id === userId

    await supabase
      .from('games')
      .update({
        [isPlayer1 ? 'player1_hp' : 'player2_hp']: hp,
      })
      .eq('id', gameId)
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
    await supabase.from('games').update({ status: 'ended' }).eq('id', gameId)
  },

  async updatePlayerMoves(gameId: string, userId: string, moves: any[]) {
    const game = await this.getGame(gameId)
    const isPlayer1 = game.player1_user_id === userId

    await supabase
      .from('games')
      .update({
        [isPlayer1 ? 'player1_moves' : 'player2_moves']: moves,
        [isPlayer1 ? 'player1_ready' : 'player2_ready']: moves.length >= 6,
      })
      .eq('id', gameId)
  },

  async updatePlayerHp(gameId: string, userId: string, hp: number) {
    const game = await this.getGame(gameId)
    const isPlayer1 = game.player1_user_id === userId

    const updates: any = {
      [isPlayer1 ? 'player1_hp' : 'player2_hp']: hp,
    }

    if (hp <= 0) {
      const winnerId = isPlayer1 ? game.player2_user_id : game.player1_user_id
      updates.winner_user_id = winnerId
      updates.status = 'finished'
    }

    await supabase.from('games').update(updates).eq('id', gameId)
  },

  async processAttack(
    gameId: string,
    attackerId: string,
    move: any,
    damage: number,
  ) {
    const game = await this.getGame(gameId)
    const isAttackerPlayer1 = game.player1_user_id === attackerId
    const defenderHp = isAttackerPlayer1 ? game.player2_hp : game.player1_hp
    const newHp = Math.max(0, defenderHp - damage)

    const updates: any = {
      [isAttackerPlayer1 ? 'player2_hp' : 'player1_hp']: newHp,
      current_turn: isAttackerPlayer1 ? 2 : 1,
      game_log: [
        ...(game.game_log || []),
        `${isAttackerPlayer1 ? 'Player 1' : 'Player 2'} used ${move.name} for ${damage} damage!`,
      ],
    }

    if (newHp <= 0) {
      updates.winner_user_id = attackerId
      updates.status = 'finished'
    }

    await supabase.from('games').update(updates).eq('id', gameId)
  },

  async subscribeToGameState(gameId: string, callback: (game: any) => void) {
    // Subscribe to database changes
    const channel = supabase
      .channel(`game-state-${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        callback,
      )
      .subscribe()

    return channel
  },

  async subscribeToPresence(
    gameId: string,
    userId: string,
    callbacks: {
      onJoin: (presence: any) => void
      onLeave: (presence: any) => void
    },
  ) {
    const channel = supabase
      .channel(`presence-${gameId}`, {
        config: {
          presence: {
            key: userId,
          },
        },
      })
      .on('presence', { event: 'join' }, callbacks.onJoin)
      .on('presence', { event: 'leave' }, callbacks.onLeave)
      .subscribe()

    await channel.track({
      user_id: userId,
      online_at: new Date().toISOString(),
    })
    return channel
  },
}
