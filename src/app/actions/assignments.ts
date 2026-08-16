'use server'

import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { analyzeSubmission } from '@/lib/ai/analysis'

const prisma = new PrismaClient()

export async function submitAssignmentAction(assignmentId: string, prevState: any, formData: FormData) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'STUDENT') {
      return { error: 'Unauthorized' }
    }

    const content = formData.get('content') as string

    if (!content || content.trim().length < 10) {
      return { error: 'Submission must be at least 10 characters long.' }
    }

    // Check if already submitted
    const existing = await prisma.submission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId: assignmentId,
          studentId: session.id
        }
      }
    })

    if (existing) {
      return { error: 'You have already submitted this assignment.' }
    }

    // Get assignment details for AI rubric context
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId }
    })

    if (!assignment) {
      return { error: 'Assignment not found.' }
    }

    // Ask Gemini for Feedback
    const aiFeedback = await analyzeSubmission(content, assignment.description)
    
    // Simulate grading (80-100)
    const grade = Math.floor(Math.random() * 21) + 80

    // Save submission
    await prisma.submission.create({
      data: {
        content: content,
        studentId: session.id,
        assignmentId: assignmentId,
        aiFeedback: aiFeedback,
        grade: grade
      }
    })

    revalidatePath(`/dashboard/assignments/${assignmentId}`)
    return { success: 'Assignment submitted and graded successfully.' }

  } catch (error) {
    console.error('Submission error:', error)
    return { error: 'Failed to submit assignment.' }
  }
}
