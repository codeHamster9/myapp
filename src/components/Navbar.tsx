import { Link, useLocation } from 'react-router'

const routes = [
  { path: '/', label: 'Home' },
  { path: '/pokemon', label: 'Pokemon' },
  { path: '/experience', label: 'Experience' },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <nav>
      <ul
        style={{ display: 'flex', gap: '1rem', listStyle: 'none', padding: 0 }}
      >
        {routes.map((route) => (
          <li key={route.path}>
            <Link
              to={route.path}
              style={{
                fontWeight:
                  location.pathname === route.path ? 'bold' : 'normal',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
