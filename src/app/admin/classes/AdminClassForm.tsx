'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { createClassAction, updateClassAction, deleteClassAction } from '@/app/actions/classes'
import { Loader2, Trash2 } from 'lucide-react'

type Course = { id: string, title: string }
type User = { id: string, name: string, email: string }
type ClassData = { 
  id: string, 
  name: string, 
  courseId: string, 
  teacherId: string, 
  students: { id: string }[] 
}

interface AdminClassFormProps {
  initialData?: ClassData
  courses: Course[]
  teachers: User[]
  students: User[]
  isEdit?: boolean
}

export function AdminClassForm({ initialData, courses, teachers, students, isEdit }: AdminClassFormProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set(initialData?.students.map(s => s.id) || [])
  )

  const toggleStudent = (id: string) => {
    const newSet = new Set(selectedStudents)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedStudents(newSet)
  }

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    setError('')
    
    // Append all selected student IDs to the form data
    selectedStudents.forEach(id => {
      formData.append('studentIds', id)
    })

    try {
      if (isEdit && initialData) {
        await updateClassAction(initialData.id, formData)
      } else {
        await createClassAction(formData)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setIsPending(false)
    }
  }

  async function handleDelete() {
    if (!initialData || !confirm('Are you sure you want to delete this class?')) return
    setIsPending(true)
    try {
      await deleteClassAction(initialData.id)
      router.push('/admin/classes')
    } catch (err: any) {
      setError(err.message || 'Failed to delete')
      setIsPending(false)
    }
  }

  return (
    <div className="max-w-2xl">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm font-medium">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-ink">Class Name</label>
          <input 
            id="name" 
            name="name" 
            defaultValue={initialData?.name} 
            placeholder="e.g. Fall 2026 - Section A" 
            required 
            className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="courseId" className="text-sm font-medium text-ink">Course</label>
            <select 
              id="courseId" 
              name="courseId" 
              defaultValue={initialData?.courseId || ''} 
              className="w-full h-10 px-3 py-2 rounded-md border border-ledger-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all"
              required
            >
              <option value="" disabled>Select a Course</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="teacherId" className="text-sm font-medium text-ink">Instructor (Teacher)</label>
            <select 
              id="teacherId" 
              name="teacherId" 
              defaultValue={initialData?.teacherId || ''} 
              className="w-full h-10 px-3 py-2 rounded-md border border-ledger-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all"
              required
            >
              <option value="" disabled>Select an Instructor</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-ledger-line">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-ink">Enroll Students</label>
            <span className="text-xs font-semibold text-primary-red bg-accent-red px-2 py-1 rounded">
              {selectedStudents.size} Selected
            </span>
          </div>
          
          <div className="border border-ledger-line rounded-md bg-white max-h-[300px] overflow-y-auto p-2 space-y-1">
            {students.length === 0 ? (
              <div className="p-4 text-center text-sm text-ink/50">No students found in the system.</div>
            ) : (
              students.map(student => (
                <label 
                  key={student.id} 
                  className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors border ${selectedStudents.has(student.id) ? 'bg-accent-red/30 border-primary-red/30' : 'bg-transparent border-transparent hover:bg-parchment/50'}`}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedStudents.has(student.id)}
                    onChange={() => toggleStudent(student.id)}
                    className="w-4 h-4 text-primary-red border-ledger-line rounded focus:ring-primary-red"
                  />
                  <div>
                    <div className="text-sm font-semibold text-ink">{student.name}</div>
                    <div className="text-xs text-ink/60">{student.email}</div>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-ledger-line">
          {isEdit ? (
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleDelete}
              disabled={isPending}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Class
            </Button>
          ) : (
            <div></div> // Spacer
          )}

          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create Class'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
