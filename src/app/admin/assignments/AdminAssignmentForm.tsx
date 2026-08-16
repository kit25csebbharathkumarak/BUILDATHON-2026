'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { createAdminAssignment, updateAdminAssignment } from '@/app/actions/admin'

type Course = { id: string, title: string, category: string }

export function AdminAssignmentForm({ assignment, courses, isEdit = false }: { assignment?: any, courses: Course[], isEdit?: boolean }) {
  const router = useRouter()
  const actionToUse = isEdit && assignment?.id 
    ? updateAdminAssignment.bind(null, assignment.id) 
    : createAdminAssignment

  const [state, formAction, isPending] = useActionState(actionToUse, null)

  useEffect(() => {
    if (state?.success) {
      router.push('/admin/assignments')
      router.refresh()
    }
  }, [state, router])

  // Format date for datetime-local input
  const defaultDate = assignment?.dueDate 
    ? new Date(assignment.dueDate).toISOString().slice(0, 16)
    : ''

  return (
    <form action={formAction} className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Assignment Title</label>
        <input 
          name="title" 
          defaultValue={assignment?.title}
          required 
          className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Description / Instructions</label>
        <textarea 
          name="description" 
          defaultValue={assignment?.description}
          required 
          rows={4}
          className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Due Date</label>
        <input 
          name="dueDate" 
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
          defaultValue={assignment?.courseId || ''}
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
          {isPending ? 'Saving...' : (isEdit ? 'Update Assignment' : 'Create Assignment')}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
