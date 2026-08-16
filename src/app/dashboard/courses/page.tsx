import { getSession } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { QuickEnrollButton, DropCourseButton } from './CourseEnrollmentActions'
import { 
  BookOpen, 
  Users, 
  Star, 
  Calendar, 
  CheckCircle2, 
  PlusCircle, 
  ArrowRight,
  TrendingUp,
  FileText,
  Sparkles,
  GraduationCap
} from 'lucide-react'

const prisma = new PrismaClient()

export default async function MyCoursesPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const isTeacher = session.role === 'TEACHER'
  const isStudent = session.role === 'STUDENT'

  // Teacher View
  if (isTeacher) {
    const teachingCourses = await prisma.course.findMany({
      where: { teacherId: session.id },
      include: {
        classes: true,
        assignments: true,
        exams: true,
        _count: {
          select: { enrollments: true, assignments: true, exams: true }
        }
      }
    })

    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink">My Teaching Courses</h1>
            <p className="text-ink/60 mt-1">Manage curriculum, student rosters, and assignments for your courses.</p>
          </div>
          <Link href="/courses">
            <Button variant="outline" className="bg-white">Browse Course Catalog</Button>
          </Link>
        </div>

        {teachingCourses.length === 0 ? (
          <div className="bg-white border border-dashed border-ledger-line rounded-xl p-12 text-center">
            <GraduationCap className="w-12 h-12 text-primary-red mx-auto mb-4 opacity-80" />
            <h3 className="text-lg font-bold text-ink mb-1">No Courses Assigned</h3>
            <p className="text-sm text-ink/60 max-w-md mx-auto mb-6">
              You haven't been assigned to teach any courses yet. Contact your administrator to assign courses to your faculty profile.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachingCourses.map(course => (
              <Card key={course.id} className="flex flex-col h-full bg-white hover:shadow-md transition-shadow">
                <div className="h-28 bg-gradient-to-r from-accent-red to-parchment p-6 flex justify-between items-start border-b border-ledger-line">
                  <Badge variant="default">{course.category}</Badge>
                  <span className="font-mono text-xs font-semibold text-amber-700 bg-white/90 px-2 py-0.5 rounded">
                    ★ {course.rating.toFixed(1)}
                  </span>
                </div>
                <CardContent className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-ink mb-2">{course.title}</h3>
                  <p className="text-xs text-ink/60 mb-6 line-clamp-2">{course.description}</p>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-parchment/60 rounded-lg text-center mb-6 text-xs">
                    <div>
                      <div className="font-bold text-ink text-base">{course._count.enrollments}</div>
                      <div className="text-ink/50 text-[10px] uppercase">Students</div>
                    </div>
                    <div>
                      <div className="font-bold text-ink text-base">{course._count.assignments}</div>
                      <div className="text-ink/50 text-[10px] uppercase">Tasks</div>
                    </div>
                    <div>
                      <div className="font-bold text-ink text-base">{course.classes.length}</div>
                      <div className="text-ink/50 text-[10px] uppercase">Classes</div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-ledger-line flex flex-col gap-2">
                    <Link href={`/dashboard/assignments`} className="w-full">
                      <Button variant="outline" className="w-full text-xs">Manage Assignments</Button>
                    </Link>
                    <Link href={`/courses/${course.id}`} className="w-full">
                      <Button variant="secondary" className="w-full text-xs">View Course Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.id },
    include: {
      course: {
        include: { 
          teacher: true,
          assignments: {
            orderBy: { dueDate: 'asc' },
            take: 2
          },
          _count: {
            select: { assignments: true, exams: true }
          }
        }
      }
    }
  })

  const userWithClasses = await prisma.user.findUnique({
    where: { id: session.id },
    include: { enrolledClasses: true }
  })
  const studentClasses = userWithClasses?.enrolledClasses || []

  // Also fetch all available courses so students can quick enroll!
  const enrolledCourseIds = new Set(enrollments.map(e => e.course.id))
  const availableCourses = await prisma.course.findMany({
    where: {
      id: { notIn: Array.from(enrolledCourseIds) }
    },
    include: { 
      teacher: true,
      _count: { select: { enrollments: true, assignments: true } }
    },
    take: 6
  })

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ledger-line pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">My Courses</h1>
          <p className="text-ink/60 mt-1">Manage your active semester course enrollments and academic progress.</p>
        </div>
        <Link href="/courses">
          <Button className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            <span>Browse Full Catalog</span>
          </Button>
        </Link>
      </div>

      {/* Enrolled Courses Section */}
      {enrollments.length === 0 ? (
        <div className="bg-white border border-ledger-line rounded-xl p-8 shadow-sm">
          <div className="text-center py-6 max-w-md mx-auto">
            <div className="w-14 h-14 bg-accent-red rounded-full flex items-center justify-center text-primary-red mx-auto mb-4">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-ink mb-2">No Active Enrollments Yet</h3>
            <p className="text-sm text-ink/70 mb-6">
              You are not currently enrolled in any courses for this semester. Choose from the available academic courses below to enroll instantly!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Active Enrolled Courses ({enrollments.length})
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => {
              const assignedClass = studentClasses.find((c: any) => c.courseId === enrollment.course.id)
              return (
              <Card key={enrollment.id} className="flex flex-col h-full bg-white hover:shadow-md transition-shadow border-ledger-line">
                <div className="h-28 bg-gradient-to-r from-accent-red to-parchment p-5 flex flex-col justify-between border-b border-ledger-line">
                  <div className="flex justify-between items-start">
                    <Badge variant="default">{enrollment.course.category}</Badge>
                    <span className="text-xs font-semibold text-amber-700 bg-white/90 px-2 py-0.5 rounded">
                      ★ {enrollment.course.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-xs text-ink/60 font-mono">
                      Instructor: {enrollment.course.teacher.name}
                    </div>
                    {assignedClass && (
                      <div className="text-xs font-bold text-primary-red bg-white/80 px-2 py-0.5 rounded-sm">
                        {assignedClass.name}
                      </div>
                    )}
                  </div>
                </div>

                <CardContent className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-ink mb-2 line-clamp-2">
                    {enrollment.course.title}
                  </h3>
                  
                  {/* Progress Indicator */}
                  <div className="space-y-1.5 my-4">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-ink/60">Course Completion</span>
                      <span className="text-primary-red font-bold">{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-parchment h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary-red h-full transition-all duration-300 rounded-full" 
                        style={{ width: `${Math.max(5, enrollment.progress)}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="flex items-center justify-between text-xs text-ink/60 py-2 border-t border-b border-ledger-line mb-4">
                    <span>{enrollment.course._count.assignments} Assignments</span>
                    <span>•</span>
                    <span>{enrollment.course._count.exams} Exams</span>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto pt-2 flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Link href={`/courses/${enrollment.course.id}`} className="w-full">
                        <Button variant="outline" className="w-full text-xs h-9 bg-white">
                          Syllabus
                        </Button>
                      </Link>
                      <Link href={`/dashboard/assignments`} className="w-full">
                        <Button variant="primary" className="w-full text-xs h-9">
                          Assignments
                        </Button>
                      </Link>
                    </div>

                    <div className="flex justify-end pt-1">
                      <DropCourseButton 
                        courseId={enrollment.course.id} 
                        courseTitle={enrollment.course.title} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )})}
          </div>
        </div>
      )}

      {/* Available Courses / Quick Enroll Section */}
      {availableCourses.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-ledger-line">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-red" />
                Available Courses to Enroll
              </h2>
              <p className="text-xs text-ink/60 mt-0.5">Click "Enroll Now" to instantly add these courses to your semester schedule.</p>
            </div>
            <Link href="/courses" className="text-xs font-semibold text-primary-red hover:underline flex items-center gap-1">
              View All ({availableCourses.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map(course => (
              <Card key={course.id} className="flex flex-col h-full bg-white hover:shadow-md transition-shadow border-ledger-line">
                <div className="p-5 border-b border-ledger-line bg-parchment/30 flex justify-between items-start">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-red bg-accent-red px-2 py-0.5 rounded">
                    {course.category}
                  </span>
                  <span className="font-mono text-sm font-bold text-ink">
                    {course.price === 0 ? 'FREE' : `$${course.price.toFixed(2)}`}
                  </span>
                </div>

                <CardContent className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-ink text-base mb-1 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-ink/60 mb-3 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="text-xs text-ink/60 space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span>Instructor:</span>
                      <span className="font-medium text-ink">{course.teacher.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <span className="font-semibold text-amber-700">★ {course.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-ledger-line flex gap-2 items-center">
                    <Link href={`/courses/${course.id}`} className="flex-1">
                      <Button variant="outline" className="w-full text-xs h-9 bg-white">
                        Details
                      </Button>
                    </Link>
                    <div className="flex-1">
                      <QuickEnrollButton 
                        courseId={course.id} 
                        courseTitle={course.title}
                        className="text-xs h-9 w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
