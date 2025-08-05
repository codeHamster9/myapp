// import {
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from '@tanstack/react-table'
// import * as React from 'react'

// import './table.css'
// import { usePokemon } from '@/features/pokemon/services/pokemonService'
// import { Pokemon } from '@/features/pokemon/types/pokemon'

// type Person = {
//   firstName: string
//   lastName: string
//   age: number
//   visits: number
//   status: string
//   progress: number
// }

// const defaultData: Person[] = [
//   {
//     firstName: 'tanner',
//     lastName: 'linsley',
//     age: 24,
//     visits: 100,
//     status: 'In Relationship',
//     progress: 50,
//   },
//   {
//     firstName: 'tandy',
//     lastName: 'miller',
//     age: 40,
//     visits: 40,
//     status: 'Single',
//     progress: 80,
//   },
//   {
//     firstName: 'joe',
//     lastName: 'dirte',
//     age: 45,
//     visits: 20,
//     status: 'Complicated',
//     progress: 10,
//   },
// ]

// const columnHelper = createColumnHelper<Pokemon>()

// const columns = [
//   columnHelper.accessor('id', {
//     cell: (info) => info.getValue(),
//     footer: (info) => info.column.id,
//   }),
//   columnHelper.accessor((row) => row.name, {
//     id: 'name',
//     cell: (info) => <i>{info.getValue()}</i>,
//     header: () => <span>Last Name</span>,
//     footer: (info) => info.column.id,
//   }),
//   //   columnHelper.accessor('age', {
//   //     header: () => 'Age',
//   //     cell: (info) => info.renderValue(),
//   //     footer: (info) => info.column.id,
//   //   }),
//   //   columnHelper.accessor('visits', {
//   //     header: () => <span>Visits</span>,
//   //     footer: (info) => info.column.id,
//   //   }),
//   //   columnHelper.accessor('status', {
//   //     header: 'Status',
//   //     footer: (info) => info.column.id,
//   //   }),
//   //   columnHelper.accessor('progress', {
//   //     header: 'Profile Progress',
//   //     footer: (info) => info.column.id,
//   //   }),
// ]

// function PokeTablePage() {
//   //   const [data, _setData] = React.useState(() => [...defaultData])
//   const rerender = React.useReducer(() => ({}), {})[1]

//   const { data: pokemon1Data } = usePokemon(1)

//   const tableData = React.useMemo(() => [pokemon1Data] ?? [], [pokemon1Data])
//   const table = useReactTable({
//     data: tableData,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   })

//   return (
//     <div className="p-2">
//       <table>
//         <thead>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <tr key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <th key={header.id}>
//                   {header.isPlaceholder
//                     ? null
//                     : flexRender(
//                         header.column.columnDef.header,
//                         header.getContext(),
//                       )}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody>
//           {table.getRowModel().rows.map((row) => (
//             <tr key={row.id}>
//               {row.getVisibleCells().map((cell) => (
//                 <td key={cell.id}>
//                   {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//         <tfoot>
//           {table.getFooterGroups().map((footerGroup) => (
//             <tr key={footerGroup.id}>
//               {footerGroup.headers.map((header) => (
//                 <th key={header.id}>
//                   {header.isPlaceholder
//                     ? null
//                     : flexRender(
//                         header.column.columnDef.footer,
//                         header.getContext(),
//                       )}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </tfoot>
//       </table>
//       <div className="h-4" />
//       <button onClick={() => rerender()} className="border p-2">
//         Rerender
//       </button>
//     </div>
//   )
// }

// export default PokeTablePage

// src/types.ts

// Define the shape of a single user object from the API
// src/components/SimpleTable.tsx
import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  createColumnHelper,
  ColumnDef,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table'
import { Pokemon } from '@/features/pokemon/types/pokemon'
// import { fetchUsers } from '../api'
// import { User } from '../types' // Import the User interface

// src/types.ts

// Define the shape of a single user object from the API

const columnHelper = createColumnHelper<Pokemon>()

export const fetchUsers = async (): Promise<Pokemon[]> => {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
  const data = await response.json()
  const results = await Promise.all<Pokemon[]>(
    data?.results.map(async (p: { name: string; url: string }) =>
      fetch(p.url).then(async (r) => r.json()),
    ),
  )

  return results
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
  columnHelper.accessor('weight', {
    header: 'weight',
    cell: (info) => info.getValue(),
  }),
]

function SimpleTable() {
  const { data, isLoading, isError, error } = useQuery<Pokemon[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
    select: (data) =>
      data.map((d) => {
        return {
          id: d.id,
          moves: d.moves,
          name: d.name,
          sprites: d.sprites,
          stats: d.stats,
          weight: d.weight,
        }
      }),
  })

  const tableData = useMemo(() => data ?? [], [data])

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
    // TypeScript will correctly infer that 'error' is an 'Error' object
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
    </div>
  )
}

export default SimpleTable
