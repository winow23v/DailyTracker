import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import AuthButton from '@/components/AuthButton'
import { ThemeToggle } from '@/components/ThemeToggle'

export default async function Header() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 dark:bg-zinc-950">
        <div className="flex items-center gap-4">
            {/* TODO: Add mobile sheet menu for sidebar */}
            <h1 className="text-xl font-semibold">Today</h1>
        </div>
        <div className="flex items-center gap-4 ml-auto">
            <ThemeToggle />
            <AuthButton session={session} />
        </div>
    </header>
  );
}
