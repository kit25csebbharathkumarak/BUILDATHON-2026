import { EmptyState } from '@/components/ui/EmptyState'
import { BarChart } from 'lucide-react'

export default function AdminReportsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">View Reports & Analytics</h1>
        <p className="text-ink/60 mt-2">Platform-wide performance and engagement analytics.</p>
      </div>

      <div className="p-12">
        <EmptyState 
          title="Module Under Construction" 
          description="Comprehensive data visualization and reporting dashboards will be available here soon."
          icon={<BarChart className="w-8 h-8" />}
          actionLabel="Return to Dashboard"
        />
      </div>
    </div>
  )
}
