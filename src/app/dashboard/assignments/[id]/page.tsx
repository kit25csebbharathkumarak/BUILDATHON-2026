import { getSession } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { MarginaliaNote } from '@/components/ui/MarginaliaNote'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { notFound, redirect } from 'next/navigation'

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
    <div className="space-y-12 animate-fade-in pb-20">
      <header className="border-b border-ink pb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-sm text-ink/70 uppercase">{assignment.course.category}</span>
            {isStudent && submission?.grade && (
              <Badge variant="success">Graded: {submission.grade}%</Badge>
            )}
            {isStudent && !submission && isOverdue && (
              <Badge variant="warning">Overdue</Badge>
            )}
          </div>
          <h1 className="font-serif text-3xl text-ink mb-2">
            {assignment.title}
          </h1>
          <p className="font-mono text-sm text-ink/70">
            Due: {assignment.dueDate.toLocaleString()}
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          {/* Assignment Description */}
          <section>
            <h2 className="font-serif text-xl mb-4 border-b border-ledger-line pb-2">Prompt & Requirements</h2>
            <div className="font-sans text-ink leading-relaxed">
              {assignment.description.split('\\n').map((para, idx) => (
                <p key={idx} className="mb-4">{para}</p>
              ))}
            </div>
          </section>

          {/* Submission Area (Student) */}
          {isStudent && (
            <section className="relative">
              <h2 className="font-serif text-xl mb-4 border-b border-ledger-line pb-2">Your Submission</h2>
              
              {submission ? (
                <div className="relative">
                  <div className="p-6 bg-paper border border-ledger-line shadow-sm min-h-[200px] font-sans text-ink/90 leading-relaxed whitespace-pre-wrap">
                    {submission.content}
                  </div>
                  
                  {/* The Signature Marginalia Note attached to the submission */}
                  {submission.aiFeedback && (
                    <div className="absolute top-12 -right-8 z-10 w-64 md:w-80 translate-x-full pr-12 hidden lg:block">
                      {/* Connecting line */}
                      <div className="absolute top-4 -left-8 w-8 border-t border-marigold/50 border-dashed"></div>
                      <MarginaliaNote tone="insight" className="w-full text-left">
                        {submission.aiFeedback}
                      </MarginaliaNote>
                    </div>
                  )}
                  {submission.aiFeedback && (
                    <div className="mt-6 lg:hidden">
                      <MarginaliaNote tone="insight" className="w-full text-left">
                        {submission.aiFeedback}
                      </MarginaliaNote>
                    </div>
                  )}
                </div>
              ) : (
                <form className="space-y-4">
                  <textarea 
                    className="w-full h-64 p-4 bg-paper border border-ledger-line rounded-[2px] focus:outline-none focus:border-marigold focus:ring-1 focus:ring-marigold resize-y"
                    placeholder="Write or paste your submission here..."
                    required
                  ></textarea>
                  <Button type="submit" variant="primary">Submit Assignment</Button>
                </form>
              )}
            </section>
          )}

          {/* Teacher View: Submissions List */}
          {!isStudent && (
            <section>
              <h2 className="font-serif text-xl mb-4 border-b border-ledger-line pb-2">Submissions</h2>
              {assignment.submissions.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-ledger-line font-mono text-sm text-ink/50">
                  No submissions yet.
                </div>
              ) : (
                <div className="border border-ledger-line bg-paper">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-parchment border-b border-ink">
                      <tr>
                        <th className="p-4 font-medium">Student</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignment.submissions.map(sub => (
                        <tr key={sub.id} className="border-b border-ledger-line hover:bg-parchment/50">
                          <td className="p-4">{sub.student.name}</td>
                          <td className="p-4">
                            {sub.grade ? <Badge variant="success">Graded</Badge> : <Badge variant="neutral">Needs Grading</Badge>}
                          </td>
                          <td className="p-4 text-right font-mono">
                            {sub.grade ? `${sub.grade}%` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1">
          <div className="p-6 bg-parchment border border-ledger-line rounded-[2px]">
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Rubric & Info</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <strong className="block text-ink">Weight</strong>
                <span className="font-mono text-ink/70">20% of Final Grade</span>
              </li>
              <li>
                <strong className="block text-ink">Format</strong>
                <span className="font-mono text-ink/70">Text Entry</span>
              </li>
              <li>
                <strong className="block text-ink">Late Policy</strong>
                <span className="font-mono text-ink/70">-10% per day late</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
