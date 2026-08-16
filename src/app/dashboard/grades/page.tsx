import { getSession } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { redirect } from 'next/navigation'
import { Printer } from 'lucide-react'

const prisma = new PrismaClient()

export default async function GradesPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const isStudent = session.role === 'STUDENT'

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.id },
    include: {
      course: { include: { teacher: true } },
    }
  })

  return (
    <div className="space-y-8 animate-fade-in print:bg-white">
      <div className="flex justify-between items-end pb-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Grades & Transcript</h1>
          <p className="text-ink/60 mt-2">
            Official academic records for Fall 2026.
          </p>
        </div>
        <div className="text-right">
          {/* Note: This would typically be a client component button to trigger window.print() */}
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-ledger-line rounded-md text-sm font-medium text-ink hover:bg-parchment hover:text-primary-red transition-colors print:hidden">
            <Printer className="w-4 h-4" />
            Print Record
          </button>
        </div>
      </div>

      <Card className="print:shadow-none print:border-black print:rounded-none">
        <CardHeader className="border-b border-ledger-line bg-parchment/50 print:bg-white print:border-b-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold uppercase tracking-wider">{session.name}</CardTitle>
              <div className="text-sm font-medium text-ink/60 mt-1">ID: {session.id.substring(0, 8).toUpperCase()}</div>
            </div>
            <div className="text-right text-sm">
              <div className="font-semibold text-primary-red uppercase tracking-wider">Fall Term 2026</div>
              <div className="text-ink/60 mt-1">Issued: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {enrollments.length === 0 ? (
             <div className="p-8">
               <EmptyState 
                 title="No academic records found" 
                 description="You have no graded courses for the current term."
               />
             </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-white border-b border-ledger-line print:border-black">
                <tr>
                  <th className="py-4 px-6 font-semibold text-ink/70">Course</th>
                  <th className="py-4 px-6 font-semibold text-ink/70">Instructor</th>
                  <th className="py-4 px-6 font-semibold text-ink/70 text-right">Credits</th>
                  <th className="py-4 px-6 font-semibold text-ink/70 text-right">Grade</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enr) => {
                  const gradeScore = enr.progress
                  const letterGrade = gradeScore > 90 ? 'A' : gradeScore > 80 ? 'B' : gradeScore > 70 ? 'C' : gradeScore > 60 ? 'D' : 'F'
                  const isPassing = gradeScore > 60

                  return (
                    <tr key={enr.id} className="border-b border-ledger-line last:border-0 print:border-gray-300">
                      <td className="py-4 px-6">
                        <div className="font-bold text-ink">{enr.course.title}</div>
                        <div className="text-xs text-ink/50 uppercase font-mono mt-1">{enr.course.category.substring(0,3)}-101</div>
                      </td>
                      <td className="py-4 px-6 text-ink/80">{enr.course.teacher.name}</td>
                      <td className="py-4 px-6 text-right font-medium">3.0</td>
                      <td className="py-4 px-6 text-right">
                        <Badge variant={isPassing ? 'success' : 'warning'} className="font-bold text-sm px-3 py-1">
                          {letterGrade}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </CardContent>
        
        {enrollments.length > 0 && (
          <div className="bg-parchment/30 p-6 border-t border-ledger-line flex justify-between items-center print:bg-white print:border-t-2 print:border-black">
            <div>
              <div className="text-sm text-ink/60">Cumulative GPA</div>
              <div className="text-2xl font-bold text-ink">3.8 <span className="text-sm font-normal text-ink/50">/ 4.0</span></div>
            </div>
            <div>
              <div className="text-sm text-ink/60">Academic Standing</div>
              <div className="text-lg font-bold text-green-600">Good</div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
