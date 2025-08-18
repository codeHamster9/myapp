import { highlightText } from '@/utils/highlightText'

import type { Item } from '../types'

interface ItemCardProps {
  item: Item
  searchQuery?: string
}

export default function ItemCard({ item, searchQuery = '' }: ItemCardProps) {
  return (
    <div className="group rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="p-4">
        <h3
          className="text-lg font-semibold mb-1"
          dangerouslySetInnerHTML={{
            __html: highlightText(item.title, searchQuery),
          }}
        />
        <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mb-2">
          {item.category}
        </span>
        <p
          className="text-gray-600"
          dangerouslySetInnerHTML={{
            __html: highlightText(item.description, searchQuery),
          }}
        />
      </div>
    </div>
  )
}
