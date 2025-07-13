import React from 'react'

import CategoryFilter from '@/features/experience-search/components/CategoryFilter'

import type { Item } from '../types'

// import { useRenderCount } from '@uidotdev/usehooks'
import { ExperienceSearchBar } from './ExperienceSearchBar'
import ItemGrid from './ItemGrid'

interface SearchSectionProps {
  items: Item[]
}

export default function SearchSection({ items }: SearchSectionProps) {
  //const renderCount = useRenderCount()
  //console.info('renderCount searchSection:', renderCount)

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <ExperienceSearchBar />
        <CategoryFilter items={items} />
      </div>
      <ItemGrid items={items} />
    </>
  )
}
