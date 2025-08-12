import { createBrowserRouter, Outlet } from 'react-router'

import Layout from './components/Layout/Layout'
import ExperiencePage from './pages/experiencePage'
import FlightTicketsPage from './pages/FlightTickets/page'
import Index from './pages/Index'
import Notfound from './pages/Notfound'
import PokemonPage from './pages/pokemonPage'
import PokeTablePage from './pages/pokeTable'
import ZustandPage from './pages/zustandPage'

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
        path: '/experience',
        element: <ExperiencePage />,
      },
      {
        path: '/zustand',
        element: <ZustandPage />,
      },
      {
        path: '/poke-table',
        element: <PokeTablePage />,
      },
      {
        path: '/flight-tickets',
        element: <FlightTicketsPage />,
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
