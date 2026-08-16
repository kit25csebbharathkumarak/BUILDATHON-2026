import { getSession } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { Table, TableBody, TableCell, TableCellMono, TableHead, TableHeader, TableRow } from '@/components/ui/DataTable'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export default async function ReportsPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const isStudent = session.role === 'STUDENT'

  // Fetch some dummy data for the report card
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.id },
    include: {
      course: { include: { teacher: true } },
    }
  })

  return (
    <div className="space-y-12 animate-fade-in print:bg-white print:text-black">
      <div className="flex justify-between items-end border-b-2 border-ink pb-4 mb-12">
        <div>
          <h1 className="font-serif text-4xl text-ink uppercase tracking-wider mb-2">
            Official Transcript
          </h1>
          <p className="font-sans text-ink/70 print:text-black">
            EduAI Academic Records Division
          </p>
        </div>
        <div className="font-mono text-sm text-ink/60 text-right print:text-black">
          <div>DATE ISSUED: {new Date().toLocaleDateString()}</div>
          <div>STUDENT ID: {session.id.substring(0, 8).toUpperCase()}</div>
          <button 
            className="mt-4 border border-ledger-line px-4 py-1 hover:bg-ledger-line/30 print:hidden"
            // onClick window.print() would go in a client component, just styled for now
          >
            Print Record
          </button>
        </div>
      </div>

      <div className="border-4 border-double border-ink p-12 bg-paper print:shadow-none print:border-black">
        <div className="text-center border-b-2 border-ink pb-8 mb-8">
          <h2 className="font-serif text-3xl font-bold uppercase tracking-widest">{session.email.split('@')[0]}</h2>
          <div className="font-mono text-sm mt-4 tracking-widest">FALL TERM 2026</div>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center font-mono text-ink/50 py-12">
            No academic records found for the current term.
          </div>
        ) : (
          <div className="mb-12">
            <table className="w-full text-left font-sans">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th className="py-2 px-4 uppercase text-xs tracking-widest">Course Code</th>
                  <th className="py-2 px-4 uppercase text-xs tracking-widest">Course Title</th>
                  <th className="py-2 px-4 uppercase text-xs tracking-widest">Instructor</th>
                  <th className="py-2 px-4 uppercase text-xs tracking-widest text-right">Credits</th>
                  <th className="py-2 px-4 uppercase text-xs tracking-widest text-right">Final Grade</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enr) => (
                  <tr key={enr.id} className="border-b border-ledger-line print:border-gray-300">
                    <td className="py-4 px-4 font-mono text-sm uppercase">{enr.course.category.substring(0,3)}-101</td>
                    <td className="py-4 px-4 font-semibold">{enr.course.title}</td>
                    <td className="py-4 px-4">{enr.course.teacher.name}</td>
                    <td className="py-4 px-4 font-mono text-right">3.0</td>
                    <td className="py-4 px-4 font-mono text-right font-bold text-lg">
                      {/* Dummy grade logic for visual */}
                      {enr.progress > 80 ? 'A' : enr.progress > 60 ? 'B' : 'C'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-end pt-16 mt-16 border-t-2 border-ink">
          <div className="font-mono text-sm">
            <div className="mb-2">Cumulative GPA: <strong>3.8</strong></div>
            <div>Academic Standing: <strong>Good</strong></div>
          </div>
          <div className="text-center">
            <div className="w-48 border-b border-ink mb-2"></div>
            <div className="font-serif text-xs uppercase tracking-widest text-ink/70">Registrar Signature</div>
          </div>
        </div>
      </div>
    </div>
  )
}
