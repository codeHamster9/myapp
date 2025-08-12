import { useSuspenseQuery } from '@tanstack/react-query'

import CategoryFilter from '@/features/experience-search/components/CategoryFilter'
import { ExperienceSearchBar } from '@/features/experience-search/components/ExperienceSearchBar'
import ItemGrid from '@/features/experience-search/components/ItemGrid'
import type { Item } from '@/features/experience-search/types'

const fetchItems = async (): Promise<Item[]> => {
  const response = await fetch('/api/items')
  const data = await response.json()
  return data
}

export default function ExperiencePage() {
  const { data: items } = useSuspenseQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  })

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
