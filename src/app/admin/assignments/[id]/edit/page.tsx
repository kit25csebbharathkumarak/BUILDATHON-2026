import { PrismaClient } from '@prisma/client'
import { AdminAssignmentForm } from '../AdminAssignmentForm'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

export default async function EditAssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  
  const assignment = await prisma.assignment.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!assignment) notFound()

  const courses = await prisma.course.findMany({
    select: { id: true, title: true, category: true },
    orderBy: { title: 'asc' }
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Edit Assignment</h1>
        <p className="text-ink/60 mt-2">Update due dates and instructions for {assignment.title}.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-lg border border-ledger-line shadow-sm">
        <AdminAssignmentForm assignment={assignment} courses={courses} isEdit={true} />
      </div>
    </div>
  )
}
