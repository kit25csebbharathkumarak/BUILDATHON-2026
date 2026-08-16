'use server'

import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function updateProfileInfo(prevState: any, formData: FormData) {
  try {
    const session = await getSession()
    if (!session) return { error: 'Unauthorized' }

    const name = formData.get('name') as string

    if (!name || name.trim() === '') {
      return { error: 'Name cannot be empty' }
    }

    await prisma.user.update({
      where: { id: session.id },
      data: { name: name.trim() }
    })

    revalidatePath('/dashboard/profile')
    return { success: 'Profile updated successfully' }
  } catch (error) {
    console.error('Profile update error:', error)
    return { error: 'Failed to update profile' }
  }
}

export async function updatePassword(prevState: any, formData: FormData) {
  try {
    const session = await getSession()
    if (!session) return { error: 'Unauthorized' }

    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { error: 'All fields are required' }
    }

    if (newPassword !== confirmPassword) {
      return { error: 'New passwords do not match' }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id }
    })

    if (!user || user.password !== currentPassword) {
      return { error: 'Incorrect current password' }
    }

    await prisma.user.update({
      where: { id: session.id },
      data: { password: newPassword }
    })

    return { success: 'Password updated successfully' }
  } catch (error) {
    console.error('Password update error:', error)
    return { error: 'Failed to update password' }
  }
}
