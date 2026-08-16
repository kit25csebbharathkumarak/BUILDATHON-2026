import Link from 'next/link'
import { PrismaClient } from '@prisma/client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

const prisma = new PrismaClient()

export default async function HomePage() {
  const featuredCourses = await prisma.course.findMany({
    take: 3,
    include: { teacher: true }
  })

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-parchment pt-24 pb-32">
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

      {/* Featured Courses */}
      <section className="py-24 bg-white">
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
          </div>
        </div>
      </section>
    </div>
  )
}
