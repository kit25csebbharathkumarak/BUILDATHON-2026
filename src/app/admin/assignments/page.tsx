import { PrismaClient } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableCellMono, TableHead, TableHeader, TableRow } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Search, Plus } from 'lucide-react'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function AdminAssignmentsPage() {
  const assignments = await prisma.assignment.findMany({
    include: {
      course: { select: { title: true, category: true } },
      _count: { select: { submissions: true } }
    },
    orderBy: { dueDate: 'asc' }
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Manage Assignments</h1>
          <p className="text-ink/60 mt-2">Monitor all assignments across the platform.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Search assignments..." 
              className="pl-9 pr-4 py-2 border border-ledger-line rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-red"
            />
          </div>
          <Link href="/admin/assignments/new">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Assignment
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-parchment">
              <TableRow>
                <TableHead className="w-[100px]">Assign ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-center">Submissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map(assignment => {
                const isOverdue = new Date() > assignment.dueDate
                return (
                  <TableRow key={assignment.id}>
                    <TableCellMono className="text-ink/50 text-xs">
                      {assignment.id.substring(0, 8)}
                    </TableCellMono>
                    <TableCell className="font-bold text-ink">
                      {assignment.title}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{assignment.course.title}</div>
                      <div className="text-xs text-ink/60">{assignment.course.category}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={isOverdue ? "text-rust font-medium" : "text-ink/80"}>
                          {assignment.dueDate.toLocaleDateString()}
                        </span>
                        {isOverdue && <Badge variant="warning">Overdue</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={assignment._count.submissions > 0 ? "success" : "neutral"}>
                        {assignment._count.submissions} / -
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/assignments/${assignment.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">Manage</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
              {assignments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-ink/60">
                    No assignments found in the database.
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
