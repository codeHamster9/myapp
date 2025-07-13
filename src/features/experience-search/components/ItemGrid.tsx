import { useAtom } from 'jotai/react'
import { useMemo } from 'react'

import { searchQueryAtom, selectedCategoryAtom } from '@/store/searchAtoms'

import type { Item } from '../types'

import ItemCard from './ItemCard'

interface ItemGridProps {
  items: Item[]
  searchQuery?: string
}

export default function ItemGrid({ items }: ItemGridProps) {
  const [searchQuery] = useAtom(searchQueryAtom)
  const [selectedCategory] = useAtom(selectedCategoryAtom)

  const filteredItems = useMemo(() => {
    console.log('filteredItems')

    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory
        ? item.category === selectedCategory
        : true
      return matchesSearch && matchesCategory
    })
  }, [items, searchQuery, selectedCategory])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredItems.length ? (
        filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} searchQuery={searchQuery} />
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No items found matching your criteria
        </p>
      )}
    </div>
  )
}
