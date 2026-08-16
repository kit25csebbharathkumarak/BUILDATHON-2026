'use client'

import { useActionState } from 'react'
import { updateProfileInfo, updatePassword } from '@/app/actions/profile'
import { Button } from '@/components/ui/Button'

export function ProfileForm({ defaultName, defaultEmail }: { defaultName: string, defaultEmail: string }) {
  const [state, action, isPending] = useActionState(updateProfileInfo, null)

  return (
    <form action={action} className="space-y-4">
      {state?.success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md">
          {state.success}
        </div>
      )}
      {state?.error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {state.error}
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">Full Name</label>
          <input 
            name="name"
            type="text" 
            defaultValue={defaultName}
            required
            className="w-full px-4 py-2 border border-ledger-line rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red bg-paper text-ink"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">Email Address</label>
          <input 
            type="email" 
            defaultValue={defaultEmail}
            className="w-full px-4 py-2 border border-ledger-line rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red bg-parchment text-ink/70 cursor-not-allowed"
            disabled
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Bio (Coming Soon)</label>
        <textarea 
          disabled
          className="w-full px-4 py-2 border border-ledger-line rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red bg-parchment text-ink/50 h-24 resize-none cursor-not-allowed"
          placeholder="Bio editing will be available once the database migration is complete."
        ></textarea>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

export function PasswordForm() {
  const [state, action, isPending] = useActionState(updatePassword, null)

  return (
    <form action={action} className="space-y-4">
      {state?.success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md">
          {state.success}
        </div>
      )}
      {state?.error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Current Password</label>
        <input 
          name="currentPassword"
          type="password" 
          required
          className="w-full px-4 py-2 border border-ledger-line rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red bg-paper text-ink"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">New Password</label>
          <input 
            name="newPassword"
            type="password" 
            required
            className="w-full px-4 py-2 border border-ledger-line rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red bg-paper text-ink"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">Confirm New Password</label>
          <input 
            name="confirmPassword"
            type="password" 
            required
            className="w-full px-4 py-2 border border-ledger-line rounded-md focus:outline-none focus:ring-1 focus:ring-primary-red bg-paper text-ink"
          />
        </div>
      </div>
      <div className="pt-2">
        <Button type="submit" variant="outline" disabled={isPending}>
          {isPending ? 'Updating...' : 'Update Password'}
        </Button>
      </div>
    </form>
  )
}
