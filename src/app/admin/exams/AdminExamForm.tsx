'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { createAdminExam, updateAdminExam } from '@/app/actions/admin'

type Course = { id: string, title: string, category: string }

export function AdminExamForm({ exam, courses, isEdit = false }: { exam?: any, courses: Course[], isEdit?: boolean }) {
  const router = useRouter()
  const actionToUse = isEdit && exam?.id 
    ? updateAdminExam.bind(null, exam.id) 
    : createAdminExam

  const [state, formAction, isPending] = useActionState(actionToUse, null)

  useEffect(() => {
    if (state?.success) {
      router.push('/admin/exams')
      router.refresh()
    }
  }, [state, router])

  const defaultDate = exam?.date 
    ? new Date(exam.date).toISOString().slice(0, 16)
    : ''

  return (
    <form action={formAction} className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Exam Title</label>
        <input 
          name="title" 
          defaultValue={exam?.title}
          required 
          className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Scheduled Date & Time</label>
        <input 
          name="date" 
          type="datetime-local"
          defaultValue={defaultDate}
          required 
          className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Target Course</label>
        <select 
          name="courseId" 
          defaultValue={exam?.courseId || ''}
          required
          className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red"
        >
          <option value="" disabled>Select a course...</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.category}: {c.title}</option>
          ))}
        </select>
      </div>

      {state?.error && (
        <div className="p-3 bg-rust/10 border border-rust/30 text-rust text-sm rounded-md">
          {state.error}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : (isEdit ? 'Update Exam' : 'Schedule Exam')}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
