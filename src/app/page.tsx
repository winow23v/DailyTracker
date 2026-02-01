import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import TodoList from '@/components/TodoList'
import Finance from '@/components/Finance'
import StockTrades from '@/components/StockTrades'
import DailySummary from '@/components/DailySummary'
import DailyMemo from '@/components/DailyMemo'

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
    <main className="flex-1 p-6 md:p-8">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        <DailySummary dailyPageId={dailyPageId} session={session} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- To-Do List (Wider) --- */}
          <div className="lg:col-span-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">To-Do List</h2>
              <TodoList dailyPageId={dailyPageId} session={session} pageDate={today} />
            </div>
          </div>

          {/* --- Finance & Stocks (Stacked) --- */}
          <div className="flex flex-col gap-8">
            {/* Finance Card */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">Finance</h2>
                <Finance dailyPageId={dailyPageId} session={session} pageDate={today} />
              </div>
            </div>
            {/* Stock Trades Card */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">Stock Trades</h2>
                <StockTrades dailyPageId={dailyPageId} session={session} pageDate={today} />
              </div>
            </div>
          </div>
          
          {/* --- Daily Memo (Full Width) --- */}
          <div className="lg:col-span-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">Memo & Reflection</h2>
              <DailyMemo dailyPageId={dailyPageId} session={session} />
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
