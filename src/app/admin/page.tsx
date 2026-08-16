import { PrismaClient } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableCellMono, TableHead, TableHeader, TableRow } from '@/components/ui/DataTable'
import { Users, GraduationCap, Library, AlertCircle } from 'lucide-react'

const prisma = new PrismaClient()

export default async function AdminDashboardPage() {
  const studentCount = await prisma.user.count({ where: { role: 'STUDENT' } })
  const teacherCount = await prisma.user.count({ where: { role: 'TEACHER' } })
  const courseCount = await prisma.course.count()
  const enrollmentCount = await prisma.enrollment.count()
  
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Admin Dashboard</h1>
        <p className="text-ink/60 mt-2">System-wide overview and management ledger.</p>
      </div>

      {/* System Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-accent-red rounded-lg text-primary-red">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink/60">Total Students</p>
              <p className="text-3xl font-bold text-ink">{studentCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-accent-red rounded-lg text-primary-red">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink/60">Total Teachers</p>
              <p className="text-3xl font-bold text-ink">{teacherCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-accent-red rounded-lg text-primary-red">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink/60">Active Courses</p>
              <p className="text-3xl font-bold text-ink">{courseCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink/60">Total Enrollments</p>
              <p className="text-3xl font-bold text-ink">{enrollmentCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
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
                      <Badge variant="default">{user.role}</Badge>
                    )}
                  </TableCell>
                  <TableCellMono className="text-right text-sm">
                    {user.createdAt.toLocaleDateString()}
                  </TableCellMono>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
