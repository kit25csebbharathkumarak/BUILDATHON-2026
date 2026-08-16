import Link from 'next/link'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCellMono } from '@/components/ui/DataTable'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { QuickEnrollButton } from '@/app/dashboard/courses/CourseEnrollmentActions'
import { Search, Star, Users, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react'

const prisma = new PrismaClient()

export default async function CoursesPage(props: { 
  searchParams: Promise<{ q?: string; category?: string; view?: string }> 
}) {
  const searchParams = await props.searchParams
  const query = searchParams.q || ''
  const selectedCategory = searchParams.category || 'ALL'
  const view = searchParams.view || 'grid'
  const session = await getSession()

  // Build filter conditions
  const whereClause: any = {}
  if (query) {
    whereClause.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { category: { contains: query, mode: 'insensitive' } },
    ]
  }
  if (selectedCategory && selectedCategory !== 'ALL') {
    whereClause.category = { contains: selectedCategory }
  }

  // Fetch courses with counts and teacher info
  const courses = await prisma.course.findMany({
    where: whereClause,
    include: { 
      teacher: true,
      _count: {
        select: { enrollments: true, assignments: true }
      }
    },
    orderBy: { rating: 'desc' }
  })

  // Get distinct categories
  const allCourses = await prisma.course.findMany({ select: { category: true } })
  const categories = ['ALL', ...Array.from(new Set(allCourses.map(c => c.category)))]

  // If student is logged in, find enrolled course IDs
  let enrolledCourseIds = new Set<string>()
  if (session && session.role === 'STUDENT') {
    const userEnrollments = await prisma.enrollment.findMany({
      where: { userId: session.id },
      select: { courseId: true }
    })
    enrolledCourseIds = new Set(userEnrollments.map(e => e.courseId))
  }

  return (
    <div className="py-12 md:py-20 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-ledger-line pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-red text-primary-red text-xs font-semibold uppercase tracking-wider mb-3">
            Academic Course Catalog
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-ink">
            Explore Courses
          </h1>
          <p className="text-base text-ink/70 max-w-2xl mt-2">
            Browse our complete curriculum. Learn directly from faculty and earn credits with AI-assisted homework grading.
          </p>
        </div>

        {session?.role === 'STUDENT' && (
          <Link href="/dashboard/courses">
            <Button variant="outline" className="flex items-center gap-2 bg-white shrink-0">
              <BookOpen className="w-4 h-4 text-primary-red" />
              <span>Go to My Enrolled Courses ({enrolledCourseIds.size})</span>
            </Button>
          </Link>
        )}
      </div>
      
      {/* Search & Category Filter Toolbar */}
      <div className="space-y-6 mb-10">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Form */}
          <form className="flex w-full sm:max-w-md relative" action="/courses" method="GET">
            <input type="hidden" name="category" value={selectedCategory} />
            <input type="hidden" name="view" value={view} />
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search courses by title, topic, or instructor..."
                className="w-full bg-white border border-ledger-line rounded-lg pl-10 pr-24 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red"
              />
              <button 
                type="submit" 
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary-red text-white px-4 py-1.5 rounded-md text-xs font-medium hover:bg-primary-red/90 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-white border border-ledger-line p-1 rounded-lg self-end sm:self-auto text-xs font-medium">
            <Link 
              href={`/courses?category=${encodeURIComponent(selectedCategory)}&q=${encodeURIComponent(query)}&view=grid`}
              className={`px-3 py-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-primary-red text-white font-semibold' : 'text-ink/70 hover:bg-parchment'}`}
            >
              Card View
            </Link>
            <Link 
              href={`/courses?category=${encodeURIComponent(selectedCategory)}&q=${encodeURIComponent(query)}&view=table`}
              className={`px-3 py-1.5 rounded-md transition-colors ${view === 'table' ? 'bg-primary-red text-white font-semibold' : 'text-ink/70 hover:bg-parchment'}`}
            >
              Table View
            </Link>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => {
            const isActive = selectedCategory === cat
            return (
              <Link
                key={cat}
                href={`/courses?category=${encodeURIComponent(cat)}&q=${encodeURIComponent(query)}&view=${view}`}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-ink text-white shadow-sm' 
                    : 'bg-white border border-ledger-line text-ink/70 hover:border-ink hover:text-ink'
                }`}
              >
                {cat === 'ALL' ? 'All Subjects' : cat}
              </Link>
            )
          })}
        </div>
      </div>

      {query && (
        <div className="text-sm mb-6 text-ink/70 flex items-center justify-between">
          <span>Found <strong>{courses.length}</strong> matching courses for "{query}"</span>
          <Link href="/courses" className="text-primary-red text-xs hover:underline">Clear filter</Link>
        </div>
      )}

      {courses.length === 0 ? (
        <EmptyState 
          title="No courses found" 
          description="We couldn't find any courses matching your criteria. Try different search terms or categories." 
        />
      ) : view === 'grid' ? (
        /* Grid Cards View */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => {
            const isEnrolled = enrolledCourseIds.has(course.id)
            return (
              <Card key={course.id} className="flex flex-col h-full bg-white hover:shadow-lg transition-all duration-200 border-ledger-line overflow-hidden group">
                <div className="h-36 bg-gradient-to-br from-accent-red via-parchment to-white p-6 flex flex-col justify-between border-b border-ledger-line relative">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary-red bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-primary-red/20">
                      {course.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-white/90 px-2 py-1 rounded shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {course.rating.toFixed(1)}
                    </span>
                  </div>
                  
                  {isEnrolled && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 self-start">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Enrolled
                    </div>
                  )}
                </div>

                <CardContent className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-ink mb-2 group-hover:text-primary-red transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-ink/70 mb-4 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="text-xs text-ink/60 space-y-1 mb-6 pt-2 border-t border-ledger-line">
                    <div className="flex justify-between">
                      <span>Instructor:</span>
                      <span className="font-medium text-ink">{course.teacher.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Students:</span>
                      <span className="font-medium text-ink">{course._count.enrollments} Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assignments:</span>
                      <span className="font-medium text-ink">{course._count.assignments} Items</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-ledger-line flex flex-col gap-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xl font-bold text-ink">
                        {course.price === 0 ? 'FREE' : `$${course.price.toFixed(2)}`}
                      </span>
                      <Link href={`/courses/${course.id}`} className="text-xs font-semibold text-primary-red hover:underline flex items-center gap-1">
                        Syllabus & Info <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link href={`/courses/${course.id}`} className="w-full">
                        <Button variant="outline" className="w-full text-xs h-9 bg-white">
                          Details
                        </Button>
                      </Link>

                      {session?.role === 'STUDENT' ? (
                        isEnrolled ? (
                          <Link href="/dashboard/assignments" className="w-full">
                            <Button variant="secondary" className="w-full text-xs h-9 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                              Go to Work
                            </Button>
                          </Link>
                        ) : (
                          <QuickEnrollButton 
                            courseId={course.id} 
                            courseTitle={course.title} 
                            className="text-xs h-9 w-full"
                          />
                        )
                      ) : (
                        <Link href={`/courses/${course.id}`} className="w-full">
                          <Button className="w-full text-xs h-9">
                            Enroll
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-ledger-line shadow-sm rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-parchment">
              <TableRow>
                <TableHead className="w-[140px]">Category</TableHead>
                <TableHead>Course Title</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead className="text-center">Students</TableHead>
                <TableHead className="text-right">Rating</TableHead>
                <TableHead className="text-right">Tuition</TableHead>
                <TableHead className="text-right w-[160px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map(course => {
                const isEnrolled = enrolledCourseIds.has(course.id)
                return (
                  <TableRow key={course.id} className="hover:bg-parchment/40">
                    <TableCell>
                      <span className="text-xs font-semibold uppercase text-primary-red bg-accent-red px-2 py-0.5 rounded">
                        {course.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-ink">{course.title}</div>
                      <div className="text-xs text-ink/60 line-clamp-1">{course.description}</div>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-ink/80">
                      {course.teacher.name}
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs">
                      {course._count.enrollments}
                    </TableCell>
                    <TableCellMono className="text-right font-semibold text-amber-700">
                      ★ {course.rating.toFixed(1)}
                    </TableCellMono>
                    <TableCellMono className="text-right font-bold text-ink">
                      {course.price === 0 ? 'FREE' : `$${course.price.toFixed(2)}`}
                    </TableCellMono>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isEnrolled ? (
                          <span className="text-xs text-emerald-700 font-semibold px-2 py-1 bg-emerald-50 rounded">Enrolled</span>
                        ) : session?.role === 'STUDENT' ? (
                          <QuickEnrollButton courseId={course.id} courseTitle={course.title} variant="outline" className="h-8 text-xs px-2.5" />
                        ) : null}
                        <Link href={`/courses/${course.id}`}>
                          <Button variant="outline" size="sm" className="h-8 text-xs bg-white">
                            View
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
