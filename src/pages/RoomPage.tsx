import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import BattleLog from '@/features/pokemon/components/BattleLog'
import PokemonCard from '@/features/pokemon/components/PokemonCard'
import useBattleStore from '@/store/battleStore'

export default function RoomPage() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  const [isConnected, setIsConnected] = useState(false)
  const [playerCount, setPlayerCount] = useState(1)
  const [playerId, setPlayerId] = useState(1)

  const canStartGame = useBattleStore((state) => state.canStartGame())
  const initGame = useBattleStore((state) => state.initGame)

  useEffect(() => {
    // TODO: Connect to Supabase room
    setIsConnected(true)
    setPlayerId(Math.random() > 0.5 ? 1 : 2) // Temporary random assignment
  }, [roomCode])

  const leaveRoom = () => {
    navigate('/')
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
            <Button onClick={initGame} variant="outline">
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
              <PokemonCard playerId={1} />
              <PokemonCard playerId={2} />
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
