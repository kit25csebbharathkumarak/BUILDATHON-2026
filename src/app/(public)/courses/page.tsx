import Link from 'next/link'
import { PrismaClient } from '@prisma/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCellMono } from '@/components/ui/DataTable'
import { EmptyState } from '@/components/ui/EmptyState'

const prisma = new PrismaClient()

export default async function CoursesPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams
  const query = searchParams.q || ''

  const courses = await prisma.course.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { category: { contains: query } },
      ],
    },
    include: { teacher: true },
    orderBy: { rating: 'desc' }
  })

  return (
    <div className="py-16 md:py-24">
      <div className="border-b border-ink pb-8 mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">Course Ledger</h1>
        <p className="text-lg text-ink/70 max-w-2xl font-sans">
          Browse our complete academic offering.
        </p>
      </div>
      
      <div className="mb-8">
        <form className="flex max-w-md" action="/courses" method="GET">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search catalog..."
            className="flex-1 bg-paper border border-ledger-line rounded-l-[2px] px-4 py-2 text-sm focus:outline-none focus:border-marigold"
          />
          <button type="submit" className="bg-ink text-paper px-6 py-2 rounded-r-[2px] text-sm font-medium hover:bg-ink/90 transition-colors">
            Search
          </button>
        </form>
      </div>

      {query && (
        <div className="font-mono text-sm mb-6 text-ink/70">
          FILTER: "{query}" — {courses.length} matches
        </div>
      )}

      {courses.length === 0 ? (
        <EmptyState 
          title="No courses found" 
          description="We couldn't find any courses matching your search criteria." 
        />
      ) : (
        <div className="bg-paper border border-ledger-line shadow-sm rounded-[2px] overflow-hidden">
          <Table>
            <TableHeader className="bg-parchment">
              <TableRow>
                <TableHead className="w-[120px]">Code / Category</TableHead>
                <TableHead>Course Title</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead className="text-right">Rating</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map(course => (
                <TableRow key={course.id}>
                  <TableCellMono className="text-ink/60 uppercase text-xs">
                    {course.category.substring(0,3)}-{course.id.substring(course.id.length-4)}
                  </TableCellMono>
                  <TableCell className="font-medium text-base">
                    {course.title}
                  </TableCell>
                  <TableCell>
                    {course.teacher.name}
                  </TableCell>
                  <TableCellMono className="text-right">
                    {course.rating.toFixed(1)}
                  </TableCellMono>
                  <TableCell className="text-right">
                    <Link href={`/courses/${course.id}`} className="text-sm font-medium hover:text-marigold border-b border-transparent hover:border-marigold transition-all">
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
