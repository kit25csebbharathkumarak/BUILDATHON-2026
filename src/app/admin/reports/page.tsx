import { PrismaClient } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableCellMono, TableHead, TableHeader, TableRow } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { BarChart2, TrendingUp, CheckCircle, FileText, Download } from 'lucide-react'

const prisma = new PrismaClient()

export default async function AdminReportsPage() {
  // Aggregate Metrics
  const totalSubmissions = await prisma.submission.count()
  const gradedSubmissions = await prisma.submission.count({ where: { grade: { not: null } } })
  
  const allGrades = await prisma.grade.findMany({ select: { score: true } })
  const avgGrade = allGrades.length > 0 
    ? (allGrades.reduce((acc, curr) => acc + curr.score, 0) / allGrades.length).toFixed(1)
    : 'N/A'

  const allAttendance = await prisma.attendance.findMany({ select: { status: true } })
  const presentCount = allAttendance.filter(a => a.status === 'PRESENT').length
  const attendanceRate = allAttendance.length > 0
    ? Math.round((presentCount / allAttendance.length) * 100)
    : 100

  // Fetch Reports
  const reports = await prisma.report.findMany({
    orderBy: { generatedAt: 'desc' },
    take: 10
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">View Reports & Analytics</h1>
          <p className="text-ink/60 mt-2">Platform-wide performance and engagement analytics.</p>
        </div>
        <Button className="flex items-center gap-2" variant="outline">
          <Download className="w-4 h-4" />
          Export Global CSV
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-accent-red rounded-lg text-primary-red">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink/60">Average Platform Grade</p>
              <p className="text-3xl font-bold text-ink">{avgGrade}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-accent-red rounded-lg text-primary-red">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink/60">Overall Attendance</p>
              <p className="text-3xl font-bold text-ink">{attendanceRate}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-accent-red rounded-lg text-primary-red">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink/60">Total Assignments Submitted</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-ink">{totalSubmissions}</p>
                <p className="text-sm text-ink/60 mb-1">({gradedSubmissions} graded)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5" />
            System Generated Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-parchment">
              <TableRow>
                <TableHead className="w-[120px]">Report ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Target Scope</TableHead>
                <TableHead>Generated At</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map(report => (
                <TableRow key={report.id}>
                  <TableCellMono className="text-ink/50 text-xs">
                    {report.id.substring(0, 8)}
                  </TableCellMono>
                  <TableCell className="font-medium text-ink">
                    {report.title}
                  </TableCell>
                  <TableCell>
                    {report.userId ? <Badge variant="warning">User Specific</Badge> : <Badge variant="success">Platform Wide</Badge>}
                  </TableCell>
                  <TableCell className="text-sm text-ink/80">
                    {report.generatedAt.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-7 text-xs">View Data</Button>
                  </TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-ink/60">
                    No reports generated yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
