'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { registerAction } from '@/app/actions/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { MarginaliaNote } from '@/components/ui/MarginaliaNote'

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
      <div className="w-full max-w-md relative">
        <Link href="/" className="font-serif font-bold text-ink text-2xl tracking-tight block text-center mb-8">
          EduAI.
        </Link>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-center">Create Academic Ledger</CardTitle>
            <p className="text-center text-sm text-ink/70 font-sans mt-2">
              Join the platform today to track your progress.
            </p>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-5 font-sans">
              
              <div className="space-y-1">
                <label className="text-sm font-semibold text-ink uppercase tracking-wider text-xs">Full Name</label>
                <input 
                  name="name" 
                  placeholder="e.g. John Doe" 
                  required 
                  className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink focus:outline-none focus:border-marigold focus:ring-1 focus:ring-marigold rounded-[2px] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-ink uppercase tracking-wider text-xs">Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="e.g. you@school.edu" 
                  required 
                  className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink focus:outline-none focus:border-marigold focus:ring-1 focus:ring-marigold rounded-[2px] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-ink uppercase tracking-wider text-xs">Password</label>
                <input 
                  name="password" 
                  type="password" 
                  required 
                  className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink focus:outline-none focus:border-marigold focus:ring-1 focus:ring-marigold rounded-[2px] transition-colors"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-sm font-semibold text-ink uppercase tracking-wider text-xs">Account Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center justify-center gap-2 p-3 border border-ledger-line cursor-pointer hover:bg-parchment/50 has-[:checked]:border-ink has-[:checked]:bg-parchment transition-all rounded-[2px]">
                    <input type="radio" name="role" value="STUDENT" defaultChecked className="accent-ink" />
                    <span className="text-sm font-medium">Student</span>
                  </label>
                  
                  <label className="flex items-center justify-center gap-2 p-3 border border-ledger-line cursor-pointer hover:bg-parchment/50 has-[:checked]:border-ink has-[:checked]:bg-parchment transition-all rounded-[2px]">
                    <input type="radio" name="role" value="TEACHER" className="accent-ink" />
                    <span className="text-sm font-medium">Teacher</span>
                  </label>
                </div>
              </div>

              {state?.error && (
                <div className="p-3 bg-rust/10 border border-rust/30 text-rust text-sm rounded-[2px]">
                  {state.error}
                </div>
              )}

              <Button 
                className="w-full mt-6" 
                size="lg"
                type="submit" 
                disabled={isPending}
              >
                {isPending ? 'Creating Account...' : 'Register'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* AI Signature Note */}
        <div className="absolute -right-32 top-1/3 hidden lg:block">
          <MarginaliaNote tone="insight" className="w-48 text-left shadow-sm">
            All passwords are encrypted before they hit the database.
          </MarginaliaNote>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-ink/70 font-sans">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-ink hover:text-marigold transition-colors border-b border-ink hover:border-marigold pb-0.5">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
