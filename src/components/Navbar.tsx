import humanizeString from 'humanize-string'
import { Link, useLocation } from 'react-router'

import { useTheme } from '@/contexts/ThemeContext'
import { appRoutes } from '@/router'
import { Button } from './ui/button'
import { Sun, Moon } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800">
      <ul className="flex gap-4 list-none p-0">
        {appRoutes
          .filter((route) => route.path !== '*')
          .map((route) => (
            <li key={route.path}>
              <Link
                to={route.path || '/'}
                className={
                  location.pathname === route.path
                    ? 'font-bold text-blue-600'
                    : 'text-gray-700'
                }
              >
                {humanizeString(route.path?.substring(1) || 'Home')}
              </Link>
            </li>
          ))}
      </ul>
      <Button variant="outline" size="icon" onClick={toggleTheme}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </nav>
  )
}
