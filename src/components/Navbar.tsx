import humanizeString from 'humanize-string'
import { Link, useLocation } from 'react-router'

import { useTheme } from '@/contexts/ThemeContext'
import { appRoutes } from '@/router'

export default function Navbar() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  return (
    <nav className="w-full flex items-center justify-between px-8 py-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex-1"></div>
      <ul className="flex gap-8 list-none p-0">
        {appRoutes
          .filter((route) => route.path !== '*')
          .map((route) => (
            <li key={route.path}>
              <Link
                to={route.path || '/'}
                className={
                  location.pathname === route.path
                    ? 'font-semibold text-blue-600 dark:text-blue-400 px-3 py-2 rounded-md bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                }
              >
                {humanizeString(route.path?.substring(1) || 'Home')}
              </Link>
            </li>
          ))}
      </ul>
      <div className="flex-1 flex justify-end">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  )
}
