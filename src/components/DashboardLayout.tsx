import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { logoutUser } from '@/app/actions/auth';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const role = session.role;

  return (
    <div className="flex h-screen overflow-hidden bg-surface-hover">
      {/* Sidebar */}
      <aside className="w-64 glass-panel flex-shrink-0 flex flex-col" style={{ borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <span style={{ fontSize: '1.5rem' }}>🎓</span> EduPortal
          </Link>
          <div className="mt-2 text-xs text-muted font-bold uppercase tracking-wider">
            {role} Panel
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {role === 'student' && (
            <>
              <Link href="/student/dashboard" className="block px-4 py-2 rounded-md hover:bg-primary-light text-text-main font-bold">Dashboard</Link>
              <Link href="/student/progress" className="block px-4 py-2 rounded-md hover:bg-primary-light text-text-main font-bold">My Progress</Link>
              <Link href="/courses" className="block px-4 py-2 rounded-md hover:bg-primary-light text-text-main font-bold">Browse Courses</Link>
            </>
          )}
          {role === 'teacher' && (
            <>
              <Link href="/teacher/dashboard" className="block px-4 py-2 rounded-md hover:bg-primary-light text-text-main font-bold">Dashboard</Link>
              <Link href="/courses" className="block px-4 py-2 rounded-md hover:bg-primary-light text-text-main font-bold">Browse Courses</Link>
            </>
          )}
          {role === 'admin' && (
            <>
              <Link href="/admin/dashboard" className="block px-4 py-2 rounded-md hover:bg-primary-light text-text-main font-bold">Dashboard</Link>
              <Link href="#" className="block px-4 py-2 rounded-md hover:bg-primary-light text-text-main font-bold">Manage Users</Link>
              <Link href="#" className="block px-4 py-2 rounded-md hover:bg-primary-light text-text-main font-bold">Manage Courses</Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-glass-border">
          <form action={logoutUser}>
            <button type="submit" className="btn btn-outline w-full justify-center">Logout</button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
