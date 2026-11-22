import { cn } from '../../lib/cn';

export function Tabs<T extends string>({ value, onChange, tabs, label, className }: {
  value: T; onChange: (v: T) => void; tabs: { value: T; label: string }[]; label: string; className?: string;
}) {
  return (
    <div role="tablist" aria-label={label} className={cn('flex gap-1 overflow-x-auto border-b border-line scrollbar-none', className)}>
      {tabs.map((t) => (
        <button key={t.value} role="tab" id={`tab-${t.value}`} aria-selected={value === t.value} aria-controls={`panel-${t.value}`} onClick={() => onChange(t.value)}
          className={cn('-mb-px h-11 shrink-0 border-b-2 px-4 text-label-m transition-colors',
            value === t.value ? 'border-brand text-brand-700' : 'border-transparent text-ink-secondary hover:text-ink')}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
