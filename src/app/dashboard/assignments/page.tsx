import { getSession } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { Table, TableBody, TableCell, TableCellMono, TableHead, TableHeader, TableRow } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export default async function AssignmentsPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const isStudent = session.role === 'STUDENT'

  let assignments: any[] = []

  if (isStudent) {
    // Get assignments for courses the student is enrolled in
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.id },
      select: { courseId: true }
    })
    const courseIds = enrollments.map(e => e.courseId)
    
    assignments = await prisma.assignment.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        course: { select: { title: true, category: true } },
        submissions: {
          where: { studentId: session.id },
          select: { id: true, grade: true, aiFeedback: true }
        }
      },
      orderBy: { dueDate: 'asc' }
    })
  } else {
    // Teacher view: get assignments they created
    const classes = await prisma.class.findMany({
      where: { teacherId: session.id },
      select: { courseId: true }
    })
    const courseIds = classes.map(c => c.courseId)
    
    assignments = await prisma.assignment.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        course: { select: { title: true, category: true } },
        _count: { select: { submissions: true } }
      },
      orderBy: { dueDate: 'asc' }
    })
  }

  return (
    <div className="space-y-12 animate-fade-in">
      <header className="border-b border-ink pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl text-ink mb-2">
            Assignments Ledger
          </h1>
          <p className="font-sans text-ink/70">
            {isStudent ? 'Track your upcoming and past due work.' : 'Manage coursework and grading.'}
          </p>
        </div>
      </header>

      {assignments.length === 0 ? (
        <EmptyState 
          title="No assignments found" 
          description={isStudent ? "You don't have any pending or past assignments at this time." : "You haven't created any assignments yet."}
        />
      ) : (
        <div className="border border-ledger-line bg-paper">
          <Table>
            <TableHeader className="bg-parchment">
              <TableRow>
                <TableHead className="w-[120px]">Course Code</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map(assignment => {
                const now = new Date()
                const isOverdue = new Date(assignment.dueDate) < now
                
                let statusBadge = <Badge variant="neutral">Pending</Badge>
                
                if (isStudent) {
                  const submission = assignment.submissions[0]
                  if (submission) {
                    if (submission.grade !== null) {
                      statusBadge = <Badge variant="success">Graded: {submission.grade}%</Badge>
                    } else {
                      statusBadge = <Badge variant="default">Submitted</Badge>
                    }
                  } else if (isOverdue) {
                    statusBadge = <Badge variant="warning">Overdue</Badge>
                  }
                } else {
                  // Teacher status
                  statusBadge = <Badge variant="neutral">{assignment._count?.submissions || 0} Submitted</Badge>
                }

                return (
                  <TableRow key={assignment.id}>
                    <TableCellMono className="text-ink/60 uppercase text-xs">
                      {assignment.course.category.substring(0,3)}
                    </TableCellMono>
                    <TableCell className="font-medium text-ink">
                      {assignment.title}
                    </TableCell>
                    <TableCellMono className="text-sm">
                      {assignment.dueDate.toLocaleDateString()}
                    </TableCellMono>
                    <TableCell>
                      {statusBadge}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/assignments/${assignment.id}`} className="text-sm font-medium hover:text-marigold border-b border-transparent hover:border-marigold transition-all">
                        {isStudent && assignment.submissions?.length > 0 ? 'View Feedback' : 'View'}
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
