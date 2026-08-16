import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const role = session.role;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/" className="sidebar-brand">
            <span>🎓</span> EduPortal
          </Link>
          <div className="sidebar-role">
            {role} Panel
          </div>
        </div>

        <nav className="sidebar-nav">
          {role === 'STUDENT' && (
            <>
              <Link href="/dashboard" className="sidebar-link">Dashboard</Link>
              <Link href="/dashboard/progress" className="sidebar-link">My Progress</Link>
              <Link href="/courses" className="sidebar-link">Browse Courses</Link>
            </>
          )}
          {role === 'TEACHER' && (
            <>
              <Link href="/dashboard" className="sidebar-link">Dashboard</Link>
              <Link href="/courses" className="sidebar-link">Browse Courses</Link>
            </>
          )}
          {role === 'ADMIN' && (
            <>
              <Link href="/admin" className="sidebar-link">Dashboard</Link>
              <Link href="#" className="sidebar-link">Manage Users</Link>
              <Link href="#" className="sidebar-link">Manage Courses</Link>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <form action={logoutAction}>
            <button type="submit" className="btn btn-outline btn-full" style={{ marginTop: 0 }}>Logout</button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}
