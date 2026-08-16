import { EmptyState } from '@/components/ui/EmptyState'
import { Sparkles } from 'lucide-react'

export default function AdminInsightsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">AI Insights & Monitoring</h1>
        <p className="text-ink/60 mt-2">Monitor EduPortal AI Engine activity and automated interventions.</p>
      </div>

      <div className="p-12">
        <EmptyState 
          title="Module Under Construction" 
          description="Global monitoring of AI-generated insights, at-risk flags, and system health is coming soon."
          icon={<Sparkles className="w-8 h-8" />}
          actionLabel="Return to Dashboard"
        />
      </div>
    </div>
  )
}
