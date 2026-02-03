import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import AuthButton from '@/components/AuthButton'
import ThemeToggle from '@/components/ThemeToggle'
import { PlusIcon } from 'lucide-react'

export default async function TopBar() {
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

  const today = new Date();
  const dateString = `Today · ${today.getFullYear()}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getDate().toString().padStart(2, '0')}`;

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-[var(--color-surface)] px-4 dark:bg-[var(--color-surface)] sm:h-auto sm:border-0 sm:px-6">
        <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Life Asset
            </Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
            <span className="text-base font-semibold text-zinc-800 dark:text-zinc-100">{dateString}</span>
        </div>
        <div className="flex items-center gap-3 ml-auto">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-accent)] text-white shadow-sm">
                <PlusIcon className="w-5 h-5" />
            </button>
            <ThemeToggle />
            <AuthButton session={session} />
        </div>
    </header>
  );
}
