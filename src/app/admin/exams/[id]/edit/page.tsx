import { PrismaClient } from '@prisma/client'
import { AdminExamForm } from '../../AdminExamForm'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

export default async function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  
  const exam = await prisma.exam.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!exam) notFound()

  const courses = await prisma.course.findMany({
    select: { id: true, title: true, category: true },
    orderBy: { title: 'asc' }
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Edit Exam</h1>
        <p className="text-ink/60 mt-2">Update schedule for {exam.title}.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-lg border border-ledger-line shadow-sm">
        <AdminExamForm exam={exam} courses={courses} isEdit={true} />
      </div>
    </div>
  )
}
