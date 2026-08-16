import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logoutAction } from '@/app/actions/auth'
import { 
  User, 
  Library, 
  BookOpen, 
  Calendar, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Settings, 
  LogOut,
  LayoutDashboard
} from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const isStudent = session.role === 'STUDENT'

  return (
    <div className="flex h-screen bg-parchment overflow-hidden">
      {/* Modern Sidebar */}
      <aside className="w-64 bg-white border-r border-ledger-line flex flex-col shrink-0 shadow-sm z-10">
        <div className="h-16 flex items-center px-6 border-b border-ledger-line">
          <Link href="/" className="font-bold text-xl text-primary-red tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary-red text-white flex items-center justify-center">4D</span>
            4D EduPortal
          </Link>
        </div>
        
        <div className="px-6 py-6 border-b border-ledger-line bg-parchment/50">
          <div className="text-sm font-semibold text-ink truncate">{session.name || 'Student'}</div>
          <div className="mt-3 inline-block px-2 py-1 bg-accent-red text-primary-red text-xs font-semibold rounded-md">
            {session.role}
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {/* Base/Teacher Menu */}
          {!isStudent && (
            <>
              <div className="text-xs font-semibold text-ink/40 uppercase tracking-wider px-3 mb-2 mt-2 first:mt-0">Teacher Management</div>
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard Overview
              </Link>
              <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
                <User className="w-4 h-4" />
                Profile
              </Link>
              <Link href="/dashboard/courses" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
                <Library className="w-4 h-4" />
                Manage Courses
              </Link>
              <Link href="/dashboard/assignments" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
                <BookOpen className="w-4 h-4" />
                Manage Assignments
              </Link>
              <Link href="/dashboard/attendance" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
                <Calendar className="w-4 h-4" />
                Track Attendance
              </Link>
              <Link href="/dashboard/grades" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
                <FileText className="w-4 h-4" />
                Class Grades
              </Link>
              <Link href="/dashboard/recommendations" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
                <Sparkles className="w-4 h-4" />
                AI Student Insights
              </Link>
              <Link href="/dashboard/progress" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
                <TrendingUp className="w-4 h-4" />
                Class Progress
              </Link>
            </>
          )}

          {/* Student Specific Menu mapped from requirements */}
          {isStudent && (
            <>
              <div className="text-xs font-semibold text-ink/40 uppercase tracking-wider px-3 mb-2 mt-2 first:mt-0">User Dashboard</div>
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard Overview
              </Link>
              <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
                <User className="w-4 h-4" />
                Profile
              </Link>
              <Link href="/dashboard/courses" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
                <Library className="w-4 h-4" />
                My Courses
              </Link>
              <Link href="/dashboard/assignments" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
                <BookOpen className="w-4 h-4" />
                My Assignments
              </Link>
              <Link href="/dashboard/attendance" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
                <Calendar className="w-4 h-4" />
                Attendance
              </Link>
              <Link href="/dashboard/grades" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
                <FileText className="w-4 h-4" />
                Grades
              </Link>
              <Link href="/dashboard/recommendations" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
                <Sparkles className="w-4 h-4" />
                AI Recommendations
              </Link>
              <Link href="/dashboard/progress" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
                <TrendingUp className="w-4 h-4" />
                Progress Overview
              </Link>
            </>
          )}

          <div className="mt-8 pt-4 border-t border-ledger-line">
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-ledger-line">
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-red-50 hover:text-red-600 transition-colors">
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-parchment p-8 md:p-12">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
