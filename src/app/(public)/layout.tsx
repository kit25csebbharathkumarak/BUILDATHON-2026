import Link from 'next/link'
import { getSession } from '@/lib/auth'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Strict ledger-line header, no blur, no generic shadow */}
      <header className="w-full border-b border-ledger-line bg-paper">
        <div className="container mx-auto px-6 flex h-16 items-center justify-between">
          <Link href="/" className="font-serif font-bold text-ink text-2xl tracking-tight">
            EduAI.
          </Link>
          
          <nav className="hidden md:flex gap-8">
            <Link href="/" className="text-sm font-medium hover:text-marigold transition-colors">Home</Link>
            <Link href="/courses" className="text-sm font-medium hover:text-marigold transition-colors">Courses</Link>
            <Link href="/contact" className="text-sm font-medium hover:text-marigold transition-colors">Contact</Link>
          </nav>
          
          <div className="flex items-center gap-6">
            {session ? (
              <Link href={session.role === 'ADMIN' ? '/admin' : '/dashboard'} className="font-medium text-sm border-b border-ink hover:text-marigold hover:border-marigold transition-all pb-0.5">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:text-marigold">Sign In</Link>
                <Link href="/register" className="text-sm font-medium px-4 py-2 bg-ink text-paper rounded-[2px] hover:bg-ink/90">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6">
        {children}
      </main>

      <footer className="border-t border-ledger-line py-12 mt-20">
        <div className="container mx-auto px-6 grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="font-serif font-bold text-ink text-xl mb-4 block">
              EduAI.
            </Link>
            <p className="text-sm text-ink/70">
              The living gradebook.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h3>
            <ul className="space-y-3 text-sm text-ink/70">
              <li><Link href="/courses" className="hover:text-marigold">Browse Courses</Link></li>
              <li><Link href="/about" className="hover:text-marigold">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3 text-sm text-ink/70">
              <li><Link href="/blog" className="hover:text-marigold">Blog</Link></li>
              <li><Link href="/help" className="hover:text-marigold">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-marigold">Contact Support</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3 text-sm text-ink/70">
              <li><Link href="/privacy" className="hover:text-marigold">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-marigold">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-12 pt-8 border-t border-ledger-line text-sm text-ink/50 font-mono">
          © {new Date().getFullYear()} EduAI. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
