import { createBrowserRouter, Outlet } from 'react-router'

import Layout from './components/Layout/Layout'
import Index from './pages/Index/index'
import LobbyPage from './pages/LobbyPage'
import Notfound from './pages/Notfound'
import PokemonPage from './pages/pokemonPage'
import PokeTablePage from './pages/pokeTable'
import RoomPage from './pages/RoomPage'

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
      {
        path: '/lobby',
        element: <LobbyPage />,
      },
      {
        path: '/room/:roomCode',
        element: <RoomPage />,
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
