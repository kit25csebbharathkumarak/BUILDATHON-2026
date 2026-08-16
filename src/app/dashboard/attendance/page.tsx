import { getSession } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card, CardContent } from '@/components/ui/Card'
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

  const total = attendanceRecords.length
  const present = attendanceRecords.filter(a => a.status === 'PRESENT').length
  const late = attendanceRecords.filter(a => a.status === 'LATE').length
  const absent = attendanceRecords.filter(a => a.status === 'ABSENT').length
  
  const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Attendance</h1>
        <p className="text-ink/60 mt-2">
          {isStudent ? 'Your official presence record.' : 'Manage class attendance.'}
        </p>
      </div>

      {isStudent ? (
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-md bg-gradient-to-br from-primary-red to-red-700 text-white">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-bold mb-2">{percentage}%</span>
                <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Overall Rate</span>
              </CardContent>
            </Card>
            
            <Card>
              <div className="divide-y divide-ledger-line">
                <div className="p-4 flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Present
                  </span>
                  <span className="font-bold text-ink">{present}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> Late
                  </span>
                  <span className="font-bold text-ink">{late}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Absent
                  </span>
                  <span className="font-bold text-ink">{absent}</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {attendanceRecords.length === 0 ? (
              <EmptyState 
                title="No attendance records" 
                description="No classes have been recorded yet for this term."
              />
            ) : (
              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-parchment border-b border-ledger-line">
                      <tr>
                        <th className="p-4 font-medium text-ink/70 w-[120px]">Date</th>
                        <th className="p-4 font-medium text-ink/70">Course</th>
                        <th className="p-4 font-medium text-ink/70">Section</th>
                        <th className="p-4 font-medium text-ink/70 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.map(record => (
                        <tr key={record.id} className="border-b border-ledger-line hover:bg-parchment/50 transition-colors">
                          <td className="p-4 text-ink/70">
                            {record.date.toLocaleDateString()}
                          </td>
                          <td className="p-4 font-medium text-ink">
                            {record.class.course.title}
                          </td>
                          <td className="p-4 text-ink/70">
                            {record.class.name}
                          </td>
                          <td className="p-4 text-right">
                            <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase ${
                              record.status === 'PRESENT' ? 'text-green-600' : 
                              record.status === 'ABSENT' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {record.status}
                              <span className={`w-2 h-2 rounded-full ${
                                record.status === 'PRESENT' ? 'bg-green-500' : 
                                record.status === 'ABSENT' ? 'bg-red-500' : 'bg-yellow-500'
                              }`}></span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <EmptyState 
          title="Teacher Attendance View" 
          description="Select a class to take attendance for today."
        />
      )}
    </div>
  )
}
