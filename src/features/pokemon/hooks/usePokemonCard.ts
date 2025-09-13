import { useState, useEffect } from 'react'

import { supabase } from '@/lib/supabase'

import { usePokemon, useMoves } from '../services/pokemonService'
import type { Move } from '../types/pokemon'

export function usePokemonCard(
  pokemonId: number,
  roomCode: string,
  userId: string,
) {
  const { data: pokemon, isLoading: pokemonLoading } = usePokemon(pokemonId)
  const { movesWithData, isLoading: movesLoading } = useMoves(pokemon?.moves)
  const [availableMoves, setAvailableMoves] = useState<Move[]>([])
  const [selectedMoves, setSelectedMoves] = useState<Move[]>([])
  const [hp, setHp] = useState(0)

  const isLoading = pokemonLoading || movesLoading
  const maxMoves = Math.min(6, movesWithData.length)

  useEffect(() => {
    if (movesWithData.length > 0) {
      setAvailableMoves(movesWithData)
      const firstSixMoves = movesWithData.slice(0, 6)
      setSelectedMoves(firstSixMoves)
    }
  }, [movesWithData])

  useEffect(() => {
    if (pokemon) {
      setHp(pokemon.stats[0].base_stat)
    }
  }, [pokemon])

  // Sync to Supabase when pokemon data is ready
  useEffect(() => {
    console.log('Sync check:', { pokemon: !!pokemon, selectedMoves: selectedMoves.length, hp, roomCode, userId, pokemonId })
    if (pokemon && selectedMoves.length > 0 && hp > 0 && roomCode && userId) {
      console.log('Syncing pokemon data:', { pokemonId, roomCode, userId, hp })
      syncToSupabase()
    }
  }, [pokemon, selectedMoves, hp, roomCode, userId, pokemonId])

  const syncToSupabase = async () => {
    try {
      console.log('Attempting to sync:', {
        room_code: roomCode,
        user_id: userId,
        pokemon_id: pokemonId,
        hp: hp,
        max_hp: pokemon?.stats[0].base_stat || 0,
        selected_moves: selectedMoves,
      })

      const { data, error } = await supabase
        .from('pokemon_data')
        .upsert(
          {
            room_code: roomCode,
            user_id: userId,
            pokemon_id: pokemonId,
            hp: hp,
            max_hp: pokemon?.stats[0].base_stat || 0,
            selected_moves: selectedMoves,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'room_code,user_id',
          },
        )
        .select()

      if (error) {
        console.error('Supabase error:', error)
      } else {
        console.log('Sync successful:', data)
        
        // Broadcast as fallback
        supabase.channel(`room-${roomCode}`).send({
          type: 'broadcast',
          event: 'pokemon_updated',
          payload: { userId, pokemonId }
        })
      }
    } catch (error) {
      console.error('Failed to sync pokemon data:', error)
    }
  }

  return {
    pokemon,
    availableMoves,
    setAvailableMoves,
    selectedMoves,
    setSelectedMoves,
    hp,
    setHp,
    isLoading,
    maxMoves,
    syncToSupabase,
  }
}
