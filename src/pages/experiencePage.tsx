import React, { useEffect } from 'react'

import CategoryFilter from '@/features/experience-search/components/CategoryFilter'
import { ExperienceSearchBar } from '@/features/experience-search/components/ExperienceSearchBar'
import ItemGrid from '@/features/experience-search/components/ItemGrid'
import type { Item } from '@/features/experience-search/types'
import { useQuery } from '@tanstack/react-query'

const fetchItems = async (): Promise<Item[]> => {
  const response = await fetch('/api/items')
  const data = await response.json()
  return data
}

export default function HomePage() {
  // const [items, setItems] = React.useState<Item[]>([])
  // useEffect(() => {
  //   fetchItems().then((data) => {
  //     setItems(data)
  //   })
  // }, [])

  const {
    data: items,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  })

  if (isLoading) {
    return (
      <div className="h-full min-h-full flex items-center justify-center text-black">
        {' '}
        Loading...
      </div>
    )
  }
  return (
    <div className="min-h-screen p-6 md:p-8 ">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Discover Experiences
        </h1>
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <ExperienceSearchBar />
            <CategoryFilter items={items ?? []} />
          </div>
          <ItemGrid items={items ?? []} />
        </>
      </div>
    </div>
  )
}
