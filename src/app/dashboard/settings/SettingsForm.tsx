'use client'

import { useActionState, useEffect } from 'react'
import { savePreferences } from '@/app/actions/settings'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export function SettingsForm({ initialPreferences }: { initialPreferences: any }) {
  const [state, formAction, isPending] = useActionState(savePreferences, null)

  useEffect(() => {
    if (state?.success) {
      if (initialPreferences.darkMode) {
         document.documentElement.classList.add('dark')
      } else {
         document.documentElement.classList.remove('dark')
      }
    }
  }, [state, initialPreferences.darkMode])

  return (
    <form action={formAction} className="space-y-6">
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

      <div className="space-y-4">
        <h3 className="font-semibold text-ink border-b border-ledger-line pb-2">Notifications</h3>
        <label className="flex items-center gap-3 p-3 border border-ledger-line rounded-md hover:bg-parchment/50 cursor-pointer">
          <input type="checkbox" name="emailNotifications" defaultChecked={initialPreferences?.emailNotifications} className="w-4 h-4 accent-primary-red" />
          <div className="flex flex-col">
            <span className="font-medium text-sm text-ink">Email Notifications</span>
            <span className="text-xs text-ink/60">Receive daily summaries and grading updates.</span>
          </div>
        </label>

        <label className="flex items-center gap-3 p-3 border border-ledger-line rounded-md hover:bg-parchment/50 cursor-pointer">
          <input type="checkbox" name="smsNotifications" defaultChecked={initialPreferences?.smsNotifications} className="w-4 h-4 accent-primary-red" />
          <div className="flex flex-col">
            <span className="font-medium text-sm text-ink">SMS Alerts</span>
            <span className="text-xs text-ink/60">Get instant alerts for assignments due within 24 hours.</span>
          </div>
        </label>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-ink border-b border-ledger-line pb-2 mt-8">Appearance</h3>
        <label className="flex items-center gap-3 p-3 border border-ledger-line rounded-md hover:bg-parchment/50 cursor-pointer">
          <input type="checkbox" name="darkMode" defaultChecked={initialPreferences?.darkMode} className="w-4 h-4 accent-primary-red" />
          <div className="flex flex-col">
            <span className="font-medium text-sm text-ink">Dark Mode</span>
            <span className="text-xs text-ink/60">Switch to a darker theme for better nighttime viewing.</span>
          </div>
        </label>

        <label className="flex items-center gap-3 p-3 border border-ledger-line rounded-md hover:bg-parchment/50 cursor-pointer">
          <input type="checkbox" name="highContrast" defaultChecked={initialPreferences?.highContrast} className="w-4 h-4 accent-primary-red" />
          <div className="flex flex-col">
            <span className="font-medium text-sm text-ink">High Contrast Mode</span>
            <span className="text-xs text-ink/60">Increase visual contrast for better readability.</span>
          </div>
        </label>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </form>
  )
}
