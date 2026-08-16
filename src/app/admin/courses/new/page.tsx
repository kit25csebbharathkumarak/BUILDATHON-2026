import { PrismaClient } from '@prisma/client'
import { AdminCourseForm } from '../AdminCourseForm'

const prisma = new PrismaClient()

export default async function NewCoursePage() {
  const teachers = await prisma.user.findMany({
    where: { role: 'TEACHER' },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Create New Course</h1>
        <p className="text-ink/60 mt-2">Define a new course and assign a teacher.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-lg border border-ledger-line shadow-sm">
        <AdminCourseForm teachers={teachers} />
      </div>
    </div>
  )
}
