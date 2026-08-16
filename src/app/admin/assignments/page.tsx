import { EmptyState } from '@/components/ui/EmptyState'
import { BookOpen } from 'lucide-react'

export default function AdminAssignmentsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Manage Assignments</h1>
        <p className="text-ink/60 mt-2">Monitor all assignments across the platform.</p>
      </div>

      <div className="p-12">
        <EmptyState 
          title="Module Under Construction" 
          description="Global assignment management is currently being built. This will allow administrators to oversee assignment distributions and grading metrics across all courses."
          icon={<BookOpen className="w-8 h-8" />}
          actionLabel="Return to Dashboard"
        />
      </div>
    </div>
  )
}
