import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface MarginaliaNoteProps extends HTMLAttributes<HTMLDivElement> {
  tone?: 'insight' | 'success' | 'warning';
}

export const MarginaliaNote = forwardRef<HTMLDivElement, MarginaliaNoteProps>(
  ({ className, tone = 'insight', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-start gap-2 p-3 text-sm -rotate-1 shadow-sm border border-marigold/30 bg-paper transition-all hover:rotate-0 z-10 font-sans',
          {
            'text-marigold': tone === 'insight',
            'text-sage border-sage/30': tone === 'success',
            'text-rust border-rust/30': tone === 'warning',
          },
          className
        )}
        {...props}
      >
        <div className={cn('text-lg leading-none font-serif', {
          'text-marigold': tone === 'insight',
          'text-sage': tone === 'success',
          'text-rust': tone === 'warning',
        })}>
          *
        </div>
        <div className="pt-0.5">
          {children}
        </div>
      </div>
    );
  }
);
MarginaliaNote.displayName = 'MarginaliaNote';
