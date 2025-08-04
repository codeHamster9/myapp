import { createBrowserRouter } from 'react-router'

import Layout from './components/Layout/Layout'
import ExperiencePage from './pages/experiencePage'
import Index from './pages/Index'
import Notfound from './pages/Notfound'
import PokemonPage from './pages/pokemonPage'
import ZustandPage from './pages/zustandPage'

export const appRoutes = [
  {
    path: '/',
    element: (
      <Layout>
        <Index />
      </Layout>
    ),
  },
  {
    path: '/pokemon',
    element: (
      <Layout>
        <PokemonPage />
      </Layout>
    ),
  },
  {
    path: '/experience',
    element: (
      <Layout>
        <ExperiencePage />
      </Layout>
    ),
  },
  {
    path: '/zustand',
    element: (
      <Layout>
        <ZustandPage />
      </Layout>
    ),
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
