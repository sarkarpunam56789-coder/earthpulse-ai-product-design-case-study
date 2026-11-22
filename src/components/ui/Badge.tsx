import { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'brand';
const styles: Record<BadgeVariant, string> = {
  success: 'bg-success-bg text-success-fg border-success-border',
  warning: 'bg-warning-bg text-warning-fg border-warning-border',
  error: 'bg-danger-bg text-danger-fg border-danger-border',
  info: 'bg-info-bg text-info-fg border-info-border',
  neutral: 'bg-subtle text-ink-secondary border-line',
  brand: 'bg-brand-subtle text-brand-700 border-brand-200',
};

export function Badge({ variant = 'neutral', children, dot, className }: { variant?: BadgeVariant; children: ReactNode; dot?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-full border px-2 text-label-s', styles[variant], className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

export const SampleBadge = ({ label = 'Sample data' }: { label?: string }) => <Badge variant="neutral">{label}</Badge>;
