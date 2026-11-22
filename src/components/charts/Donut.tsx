export interface DonutDatum { label: string; value: number; color: string }

export function Donut({ data, size = 160, centerValue, centerLabel, ariaLabel }: {
  data: DonutDatum[]; size?: number; centerValue: string; centerLabel: string; ariaLabel: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const stroke = 22;
  const r = size / 2 - stroke / 2;
  const C = 2 * Math.PI * r;
  const c = size / 2;
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={ariaLabel} className="shrink-0">
      <circle cx={c} cy={c} r={r} fill="none" stroke="#E7ECE5" strokeWidth={stroke} />
      {total > 0 && data.map((d) => {
        const len = (d.value / total) * C;
        const gap = data.length > 1 ? 3 : 0;
        const el = (
          <circle key={d.label} cx={c} cy={c} r={r} fill="none" stroke={d.color} strokeWidth={stroke}
            strokeDasharray={`${Math.max(len - gap, 0)} ${C}`} strokeDashoffset={-acc} transform={`rotate(-90 ${c} ${c})`} />
        );
        acc += len;
        return el;
      })}
      <text x={c} y={c - 2} textAnchor="middle" className="fill-ink" style={{ fontSize: 24, fontWeight: 600 }}>{centerValue}</text>
      <text x={c} y={c + 16} textAnchor="middle" className="fill-ink-secondary" style={{ fontSize: 12 }}>{centerLabel}</text>
    </svg>
  );
}

export function DonutLegend({ data, suffix = '%' }: { data: { label: string; value: number; color: string }[]; suffix?: string }) {
  return (
    <ul className="flex min-w-[180px] flex-1 flex-col gap-3">
      {data.map((d) => (
        <li key={d.label} className="flex items-center gap-2 text-body-s">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} aria-hidden />
          <span className="flex-1 text-ink">{d.label}</span>
          <span className="text-label-m">{Math.round(d.value)}{suffix}</span>
        </li>
      ))}
    </ul>
  );
}
