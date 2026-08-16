import Link from 'next/link'
import { getSession } from '@/lib/auth'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <header className="border-b border-ledger-line bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-primary-red tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary-red text-white flex items-center justify-center">4D</span>
            4D EduPortal
          </Link>
          
          <nav className="hidden md:flex gap-8">
            <Link href="/" className="text-sm font-medium text-ink hover:text-primary-red transition-colors">Home</Link>
            <Link href="/courses" className="text-sm font-medium text-ink hover:text-primary-red transition-colors">Courses</Link>
            <Link href="/about" className="text-sm font-medium text-ink hover:text-primary-red transition-colors">About</Link>
          </nav>
          
          <div className="flex gap-4">
            {session ? (
              <Link href="/dashboard" className="text-sm font-medium px-4 py-2 bg-primary-red text-white rounded-md hover:bg-primary-red-hover transition-colors">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium px-4 py-2 text-ink hover:text-primary-red transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="text-sm font-medium px-4 py-2 bg-primary-red text-white rounded-md hover:bg-primary-red-hover transition-colors shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-parchment border-t border-ledger-line py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="font-bold text-xl text-primary-red tracking-tight mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-primary-red text-white flex items-center justify-center text-xs">4D</span>
              4D EduPortal
            </div>
            <p className="text-sm text-ink/70 max-w-xs">
              Modern academic management for students, teachers, and administrators.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-ink mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/courses" className="text-sm text-ink/70 hover:text-primary-red transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-sm text-ink/70 hover:text-primary-red transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-ink mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-sm text-ink/70 hover:text-primary-red transition-colors">Blog</Link></li>
              <li><Link href="/help" className="text-sm text-ink/70 hover:text-primary-red transition-colors">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-ink mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-ink/70 hover:text-primary-red transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-ink/70 hover:text-primary-red transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
