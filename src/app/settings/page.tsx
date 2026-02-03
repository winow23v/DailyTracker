import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import ThemeToggle from '@/components/ThemeToggle'

export default async function SettingsPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>This is your public display name.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <div className="flex items-center justify-between">
              <p>Logged in as <span className="font-medium">{user.email}</span></p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
                <p>You are not logged in.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the app.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="font-medium">Theme</p>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data</CardTitle>
          <CardDescription>Manage your application data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="font-medium">Default Currency</p>
                <p className="text-sm text-zinc-500">Not implemented</p>
            </div>
            <div className="flex items-center justify-between">
                <p className="font-medium">Data Backup</p>
                <p className="text-sm text-zinc-500">Not implemented</p>
            </div>
            <div className="flex items-center justify-between">
                <p className="font-medium">Data Restore</p>
                <p className="text-sm text-zinc-500">Not implemented</p>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
