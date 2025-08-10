import { useInfiniteQuery } from '@tanstack/react-query'
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  createColumnHelper,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import React, { useMemo, useEffect, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { PokemonImageModal } from '@/features/pokemon/components/PokemonImageModal'
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
    size: 40,
  }),
  columnHelper.accessor('sprites', {
    header: 'Image',
    size: 80,
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
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
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
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [searchValue, setSearchValue] = useState('')
  const [searchField, setSearchField] = useState('name')

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
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !searchValue
        ) {
          fetchNextPage()
        }
      },
      { threshold: 1 },
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, searchValue])

  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable<Pokemon>({
    data: tableData,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualSorting: false,
  })

  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 80,
    overscan: 10,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-3">
        <div className="flex gap-4 items-center">
          <Input
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
              table
                .getColumn(searchField)
                ?.setFilterValue(e.target.value || undefined)
            }}
            placeholder={`Search by ${searchField}...`}
          />
        </div>
        <RadioGroup
          value={searchField}
          onValueChange={(value) => {
            table.getColumn(searchField)?.setFilterValue(undefined)
            setSearchField(value)
            table.getColumn(value)?.setFilterValue(searchValue || undefined)
          }}
          className="flex gap-4"
        >
          {['name', 'id', 'height', 'weight'].map((field) => (
            <div key={field} className="flex items-center gap-2">
              <RadioGroupItem value={field} id={field} />
              <Label
                htmlFor={field}
                className="capitalize cursor-pointer text-gray-900 dark:text-gray-100"
              >
                {field}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div
        ref={tableContainerRef}
        className="overflow-auto shadow-md rounded-lg"
        style={{ height: 'calc(100vh - 200px)' }}
      >
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-collapse table-fixed">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3"
                    style={{ width: header.getSize() }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2 cursor-pointer select-none">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
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
          <tbody
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index]
              return (
                <tr
                  key={row.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    display: 'table',
                    tableLayout: 'fixed',
                  }}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4"
                      style={{
                        display: 'table-cell',
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
        <div
          ref={loadMoreRef}
          className="h-10 flex items-center justify-center"
        >
          {isFetchingNextPage && <div>Loading more...</div>}
        </div>
      </div>
    </div>
  )
}

export default SimpleTable
