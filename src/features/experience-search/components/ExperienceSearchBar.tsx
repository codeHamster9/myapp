import { useAtom } from 'jotai/react'

import { SearchBar } from '@/components/SearchBar'
import { searchQueryAtom } from '@/store/searchAtoms'

export function ExperienceSearchBar() {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
  return (
    <SearchBar
      placeholder="Search for experiences..."
      value={searchQuery}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setSearchQuery(e.target.value)
      }
    />
  )
}
