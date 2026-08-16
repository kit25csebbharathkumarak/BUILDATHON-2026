'use server'

import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function enrollInCourseAction(courseId: string) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'STUDENT') {
      return { error: 'You must be logged in as a student to enroll in courses.' }
    }

    if (!courseId) {
      return { error: 'Invalid course ID provided.' }
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { classes: true }
    })

    if (!course) {
      return { error: 'Course not found.' }
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.id,
          courseId: courseId
        }
      }
    })

    if (existingEnrollment) {
      return { error: 'You are already enrolled in this course.' }
    }

    // Create enrollment
    await prisma.enrollment.create({
      data: {
        userId: session.id,
        courseId: courseId,
        progress: 0
      }
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/courses')
    revalidatePath('/courses')
    revalidatePath(`/courses/${courseId}`)

    return { success: true, message: `Successfully enrolled in ${course.title}!` }
  } catch (error) {
    console.error('Enrollment error:', error)
    return { error: 'Failed to enroll in course. Please try again.' }
  }
}

export async function dropCourseAction(courseId: string) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'STUDENT') {
      return { error: 'Unauthorized' }
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.id,
          courseId: courseId
        }
      }
    })

    if (!existingEnrollment) {
      return { error: 'Enrollment record not found.' }
    }

    await prisma.enrollment.delete({
      where: {
        userId_courseId: {
          userId: session.id,
          courseId: courseId
        }
      }
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/courses')
    revalidatePath('/courses')
    revalidatePath(`/courses/${courseId}`)

    return { success: true, message: 'Successfully dropped the course.' }
  } catch (error) {
    console.error('Drop course error:', error)
    return { error: 'Failed to drop course. Please try again.' }
  }
}

export async function updateCourseProgressAction(courseId: string, progress: number) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'STUDENT') {
      return { error: 'Unauthorized' }
    }

    const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)))

    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId: session.id,
          courseId: courseId
        }
      },
      data: {
        progress: clampedProgress
      }
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/courses')
    return { success: true, progress: clampedProgress }
  } catch (error) {
    console.error('Progress update error:', error)
    return { error: 'Failed to update progress.' }
  }
}
