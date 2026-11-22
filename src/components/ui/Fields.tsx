import { forwardRef, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, useId } from 'react';
import { Check, ChevronDown, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string; helper?: string; error?: string; leftIcon?: LucideIcon; rightSlot?: ReactNode; hideLabel?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, helper, error, leftIcon: Icon, rightSlot, className, id, hideLabel, ...rest }, ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  const hid = `${fid}-hint`;
  return (
    <div className={className}>
      <label htmlFor={fid} className={cn('mb-1 block text-label-m text-ink', hideLabel && 'sr-only')}>{label}</label>
      <div className={cn(
        'flex h-11 items-center gap-2 rounded-md border bg-surface px-3 transition-colors',
        error ? 'border-danger focus-within:shadow-focus-danger' : 'border-line hover:border-line-strong focus-within:border-brand-500 focus-within:shadow-focus',
        rest.disabled && 'border-line-subtle bg-muted hover:border-line-subtle',
      )}>
        {Icon && <Icon className="h-5 w-5 shrink-0 text-ink-placeholder" aria-hidden />}
        <input ref={ref} id={fid} aria-invalid={!!error} aria-describedby={error || helper ? hid : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-body-m placeholder:text-ink-placeholder focus-visible:shadow-none disabled:text-ink-disabled" {...rest} />
        {rightSlot}
      </div>
      {(error || helper) && <p id={hid} className={cn('mt-1 text-caption', error ? 'text-danger-fg' : 'text-ink-secondary')}>{error ?? helper}</p>}
    </div>
  );
});

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string; options: { value: string; label: string }[]; placeholder?: string; helper?: string; error?: string;
  onChange?: (value: string) => void; hideLabel?: boolean;
}

export function SelectField({ label, options, placeholder, helper, error, className, id, onChange, hideLabel, value, ...rest }: SelectFieldProps) {
  const auto = useId();
  const fid = id ?? auto;
  const hid = `${fid}-hint`;
  return (
    <div className={className}>
      <label htmlFor={fid} className={cn('mb-1 block text-label-m text-ink', hideLabel && 'sr-only')}>{label}</label>
      <div className={cn(
        'relative flex h-11 items-center rounded-md border bg-surface transition-colors',
        error ? 'border-danger focus-within:shadow-focus-danger' : 'border-line hover:border-line-strong focus-within:border-brand-500 focus-within:shadow-focus',
        rest.disabled && 'border-line-subtle bg-muted',
      )}>
        <select id={fid} value={value} aria-invalid={!!error} aria-describedby={error || helper ? hid : undefined}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn('h-full w-full appearance-none bg-transparent pl-3 pr-9 text-body-m focus-visible:shadow-none disabled:text-ink-disabled', !value && 'text-ink-placeholder')} {...rest}>
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o) => <option key={o.value} value={o.value} className="text-ink">{o.label}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 h-5 w-5 text-ink-secondary" aria-hidden />
      </div>
      {(error || helper) && <p id={hid} className={cn('mt-1 text-caption', error ? 'text-danger-fg' : 'text-ink-secondary')}>{error ?? helper}</p>}
    </div>
  );
}

export function Checkbox({ label, checked, onChange, disabled, className }: { label: ReactNode; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; className?: string }) {
  return (
    <label className={cn('flex cursor-pointer items-start gap-2 text-body-m', disabled && 'cursor-not-allowed text-ink-disabled', className)}>
      <input type="checkbox" className="peer sr-only" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-xs border-[1.5px] border-line-strong bg-surface peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:shadow-focus peer-disabled:bg-muted peer-checked:[&_svg]:opacity-100">
        <Check className="h-3.5 w-3.5 text-white opacity-0" strokeWidth={3} aria-hidden />
      </span>
      <span>{label}</span>
    </label>
  );
}

export function RadioGroup({ legend, name, value, onChange, options, inline, className }: {
  legend: string; name: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; inline?: boolean; className?: string;
}) {
  return (
    <fieldset className={className}>
      <legend className="mb-2 text-label-m">{legend}</legend>
      <div className={cn('flex gap-3', inline ? 'flex-wrap gap-x-6' : 'flex-col')}>
        {options.map((o) => (
          <label key={o.value} className="flex cursor-pointer items-center gap-2 text-body-m">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="peer sr-only" />
            <span className="grid h-5 w-5 place-items-center rounded-full border-[1.5px] border-line-strong bg-surface peer-checked:border-brand peer-focus-visible:shadow-focus peer-checked:[&>span]:scale-100">
              <span className="h-2.5 w-2.5 scale-0 rounded-full bg-brand transition-transform" />
            </span>
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Toggle({ checked, onChange, label, description, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <div className="text-label-m">{label}</div>
        {description && <div className="text-body-s text-ink-secondary">{description}</div>}
      </div>
      <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} onClick={() => onChange(!checked)}
        className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed', checked ? 'bg-brand' : 'bg-line-strong', disabled && 'opacity-50')}>
        <span className={cn('absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-surface shadow-elev-1 transition-transform', checked && 'translate-x-5')} />
      </button>
    </div>
  );
}

export function Chip({ selected, onClick, children, disabled, className }: { selected?: boolean; onClick?: () => void; children: ReactNode; disabled?: boolean; className?: string }) {
  return (
    <button type="button" aria-pressed={!!selected} disabled={disabled} onClick={onClick}
      className={cn('inline-flex h-9 items-center gap-1 whitespace-nowrap rounded-full border px-4 text-label-m transition-colors disabled:cursor-not-allowed',
        selected ? 'border-brand bg-brand-subtle text-brand-700' : 'border-line bg-surface text-ink hover:border-line-strong hover:bg-subtle',
        disabled && 'border-line-subtle bg-muted text-ink-disabled hover:bg-muted', className)}>
      {selected && <Check className="h-4 w-4" aria-hidden />}
      {children}
    </button>
  );
}
