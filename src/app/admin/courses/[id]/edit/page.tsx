import { PrismaClient } from '@prisma/client'
import { AdminCourseForm } from '../../AdminCourseForm'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  
  const course = await prisma.course.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!course) notFound()

  const teachers = await prisma.user.findMany({
    where: { role: 'TEACHER' },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Edit Course</h1>
        <p className="text-ink/60 mt-2">Update information for {course.title}.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-lg border border-ledger-line shadow-sm">
        <AdminCourseForm course={course} teachers={teachers} isEdit={true} />
      </div>
    </div>
  )
}
