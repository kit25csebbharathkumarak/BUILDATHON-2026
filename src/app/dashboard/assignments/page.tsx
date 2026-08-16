import { getSession } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card, CardContent } from '@/components/ui/Card'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CreateAssignmentDialog } from './CreateAssignmentDialog'

const prisma = new PrismaClient()

export default async function AssignmentsPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const isStudent = session.role === 'STUDENT'

  let assignments: any[] = []
  let teacherCourses: any[] = []

  if (isStudent) {
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
    teacherCourses = await prisma.course.findMany({
      where: { teacherId: session.id },
      select: { id: true, title: true }
    })
    const courseIds = teacherCourses.map(c => c.id)
    
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Assignments</h1>
          <p className="text-ink/60 mt-2">
            {isStudent ? 'Track your upcoming and past due work.' : 'Manage coursework and grading.'}
          </p>
        </div>
        {!isStudent && (
          <CreateAssignmentDialog courses={teacherCourses} />
        )}
      </div>

      {assignments.length === 0 ? (
        <EmptyState 
          title="No assignments found" 
          description={isStudent ? "You don't have any pending or past assignments at this time." : "You haven't created any assignments yet."}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Subject</TableHead>
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
                    statusBadge = <Badge variant="neutral">{assignment._count?.submissions || 0} Submitted</Badge>
                  }

                  return (
                    <TableRow key={assignment.id}>
                      <TableCell className="text-xs font-semibold text-primary-red uppercase tracking-wider">
                        {assignment.course.category}
                      </TableCell>
                      <TableCell className="font-medium text-ink">
                        {assignment.title}
                      </TableCell>
                      <TableCell className="text-sm text-ink/70">
                        {assignment.dueDate.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {statusBadge}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/assignments/${assignment.id}`} className="text-sm font-semibold text-primary-red hover:underline">
                          {isStudent && assignment.submissions?.length > 0 ? 'View Feedback' : 'View'}
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
