import { getSession } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { EmptyState } from '@/components/ui/EmptyState'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export default async function AttendancePage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const isStudent = session.role === 'STUDENT'

  let attendanceRecords: any[] = []

  if (isStudent) {
    attendanceRecords = await prisma.attendance.findMany({
      where: { studentId: session.id },
      include: {
        class: { include: { course: true } }
      },
      orderBy: { date: 'desc' }
    })
  }

  // Calculate stats for student
  const total = attendanceRecords.length
  const present = attendanceRecords.filter(a => a.status === 'PRESENT').length
  const late = attendanceRecords.filter(a => a.status === 'LATE').length
  const absent = attendanceRecords.filter(a => a.status === 'ABSENT').length
  
  const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0

  return (
    <div className="space-y-12 animate-fade-in">
      <header className="border-b border-ink pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl text-ink mb-2">
            Attendance Ledger
          </h1>
          <p className="font-sans text-ink/70">
            {isStudent ? 'Your official presence record.' : 'Manage class attendance.'}
          </p>
        </div>
      </header>

      {isStudent ? (
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Stats Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-paper border border-ledger-line p-6 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-5xl text-ink mb-2">{percentage}%</span>
              <span className="font-mono text-xs uppercase tracking-wider text-ink/50">Overall Rate</span>
            </div>
            
            <div className="border border-ledger-line bg-paper divide-y divide-ledger-line">
              <div className="p-4 flex justify-between items-center">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-sage"></span> Present
                </span>
                <span className="font-mono text-ink">{present}</span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-marigold"></span> Late
                </span>
                <span className="font-mono text-ink">{late}</span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-rust"></span> Absent
                </span>
                <span className="font-mono text-ink">{absent}</span>
              </div>
            </div>
          </div>

          {/* Records List */}
          <div className="lg:col-span-3">
            {attendanceRecords.length === 0 ? (
              <EmptyState 
                title="No attendance records" 
                description="No classes have been recorded yet for this term."
              />
            ) : (
              <div className="border border-ledger-line bg-paper">
                <table className="w-full text-sm text-left">
                  <thead className="bg-parchment border-b border-ink">
                    <tr>
                      <th className="p-4 font-medium w-[120px]">Date</th>
                      <th className="p-4 font-medium">Course</th>
                      <th className="p-4 font-medium">Class/Section</th>
                      <th className="p-4 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map(record => (
                      <tr key={record.id} className="border-b border-ledger-line hover:bg-parchment/50 transition-colors">
                        <td className="p-4 font-mono text-xs text-ink/70">
                          {record.date.toLocaleDateString()}
                        </td>
                        <td className="p-4 font-medium text-ink">
                          {record.class.course.title}
                        </td>
                        <td className="p-4 text-ink/70">
                          {record.class.name}
                        </td>
                        <td className="p-4 text-right">
                          <span className={`inline-flex items-center gap-2 font-mono text-xs uppercase ${
                            record.status === 'PRESENT' ? 'text-sage' : 
                            record.status === 'ABSENT' ? 'text-rust' : 'text-marigold'
                          }`}>
                            {record.status}
                            <span className={`w-2 h-2 rounded-full ${
                              record.status === 'PRESENT' ? 'bg-sage' : 
                              record.status === 'ABSENT' ? 'bg-rust' : 'bg-marigold'
                            }`}></span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <EmptyState 
          title="Teacher Attendance View" 
          description="Select a class to take attendance for today."
          actionLabel="Select Class"
          onAction={() => {}}
        />
      )}
    </div>
  )
}
