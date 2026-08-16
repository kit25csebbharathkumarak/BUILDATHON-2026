import { getSession } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { MarginaliaNote } from '@/components/ui/MarginaliaNote'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export default async function ProgressPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const isStudent = session.role === 'STUDENT'

  let aiInsights: any[] = []
  let masteryPercentage = 78
  let teacherClasses: any[] = []

  if (isStudent) {
    aiInsights = await prisma.aIInsight.findMany({
      where: { userId: session.id },
      orderBy: { generatedAt: 'desc' },
      take: 3
    })
  } else {
    teacherClasses = await prisma.class.findMany({
      where: { teacherId: session.id },
      include: {
        course: true,
        students: {
          include: { enrollments: true }
        },
        _count: { select: { students: true } }
      }
    })
    
    let allProgress: number[] = []
    teacherClasses.forEach(cls => {
      cls.students.forEach((student: any) => {
        const enrollment = student.enrollments.find((e: any) => e.courseId === cls.courseId)
        if (enrollment) allProgress.push(enrollment.progress)
      })
    })

    if (allProgress.length > 0) {
      masteryPercentage = Math.round(allProgress.reduce((a, b) => a + b, 0) / allProgress.length)
    } else {
      masteryPercentage = 0
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">{isStudent ? 'Academic Mastery' : 'Class Mastery'}</h1>
        <p className="text-ink/60 mt-2">
          {isStudent ? 'Comprehensive analysis of your current standing.' : 'Aggregate performance metrics across all your classes.'}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card className="border-none shadow-md bg-gradient-to-br from-primary-red to-red-700 text-white text-center p-8">
            <div className="text-7xl font-bold tracking-tighter mb-2">
              {masteryPercentage}<span className="text-4xl opacity-50">%</span>
            </div>
            <div className="text-xs uppercase tracking-widest font-semibold opacity-80">
              Proficiency
            </div>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Historical Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-32 border-b border-ledger-line pb-2 px-2 gap-3">
                {[62, 65, 68, 71, 78].map((val, i) => (
                  <div key={i} className="w-full bg-accent-red rounded-t-sm relative group transition-all hover:bg-primary-red" style={{ height: `${val}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {val}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 text-xs font-semibold text-ink/40 uppercase">
                <span>Sept</span>
                <span>Oct</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{isStudent ? 'Subject Breakdown' : 'Class Breakdown'}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-parchment border-y border-ledger-line">
                  <tr>
                    <th className="p-4 font-medium text-ink/70">Course</th>
                    <th className="p-4 font-medium text-ink/70 w-[100px]">{isStudent ? 'Score' : 'Avg Score'}</th>
                    <th className="p-4 font-medium text-ink/70 w-[100px]">{isStudent ? 'Status' : 'Students'}</th>
                  </tr>
                </thead>
                <tbody>
                  {isStudent ? (
                    <>
                      <tr className="border-b border-ledger-line">
                        <td className="p-4 font-medium">Introduction to Computer Science</td>
                        <td className="p-4 font-bold text-green-600">94%</td>
                        <td className="p-4 text-xs font-bold text-green-600 uppercase">Excellent</td>
                      </tr>
                      <tr className="border-b border-ledger-line">
                        <td className="p-4 font-medium">Data Structures & Algorithms</td>
                        <td className="p-4 font-bold text-ink">78%</td>
                        <td className="p-4 text-xs font-bold text-ink/70 uppercase">Average</td>
                      </tr>
                      <tr className="border-b border-ledger-line">
                        <td className="p-4 font-medium">Advanced Calculus</td>
                        <td className="p-4 font-bold text-red-600">62%</td>
                        <td className="p-4 text-xs font-bold text-red-600 uppercase">At Risk</td>
                      </tr>
                    </>
                  ) : (
                    teacherClasses.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-4 text-center text-ink/50">No classes assigned yet.</td>
                      </tr>
                    ) : (
                      teacherClasses.map(cls => {
                        const classProgress: number[] = []
                        cls.students.forEach((student: any) => {
                          const enrollment = student.enrollments.find((e: any) => e.courseId === cls.courseId)
                          if (enrollment) classProgress.push(enrollment.progress)
                        })
                        
                        const avg = classProgress.length > 0 ? Math.round(classProgress.reduce((a: number, b: number) => a + b, 0) / classProgress.length) : 0
                        return (
                          <tr key={cls.id} className="border-b border-ledger-line">
                            <td className="p-4 font-medium">{cls.name} <span className="text-ink/50 text-xs block">{cls.course.title}</span></td>
                            <td className="p-4 font-bold text-ink">{avg}%</td>
                            <td className="p-4 font-medium text-ink/70">{cls._count.students}</td>
                          </tr>
                        )
                      })
                    )
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {isStudent && (
            <Card>
              <CardHeader>
                <CardTitle>AI Diagnostics Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights.length > 0 ? (
                    aiInsights.map((insight) => (
                      <MarginaliaNote 
                        key={insight.id}
                        tone={insight.type === 'AT_RISK' ? 'warning' : insight.type === 'RECOMMENDATION' ? 'success' : 'insight'}
                      >
                        <div className="mb-1 flex justify-between items-center w-full gap-4">
                          <span className="font-bold text-xs uppercase tracking-wider opacity-80">
                            {insight.type === 'AT_RISK' ? 'Intervention Required' : insight.type === 'RECOMMENDATION' ? 'Suggestion' : 'Observation'}
                          </span>
                          <span className="text-xs opacity-50">{insight.generatedAt.toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm">
                          {insight.content}
                        </p>
                      </MarginaliaNote>
                    ))
                  ) : (
                    <div className="p-8 text-center text-sm text-ink/50">
                      No diagnostic data generated for this term yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
