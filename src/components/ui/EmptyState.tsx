import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export function EmptyState({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-line px-6 py-10 text-center">
      <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-brand-subtle"><Icon className="h-6 w-6 text-brand" aria-hidden /></span>
      <h3 className="text-h4">{title}</h3>
      <p className="mt-1 max-w-sm text-body-s text-ink-secondary">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
