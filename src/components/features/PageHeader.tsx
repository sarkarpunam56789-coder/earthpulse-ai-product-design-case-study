import { ReactNode } from 'react';

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-h2 sm:text-h1">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-body-m text-ink-secondary">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}

export function SectionTitle({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-h3">{title}</h2>
      {right}
    </div>
  );
}

export function Footnote({ children }: { children?: ReactNode }) {
  return (
    <p className="mt-8 text-center text-caption text-ink-secondary">
      {children ?? 'Values marked as sample data are placeholders for demonstration. Impact figures are estimates built from illustrative factors, not verified measurements.'}
    </p>
  );
}
