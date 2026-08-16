'use client'

import { useActionState, useState, useEffect } from 'react'
import { createAssignmentAction } from '@/app/actions/assignments'
import { Button } from '@/components/ui/Button'
import { Plus, X, CheckCircle2, AlertCircle } from 'lucide-react'

type Course = { id: string; title: string }

export function CreateAssignmentDialog({ courses }: { courses: Course[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(createAssignmentAction, null)

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => setIsOpen(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [state])

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Create Assignment
      </Button>
    )
  }

  return (
    <div className="mb-8 p-6 bg-white border border-ledger-line rounded-xl shadow-sm relative animate-fade-in">
      <button 
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 text-ink/50 hover:text-ink transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      
      <h2 className="text-xl font-bold text-ink mb-6">Create New Assignment</h2>
      
      <form action={formAction} className="space-y-4 max-w-2xl">
        {state?.success && (
          <div className="p-3 bg-green-50 text-green-700 rounded-md flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            {state.success}
          </div>
        )}
        {state?.error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            {state.error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink">Course</label>
            <select 
              name="courseId" 
              required
              className="w-full px-3 py-2 bg-parchment border border-ledger-line rounded-md focus:outline-none focus:border-primary-red transition-colors"
            >
              <option value="">Select a course...</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink">Due Date</label>
            <input 
              type="datetime-local" 
              name="dueDate" 
              required
              className="w-full px-3 py-2 bg-parchment border border-ledger-line rounded-md focus:outline-none focus:border-primary-red transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-ink">Assignment Title</label>
          <input 
            type="text" 
            name="title" 
            placeholder="e.g. Midterm Essay"
            required
            className="w-full px-3 py-2 bg-parchment border border-ledger-line rounded-md focus:outline-none focus:border-primary-red transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-ink">Description / Prompt</label>
          <textarea 
            name="description" 
            rows={4}
            placeholder="Provide instructions for the students..."
            required
            className="w-full px-3 py-2 bg-parchment border border-ledger-line rounded-md focus:outline-none focus:border-primary-red transition-colors resize-y"
          ></textarea>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creating...' : 'Publish Assignment'}
          </Button>
        </div>
      </form>
    </div>
  )
}
