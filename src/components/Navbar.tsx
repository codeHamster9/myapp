import humanizeString from 'humanize-string'
import { Link, useLocation } from 'react-router'

import { appRoutes } from '@/router'
import { useTheme } from '@/contexts/ThemeContext'

export default function Navbar() {
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()

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
      <button
        onClick={toggleTheme}
        className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </nav>
  )
}
