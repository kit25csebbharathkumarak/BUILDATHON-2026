import { getSession } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/Card'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { StudentCheckInCard } from './StudentCheckInCard'
import { TeacherAttendanceManager } from './TeacherAttendanceManager'
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react'

const prisma = new PrismaClient()

export default async function AttendancePage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const isStudent = session.role === 'STUDENT'
  const isTeacher = session.role === 'TEACHER'
  const isAdmin = session.role === 'ADMIN'

  // ----------------------------------------------------
  // TEACHER / ADMIN ATTENDANCE VIEW
  // ----------------------------------------------------
  if (isTeacher || isAdmin) {
    const teacherClasses = await prisma.class.findMany({
      where: isTeacher ? { teacherId: session.id } : {},
      include: {
        course: {
          include: {
            enrollments: {
              include: { user: true }
            }
          }
        },
        attendances: {
          orderBy: { date: 'desc' }
        }
      }
    })

    const classSections = teacherClasses.map(cls => ({
      id: cls.id,
      name: cls.name,
      courseTitle: cls.course.title,
      courseCategory: cls.course.category,
      students: cls.course.enrollments.map(e => {
        const latestAtt = cls.attendances.find(a => a.studentId === e.user.id)
        return {
          id: e.user.id,
          name: e.user.name,
          email: e.user.email,
          initialStatus: latestAtt?.status || 'PRESENT'
        }
      })
    }))

    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Class Attendance Portal</h1>
          <p className="text-ink/60 mt-1">
            Record, track, and manage student attendance rosters across your assigned classes.
          </p>
        </div>

        <TeacherAttendanceManager classes={classSections} />
      </div>
    )
  }

  // ----------------------------------------------------
  // STUDENT ATTENDANCE VIEW
  // ----------------------------------------------------
  const studentId = session.id

  // 1. Fetch student's enrolled courses and associated classes
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: studentId },
    include: {
      course: {
        include: {
          teacher: true,
          classes: true
        }
      }
    }
  })

  // 2. Fetch all student attendance records
  const attendanceRecords = await prisma.attendance.findMany({
    where: { studentId },
    include: {
      class: {
        include: {
          course: {
            include: { teacher: true }
          }
        }
      }
    },
    orderBy: { date: 'desc' }
  })

  // 3. Normalize today's date for check-in verification
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 4. Map active classes for today's check-in
  const enrolledClasses = enrollments.flatMap(e => 
    e.course.classes.map(cls => {
      const todayRecord = attendanceRecords.find(a => 
        a.classId === cls.id && new Date(a.date).toDateString() === today.toDateString()
      )

      return {
        id: cls.id,
        name: cls.name,
        courseId: e.course.id,
        courseTitle: e.course.title,
        courseCategory: e.course.category,
        teacherName: e.course.teacher.name,
        todayRecord: todayRecord ? { status: todayRecord.status, date: todayRecord.date } : null
      }
    })
  )

  // 5. Aggregate overall metrics
  const total = attendanceRecords.length
  const present = attendanceRecords.filter(a => a.status === 'PRESENT').length
  const late = attendanceRecords.filter(a => a.status === 'LATE').length
  const absent = attendanceRecords.filter(a => a.status === 'ABSENT').length
  
  // Rate calculation (Late is weighted 80% or standard full presence)
  const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0

  // 6. Course-by-Course Breakdown
  const courseBreakdown = enrollments.map(e => {
    const courseRecords = attendanceRecords.filter(a => a.class.courseId === e.course.id)
    const cTotal = courseRecords.length
    const cPresent = courseRecords.filter(a => a.status === 'PRESENT').length
    const cLate = courseRecords.filter(a => a.status === 'LATE').length
    const cAbsent = courseRecords.filter(a => a.status === 'ABSENT').length
    const cPercentage = cTotal > 0 ? Math.round(((cPresent + cLate) / cTotal) * 100) : 100

    return {
      courseId: e.course.id,
      title: e.course.title,
      category: e.course.category,
      teacher: e.course.teacher.name,
      total: cTotal,
      present: cPresent,
      late: cLate,
      absent: cAbsent,
      percentage: cPercentage
    }
  })

  // Dynamic Rate Banner styling
  const isHealthy = percentage >= 85
  const isModerate = percentage >= 75 && percentage < 85
  const isAtRisk = total > 0 && percentage < 75

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="border-b border-ledger-line pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">My Attendance</h1>
          <p className="text-ink/60 mt-1">Official presence records, lecture check-ins, and semester attendance metrics.</p>
        </div>
        <Link href="/dashboard/courses" className="text-xs font-semibold text-primary-red hover:underline flex items-center gap-1">
          Enrolled in {enrollments.length} Courses <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Top Metrics Row */}
      <div className="grid md:grid-cols-4 gap-6">
        {/* Overall Rate Card */}
        <Card className={`md:col-span-1 border-none shadow-md text-white ${
          total === 0 
            ? 'bg-gradient-to-br from-neutral-700 to-neutral-900' 
            : isHealthy 
            ? 'bg-gradient-to-br from-emerald-600 to-teal-800' 
            : isModerate 
            ? 'bg-gradient-to-br from-amber-500 to-orange-700' 
            : 'bg-gradient-to-br from-primary-red to-red-800'
        }`}>
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <span className="text-5xl font-extrabold mb-1">{total === 0 ? '0%' : `${percentage}%`}</span>
            <span className="text-xs uppercase tracking-wider font-semibold opacity-90 mb-3">Overall Presence Rate</span>
            
            <div className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs">
              {total === 0 ? 'No records logged' : isHealthy ? '✓ Good Standing' : isModerate ? '⚠ Moderate Attendance' : '⚠ At Risk (< 75%)'}
            </div>
          </CardContent>
        </Card>
        
        {/* Breakdown Counts */}
        <Card className="md:col-span-3 bg-white border-ledger-line">
          <CardContent className="p-6">
            <h3 className="text-xs font-bold text-ink/60 uppercase tracking-wider mb-4">Semester Presence Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5 text-emerald-700 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-semibold">Present</span>
                </div>
                <span className="text-3xl font-extrabold text-emerald-800">{present}</span>
                <span className="text-[11px] text-emerald-600 font-mono mt-1">
                  {total > 0 ? `${Math.round((present / total) * 100)}%` : '0%'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5 text-amber-700 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-semibold">Late</span>
                </div>
                <span className="text-3xl font-extrabold text-amber-800">{late}</span>
                <span className="text-[11px] text-amber-600 font-mono mt-1">
                  {total > 0 ? `${Math.round((late / total) * 100)}%` : '0%'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5 text-red-700 mb-1">
                  <XCircle className="w-4 h-4" />
                  <span className="text-xs font-semibold">Absent</span>
                </div>
                <span className="text-3xl font-extrabold text-red-800">{absent}</span>
                <span className="text-[11px] text-red-600 font-mono mt-1">
                  {total > 0 ? `${Math.round((absent / total) * 100)}%` : '0%'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Active Check-In Card */}
      <StudentCheckInCard 
        enrolledClasses={enrolledClasses} 
        hasRecords={attendanceRecords.length > 0} 
      />

      {/* Course-by-Course Attendance Breakdown */}
      {courseBreakdown.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-red" />
              Per-Course Attendance Standing
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseBreakdown.map(c => (
              <Card key={c.courseId} className="bg-white border-ledger-line">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase text-primary-red bg-accent-red px-2 py-0.5 rounded">
                      {c.category}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      c.total === 0 ? 'bg-neutral-100 text-neutral-600' :
                      c.percentage >= 85 ? 'bg-emerald-100 text-emerald-800' :
                      c.percentage >= 75 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {c.total === 0 ? 'N/A' : `${c.percentage}%`}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-ink text-sm line-clamp-1">{c.title}</h4>
                    <p className="text-xs text-ink/60">Instructor: {c.teacher}</p>
                  </div>

                  <div className="w-full bg-parchment h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        c.percentage >= 85 ? 'bg-emerald-500' : c.percentage >= 75 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${c.total === 0 ? 0 : c.percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-ink/60 pt-2 border-t border-ledger-line">
                    <span>{c.present} Present</span>
                    <span>{c.late} Late</span>
                    <span>{c.absent} Absent</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Full Presence Records Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-red" />
            Detailed Attendance History ({attendanceRecords.length} Sessions)
          </h2>
        </div>

        {attendanceRecords.length === 0 ? (
          <div className="bg-white border border-ledger-line rounded-xl p-8 text-center">
            <p className="text-sm text-ink/60">
              No previous lecture attendance records found. Use the <strong>Check In for Today</strong> button above to record your attendance.
            </p>
          </div>
        ) : (
          <Card className="bg-white border-ledger-line shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-parchment border-b border-ledger-line">
                  <tr>
                    <th className="p-4 font-medium text-ink/70 w-[140px]">Date</th>
                    <th className="p-4 font-medium text-ink/70">Course</th>
                    <th className="p-4 font-medium text-ink/70">Section</th>
                    <th className="p-4 font-medium text-ink/70">Instructor</th>
                    <th className="p-4 font-medium text-ink/70 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ledger-line">
                  {attendanceRecords.map(record => (
                    <tr key={record.id} className="hover:bg-parchment/40 transition-colors">
                      <td className="p-4 font-mono text-xs text-ink/70">
                        {new Date(record.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-4 font-semibold text-ink">
                        {record.class.course.title}
                      </td>
                      <td className="p-4 text-xs font-mono text-ink/60">
                        {record.class.name}
                      </td>
                      <td className="p-4 text-xs text-ink/70">
                        {record.class.course.teacher.name}
                      </td>
                      <td className="p-4 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                          record.status === 'PRESENT' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : record.status === 'LATE' 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            record.status === 'PRESENT' ? 'bg-emerald-500' :
                            record.status === 'LATE' ? 'bg-amber-500' : 'bg-red-500'
                          }`}></span>
                          {record.status}
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
  )
}
