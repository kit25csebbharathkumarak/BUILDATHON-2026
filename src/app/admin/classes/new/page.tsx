import { PrismaClient } from '@prisma/client'
import { AdminClassForm } from '../AdminClassForm'

const prisma = new PrismaClient()

export default async function NewClassPage() {
  const courses = await prisma.course.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' }
  })

  const teachers = await prisma.user.findMany({
    where: { role: 'TEACHER' },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' }
  })

  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Create New Class</h1>
        <p className="text-ink/60 mt-2">Set up a new class section, assign an instructor, and enroll students.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-lg border border-ledger-line shadow-sm">
        <AdminClassForm 
          courses={courses} 
          teachers={teachers} 
          students={students} 
        />
      </div>
    </div>
  )
}
