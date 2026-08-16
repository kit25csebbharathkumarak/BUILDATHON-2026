'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from '@/app/actions/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null)
  const router = useRouter()
  
  useEffect(() => {
    if (state?.success) {
      router.push('/dashboard')
    }
  }, [state?.success, router])

  return (
    <div className="min-h-screen bg-parchment flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="font-bold text-ink text-2xl tracking-tight flex items-center justify-center gap-2 mb-8">
          <span className="w-8 h-8 rounded-lg bg-primary-red text-white flex items-center justify-center">4D</span>
          4D EduPortal
        </Link>

        <Card className="shadow-lg border-none">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
            <p className="text-sm text-ink/60 mt-2">
              Enter your credentials to access your account.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  defaultValue="admin@school.edu"
                  required 
                  className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red rounded-md transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-ink flex justify-between">
                  Password
                  <Link href="#" className="text-primary-red hover:underline text-xs">Forgot password?</Link>
                </label>
                <input 
                  name="password" 
                  type="password" 
                  defaultValue="password123"
                  required 
                  className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red rounded-md transition-colors"
                />
              </div>

              {state?.error && (
                <div className="p-3 bg-rust/10 border border-rust/30 text-rust text-sm rounded-md">
                  {state.error}
                </div>
              )}

              <Button 
                className="w-full mt-2" 
                size="lg"
                type="submit" 
                disabled={isPending}
              >
                {isPending ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-ink/60">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-primary-red hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
