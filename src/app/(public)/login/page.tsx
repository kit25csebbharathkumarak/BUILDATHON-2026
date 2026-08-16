'use client';
import { useActionState } from 'react';
import Link from 'next/link';
import { loginUser } from '@/app/actions/auth';

export default function Login() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await loginUser(formData);
    },
    null
  );

  return (
    <div className="container py-20 flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="card w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted">Sign in to your account</p>
        </div>

        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="p-3 bg-danger/20 text-danger border border-danger/50 rounded-md text-sm font-bold text-center">
              {state.error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              className="w-full p-3 rounded-md border border-glass-border bg-surface-hover focus:outline-none focus:border-primary transition-colors"
              placeholder="alex@example.com"
              required 
              defaultValue="alex@example.com"
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
              defaultValue="password123"
            />
          </div>

          <button type="submit" disabled={isPending} className="btn btn-primary w-full justify-center mt-6 disabled:opacity-50">
            {isPending ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted">
          Don't have an account? <Link href="/register" className="font-bold text-primary hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
}
