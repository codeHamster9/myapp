import { useQuery } from '@tanstack/react-query'

import type { Pokemon, Move } from '../types/pokemon'

const API_BASE = 'https://pokeapi.co/api/v2'

// Query keys for caching
export const pokemonKeys = {
  all: ['pokemon'] as const,
  detail: (id: number) => [...pokemonKeys.all, id] as const,
  move: (url: string) => [...pokemonKeys.all, 'move', url] as const,
}

// Custom hooks for fetching data
export const usePokemon = (id: number) => {
  console.log('usePokemon', id)
  return useQuery({
    queryKey: pokemonKeys.detail(id),
    queryFn: async (): Promise<Pokemon> => {
      const response = await fetch(`${API_BASE}/pokemon/${id}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
  })
}

export const useMove = (url: string) => {
  return useQuery({
    queryKey: pokemonKeys.move(url),
    queryFn: async (): Promise<Move> => {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
  })
}
