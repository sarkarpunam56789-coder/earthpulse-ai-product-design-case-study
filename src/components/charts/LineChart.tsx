import { niceTicks } from '../../lib/format';

const tick = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

export function LineChart({ values, labels, unit, ticks, height = 176, ariaLabel, partialLast }: {
  values: number[]; labels: string[]; unit: string; ticks?: number[]; height?: number; ariaLabel: string; partialLast?: boolean;
}) {
  const t = ticks ?? niceTicks(Math.max(...values, 0));
  const top = t[0] || 1;
  const n = values.length;
  const xs = values.map((_, i) => ((i + 0.5) / n) * 100);
  const ys = values.map((v) => 100 - Math.min(100, (v / top) * 100));
  const line = 'M ' + xs.map((x, i) => `${x} ${ys[i]}`).join(' L ');
  const area = `${line} L ${xs[n - 1]} 100 L ${xs[0]} 100 Z`;
  return (
    <div role="img" aria-label={ariaLabel}>
      <div className="flex gap-3">
        <div className="relative w-9 shrink-0 text-right text-caption text-ink-placeholder" style={{ height }} aria-hidden>
          {t.map((v, i) => <span key={i} className="absolute right-0 -translate-y-1/2" style={{ top: `${(i / 3) * 100}%` }}>{tick(v)}</span>)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="relative" style={{ height }}>
            {t.map((_, i) => <div key={i} className="absolute inset-x-0 h-px bg-line-subtle" style={{ top: `${(i / 3) * 100}%` }} aria-hidden />)}
            <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              <path d={area} className="fill-viz-water/15" />
              <path d={line} fill="none" className="stroke-viz-water" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </svg>
            {values.map((v, i) => {
              const last = i === n - 1;
              const size = last ? 'h-3 w-3' : 'h-2 w-2';
              return (
                <button key={i} type="button" className={`group absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-viz-water bg-surface ${size}`} style={{ left: `${xs[i]}%`, top: `${ys[i]}%` }} aria-label={`${labels[i]}: ${v} ${unit}${last && partialLast ? ' (month to date)' : ''}`}>
                  <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-sm bg-inverse px-2 py-1 text-label-s text-ink-inverse group-hover:block group-focus:block">
                    {labels[i]} · {v} {unit}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex" aria-hidden>
            {labels.map((l) => <span key={l} className="flex-1 text-center text-caption text-ink-placeholder">{l}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
