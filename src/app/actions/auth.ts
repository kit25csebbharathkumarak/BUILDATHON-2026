'use server'

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { setAuthCookie, clearAuthCookie } from '@/lib/auth'
import { z } from 'zod'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
})

export async function loginAction(prevState: any, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries())
    const validatedData = loginSchema.parse(rawData)

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (!user) {
      return { error: 'Invalid credentials' }
    }

    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password)

    if (!isPasswordValid) {
      return { error: 'Invalid credentials' }
    }

    await setAuthCookie(
      await import('@/lib/auth').then((m) =>
        m.signToken({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        })
      )
    )

    return { success: true, role: user.role }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed' }
    }
    console.error(error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function registerAction(prevState: any, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries())
    const validatedData = registerSchema.parse(rawData)

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return { error: 'Email already exists' }
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
      },
    })

    await setAuthCookie(
      await import('@/lib/auth').then((m) =>
        m.signToken({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        })
      )
    )

    return { success: true, role: user.role }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed' }
    }
    console.error(error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function logoutAction(): Promise<void> {
  await clearAuthCookie()
  redirect('/login')
}
