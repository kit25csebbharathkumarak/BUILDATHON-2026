import { getSession } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { MarginaliaNote } from '@/components/ui/MarginaliaNote'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { notFound, redirect } from 'next/navigation'
import { SubmissionForm } from './SubmissionForm'

const prisma = new PrismaClient()

export default async function AssignmentDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const session = await getSession()

  if (!session) redirect('/login')

  const isStudent = session.role === 'STUDENT'

  const assignment = await prisma.assignment.findUnique({
    where: { id: params.id },
    include: {
      course: true,
      submissions: isStudent ? { where: { studentId: session.id } } : { include: { student: true } }
    }
  })

  if (!assignment) notFound()

  const submission = isStudent ? assignment.submissions[0] : null
  const isOverdue = new Date(assignment.dueDate) < new Date()

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-xs font-bold text-primary-red uppercase tracking-wider bg-accent-red px-2 py-1 rounded-md">
            {assignment.course.category}
          </span>
          {isStudent && submission?.grade && (
            <Badge variant="success">Graded: {submission.grade}%</Badge>
          )}
          {isStudent && !submission && isOverdue && (
            <Badge variant="warning">Overdue</Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-ink mb-2">
          {assignment.title}
        </h1>
        <p className="text-sm font-medium text-ink/60">
          Due: {assignment.dueDate.toLocaleString()}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Prompt & Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-ink/80 leading-relaxed space-y-4">
                {assignment.description.split('\\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          {isStudent && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-ink">Your Submission</h2>
              
              {submission ? (
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6 text-ink/90 leading-relaxed whitespace-pre-wrap">
                      {submission.content}
                    </CardContent>
                  </Card>
                  
                  {submission.aiFeedback && (
                    <MarginaliaNote tone="insight">
                      {submission.aiFeedback}
                    </MarginaliaNote>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <SubmissionForm assignmentId={assignment.id} />
                  </CardContent>
                </Card>
              )}
            </section>
          )}

          {!isStudent && (
            <Card>
              <CardHeader>
                <CardTitle>Submissions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {assignment.submissions.length === 0 ? (
                  <div className="p-8 text-center text-sm text-ink/50">
                    No submissions yet.
                  </div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="bg-parchment border-y border-ledger-line">
                      <tr>
                        <th className="p-4 font-medium text-ink/70">Student</th>
                        <th className="p-4 font-medium text-ink/70">Status</th>
                        <th className="p-4 font-medium text-ink/70 text-right">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignment.submissions.map(sub => (
                        <tr key={sub.id} className="border-b border-ledger-line">
                          <td className="p-4 font-medium">{sub.student.name}</td>
                          <td className="p-4">
                            {sub.grade ? <Badge variant="success">Graded</Badge> : <Badge variant="neutral">Needs Grading</Badge>}
                          </td>
                          <td className="p-4 text-right font-medium">
                            {sub.grade ? `${sub.grade}%` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-parchment border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wider text-ink/50">Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-sm">
                <li>
                  <strong className="block text-ink font-medium">Weight</strong>
                  <span className="text-ink/70">20% of Final Grade</span>
                </li>
                <li>
                  <strong className="block text-ink font-medium">Format</strong>
                  <span className="text-ink/70">Text Entry</span>
                </li>
                <li>
                  <strong className="block text-ink font-medium">Late Policy</strong>
                  <span className="text-ink/70">-10% per day late</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
