import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface MarginaliaNoteProps extends HTMLAttributes<HTMLDivElement> {
  tone?: 'insight' | 'success' | 'warning';
}

export const MarginaliaNote = forwardRef<HTMLDivElement, MarginaliaNoteProps>(
  ({ className, tone = 'insight', children, ...props }, ref) => {
    const baseStyles = 'p-4 rounded-lg border shadow-sm text-sm flex gap-3 transition-all'
    
    const tones = {
      insight: 'bg-white border-primary-red/20 text-ink',
      success: 'bg-green-50 border-green-200 text-green-900',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    }

    const icons = {
      insight: <Sparkles className="w-5 h-5 text-primary-red shrink-0" />,
      success: <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />,
      warning: <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
    }

    return (
      <div
        ref={ref}
        className={cn(baseStyles, tones[tone], className)}
        {...props}
      >
        {icons[tone]}
        <div className="leading-relaxed">{children}</div>
      </div>
    );
  }
);

MarginaliaNote.displayName = 'MarginaliaNote';
