import { useUser, useClerk } from '@clerk/clerk-react'
import { Outlet, redirect } from 'react-router'
import type { ClientLoaderFunctionArgs } from 'react-router'

// Extend the Window interface to include Clerk
declare global {
  interface Window {
    Clerk?: {
      user?: unknown
    }
  }
}

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  // Check if user is authenticated client-side
  // No need to import 'user' from '@clerk/clerk-react'

  // Get the current authentication state
  const isAuthenticated = !!window.Clerk?.user

  if (!isAuthenticated) {
    const url = new URL(request.url)
    throw redirect(`/sign-in?redirect_url=${encodeURIComponent(url.pathname)}`)
  }

  return null
}

export const HydrateFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
)

export default function ProtectedLayout() {
  const { user } = useUser()
  const { signOut } = useClerk()

  const handleSignOut = () => {
    signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
          <h1 className="text-xl font-semibold">My App</h1>
          <div className="flex items-center space-x-4">
            <img
              src={user?.imageUrl}
              alt={user?.fullName || 'User'}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-gray-600">
              {user?.fullName || user?.emailAddresses[0]?.emailAddress}
            </span>
            <button
              onClick={handleSignOut}
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <Outlet />
      </main>
    </div>
  )
}
