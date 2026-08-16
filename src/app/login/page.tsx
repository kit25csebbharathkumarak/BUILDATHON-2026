'use client'

import { useActionState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loginAction } from '@/app/actions/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { MarginaliaNote } from '@/components/ui/MarginaliaNote'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null)
  const router = useRouter()
  // useSearchParams requires Suspense but in Next.js 15 client components we can just use it if wrapped,
  // or we can just read window.location in useEffect, but let's just render the basic form for now to avoid suspense boundaries issues.
  
  useEffect(() => {
    if (state?.success) {
      router.push('/dashboard')
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
            <CardTitle className="font-serif text-2xl text-center">Secure Sign In</CardTitle>
            <p className="text-center text-sm text-ink/70 font-sans mt-2">
              Enter your credentials to access your academic ledger.
            </p>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-5 font-sans">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-ink uppercase tracking-wider text-xs">Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  defaultValue="admin@school.edu"
                  required 
                  className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink focus:outline-none focus:border-marigold focus:ring-1 focus:ring-marigold rounded-[2px] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-ink uppercase tracking-wider text-xs">Password</label>
                <input 
                  name="password" 
                  type="password" 
                  defaultValue="password123"
                  required 
                  className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink focus:outline-none focus:border-marigold focus:ring-1 focus:ring-marigold rounded-[2px] transition-colors"
                />
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
                {isPending ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* AI Signature Note */}
        <div className="absolute -left-32 top-1/2 hidden lg:block">
          <MarginaliaNote tone="warning" className="w-48 text-left shadow-sm">
            Remember: Do not share your password with anyone. 
          </MarginaliaNote>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-ink/70 font-sans">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-ink hover:text-marigold transition-colors border-b border-ink hover:border-marigold pb-0.5">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
