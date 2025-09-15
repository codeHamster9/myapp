import { useUser } from '@clerk/clerk-react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import PokemonCard from '@/features/pokemon/components/PokemonCard'
import { supabase } from '@/lib/supabase'

export default function RoomPage() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  const { isSignedIn, user } = useUser()
  const [connectedUsers, setConnectedUsers] = useState<any[]>([])
  const [pokemonId, setPokemonId] = useState<number | null>(null)
  const [allPokemonData, setAllPokemonData] = useState<any[]>([])
  const [hasRolled, setHasRolled] = useState(false)

  useEffect(() => {
    if (!isSignedIn || !user || !roomCode) return

    const channel = supabase
      .channel(`room-${roomCode}`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const users = Object.values(state).flat()
        setConnectedUsers(users)
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pokemon_data',
          filter: `room_code=eq.${roomCode}`,
        },
        (payload) => {
          console.log('Database change detected:', payload)
          fetchAllPokemonData()
        },
      )
      .on('broadcast', { event: 'pokemon_updated' }, () => {
        fetchAllPokemonData()
      })

      .subscribe()

    channel.track({
      user_id: user.id,
      username: user.username || user.firstName || 'Anonymous',
      online_at: new Date().toISOString(),
    })

    fetchAllPokemonData()

    return () => {
      channel.unsubscribe()
    }
  }, [roomCode, isSignedIn, user])

  const fetchAllPokemonData = async () => {
    if (!roomCode) return

    console.log('Fetching pokemon data for room:', roomCode)
    const { data, error } = await supabase
      .from('pokemon_data')
      .select('*')
      .eq('room_code', roomCode)

    if (error) {
      console.error('Error fetching pokemon data:', error)
    } else {
      console.log('Fetched pokemon data:', data)
    }

    setAllPokemonData(data || [])

    // Check if current user has already rolled
    const userHasRolled = data?.some((d) => d.user_id === user?.id)
    setHasRolled(!!userHasRolled)
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to join the room</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Room: {roomCode}</h1>
            <Button onClick={async () => navigate('/')} variant="outline">
              Leave Room
            </Button>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">
              Connected Users ({connectedUsers.length})
            </h2>
            <div className="space-y-2">
              {connectedUsers.map((connectedUser, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                >
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">{connectedUser.username}</span>
                  <span className="text-sm text-muted-foreground">
                    {connectedUser.user_id === user?.id ? '(You)' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => {
                const newId = Math.floor(Math.random() * 151) + 1
                console.log('Rolling pokemon ID:', newId)
                setPokemonId(newId)
              }}
              className="w-full"
              disabled={hasRolled}
            >
              {hasRolled ? 'Pokemon Already Rolled' : 'Roll Pokemon'}
            </Button>

            <Button
              onClick={async () =>
                navigator.clipboard.writeText(roomCode || '')
              }
              className="w-full"
              variant="outline"
            >
              Copy Room Code
            </Button>
          </div>
        </div>

        {/* All Pokemon in Room */}
        {allPokemonData.length > 0 && (
          <div className="bg-card rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Pokemon in Room</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allPokemonData.map((data) => {
                const isMyPokemon = data.user_id === user?.id
                const username =
                  connectedUsers.find((u) => u.user_id === data.user_id)
                    ?.username || 'Unknown'

                return (
                  <div key={data.id} className="space-y-2">
                    <h3 className="text-sm font-medium">
                      {isMyPokemon ? 'Your Pokemon' : `${username}'s Pokemon`}
                    </h3>
                    <PokemonCard
                      type={isMyPokemon ? 'player' : 'opponent'}
                      pokemonId={data.pokemon_id}
                      roomCode={roomCode}
                      userId={data.user_id}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Show local pokemon while syncing */}
        {pokemonId && !allPokemonData.some((d) => d.user_id === user?.id) && (
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Your Pokemon</h2>
            <PokemonCard
              type="player"
              pokemonId={pokemonId}
              roomCode={roomCode}
              userId={user?.id}
            />
          </div>
        )}
      </div>
    </div>
  )
}
