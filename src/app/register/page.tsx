'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { registerAction } from '@/app/actions/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      router.push('/login?registered=true')
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
            <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
            <p className="text-sm text-ink/60 mt-2">
              Join the platform today to start learning.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <form action={formAction} className="space-y-4">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Full Name</label>
                <input 
                  name="name" 
                  placeholder="John Doe" 
                  required 
                  className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red rounded-md transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="you@school.edu" 
                  required 
                  className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red rounded-md transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Password</label>
                <input 
                  name="password" 
                  type="password" 
                  required 
                  className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red rounded-md transition-colors"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-ink">Account Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center justify-center gap-2 p-3 border border-ledger-line cursor-pointer hover:bg-accent-red has-[:checked]:border-primary-red has-[:checked]:bg-accent-red has-[:checked]:text-primary-red transition-all rounded-md text-ink/70">
                    <input type="radio" name="role" value="STUDENT" defaultChecked className="hidden" />
                    <span className="text-sm font-medium">Student</span>
                  </label>
                  
                  <label className="flex items-center justify-center gap-2 p-3 border border-ledger-line cursor-pointer hover:bg-accent-red has-[:checked]:border-primary-red has-[:checked]:bg-accent-red has-[:checked]:text-primary-red transition-all rounded-md text-ink/70">
                    <input type="radio" name="role" value="TEACHER" className="hidden" />
                    <span className="text-sm font-medium">Teacher</span>
                  </label>
                </div>
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
                {isPending ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-ink/60">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary-red hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
