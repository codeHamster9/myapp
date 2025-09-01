import { useQuery, useQueries } from '@tanstack/react-query'

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
  return useQuery<Pokemon>({
    queryKey: pokemonKeys.detail(id),
    queryFn: async (): Promise<Pokemon> => {
      const response = await fetch(`${API_BASE}/pokemon/${id}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
    select: (data: Pokemon) => ({
      ...data,
      moves: data.moves.slice(0, 6),
    }),
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

export const useMoves = (moves: Pokemon['moves'] | undefined) => {
  return useQueries({
    queries: moves
      ? moves.map(({ move }) => ({
          queryKey: ['move', move.url],
          queryFn: async () => fetch(move.url).then(async (r) => r.json()),
          enabled: !!move.url && !!moves,
          select: (data: Move) => ({
            ...data,
            name: move.name,
            power: data.power || 40,
            accuracy: data.accuracy || 100,
          }),
        }))
      : [],
    combine: (results) => ({
      movesWithData: results
        .filter((query) => query.isSuccess && query.data)
        .map((query) => query.data!),
      isLoading: results.some((r) => r.isLoading),
    }),
  })
}
