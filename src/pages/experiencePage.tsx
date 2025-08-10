import React from 'react'

import CategoryFilter from '@/features/experience-search/components/CategoryFilter'
import { ExperienceSearchBar } from '@/features/experience-search/components/ExperienceSearchBar'
import ItemGrid from '@/features/experience-search/components/ItemGrid'

import { items } from '../data/items'
// import SearchSection from '../features/experience-search/components/SearchSection'

export default function HomePage() {
  return (
    <div className="min-h-screen p-6 md:p-8 ">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Discover Experiences
        </h1>
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <ExperienceSearchBar />
            <CategoryFilter items={items} />
          </div>
          <ItemGrid items={items} />
        </>
      </div>
    </div>
  )
}
