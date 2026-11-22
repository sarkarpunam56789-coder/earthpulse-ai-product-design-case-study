export function ProgressRing({ value, size = 96, label, strokeClass = 'stroke-brand', ariaLabel }: {
  value: number; size?: number; label: string; strokeClass?: string; ariaLabel: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  const stroke = Math.max(8, Math.round(size / 10));
  const r = size / 2 - stroke / 2;
  const C = 2 * Math.PI * r;
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={ariaLabel} className="shrink-0">
      <circle cx={c} cy={c} r={r} fill="none" className="stroke-muted" strokeWidth={stroke} />
      <circle cx={c} cy={c} r={r} fill="none" className={strokeClass} strokeWidth={stroke} strokeDasharray={`${(v / 100) * C} ${C}`} transform={`rotate(-90 ${c} ${c})`} strokeLinecap="butt" />
      <text x={c} y={c} textAnchor="middle" dominantBaseline="central" className="fill-ink" style={{ fontSize: size >= 90 ? 22 : 16, fontWeight: 600 }}>{label}</text>
    </svg>
  );
}
