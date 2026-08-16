import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'neutral';
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-[2px] px-2 py-0.5 text-xs font-mono font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-marigold focus:ring-offset-2',
          {
            'border-transparent bg-ink text-paper': variant === 'default',
            'border-transparent bg-sage text-paper': variant === 'success',
            'border-transparent bg-rust text-paper': variant === 'warning',
            'border-ledger-line bg-parchment text-ink': variant === 'neutral',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
