import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import AuthButton from '@/components/AuthButton'
import TodoList from '@/components/TodoList'
import Finance from '@/components/Finance'
import ExchangeRate from '@/components/ExchangeRate'
import StockTrades from '@/components/StockTrades'

export default async function Home() {
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]
  
  let dailyPageId: number | string;
  
  if (user) {
    // Fetch or create the daily page for logged-in user
    let { data, error } = await supabase
      .from('daily_pages')
      .select('id')
      .eq('user_id', user.id)
      .eq('page_date', today)
      .single()

    if (error || !data) {
      const { data: newDailyPage, error: newPageError } = await supabase
        .from('daily_pages')
        .insert({ user_id: user.id, page_date: today })
        .select('id')
        .single()
      dailyPageId = newDailyPage!.id;
      if (newPageError) console.error('Error creating daily page:', newPageError)
    } else {
      dailyPageId = data.id;
    }
  } else {
    // For non-logged-in users, the 'page id' is just the date string
    dailyPageId = today;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-16 px-8 sm:py-32 sm:px-16 bg-white dark:bg-black sm:items-start">
        <div className="w-full flex justify-between items-center mb-8">
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                {today}
            </h1>
            <AuthButton session={session} />
        </div>

        <ExchangeRate />

        <div className="w-full mt-8">
            <h2 className="text-2xl font-semibold">To-Do</h2>
            <TodoList dailyPageId={dailyPageId} session={session} pageDate={today} />
        </div>

        <div className="w-full mt-8">
            <h2 className="text-2xl font-semibold">Finance</h2>
            <Finance dailyPageId={dailyPageId} session={session} pageDate={today} />
        </div>

        <div className="w-full mt-8">
            <h2 className="text-2xl font-semibold">Stock Trades</h2>
            <StockTrades dailyPageId={dailyPageId} session={session} pageDate={today} />
        </div>
      </main>
    </div>
  )
}
