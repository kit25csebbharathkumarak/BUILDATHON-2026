import { PrismaClient } from '@prisma/client'
import { Table, TableBody, TableCell, TableCellMono, TableHead, TableHeader, TableRow } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { MarginaliaNote } from '@/components/ui/MarginaliaNote'

const prisma = new PrismaClient()

export default async function AdminDashboardPage() {
  const userCount = await prisma.user.count()
  const courseCount = await prisma.course.count()
  const enrollmentCount = await prisma.enrollment.count()
  
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-12 animate-fade-in">
      <header className="border-b border-ink pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl text-ink mb-2">
            System Administration
          </h1>
          <p className="font-sans text-ink/70">
            Platform-wide metrics and management ledger.
          </p>
        </div>
        <div className="font-mono text-sm text-rust uppercase text-right">
          <div>Access Level: Root</div>
          <div>Environment: Production</div>
        </div>
      </header>

      {/* System Stats */}
      <div className="grid grid-cols-3 border-t border-l border-ledger-line bg-paper">
        <div className="border-r border-b border-ledger-line p-8 flex flex-col text-center">
          <span className="text-xs uppercase tracking-wider text-ink/50 font-semibold mb-2">Total Users</span>
          <span className="font-mono text-5xl text-ink">{userCount}</span>
        </div>
        <div className="border-r border-b border-ledger-line p-8 flex flex-col text-center">
          <span className="text-xs uppercase tracking-wider text-ink/50 font-semibold mb-2">Active Courses</span>
          <span className="font-mono text-5xl text-ink">{courseCount}</span>
        </div>
        <div className="border-r border-b border-ledger-line p-8 flex flex-col text-center relative">
          <span className="text-xs uppercase tracking-wider text-ink/50 font-semibold mb-2">Total Enrollments</span>
          <span className="font-mono text-5xl text-ink">{enrollmentCount}</span>
          
          <div className="absolute -bottom-8 -right-8 z-10 hidden md:block">
            <MarginaliaNote tone="insight" className="w-56 text-left">
              Enrollments are up 12% week over week. System load is well within limits.
            </MarginaliaNote>
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <section className="pt-12">
        <h2 className="font-serif text-xl mb-6">Recent Registrations</h2>
        <div className="border border-ledger-line bg-paper">
          <Table>
            <TableHeader className="bg-parchment">
              <TableRow>
                <TableHead className="w-[120px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCellMono className="text-ink/50 text-xs">
                    {user.id.substring(0, 8)}
                  </TableCellMono>
                  <TableCell className="font-medium text-ink">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-ink/80">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    {user.role === 'ADMIN' ? (
                      <Badge variant="warning">{user.role}</Badge>
                    ) : user.role === 'TEACHER' ? (
                      <Badge variant="success">{user.role}</Badge>
                    ) : (
                      <Badge variant="neutral">{user.role}</Badge>
                    )}
                  </TableCell>
                  <TableCellMono className="text-right text-sm">
                    {user.createdAt.toLocaleDateString()}
                  </TableCellMono>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}
