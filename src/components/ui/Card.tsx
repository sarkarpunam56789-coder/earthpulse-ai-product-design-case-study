import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-lg border border-line bg-surface p-5 sm:p-6', className)} {...rest} />;
}

export function CardHeader({ title, subtitle, right, level = 'h4' }: { title: ReactNode; subtitle?: ReactNode; right?: ReactNode; level?: 'h3' | 'h4' }) {
  const H = level;
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <H className={level === 'h3' ? 'text-h3' : 'text-h4'}>{title}</H>
        {subtitle && <p className="mt-0.5 text-body-s text-ink-secondary">{subtitle}</p>}
      </div>
      {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
    </div>
  );
}
