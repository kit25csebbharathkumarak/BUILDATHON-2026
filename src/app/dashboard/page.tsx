import { getSession } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { BookOpen, Calendar, TrendingUp } from 'lucide-react'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const isStudent = session.role === 'STUDENT'

  let stats = {
    courses: 0,
    assignmentsPending: 0,
    attendanceRate: 100,
  }

  if (isStudent) {
    stats.courses = await prisma.enrollment.count({ where: { userId: session.id } })
    // Mock other stats for UI purposes
    stats.assignmentsPending = 3
    stats.attendanceRate = 92
  } else {
    stats.courses = await prisma.class.count({ where: { teacherId: session.id } })
    stats.assignmentsPending = 12 // assignments to grade
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Dashboard Overview</h1>
        <p className="text-ink/60 mt-2">Welcome back to EduPortal, {session.name}.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-accent-red rounded-lg text-primary-red">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink/60">{isStudent ? 'Enrolled Courses' : 'Active Classes'}</p>
              <p className="text-3xl font-bold text-ink">{stats.courses}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-accent-red rounded-lg text-primary-red">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink/60">{isStudent ? 'Pending Assignments' : 'To Grade'}</p>
              <p className="text-3xl font-bold text-ink">{stats.assignmentsPending}</p>
            </div>
          </CardContent>
        </Card>

        {isStudent && (
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-accent-red rounded-lg text-primary-red">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink/60">Attendance Rate</p>
                <p className="text-3xl font-bold text-ink">{stats.attendanceRate}%</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary-red"></div>
                  <div>
                    <p className="text-sm font-medium text-ink">Assignment Graded: Physics Midterm</p>
                    <p className="text-xs text-ink/60 mt-1">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-ink/60 text-center py-8">
              No upcoming classes scheduled for today.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
