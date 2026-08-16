'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { createAdminCourse, updateAdminCourse } from '@/app/actions/admin'

type Teacher = { id: string, name: string, email: string }

export function AdminCourseForm({ course, teachers, isEdit = false }: { course?: any, teachers: Teacher[], isEdit?: boolean }) {
  const router = useRouter()
  const actionToUse = isEdit && course?.id 
    ? updateAdminCourse.bind(null, course.id) 
    : createAdminCourse

  const [state, formAction, isPending] = useActionState(actionToUse, null)

  useEffect(() => {
    if (state?.success) {
      router.push('/admin/courses')
      router.refresh()
    }
  }, [state, router])

  return (
    <form action={formAction} className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Course Title</label>
        <input 
          name="title" 
          defaultValue={course?.title}
          required 
          className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Description</label>
        <textarea 
          name="description" 
          defaultValue={course?.description}
          required 
          rows={3}
          className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Category (e.g. Science, Mathematics)</label>
        <input 
          name="category" 
          defaultValue={course?.category}
          required 
          className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Assign Teacher</label>
        <select 
          name="teacherId" 
          defaultValue={course?.teacherId || ''}
          required
          className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red"
        >
          <option value="" disabled>Select a teacher...</option>
          {teachers.map(t => (
            <option key={t.id} value={t.id}>{t.name || t.email}</option>
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
          {isPending ? 'Saving...' : (isEdit ? 'Update Course' : 'Create Course')}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
