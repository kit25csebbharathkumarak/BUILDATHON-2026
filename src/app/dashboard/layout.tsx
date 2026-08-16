import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logoutAction } from '@/app/actions/auth'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  if (session.role === 'ADMIN') {
    redirect('/admin')
  }

  const isStudent = session.role === 'STUDENT'

  return (
    <div className="flex h-screen bg-parchment overflow-hidden">
      {/* Slim vertical rule sidebar */}
      <aside className="w-56 border-r border-ledger-line bg-paper flex flex-col shrink-0">
        <div className="h-20 flex items-center px-8 border-b border-ledger-line">
          <Link href="/" className="font-serif font-bold text-ink text-2xl tracking-tight">
            EduAI.
          </Link>
        </div>
        
        <div className="px-8 py-6 border-b border-ledger-line">
          <div className="text-sm font-semibold text-ink truncate">{session.email}</div>
          <div className="font-mono text-xs text-ink/50 uppercase mt-1">{session.role} Ledger</div>
        </div>

        <nav className="flex-1 px-8 py-6 space-y-4 overflow-y-auto">
          <Link href="/dashboard" className="block text-sm font-medium text-ink hover:text-marigold transition-colors">
            Overview
          </Link>
          <Link href="/dashboard/courses" className="block text-sm font-medium text-ink hover:text-marigold transition-colors">
            {isStudent ? 'My Enrollments' : 'My Roster'}
          </Link>
          <Link href="/dashboard/assignments" className="block text-sm font-medium text-ink hover:text-marigold transition-colors">
            Assignments
          </Link>
          <Link href="/dashboard/attendance" className="block text-sm font-medium text-ink hover:text-marigold transition-colors">
            Attendance
          </Link>
          {isStudent && (
            <Link href="/dashboard/progress" className="block text-sm font-medium text-ink hover:text-marigold transition-colors">
              My Progress
            </Link>
          )}
          <Link href="/dashboard/reports" className="block text-sm font-medium text-ink hover:text-marigold transition-colors">
            Reports
          </Link>
          <Link href="/dashboard/settings" className="block text-sm font-medium text-ink hover:text-marigold transition-colors">
            Settings
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
        <div className="max-w-[1000px] mx-auto p-10 md:p-16">
          {children}
        </div>
      </main>
    </div>
  )
}
