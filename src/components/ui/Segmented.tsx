import { cn } from '../../lib/cn';

export function Segmented<T extends string>({ value, onChange, options, label, className }: {
  value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label: string; className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cn('inline-flex rounded-md bg-muted p-0.5', className)}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}
          className={cn('h-8 rounded-sm px-4 text-label-m transition-colors', value === o.value ? 'bg-surface text-ink shadow-elev-1' : 'text-ink-secondary hover:text-ink')}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
