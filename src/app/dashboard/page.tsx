import { getSession } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { MarginaliaNote } from '@/components/ui/MarginaliaNote'

const prisma = new PrismaClient()

export default async function DashboardPage() {
  const session = await getSession()
  const isStudent = session?.role === 'STUDENT'

  let stats = { courses: 0, pending: 0, completed: 0 }
  
  if (session) {
    if (isStudent) {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: session.id },
      })
      stats.courses = enrollments.length
      
      const submissions = await prisma.submission.findMany({
        where: { studentId: session.id }
      })
      stats.completed = submissions.length
      stats.pending = stats.courses * 3 - stats.completed
    } else {
      const classes = await prisma.class.findMany({
        where: { teacherId: session.id }
      })
      stats.courses = classes.length
      stats.pending = 12
      stats.completed = 45
    }
  }

  return (
    <div className="space-y-12 animate-fade-in">
      <header className="border-b border-ink pb-6">
        <h1 className="font-serif text-3xl text-ink">
          Academic Ledger
        </h1>
        <p className="font-mono text-sm text-ink/60 mt-2 uppercase tracking-wide">
          Term: Fall 2026 • Status: Active
        </p>
      </header>

      {/* Stats - Grid ledger style */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-ledger-line bg-paper">
        <div className="border-r border-b border-ledger-line p-6 flex flex-col justify-center items-center text-center">
          <span className="text-xs uppercase tracking-wider text-ink/50 font-semibold mb-2">
            {isStudent ? 'Enrollments' : 'Active Classes'}
          </span>
          <span className="font-mono text-4xl text-ink">
            {stats.courses < 10 ? `0${stats.courses}` : stats.courses}
          </span>
        </div>
        <div className="border-r border-b border-ledger-line p-6 flex flex-col justify-center items-center text-center relative">
          <span className="text-xs uppercase tracking-wider text-ink/50 font-semibold mb-2">
            {isStudent ? 'Pending Tasks' : 'To Grade'}
          </span>
          <span className="font-mono text-4xl text-rust">
            {stats.pending > 0 ? (stats.pending < 10 ? `0${stats.pending}` : stats.pending) : '00'}
          </span>
        </div>
        <div className="border-r border-b border-ledger-line p-6 flex flex-col justify-center items-center text-center relative">
          <span className="text-xs uppercase tracking-wider text-ink/50 font-semibold mb-2">
            Completed
          </span>
          <span className="font-mono text-4xl text-sage">
            {stats.completed < 10 ? `0${stats.completed}` : stats.completed}
          </span>
          {/* Marginalia attached to a specific stat block */}
          {isStudent && stats.completed > 0 && (
            <div className="absolute -bottom-8 -right-8 z-10 hidden md:block">
              <MarginaliaNote tone="success" className="w-48 whitespace-normal text-left">
                Great momentum! 3 assignments completed ahead of schedule this week.
              </MarginaliaNote>
            </div>
          )}
        </div>
        <div className="border-r border-b border-ledger-line p-6 flex flex-col justify-center items-center text-center">
          <span className="text-xs uppercase tracking-wider text-ink/50 font-semibold mb-2">
            {isStudent ? 'GPA Estimate' : 'Class Avg'}
          </span>
          <span className="font-mono text-4xl text-ink">
            3.8
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 pt-8 border-t border-ledger-line">
        {/* Recent Activity */}
        <section>
          <h2 className="font-serif text-xl mb-6">Recent Records</h2>
          <div className="bg-paper border border-ledger-line rounded-[2px]">
            <div className="border-b border-ledger-line p-4 flex gap-4 hover:bg-parchment/50 transition-colors">
              <div className="font-mono text-xs text-ink/50 w-24 shrink-0 pt-0.5">OCT 14</div>
              <div>
                <p className="font-medium text-sm text-ink mb-1">Assignment Graded: Python Basics</p>
                <div className="font-mono text-xs text-sage">Score: 92/100</div>
              </div>
            </div>
            <div className="p-4 flex gap-4 hover:bg-parchment/50 transition-colors">
              <div className="font-mono text-xs text-ink/50 w-24 shrink-0 pt-0.5">OCT 12</div>
              <div>
                <p className="font-medium text-sm text-ink mb-1">New Module Available: Advanced Calculus</p>
                <div className="font-mono text-xs text-ink/50">System Action</div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Insight Teaser */}
        <section className="relative">
          <h2 className="font-serif text-xl mb-6">AI Academic Review</h2>
          <div className="bg-paper border border-ledger-line p-8 rounded-[2px] h-[200px] flex items-center justify-center text-center relative">
            <p className="text-ink/50 font-mono text-sm max-w-[250px]">
              Processing recent performance data...
            </p>
            <div className="absolute top-1/2 -right-8 -translate-y-1/2 z-10 hidden md:block">
              <MarginaliaNote tone="insight" className="w-56 text-left">
                The engine is analyzing your latest quiz scores. Expect a detailed breakdown here shortly.
              </MarginaliaNote>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
