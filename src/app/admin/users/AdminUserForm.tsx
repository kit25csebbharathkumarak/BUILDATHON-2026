'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { createAdminUser, updateAdminUser } from '@/app/actions/admin'

type User = {
  id?: string
  name: string
  email: string
  role: 'STUDENT' | 'TEACHER' | 'ADMIN'
}

export function AdminUserForm({ user, isEdit = false }: { user?: User, isEdit?: boolean }) {
  const router = useRouter()
  
  // Create a bound action if editing
  const actionToUse = isEdit && user?.id 
    ? updateAdminUser.bind(null, user.id) 
    : createAdminUser

  const [state, formAction, isPending] = useActionState(actionToUse, null)

  useEffect(() => {
    if (state?.success) {
      // Navigate back to the correct list
      if (user?.role === 'TEACHER' || (document.getElementById('role') as HTMLSelectElement)?.value === 'TEACHER') {
        router.push('/admin/teachers')
      } else {
        router.push('/admin/students')
      }
      router.refresh()
    }
  }, [state, router, user])

  return (
    <form action={formAction} className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Full Name</label>
        <input 
          name="name" 
          defaultValue={user?.name}
          required 
          className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Email Address</label>
        <input 
          name="email" 
          type="email" 
          defaultValue={user?.email}
          required 
          className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Role</label>
        <select 
          name="role" 
          id="role"
          defaultValue={user?.role || 'STUDENT'}
          className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red"
        >
          <option value="STUDENT">Student</option>
          <option value="TEACHER">Teacher</option>
          <option value="ADMIN">System Admin</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">
          {isEdit ? 'New Password (leave blank to keep current)' : 'Password'}
        </label>
        <input 
          name="password" 
          type="password" 
          required={!isEdit}
          className="w-full px-4 py-2 border border-ledger-line bg-paper text-ink rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red"
        />
      </div>

      {state?.error && (
        <div className="p-3 bg-rust/10 border border-rust/30 text-rust text-sm rounded-md">
          {state.error}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : (isEdit ? 'Update User' : 'Create User')}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
