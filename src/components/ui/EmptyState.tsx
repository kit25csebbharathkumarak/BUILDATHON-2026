import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, title, description, actionLabel, onAction, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center p-12 text-center border border-dashed border-ledger-line bg-parchment/50 rounded-lg',
          className
        )}
        {...props}
      >
        {icon && <div className="mb-4 text-ink/40">{icon}</div>}
        <h3 className="text-lg font-semibold text-ink mb-1">{title}</h3>
        <p className="text-sm text-ink/70 max-w-sm mb-6">{description}</p>
        
        {actionLabel && onAction && (
          <Button variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';
