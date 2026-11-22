import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { Loader2, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-hover active:bg-brand-pressed disabled:bg-muted disabled:text-ink-disabled',
  secondary: 'border border-line bg-surface text-ink hover:border-line-strong hover:bg-subtle active:bg-muted disabled:border-line-subtle disabled:bg-muted disabled:text-ink-disabled',
  ghost: 'text-brand-700 hover:bg-brand-subtle active:bg-muted disabled:text-ink-disabled',
  danger: 'bg-danger text-white hover:bg-danger-hover disabled:bg-muted disabled:text-ink-disabled',
};
const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-label-m',
  md: 'h-10 px-4 text-label-m',
  lg: 'h-12 px-5 text-label-l',
};
const iconSize: Record<Size, string> = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-5 w-5' };

export const buttonClasses = (variant: Variant = 'primary', size: Size = 'md', full = false) =>
  cn('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors disabled:cursor-not-allowed', variants[variant], sizes[size], full && 'w-full');

interface Common { variant?: Variant; size?: Size; full?: boolean; iconLeft?: LucideIcon; iconRight?: LucideIcon; children?: ReactNode }

export function Button({ variant = 'primary', size = 'md', full, iconLeft: L, iconRight: R, loading, children, className, disabled, ...rest }:
  Common & { loading?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(buttonClasses(variant, size, full), className)} disabled={disabled || loading} {...rest}>
      {loading ? <Loader2 className={cn(iconSize[size], 'animate-spin')} aria-hidden /> : L && <L className={iconSize[size]} aria-hidden />}
      {children}
      {R && !loading && <R className={iconSize[size]} aria-hidden />}
    </button>
  );
}

export function ButtonLink({ variant = 'primary', size = 'md', full, iconLeft: L, iconRight: R, children, className, ...rest }: Common & LinkProps) {
  return (
    <Link className={cn(buttonClasses(variant, size, full), className)} {...rest}>
      {L && <L className={iconSize[size]} aria-hidden />}
      {children}
      {R && <R className={iconSize[size]} aria-hidden />}
    </Link>
  );
}

export function IconButton({ icon: Icon, label, className, ...rest }: { icon: LucideIcon; label: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button aria-label={label} title={label} className={cn('inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface text-ink hover:bg-subtle', className)} {...rest}>
      <Icon className="h-5 w-5" aria-hidden />
    </button>
  );
}
