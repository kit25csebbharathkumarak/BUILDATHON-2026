import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logoutAction } from '@/app/actions/auth'
import { 
  LayoutDashboard,
  Users, 
  GraduationCap, 
  Library, 
  BookOpen,
  FileSpreadsheet,
  BarChart,
  Sparkles,
  LogOut 
} from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session || session.role !== 'ADMIN') {
    redirect('/login')
  }

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
          <div className="text-sm font-semibold text-ink truncate">{session.name || 'Admin User'}</div>
          <div className="mt-3 inline-block px-2 py-1 bg-accent-red text-primary-red text-xs font-semibold rounded-md">
            SYSTEM ADMIN
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-ink/40 uppercase tracking-wider px-3 mb-2">Admin Dashboard</div>
          
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard Overview
          </Link>
          <Link href="/admin/students" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
            <Users className="w-4 h-4" />
            Manage Students
          </Link>
          <Link href="/admin/teachers" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
            <GraduationCap className="w-4 h-4" />
            Manage Teachers
          </Link>
          <Link href="/admin/courses" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
            <Library className="w-4 h-4" />
            Manage Courses
          </Link>
          <Link href="/admin/classes" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
            <BookOpen className="w-4 h-4" />
            Manage Classes
          </Link>
          <Link href="/admin/assignments" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
            <FileSpreadsheet className="w-4 h-4" />
            Manage Assignments
          </Link>
          <Link href="/admin/exams" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
            <FileSpreadsheet className="w-4 h-4" />
            Manage Exams & Grades
          </Link>
          <Link href="/admin/reports" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
            <BarChart className="w-4 h-4" />
            View Reports & Analytics
          </Link>
          <Link href="/admin/insights" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-ink hover:bg-accent-red hover:text-primary-red transition-colors">
            <Sparkles className="w-4 h-4" />
            AI Insights & Monitoring
          </Link>
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
