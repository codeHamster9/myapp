import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { roomService } from '@/services/roomService'
import { testConnection } from '@/lib/testSupabase'

export default function LobbyPage() {
  const [roomCode, setRoomCode] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const { isSignedIn, user } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    testConnection().then(setIsConnected)
  }, [])

  const createRoom = async () => {
    if (!isSignedIn || !user) return
    
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()
      await roomService.createRoom(code, user.id)
      navigate(`/room/${code}`)
    } catch (error) {
      console.error('Failed to create room:', error)
    }
  }

  const joinRoom = () => {
    if (roomCode.trim()) {
      navigate(`/room/${roomCode.toUpperCase()}`)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-8 text-foreground">
            Pokemon Battle
          </h1>
          <p className="text-muted-foreground mb-6">
            Sign in to start battling!
          </p>
          <SignInButton mode="modal">
            <Button className="w-full h-12 text-lg">
              Sign In
            </Button>
          </SignInButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Pokemon Battle
          </h1>
          <UserButton />
        </div>

        <div className="space-y-6">
          <Button onClick={createRoom} className="w-full h-12 text-lg">
            Create Room
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="h-12 text-center text-lg uppercase"
              maxLength={6}
            />
            <Button
              onClick={joinRoom}
              variant="outline"
              className="w-full h-12 text-lg"
              disabled={!roomCode.trim()}
            >
              Join Room
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
