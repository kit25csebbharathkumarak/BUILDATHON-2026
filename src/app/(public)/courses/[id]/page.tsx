import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function CourseDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      teacher: true,
      _count: {
        select: { enrollments: true, classes: true, assignments: true }
      }
    }
  })

  if (!course) {
    notFound()
  }

  return (
    <div className="py-16 md:py-24">
      {/* Header */}
      <div className="border-b border-ink pb-12 mb-12">
        <div className="flex items-center gap-4 mb-6 font-mono text-sm text-ink/70 uppercase">
          <span>{course.category}</span>
          <span>•</span>
          <span>Rating {course.rating.toFixed(1)}</span>
        </div>
        <h1 className="font-serif text-4xl md:text-6xl font-light leading-tight mb-8">
          {course.title}
        </h1>
        <p className="text-xl text-ink/80 max-w-3xl leading-relaxed font-sans mb-10">
          {course.description}
        </p>
        
        <div className="flex items-center gap-8 border-t border-ledger-line pt-6 font-mono text-sm">
          <div>
            <span className="text-ink/50 block mb-1">Instructor</span>
            <span className="font-semibold">{course.teacher.name}</span>
          </div>
          <div>
            <span className="text-ink/50 block mb-1">Enrollment</span>
            <span className="font-semibold">{course._count.enrollments} Students</span>
          </div>
          <div>
            <span className="text-ink/50 block mb-1">Assignments</span>
            <span className="font-semibold">{course._count.assignments} Required</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <section className="mb-16">
            <h2 className="font-serif text-2xl mb-6 border-b border-ledger-line pb-2">Learning Objectives</h2>
            <ul className="list-disc list-inside space-y-3 text-ink/80 font-sans">
              <li>Master the core concepts of the subject</li>
              <li>Apply knowledge to real-world scenarios</li>
              <li>Understand advanced methodologies</li>
              <li>Build a comprehensive final project</li>
              <li>Prepare for industry certifications</li>
            </ul>
          </section>
          
          <section>
            <h2 className="font-serif text-2xl mb-6 border-b border-ledger-line pb-2">Course Syllabus</h2>
            <ol className="list-decimal list-outside ml-5 space-y-8 font-sans text-ink/90">
              {[1, 2, 3, 4].map((module) => (
                <li key={module} className="pl-4 border-l border-ledger-line ml-4 pb-2">
                  <h3 className="font-semibold text-lg mb-2">Module {module}: Core Fundamentals</h3>
                  <p className="text-ink/70 mb-4">Detailed introduction to the basic principles and terminology used throughout this academic section.</p>
                  <div className="flex items-center gap-6 font-mono text-xs text-ink/50 bg-parchment p-3 rounded-[2px] border border-ledger-line inline-flex">
                    <span>3 Lessons</span>
                    <span>1 Assignment</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-paper border border-ledger-line rounded-[2px] p-8 shadow-sm">
            <div className="font-mono text-3xl mb-8">
              {course.price === 0 ? 'FREE' : `$${course.price.toFixed(2)}`}
            </div>
            
            <Link href={`/login?from=/dashboard`} className="block w-full bg-ink text-paper text-center py-3 rounded-[2px] font-medium hover:bg-ink/90 transition-colors mb-6">
              Enroll in Course
            </Link>
            
            <hr className="border-ledger-line mb-6" />
            
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Requirements</h4>
            <ul className="space-y-3 text-sm text-ink/70 font-sans">
              <li>No prior experience required</li>
              <li>Basic computer literacy</li>
              <li>Dedication to complete all modules</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
