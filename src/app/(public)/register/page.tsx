'use client';
import { useActionState } from 'react';
import Link from 'next/link';
import { registerUser } from '@/app/actions/auth';

export default function Register() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await registerUser(formData);
    },
    null
  );

  return (
    <div className="container py-20 flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="card w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-muted">Join the AI-powered education platform</p>
        </div>

        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="p-3 bg-danger/20 text-danger border border-danger/50 rounded-md text-sm font-bold text-center">
              {state.error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-1">Full Name</label>
            <input 
              type="text" 
              name="name"
              className="w-full p-3 rounded-md border border-glass-border bg-surface-hover focus:outline-none focus:border-primary transition-colors"
              placeholder="John Doe"
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              className="w-full p-3 rounded-md border border-glass-border bg-surface-hover focus:outline-none focus:border-primary transition-colors"
              placeholder="you@example.com"
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              className="w-full p-3 rounded-md border border-glass-border bg-surface-hover focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
              required 
              minLength={6}
            />
          </div>

          <div className="py-2">
            <label className="block text-sm font-bold mb-2">I am a:</label>
            <div className="flex gap-4">
              {['student', 'teacher'].map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="role" 
                    value={r} 
                    defaultChecked={r === 'student'}
                    className="accent-primary"
                  />
                  <span className="capitalize">{r}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isPending} className="btn btn-primary w-full justify-center mt-6 disabled:opacity-50">
            {isPending ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted">
          Already have an account? <Link href="/login" className="font-bold text-primary hover:underline">Log In</Link>
        </div>
      </div>
    </div>
  );
}
