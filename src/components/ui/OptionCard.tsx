import { Check, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

export function OptionCard({ icon: Icon, title, description, selected, disabled, onClick, role = 'radio' }: {
  icon: LucideIcon; title: string; description: string; selected?: boolean; disabled?: boolean; onClick?: () => void; role?: 'radio' | 'checkbox';
}) {
  return (
    <button type="button" role={role} aria-checked={!!selected} disabled={disabled} onClick={onClick}
      className={cn('flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors disabled:cursor-not-allowed',
        selected ? 'border-[1.5px] border-brand bg-brand-subtle' : 'border-line bg-surface hover:border-line-strong hover:shadow-elev-1',
        disabled && 'border-line-subtle bg-muted hover:border-line-subtle hover:shadow-none')}>
      <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-md', selected ? 'bg-surface' : 'bg-subtle')}>
        <Icon className={cn('h-5 w-5', disabled ? 'text-ink-disabled' : 'text-brand')} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn('block text-label-l', disabled && 'text-ink-disabled')}>{title}</span>
        <span className={cn('block text-body-s', disabled ? 'text-ink-disabled' : 'text-ink-secondary')}>{description}</span>
      </span>
      <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-full border-[1.5px]', selected ? 'border-brand bg-brand' : 'border-line-strong bg-surface')}>
        {selected && <Check className="h-3 w-3 text-white" strokeWidth={3} aria-hidden />}
      </span>
    </button>
  );
}
