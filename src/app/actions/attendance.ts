'use server'

import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

/**
 * Student 1-Click Check-In for today's active class session
 */
export async function studentCheckInAction(classId: string) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'STUDENT') {
      return { error: 'You must be logged in as a student to check in.' }
    }

    // Verify class exists and get course details
    const targetClass = await prisma.class.findUnique({
      where: { id: classId },
      include: { course: true }
    })

    if (!targetClass) {
      return { error: 'Class section not found.' }
    }

    // Verify student is enrolled in this course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.id,
          courseId: targetClass.courseId
        }
      }
    })

    if (!enrollment) {
      return { error: 'You are not enrolled in the course for this class.' }
    }

    // Normalize date to start of current day UTC
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if already checked in today
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        studentId_classId_date: {
          studentId: session.id,
          classId: classId,
          date: today
        }
      }
    })

    if (existingAttendance) {
      return { error: `You have already checked in for today (${existingAttendance.status}).` }
    }

    // Create attendance record (marked as PRESENT)
    await prisma.attendance.create({
      data: {
        studentId: session.id,
        classId: classId,
        date: today,
        status: 'PRESENT'
      }
    })

    revalidatePath('/dashboard/attendance')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/progress')

    return { success: true, message: `Successfully checked in for ${targetClass.name}!` }
  } catch (error) {
    console.error('Check-in error:', error)
    return { error: 'Failed to record check-in. Please try again.' }
  }
}

/**
 * Teacher marks attendance for multiple students for a specific class and date
 */
export async function markClassAttendanceAction(
  classId: string, 
  dateString: string, 
  rosterStatuses: Array<{ studentId: string, status: string }>
) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'TEACHER' && session.role !== 'ADMIN')) {
      return { error: 'Unauthorized. Only teachers and admins can record class attendance.' }
    }

    const targetClass = await prisma.class.findUnique({
      where: { id: classId },
      include: { course: true }
    })

    if (!targetClass) {
      return { error: 'Class section not found.' }
    }

    const attendanceDate = new Date(dateString)
    attendanceDate.setHours(0, 0, 0, 0)

    // Process each student's attendance record
    for (const record of rosterStatuses) {
      await prisma.attendance.upsert({
        where: {
          studentId_classId_date: {
            studentId: record.studentId,
            classId: classId,
            date: attendanceDate
          }
        },
        update: {
          status: record.status
        },
        create: {
          studentId: record.studentId,
          classId: classId,
          date: attendanceDate,
          status: record.status
        }
      })
    }

    revalidatePath('/dashboard/attendance')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/progress')
    revalidatePath('/admin/reports')

    return { success: true, message: `Attendance saved for ${rosterStatuses.length} students.` }
  } catch (error) {
    console.error('Mark attendance error:', error)
    return { error: 'Failed to save attendance records.' }
  }
}

/**
 * Generate starter sample attendance history for student's enrolled courses
 */
export async function generateStudentAttendanceAction(courseId: string) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'STUDENT') {
      return { error: 'Unauthorized' }
    }

    const targetClass = await prisma.class.findFirst({
      where: { courseId }
    })

    if (!targetClass) {
      return { error: 'No class section found for this course.' }
    }

    // Generate last 5 class sessions
    const now = new Date()
    const statuses = ['PRESENT', 'PRESENT', 'PRESENT', 'LATE', 'PRESENT']

    for (let i = 1; i <= 5; i++) {
      const pastDate = new Date()
      pastDate.setDate(now.getDate() - (i * 2))
      pastDate.setHours(0, 0, 0, 0)

      await prisma.attendance.upsert({
        where: {
          studentId_classId_date: {
            studentId: session.id,
            classId: targetClass.id,
            date: pastDate
          }
        },
        update: {},
        create: {
          studentId: session.id,
          classId: targetClass.id,
          date: pastDate,
          status: statuses[i - 1] || 'PRESENT'
        }
      })
    }

    revalidatePath('/dashboard/attendance')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/progress')

    return { success: true, message: 'Generated term attendance history!' }
  } catch (error) {
    console.error('Generate attendance error:', error)
    return { error: 'Failed to generate attendance data.' }
  }
}
