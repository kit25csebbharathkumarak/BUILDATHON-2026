import { PrismaClient } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableCellMono, TableHead, TableHeader, TableRow } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Search, Plus } from 'lucide-react'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function AdminExamsPage() {
  const exams = await prisma.exam.findMany({
    include: {
      course: { select: { title: true, category: true } },
      _count: { select: { results: true } }
    },
    orderBy: { date: 'asc' }
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Manage Exams & Grades</h1>
          <p className="text-ink/60 mt-2">Oversee exams, standardized testing, and final grades.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Search exams..." 
              className="pl-9 pr-4 py-2 border border-ledger-line rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-red"
            />
          </div>
          <Link href="/admin/exams/new">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Schedule Exam
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-parchment">
              <TableRow>
                <TableHead className="w-[100px]">Exam ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead className="text-center">Graded Results</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map(exam => {
                const isPast = new Date() > exam.date
                return (
                  <TableRow key={exam.id}>
                    <TableCellMono className="text-ink/50 text-xs">
                      {exam.id.substring(0, 8)}
                    </TableCellMono>
                    <TableCell className="font-bold text-ink">
                      {exam.title}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{exam.course.title}</div>
                      <div className="text-xs text-ink/60">{exam.course.category}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={isPast ? "text-ink/80" : "text-primary-red font-medium"}>
                          {exam.date.toLocaleDateString()}
                        </span>
                        {!isPast && <Badge variant="warning">Upcoming</Badge>}
                        {isPast && exam._count.results === 0 && <Badge variant="warning">Pending Grading</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={exam._count.results > 0 ? "success" : "neutral"}>
                        {exam._count.results} Graded
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/exams/${exam.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">Manage</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
              {exams.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-ink/60">
                    No exams found in the database.
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
