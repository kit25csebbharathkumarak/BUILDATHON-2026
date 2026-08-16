import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils'; // Assuming tailwind-merge util exists

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marigold focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-[2px]',
          {
            'bg-ink text-paper hover:bg-ink/90': variant === 'primary',
            'bg-parchment text-ink border border-ledger-line hover:bg-ledger-line/30': variant === 'secondary',
            'border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper': variant === 'outline',
            'bg-transparent text-ink hover:bg-ledger-line/30': variant === 'ghost',
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
