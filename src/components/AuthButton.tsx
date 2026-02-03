'use client'

import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function AuthButton({ session }: { session: Session | null }) {
  const supabase = createClient()
  const router = useRouter()

  const handleSignIn = async (provider: 'google' | 'kakao') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: location.origin,
      },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return session ? (
    <div className="flex items-center gap-4">
      <span>{session.user.email}</span>
      <button
        onClick={handleSignOut}
        className="rounded-full bg-foreground px-2 py-1 md:px-4 md:py-2 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Sign Out
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleSignIn('google')}
        className="rounded-full bg-foreground px-2 py-1 md:px-4 md:py-2 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Login with Google
      </button>
      <button
        onClick={() => handleSignIn('kakao')}
        className="rounded-full bg-yellow-400 px-2 py-1 md:px-4 md:py-2 text-black transition-colors hover:bg-yellow-500"
      >
        Login with Kakao
      </button>
    </div>
  )
}
