'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

// Create a new Class
export async function createClassAction(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name') as string
  const courseId = formData.get('courseId') as string
  const teacherId = formData.get('teacherId') as string
  
  // Get all selected student IDs
  const studentIds = formData.getAll('studentIds').map(id => id.toString())

  if (!name || !courseId || !teacherId) {
    throw new Error('Missing required fields')
  }

  try {
    await prisma.class.create({
      data: {
        name,
        courseId,
        teacherId,
        students: {
          connect: studentIds.map(id => ({ id }))
        }
      }
    })

    revalidatePath('/admin/classes')
    revalidatePath('/dashboard/courses')
    revalidatePath('/dashboard/grades')
    revalidatePath('/dashboard/progress')
  } catch (error) {
    console.error('Failed to create class:', error)
    throw new Error('Failed to create class')
  }

  redirect('/admin/classes')
}

// Update an existing Class
export async function updateClassAction(id: string, formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name') as string
  const courseId = formData.get('courseId') as string
  const teacherId = formData.get('teacherId') as string
  
  const studentIds = formData.getAll('studentIds').map(id => id.toString())

  if (!name || !courseId || !teacherId) {
    throw new Error('Missing required fields')
  }

  try {
    await prisma.class.update({
      where: { id },
      data: {
        name,
        courseId,
        teacherId,
        students: {
          set: studentIds.map(id => ({ id }))
        }
      }
    })

    revalidatePath('/admin/classes')
    revalidatePath('/dashboard/courses')
    revalidatePath('/dashboard/grades')
    revalidatePath('/dashboard/progress')
  } catch (error) {
    console.error('Failed to update class:', error)
    throw new Error('Failed to update class')
  }

  redirect('/admin/classes')
}

// Delete a Class
export async function deleteClassAction(id: string) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  try {
    await prisma.class.delete({
      where: { id }
    })
    revalidatePath('/admin/classes')
  } catch (error) {
    console.error('Failed to delete class:', error)
    throw new Error('Failed to delete class')
  }
}
