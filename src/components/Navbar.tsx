import humanizeString from 'humanize-string'
import { Link, useLocation } from 'react-router'

import { appRoutes } from '@/router'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav>
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
    </nav>
  )
}
