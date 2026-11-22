import { cn } from '../../lib/cn';

const sizes = { sm: 'h-8 w-8 text-label-s', md: 'h-10 w-10 text-label-m', lg: 'h-14 w-14 text-h4' };

export function Avatar({ name, size = 'md', className }: { name: string; size?: keyof typeof sizes; className?: string }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?';
  return (
    <span aria-hidden className={cn('inline-flex shrink-0 items-center justify-center rounded-full border border-success-border bg-brand-subtle text-brand-700', sizes[size], className)}>
      {initials}
    </span>
  );
}
