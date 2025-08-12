import { useAtom } from 'jotai'
import { Filter } from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '../../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../../../components/ui/dropdown-menu'
import { selectedCategoryAtom } from '../../../store/searchAtoms'
import type { Item } from '../types'

interface CategoryFilterProps {
  items: Item[]
}

export default function CategoryFilter({ items }: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom)
  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))),
    [items],
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          {selectedCategory || 'All Categories'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setSelectedCategory('')}>
          All
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {categories.map((category) => (
          <DropdownMenuItem
            key={category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
