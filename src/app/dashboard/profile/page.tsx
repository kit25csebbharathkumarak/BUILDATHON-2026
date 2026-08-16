import { getSession } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { User, Shield, Key } from 'lucide-react'
import { redirect } from 'next/navigation'
import { ProfileForm, PasswordForm } from './forms'

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">User Profile</h1>
        <p className="text-ink/60 mt-2">Manage your personal information and account settings.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="text-center pt-8 pb-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-accent-red text-primary-red flex items-center justify-center mb-4">
              <User className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold text-ink mb-4">{session.name || 'Update your name'}</h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-parchment border border-ledger-line rounded-md text-xs font-semibold text-ink/70">
              <Shield className="w-3 h-3" />
              {session.role} ACCOUNT
            </div>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm defaultName={session.name} defaultEmail={session.email} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-ink/50" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
