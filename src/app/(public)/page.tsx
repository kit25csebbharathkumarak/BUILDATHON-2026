import Link from 'next/link'
import { PrismaClient } from '@prisma/client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Sparkles, Megaphone, GraduationCap, ArrowRight } from 'lucide-react'

const prisma = new PrismaClient()

export default async function HomePage() {
  const featuredCourses = await prisma.course.findMany({
    take: 3,
    include: { teacher: true }
  })

  const topTeachers = await prisma.user.findMany({
    where: { role: 'TEACHER' },
    take: 4,
  })

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-parchment pt-24 pb-20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-red text-primary-red text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-red"></span>
            </span>
            Now open for Fall 2026 Registration
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-ink mb-6 max-w-4xl mx-auto">
            The next generation of <span className="text-primary-red">academic management.</span>
          </h1>
          <p className="text-lg md:text-xl text-ink/70 mb-10 max-w-2xl mx-auto">
            4D EduPortal brings students, teachers, and administrators together in one powerful, unified platform powered by intelligent insights.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">Get Started for Free</Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 bg-white">Explore Courses</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Announcements Bar */}
      <div className="bg-primary-red text-white py-3 border-y border-rust">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-3 text-sm font-medium">
          <Megaphone className="w-4 h-4" />
          <span>Important: Midterm grading period ends on October 15th. All faculty must submit grades by 5:00 PM.</span>
        </div>
      </div>

      {/* Featured Courses */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-ink mb-4">Featured Curriculum</h2>
            <p className="text-ink/70">Discover our most popular courses for the upcoming semester.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredCourses.map(course => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow border-ledger-line/50">
                <div className="h-48 bg-parchment flex items-center justify-center p-6 border-b border-ledger-line/50">
                  <div className="w-full h-full border-2 border-dashed border-ledger-line rounded-lg flex items-center justify-center text-ink/40">
                    Course Thumbnail
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-primary-red uppercase tracking-wider bg-accent-red px-2 py-1 rounded-md">
                      {course.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-ink line-clamp-1">{course.title}</h3>
                  <p className="text-sm text-ink/70 mb-6">Instructor: {course.teacher.name}</p>
                  <Link href={`/courses/${course.id}`}>
                    <Button variant="outline" className="w-full">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
            {featuredCourses.length === 0 && (
              <div className="col-span-3 text-center py-12 text-ink/60 border-2 border-dashed border-ledger-line rounded-lg">
                No courses available right now. Check back later!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Top Teachers */}
      <section className="py-20 bg-parchment border-y border-ledger-line/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-ink mb-4">Meet Our Top Faculty</h2>
            <p className="text-ink/70">Learn from industry experts and passionate educators.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {topTeachers.map(teacher => (
              <div key={teacher.id} className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-white border-2 border-primary-red flex items-center justify-center mb-4 shadow-sm">
                  <GraduationCap className="w-10 h-10 text-primary-red/50" />
                </div>
                <h3 className="font-bold text-ink">{teacher.name || teacher.email.split('@')[0]}</h3>
                <p className="text-sm text-ink/60 mt-1">Faculty Member</p>
              </div>
            ))}
            {topTeachers.length === 0 && (
              <div className="col-span-4 text-center py-8 text-ink/60">
                No faculty members found.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AI Study Tips */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-ink rounded-2xl p-8 md:p-12 text-white shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Sparkles className="w-48 h-48" />
            </div>
            
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-6 border border-white/20">
                <Sparkles className="w-3 h-3" />
                AI-Powered Learning
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Study smarter, not harder.</h2>
              <p className="text-white/70 text-lg mb-8">
                4D EduPortal analyzes your learning patterns to generate custom study tips, highlight weak subjects before exams, and intervene when you're at risk of falling behind.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                  <h4 className="font-bold mb-1 text-primary-red">Tip of the Day</h4>
                  <p className="text-sm text-white/80">"Reviewing Chapter 4 concepts before tomorrow's Physics exam will improve your projected score by 12%."</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                  <h4 className="font-bold mb-1 text-primary-red">Insight Generated</h4>
                  <p className="text-sm text-white/80">You've maintained a 95% attendance rate in Calculus. Keep up the excellent consistency!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-parchment text-center border-t border-ledger-line">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-ink mb-6">Ready to start your journey?</h2>
          <p className="text-ink/70 mb-8 text-lg">
            Join thousands of students and educators already using the platform.
          </p>
          <Link href="/courses">
            <Button size="lg" className="px-8 text-lg flex items-center gap-2 mx-auto">
              Explore All Courses
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
