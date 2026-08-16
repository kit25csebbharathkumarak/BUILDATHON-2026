import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
        <div className="container flex items-center justify-between p-4">
          <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <span style={{ fontSize: '1.5rem' }}>🎓</span> EduPortal AI
          </Link>
          <nav className="flex gap-6 items-center">
            <Link href="/" className="font-bold text-muted hover:text-primary">Home</Link>
            <Link href="/courses" className="font-bold text-muted hover:text-primary">Courses</Link>
            <Link href="/contact" className="font-bold text-muted hover:text-primary">Contact</Link>
            <Link href="/login" className="btn btn-primary ml-4">Login / Register</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="glass-panel mt-8" style={{ borderRadius: 0, borderBottom: 'none', borderLeft: 'none', borderRight: 'none', padding: '3rem 0' }}>
        <div className="container flex justify-between items-center text-muted">
          <div>
            <span className="font-bold text-xl text-primary flex items-center gap-2 mb-2">
              <span style={{ fontSize: '1.2rem' }}>🎓</span> EduPortal AI
            </span>
            <p className="text-sm">Empowering education with Artificial Intelligence.</p>
          </div>
          <div className="flex gap-6">
            <Link href="/courses">Browse Courses</Link>
            <Link href="/contact">Support</Link>
            <Link href="#">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
