import TransactionList from '@/components/TransactionList'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function MoneyPage() {
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

  const today = new Date().toISOString().split('T')[0]

  let dailyPageId: number | string

  if (user) {
    const { data } = await supabase
      .from('daily_pages')
      .select('id')
      .eq('user_id', user.id)
      .eq('page_date', today)
      .single()
    dailyPageId = data?.id ?? today
  } else {
    dailyPageId = today
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      <h2 className="text-2xl font-semibold">Money</h2>
      <TransactionList dailyPageId={dailyPageId} session={session} pageDate={today} />
    </div>
  )
}
