import { SignIn } from '@clerk/clerk-react'
import { useSearchParams } from 'react-router'

export default function SignInPage() {
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect_url') || '/dashboard'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn
        afterSignInUrl={redirectUrl}
        signUpUrl="/sign-up"
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-lg',
          },
        }}
      />
    </div>
  )
}
