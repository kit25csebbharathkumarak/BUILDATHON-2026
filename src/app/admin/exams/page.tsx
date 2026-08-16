import { EmptyState } from '@/components/ui/EmptyState'
import { FileSpreadsheet } from 'lucide-react'

export default function AdminExamsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Manage Exams & Grades</h1>
        <p className="text-ink/60 mt-2">Oversee exams, standardized testing, and final grades.</p>
      </div>

      <div className="p-12">
        <EmptyState 
          title="Module Under Construction" 
          description="Exam management and grade auditing tools are currently in development."
          icon={<FileSpreadsheet className="w-8 h-8" />}
          actionLabel="Return to Dashboard"
        />
      </div>
    </div>
  )
}
