import { createBrowserRouter, Outlet } from 'react-router'

import Layout from './components/Layout/Layout'
import Index from './pages/Index'
import Notfound from './pages/Notfound'
import PokemonPage from './pages/pokemonPage'
import PokeTablePage from './pages/pokeTable'

export const appRoutes = [
  {
    path: '/',
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        Component: Index,
        index: true,
      },
      {
        path: '/pokemon',
        element: <PokemonPage />,
      },

      {
        path: '/poke-table',
        element: <PokeTablePage />,
      },
    ],
  },
]

const defaultRoutes = [
  {
    path: '*',
    element: (
      <Layout>
        <Notfound />
      </Layout>
    ),
  },
]

const router = createBrowserRouter([...appRoutes, ...defaultRoutes])
export default router
