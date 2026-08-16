import Link from 'next/link'
import { PrismaClient } from '@prisma/client'
import { MarginaliaNote } from '@/components/ui/MarginaliaNote'

const prisma = new PrismaClient()

export default async function HomePage() {
  const featuredCourses = await prisma.course.findMany({
    take: 5,
    orderBy: { rating: 'desc' },
    include: { teacher: true }
  })

  return (
    <div className="flex flex-col w-full py-16 md:py-24">
      {/* Hero Section */}
      <section className="relative w-full mb-32">
        <div className="max-w-3xl">
          <h1 className="font-serif text-5xl md:text-7xl font-light text-ink leading-tight mb-8">
            The ledger that learns with you.
          </h1>
          <p className="text-xl text-ink/80 max-w-2xl leading-relaxed mb-10 font-sans">
            EduAI is a precision-grade academic platform. Track coursework, automate administration, and receive intelligent insights directly in the margins of your academic record.
          </p>
          <div className="flex gap-4">
            <Link href="/register" className="bg-ink text-paper px-8 py-3 rounded-[2px] font-medium hover:bg-ink/90 transition-colors">
              Start Learning
            </Link>
            <Link href="/courses" className="border border-ledger-line text-ink px-8 py-3 rounded-[2px] font-medium hover:bg-ledger-line/30 transition-colors">
              View Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Signature AI Feature */}
      <section className="mb-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-serif text-3xl mb-6">Annotations, not chatbots.</h2>
            <p className="text-lg text-ink/70 leading-relaxed mb-6">
              Our AI engine doesn't hide behind a chat window. It reads the data and leaves precise, handwritten-style notes in the margins of your assignments and progress reports exactly when you need them.
            </p>
          </div>
          <div className="relative p-12 bg-paper border border-ledger-line shadow-sm flex flex-col gap-6">
            <div className="border-b border-ledger-line pb-4 flex justify-between">
              <span className="font-mono text-sm">Calculus 101: Midterm</span>
              <span className="font-mono text-sm text-rust">Score: 68%</span>
            </div>
            <div className="border-b border-ledger-line pb-4 flex justify-between">
              <span className="font-mono text-sm">Calculus 101: Quiz 4</span>
              <span className="font-mono text-sm text-ink">Score: 72%</span>
            </div>
            
            {/* The Marginalia Note overlapping the edge */}
            <div className="absolute -right-12 top-1/2 -translate-y-1/2">
              <MarginaliaNote tone="warning" className="w-64">
                You're consistently struggling with Integration by Parts. Review Chapter 4 notes before the final exam.
              </MarginaliaNote>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Index Cards */}
      <section>
        <div className="flex justify-between items-end border-b border-ink pb-4 mb-8">
          <h2 className="font-serif text-3xl">Featured Curriculum</h2>
          <Link href="/courses" className="text-sm font-medium hover:text-marigold border-b border-transparent hover:border-marigold pb-0.5">
            View all →
          </Link>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory">
          {featuredCourses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`} className="snap-start shrink-0">
              <div className="w-80 h-48 bg-paper border border-ledger-line p-6 flex flex-col justify-between hover:border-ink transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs uppercase tracking-wider font-semibold bg-parchment px-2 py-1 border border-ledger-line rounded-[2px]">{course.category}</span>
                    <span className="font-mono text-xs">★ {course.rating.toFixed(1)}</span>
                  </div>
                  <h3 className="font-serif text-xl leading-tight line-clamp-2">{course.title}</h3>
                </div>
                <div className="font-mono text-sm text-ink/60">
                  Prof. {course.teacher.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
