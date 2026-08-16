import Link from 'next/link'
import { PrismaClient } from '@prisma/client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { Search, Star, BookOpen, GraduationCap, Clock } from 'lucide-react'

const prisma = new PrismaClient()

export default async function CoursesPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams
  const query = searchParams.q || ''

  const courses = await prisma.course.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: { 
      teacher: true,
      _count: { select: { enrollments: true, assignments: true } }
    },
    orderBy: { rating: 'desc' }
  })

  return (
    <div className="animate-fade-in bg-parchment min-h-screen pb-24">
      {/* Premium Header */}
      <div className="bg-ink text-white pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <Badge variant="warning" className="mb-6 bg-primary-red text-white border-none uppercase tracking-widest text-xs font-bold">
              Course Catalog
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Expand your <span className="text-primary-red">knowledge</span>.
            </h1>
            <p className="text-lg md:text-xl text-white/70 font-light mb-8">
              Browse our comprehensive academic offerings taught by industry experts and top faculty members.
            </p>
            
            {/* Search Bar */}
            <form className="flex max-w-xl shadow-2xl rounded-lg overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 p-1" action="/courses" method="GET">
              <div className="flex items-center pl-4 pr-2">
                <Search className="w-5 h-5 text-white/50" />
              </div>
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search by title, subject, or keywords..."
                className="flex-1 bg-transparent border-none text-white placeholder:text-white/50 px-3 py-3 focus:outline-none focus:ring-0 w-full"
              />
              <button type="submit" className="bg-primary-red hover:bg-primary-red/90 text-white px-6 py-2 rounded-md font-bold transition-colors">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {query && (
          <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-ledger-line mb-8 flex items-center justify-between">
            <span className="text-ink/70 font-medium">
              Showing results for <span className="text-ink font-bold">"{query}"</span>
            </span>
            <Badge variant="neutral">{courses.length} courses found</Badge>
          </div>
        )}

        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-ledger-line p-12 mt-8">
            <EmptyState 
              title="No courses found" 
              description="We couldn't find any courses matching your search criteria. Try using different keywords." 
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
            {courses.map(course => (
              <Card key={course.id} className="group hover:shadow-2xl transition-all duration-300 border-none shadow-md overflow-hidden bg-white flex flex-col h-full rounded-2xl">
                {/* Card Image Placeholder */}
                <div className="h-48 bg-ink relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                  <BookOpen className="w-16 h-16 text-white/20 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-ink px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-marigold fill-marigold" />
                    {course.rating.toFixed(1)}
                  </div>
                </div>
                
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="neutral" className="bg-accent-red text-primary-red border-none font-bold uppercase tracking-wider text-[10px]">
                      {course.category}
                    </Badge>
                    <span className="text-xs font-mono text-ink/40">
                      {course.category.substring(0,3).toUpperCase()}-{course.id.substring(course.id.length-4)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-ink line-clamp-2 group-hover:text-primary-red transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-ink/60 line-clamp-2 mb-6 flex-1">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs font-medium text-ink/60 mb-6 pb-6 border-b border-ledger-line/50">
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4 text-primary-red" />
                      <span>{course._count.enrollments} Students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-primary-red" />
                      <span>{course._count.assignments} Tasks</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-white font-bold text-xs">
                        {course.teacher.name.charAt(0)}
                      </div>
                      <div className="text-sm">
                        <p className="font-bold text-ink leading-none mb-1">{course.teacher.name}</p>
                        <p className="text-xs text-ink/50 leading-none">Instructor</p>
                      </div>
                    </div>
                    <Link href={`/courses/${course.id}`}>
                      <Button variant="outline" size="sm" className="hover:bg-primary-red hover:text-white hover:border-primary-red transition-colors">
                        View Course
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
