import { useInfiniteQuery } from '@tanstack/react-query'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  createColumnHelper,
  getSortedRowModel,
} from '@tanstack/react-table'
import React, { useMemo, useEffect, useRef } from 'react'

import { PokemonImageModal } from '@/components/PokemonImageModal'
import type { Pokemon } from '@/features/pokemon/types/pokemon'

const columnHelper = createColumnHelper<Pokemon>()

export const fetchPokemons = async ({ pageParam = 0 }) => {
  const limit = 20
  const offset = pageParam * limit
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
  )
  const data = await response.json()
  const results = await Promise.all(
    data?.results.map(async (p: { name: string; url: string }) =>
      fetch(p.url).then(async (r) => r.json()),
    ),
  )

  return {
    pokemons: results,
    nextOffset: data.next ? pageParam + 1 : undefined,
  }
}

// Use a type assertion for the columns array
const columns: ColumnDef<Pokemon, any>[] = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('sprites', {
    header: 'Image',
    cell: (info) => {
      const sprites = info.getValue()
      const pokemon = info.row.original
      return (
        <PokemonImageModal sprites={sprites} pokemonName={pokemon.name}>
          <img
            src={sprites?.front_default}
            alt={`${pokemon.name} sprite`}
            className="w-16 h-16 object-contain cursor-pointer hover:scale-110 transition-transform"
          />
        </PokemonImageModal>
      )
    },
  }),
  columnHelper.accessor('weight', {
    header: 'Weight',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('height', {
    header: 'Height',
    cell: (info) => info.getValue(),
  }),
]

function SimpleTable() {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['pokemons'],
    queryFn: fetchPokemons,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
  })

  const tableData = useMemo(() => {
    return (
      data?.pages.flatMap((page) =>
        page.pokemons.map((d) => ({
          id: d.id,
          moves: d.moves,
          name: d.name,
          sprites: d.sprites,
          stats: d.stats,
          weight: d.weight,
          height: d.height,
        })),
      ) ?? []
    )
  }, [data])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1 },
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable<Pokemon>({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: false,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-collapse">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-2 cursor-pointer select-none">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {/* Add sorting direction indicator */}
                    {{
                      asc: <span className="text-blue-500">▲</span>,
                      desc: <span className="text-blue-500">▼</span>,
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && <div>Loading more...</div>}
      </div>
    </div>
  )
}

export default SimpleTable
