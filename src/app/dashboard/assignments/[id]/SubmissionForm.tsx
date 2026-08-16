'use client'

import { useActionState } from 'react'
import { submitAssignmentAction } from '@/app/actions/assignments'
import { Button } from '@/components/ui/Button'

export function SubmissionForm({ assignmentId }: { assignmentId: string }) {
  // Bind the assignmentId to the action as the first argument
  const submitWithId = submitAssignmentAction.bind(null, assignmentId)
  const [state, action, isPending] = useActionState(submitWithId, null)

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md mb-4">
          {state.error}
        </div>
      )}
      
      <textarea 
        name="content"
        className="w-full h-64 p-4 border border-ledger-line rounded-md focus:outline-none focus:ring-2 focus:ring-primary-red resize-y bg-parchment text-ink"
        placeholder="Write or paste your submission here..."
        required
        disabled={isPending}
      ></textarea>
      
      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? 'Analyzing & Submitting...' : 'Submit Assignment'}
      </Button>
    </form>
  )
}
