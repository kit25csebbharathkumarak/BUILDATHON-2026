'use server'

import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// Ensure only ADMIN can run these actions
async function requireAdmin() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }
}

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
  password: z.string().optional()
})

export async function createAdminUser(prevState: any, formData: FormData) {
  try {
    await requireAdmin()
    
    const rawData = Object.fromEntries(formData.entries())
    const validatedData = userSchema.parse(rawData)

    if (!validatedData.password || validatedData.password.length < 6) {
      return { error: 'Password must be at least 6 characters for new users.' }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return { error: 'Email already exists' }
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
      }
    })

    revalidatePath('/admin/students')
    revalidatePath('/admin/teachers')
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) return { error: 'Validation failed' }
    return { error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export async function updateAdminUser(userId: string, prevState: any, formData: FormData) {
  try {
    await requireAdmin()
    
    const rawData = Object.fromEntries(formData.entries())
    const validatedData = userSchema.parse(rawData)

    const updateData: any = {
      name: validatedData.name,
      email: validatedData.email,
      role: validatedData.role,
    }

    if (validatedData.password && validatedData.password.trim() !== '') {
      if (validatedData.password.length < 6) {
        return { error: 'Password must be at least 6 characters' }
      }
      updateData.password = await bcrypt.hash(validatedData.password, 10)
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    })

    revalidatePath('/admin/students')
    revalidatePath('/admin/teachers')
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) return { error: 'Validation failed' }
    return { error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export async function deleteAdminUser(userId: string) {
  try {
    await requireAdmin()
    await prisma.user.delete({ where: { id: userId } })
    revalidatePath('/admin/students')
    revalidatePath('/admin/teachers')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete user' }
  }
}

// --- Exam Actions ---

const examSchema = z.object({
  title: z.string().min(2),
  date: z.string().min(1),
  courseId: z.string()
})

export async function createAdminExam(prevState: any, formData: FormData) {
  try {
    await requireAdmin()
    const rawData = Object.fromEntries(formData.entries())
    const validatedData = examSchema.parse(rawData)

    await prisma.exam.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date)
      }
    })

    revalidatePath('/admin/exams')
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) return { error: 'Validation failed' }
    return { error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export async function updateAdminExam(examId: string, prevState: any, formData: FormData) {
  try {
    await requireAdmin()
    const rawData = Object.fromEntries(formData.entries())
    const validatedData = examSchema.parse(rawData)

    await prisma.exam.update({
      where: { id: examId },
      data: {
        ...validatedData,
        date: new Date(validatedData.date)
      }
    })

    revalidatePath('/admin/exams')
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) return { error: 'Validation failed' }
    return { error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

// --- Assignment Actions ---

const assignmentSchema = z.object({
  title: z.string().min(2),
  description: z.string(),
  dueDate: z.string().min(1),
  courseId: z.string()
})

export async function createAdminAssignment(prevState: any, formData: FormData) {
  try {
    await requireAdmin()
    const rawData = Object.fromEntries(formData.entries())
    const validatedData = assignmentSchema.parse(rawData)

    await prisma.assignment.create({
      data: {
        ...validatedData,
        dueDate: new Date(validatedData.dueDate)
      }
    })

    revalidatePath('/admin/assignments')
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) return { error: 'Validation failed' }
    return { error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export async function updateAdminAssignment(assignmentId: string, prevState: any, formData: FormData) {
  try {
    await requireAdmin()
    const rawData = Object.fromEntries(formData.entries())
    const validatedData = assignmentSchema.parse(rawData)

    await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        ...validatedData,
        dueDate: new Date(validatedData.dueDate)
      }
    })

    revalidatePath('/admin/assignments')
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) return { error: 'Validation failed' }
    return { error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

// --- Course Actions ---

const courseSchema = z.object({
  title: z.string().min(2),
  description: z.string(),
  category: z.string(),
  teacherId: z.string()
})

export async function createAdminCourse(prevState: any, formData: FormData) {
  try {
    await requireAdmin()
    const rawData = Object.fromEntries(formData.entries())
    const validatedData = courseSchema.parse(rawData)

    await prisma.course.create({
      data: validatedData
    })

    revalidatePath('/admin/courses')
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) return { error: 'Validation failed' }
    return { error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export async function updateAdminCourse(courseId: string, prevState: any, formData: FormData) {
  try {
    await requireAdmin()
    const rawData = Object.fromEntries(formData.entries())
    const validatedData = courseSchema.parse(rawData)

    await prisma.course.update({
      where: { id: courseId },
      data: validatedData
    })

    revalidatePath('/admin/courses')
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) return { error: 'Validation failed' }
    return { error: error instanceof Error ? error.message : 'An error occurred' }
  }
}
