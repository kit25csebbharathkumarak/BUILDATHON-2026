import { PrismaClient } from '@prisma/client'
import { AdminAssignmentForm } from '../AdminAssignmentForm'

const prisma = new PrismaClient()

export default async function NewAssignmentPage() {
  const courses = await prisma.course.findMany({
    select: { id: true, title: true, category: true },
    orderBy: { title: 'asc' }
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Create New Assignment</h1>
        <p className="text-ink/60 mt-2">Distribute a new assignment to an active course.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-lg border border-ledger-line shadow-sm">
        <AdminAssignmentForm courses={courses} />
      </div>
    </div>
  )
}
