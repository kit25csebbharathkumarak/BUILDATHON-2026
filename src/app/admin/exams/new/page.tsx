import { PrismaClient } from '@prisma/client'
import { AdminExamForm } from '../AdminExamForm'

const prisma = new PrismaClient()

export default async function NewExamPage() {
  const courses = await prisma.course.findMany({
    select: { id: true, title: true, category: true },
    orderBy: { title: 'asc' }
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Schedule New Exam</h1>
        <p className="text-ink/60 mt-2">Create a new exam for an active course.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-lg border border-ledger-line shadow-sm">
        <AdminExamForm courses={courses} />
      </div>
    </div>
  )
}
