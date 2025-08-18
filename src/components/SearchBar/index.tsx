import { Search } from 'lucide-react'
import React from 'react'

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const SearchBar = (props: SearchBarProps) => {
  const { placeholder = 'Search', value, onChange } = props
  return (
    <div className="flex-1 relative">
      <Search
        data-testid="search"
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      />
    </div>
  )
}
