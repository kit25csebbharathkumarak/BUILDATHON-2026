import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'
import { CourseEnrollmentCard } from './CourseEnrollmentCard'
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Star, 
  Award, 
  CheckCircle, 
  Clock, 
  FileText,
  UserCheck
} from 'lucide-react'

const prisma = new PrismaClient()

export default async function CourseDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const session = await getSession()
  
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      teacher: true,
      classes: true,
      assignments: {
        orderBy: { dueDate: 'asc' }
      },
      exams: {
        orderBy: { date: 'asc' }
      },
      syllabus: {
        orderBy: { module: 'asc' }
      },
      _count: {
        select: { enrollments: true, classes: true, assignments: true, exams: true }
      }
    }
  })

  if (!course) {
    notFound()
  }

  // Check if current user is enrolled
  let isEnrolled = false
  if (session && session.role === 'STUDENT') {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.id,
          courseId: course.id
        }
      }
    })
    isEnrolled = !!enrollment
  }

  return (
    <div className="py-12 md:py-16 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-ink/60 mb-6">
        <Link href="/" className="hover:text-primary-red">Home</Link>
        <span>/</span>
        <Link href="/courses" className="hover:text-primary-red">Courses</Link>
        <span>/</span>
        <span className="text-ink font-medium truncate">{course.title}</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white border border-ledger-line rounded-xl p-8 md:p-10 mb-12 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-accent-red text-primary-red font-semibold text-xs rounded-full uppercase tracking-wider">
            {course.category}
          </span>
          <span className="flex items-center gap-1 text-sm font-medium text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            {course.rating.toFixed(1)} / 5.0
          </span>
          <span className="text-xs text-ink/50">Course ID: {course.id.substring(0, 8)}</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-ink tracking-tight mb-4">
          {course.title}
        </h1>
        <p className="text-lg text-ink/70 max-w-3xl leading-relaxed mb-8">
          {course.description}
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-ledger-line">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-red flex items-center justify-center text-primary-red">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-ink/50 block">Instructor</span>
              <span className="font-semibold text-sm text-ink">{course.teacher.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-red flex items-center justify-center text-primary-red">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-ink/50 block">Enrolled Students</span>
              <span className="font-semibold text-sm text-ink">{course._count.enrollments} Active</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-red flex items-center justify-center text-primary-red">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-ink/50 block">Assignments</span>
              <span className="font-semibold text-sm text-ink">{course._count.assignments} Required</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-red flex items-center justify-center text-primary-red">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-ink/50 block">Exams</span>
              <span className="font-semibold text-sm text-ink">{course._count.exams} Scheduled</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main Content: Objectives, Syllabus, Schedule, Instructor */}
        <div className="lg:col-span-2 space-y-10">
          {/* Learning Objectives */}
          <section className="bg-white p-8 rounded-xl border border-ledger-line shadow-sm">
            <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary-red" />
              What You Will Learn
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</div>
                <p className="text-sm text-ink/80">Master essential core concepts and foundational principles.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</div>
                <p className="text-sm text-ink/80">Apply practical problem-solving to real-world academic projects.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</div>
                <p className="text-sm text-ink/80">Receive instant AI-driven feedback on your code and homework submissions.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</div>
                <p className="text-sm text-ink/80">Prepare effectively for final evaluations and academic excellence.</p>
              </div>
            </div>
          </section>
          
          {/* Course Syllabus */}
          <section className="bg-white p-8 rounded-xl border border-ledger-line shadow-sm">
            <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-red" />
              Comprehensive Syllabus
            </h2>
            <div className="space-y-4">
              {course.syllabus.length > 0 ? (
                course.syllabus.map((mod) => (
                  <div key={mod.id} className="p-4 rounded-lg border border-ledger-line hover:border-primary-red/50 transition-colors bg-parchment/30">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-ink text-base">
                        Module {mod.module}: {mod.title}
                      </h3>
                      <span className="text-xs font-medium text-primary-red bg-accent-red px-2 py-0.5 rounded">
                        {mod.duration}
                      </span>
                    </div>
                    <p className="text-sm text-ink/70 mb-3">{mod.description}</p>
                  </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink/60 italic">Syllabus details will be announced soon.</p>
              )}
            </div>
          </section>

          {/* Active Classes & Sections */}
          <section className="bg-white p-8 rounded-xl border border-ledger-line shadow-sm">
            <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-red" />
              Class Sections & Schedule
            </h2>
            {course.classes.length === 0 ? (
              <p className="text-sm text-ink/60 italic">Open Enrollment • Self-paced schedule with live weekly Q&A.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {course.classes.map(cls => (
                  <div key={cls.id} className="p-4 rounded-lg border border-ledger-line bg-parchment/30">
                    <div className="font-semibold text-ink mb-1">{cls.name}</div>
                    <div className="text-xs text-ink/60 mb-2">Instructor: {course.teacher.name}</div>
                    <div className="text-xs font-mono text-primary-red bg-accent-red px-2 py-1 rounded inline-block">
                      Term: Fall 2026
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Assignments in this Course */}
          {course.assignments.length > 0 && (
            <section className="bg-white p-8 rounded-xl border border-ledger-line shadow-sm">
              <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-red" />
                Course Assignments
              </h2>
              <div className="divide-y divide-ledger-line">
                {course.assignments.map(a => (
                  <div key={a.id} className="py-3 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-semibold text-ink">{a.title}</h4>
                      <p className="text-xs text-ink/60">{a.description}</p>
                    </div>
                    <div className="text-xs font-mono text-ink/60">
                      Due {new Date(a.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Instructor Profile Card */}
          <section className="bg-white p-8 rounded-xl border border-ledger-line shadow-sm">
            <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary-red" />
              About the Instructor
            </h2>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-accent-red text-primary-red font-bold text-xl flex items-center justify-center border-2 border-primary-red/30 shrink-0">
                {course.teacher.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-lg text-ink">{course.teacher.name}</h3>
                <p className="text-sm text-ink/60 mb-1">{course.teacher.email}</p>
                <div className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified Faculty
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar: Sticky Enrollment Card */}
        <div className="lg:col-span-1">
          <CourseEnrollmentCard
            courseId={course.id}
            courseTitle={course.title}
            price={course.price}
            isLoggedIn={!!session}
            isStudent={session?.role === 'STUDENT'}
            isEnrolled={isEnrolled}
            userRole={session?.role}
          />
        </div>
      </div>
    </div>
  )
}
