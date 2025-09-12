import { useUser } from '@clerk/clerk-react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import BattleLog from '@/features/pokemon/components/BattleLog'
import PokemonCard from '@/features/pokemon/components/PokemonCard'
import { roomService } from '@/services/roomService'
import useBattleStore from '@/store/battleStore'

export default function RoomPage() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  const { isSignedIn, user } = useUser()
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState('')

  const initPlayer = useBattleStore((state) => state.initPlayer)
  const setOpponent = useBattleStore((state) => state.setOpponent)
  const updatePlayer = useBattleStore((state) => state.updatePlayer)
  const player = useBattleStore((state) => state.player)
  const opponent = useBattleStore((state) => state.opponent)
  
  // Derive player count from battleStore
  const playerCount = (player ? 1 : 0) + (opponent ? 1 : 0)

  useEffect(() => {
    const connectToRoom = async () => {
      if (!roomCode) return

      try {
        if (!isSignedIn || !user) {
          setError('Please sign in to join room')
          return
        }

        const userId = user.id

        const { game, player } = await roomService.joinRoom(roomCode, userId)
        console.log('Join result:', { game, player })

        const players = await roomService.getGamePlayers(game.id)
        console.log('Players in game:', players.length, players)

        // Initialize my player with server Pokemon ID
        const myPlayer = players.find((p) => p.user_id === userId)
        initPlayer()
        if (myPlayer) {
          updatePlayer({ id: myPlayer.pokemon_id })
        }

        // If there's a second player, set as opponent
        if (players.length === 2) {
          const otherPlayer = players.find((p) => p.user_id !== userId)
          if (otherPlayer) {
            setOpponent({
              id: otherPlayer.pokemon_id,
              hp: 0, // Will be set when Pokemon loads
              moves: [],
              ready: false, // Client-side ready state
              isAttacked: false,
              isDefeated: false,
            })
          }
        }

        console.log('Setting up subscription for game:', game.id)
        const subscription = await roomService.subscribeToGame(
          game.id,
          onPlayerJoin,
        )
        console.log('Subscription created:', subscription)

        async function onPlayerJoin(payload: any) {
          console.log('🔥 Real-time event received:', payload)

          if (payload.table === 'broadcast') {
            console.log(
              'Game update! Event:',
              payload.eventType,
              'Table:',
              payload.table,
            )

            if (payload.eventType === 'player_joined') {
              // Sync opponent data from broadcast
              if (payload.payload.userId !== userId) {
                console.log('Setting opponent from broadcast:', payload.payload)
                // Get opponent's Pokemon data to set proper HP
                const opponentPokemonId = payload.payload.pokemonId
                setOpponent({
                  id: opponentPokemonId,
                  hp: 0, // Will be updated when opponent's Pokemon loads
                  moves: [],
                  ready: false,
                  isAttacked: false,
                  isDefeated: false,
                })
                // Player count will be derived from battleStore
              }
            } else if (payload.eventType === 'player_left') {
              // Handle player leaving
              if (payload.payload.userId !== userId) {
                console.log('Opponent left:', payload.payload.userId)
                setOpponent(null)
                // Player count will be derived from battleStore
              }
            }
          }
        }

        setIsConnected(true)

        return () => {
          subscription.unsubscribe()
          // Clean up when component unmounts
          if (user?.id && game.id) {
            roomService.leaveRoom(user.id, game.id)
          }
        }
      } catch (err) {
        setError('Failed to join room')
        console.error(err)
      }
    }

    connectToRoom()
  }, [roomCode])

  const leaveRoom = async () => {
    // gameId will be available in the cleanup function scope
    navigate('/')
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={async () => navigate('/lobby')}>
            Back to Lobby
          </Button>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Connecting to room...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Room Header */}
        <div className="bg-card rounded-lg p-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Room: {roomCode}
            </h1>
            <p className="text-muted-foreground">Players: {playerCount}/2</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={initPlayer} variant="outline">
              New Game
            </Button>
            <Button onClick={leaveRoom} variant="destructive">
              Leave Room
            </Button>
          </div>
        </div>

        {playerCount < 2 ? (
          /* Waiting Room */
          <div className="bg-card rounded-lg p-8 text-center">
            <div className="animate-pulse mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4"></div>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-foreground">
              Waiting for opponent...
            </h2>
            <p className="text-muted-foreground mb-4">
              Share this room code with a friend:{' '}
              <span className="font-mono font-bold">{roomCode}</span>
            </p>
            <Button
              onClick={async () =>
                navigator.clipboard.writeText(roomCode || '')
              }
            >
              Copy Room Code
            </Button>
          </div>
        ) : (
          /* Battle Interface */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <PokemonCard type="player" playerId={user?.id} />
              {playerCount >= 2 && <PokemonCard type="opponent" />}
            </div>
            <div className="lg:col-span-1">
              <BattleLog />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
