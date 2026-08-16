import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logoutAction } from '@/app/actions/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session || session.role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-parchment overflow-hidden">
      {/* Slim vertical rule sidebar */}
      <aside className="w-56 border-r border-ledger-line bg-paper flex flex-col shrink-0">
        <div className="h-20 flex items-center px-8 border-b border-ledger-line bg-ink text-paper">
          <Link href="/" className="font-serif font-bold text-2xl tracking-tight">
            EduAI.
          </Link>
        </div>
        
        <div className="px-8 py-6 border-b border-ledger-line">
          <div className="text-sm font-semibold text-ink truncate">{session.email}</div>
          <div className="font-mono text-xs text-rust uppercase mt-1">System Admin</div>
        </div>

        <nav className="flex-1 px-8 py-6 space-y-4 overflow-y-auto">
          <Link href="/admin" className="block text-sm font-medium text-ink hover:text-marigold transition-colors">
            System Overview
          </Link>
          <Link href="/admin/users" className="block text-sm font-medium text-ink hover:text-marigold transition-colors">
            Manage Users
          </Link>
          <Link href="/admin/courses" className="block text-sm font-medium text-ink hover:text-marigold transition-colors">
            Manage Courses
          </Link>
          <Link href="/admin/settings" className="block text-sm font-medium text-ink hover:text-marigold transition-colors">
            Global Settings
          </Link>
        </nav>

        <div className="px-8 py-6 border-t border-ledger-line">
          <form action={logoutAction}>
            <button type="submit" className="text-sm font-medium text-rust hover:opacity-80 transition-opacity">
              Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto p-10 md:p-16">
          {children}
        </div>
      </main>
    </div>
  )
}
