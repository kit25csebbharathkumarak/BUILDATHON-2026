import { getSession } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { redirect } from 'next/navigation'
import { Settings, Bell, Palette } from 'lucide-react'
import { cookies } from 'next/headers'
import { SettingsForm } from './SettingsForm'

export default async function SettingsPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const cookieStore = await cookies()
  const prefCookie = cookieStore.get('user-preferences')
  let preferences = {}
  try {
    if (prefCookie) preferences = JSON.parse(prefCookie.value)
  } catch (e) {}

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary-red" />
          Platform Settings
        </h1>
        <p className="text-ink/60 mt-2">Manage your notifications, appearance, and accessibility preferences.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-ink/50" />
              User Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SettingsForm initialPreferences={preferences} />
          </CardContent>
        </Card>

        <Card className="bg-parchment/30 border-dashed border-2 border-ledger-line shadow-none flex flex-col items-center justify-center text-center p-8">
            <Palette className="w-12 h-12 text-ink/20 mb-4" />
            <h3 className="font-bold text-ink mb-2">More coming soon!</h3>
            <p className="text-sm text-ink/60">We are constantly adding new ways to customize your 4D EduPortal experience.</p>
        </Card>
      </div>
    </div>
  )
}
