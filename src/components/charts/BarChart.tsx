import { cn } from '../../lib/cn';
import { niceTicks } from '../../lib/format';

export interface BarDatum { label: string; value: number | null; highlight?: boolean; tooltip?: string }

const tick = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

export function BarChart({ data, unit, ticks, height = 176, barClass = 'bg-viz-transport', ariaLabel }: {
  data: BarDatum[]; unit: string; ticks?: number[]; height?: number; barClass?: string; ariaLabel: string;
}) {
  const max = Math.max(...data.map((d) => d.value ?? 0), 0);
  const t = ticks ?? niceTicks(max);
  const top = t[0] || 1;
  return (
    <div role="img" aria-label={ariaLabel}>
      <div className="flex gap-3">
        <div className="relative w-9 shrink-0 text-right text-caption text-ink-placeholder" style={{ height }} aria-hidden>
          {t.map((v, i) => <span key={i} className="absolute right-0 -translate-y-1/2" style={{ top: `${(i / 3) * 100}%` }}>{tick(v)}</span>)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="relative" style={{ height }}>
            {t.map((_, i) => <div key={i} className="absolute inset-x-0 h-px bg-line-subtle" style={{ top: `${(i / 3) * 100}%` }} aria-hidden />)}
            <div className="absolute inset-0 flex items-end justify-between gap-1.5 px-1 sm:gap-2 sm:px-3">
              {data.map((d, di) => {
                const h = d.value == null ? 0 : Math.min(100, (d.value / top) * 100);
                const tip = d.tooltip ?? `${d.label} · ${d.value ?? 0} ${unit}`;
                return (
                  <div key={di} className="group relative flex h-full flex-1 items-end justify-center" tabIndex={d.value == null ? -1 : 0} aria-label={d.value == null ? `${d.label}: no data yet` : tip}>
                    {d.value == null
                      ? <div className="h-1 w-full max-w-8 rounded-full bg-muted" />
                      : <div className={cn('min-h-[2px] w-full max-w-8 rounded-t-xs', d.highlight ? 'bg-accent' : barClass)} style={{ height: `${h}%` }} />}
                    {d.value != null && (
                      <span className="pointer-events-none absolute left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-sm bg-inverse px-2 py-1 text-label-s text-ink-inverse group-hover:block group-focus:block" style={{ bottom: `calc(${h}% + 6px)` }}>
                        {tip}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-2 flex justify-between gap-1.5 px-1 sm:gap-2 sm:px-3" aria-hidden>
            {data.map((d, di) => <span key={di} className="flex-1 text-center text-caption text-ink-placeholder">{d.label}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
