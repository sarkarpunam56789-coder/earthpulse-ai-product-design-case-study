import { cn } from '../../lib/cn';

const tones = { brand: 'bg-brand', water: 'bg-viz-water', waste: 'bg-viz-electricity', danger: 'bg-danger', accent: 'bg-accent' };

export function Progress({ value, tone = 'brand', label, className }: { value: number; tone?: keyof typeof tones; label: string; className?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v)} className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}>
      <div className={cn('h-full rounded-full transition-[width] duration-300', tones[tone])} style={{ width: `${v}%` }} />
    </div>
  );
}
