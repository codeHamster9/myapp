import { createBrowserRouter } from 'react-router'

import Layout from './components/Layout/Layout'
import ExperiencePage from './pages/experiencePage'
import Index from './pages/Index'
import Notfound from './pages/Notfound'
import PokemonPage from './pages/pokemonPage'

const router = createBrowserRouter([
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
    path: '*',
    element: (
      <Layout>
        <Notfound />
      </Layout>
    ),
  },
])

export default router
