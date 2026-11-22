import { Cloud, Droplets, Trash2 } from 'lucide-react';
import { SampleBadge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { BarChart } from '../charts/BarChart';

/** Static dashboard preview for the landing page. Every value is sample data. */
export function HeroPreview() {
  const data = [
    { label: 'Mon', value: 6.4 }, { label: 'Tue', value: 7.2 }, { label: 'Wed', value: 6.9 },
    { label: 'Thu', value: 5.4, highlight: true }, { label: 'Fri', value: null }, { label: 'Sat', value: null }, { label: 'Sun', value: null },
  ];
  return (
    <div className="rounded-xl border border-line bg-surface p-5 shadow-elev-2 sm:p-6" role="img" aria-label="Preview of the EarthPulse AI dashboard with sample data: weekly carbon footprint bars and carbon, water and waste summaries.">
      <div className="mb-4 flex items-center justify-between">
        <div><div className="text-label-s text-ink-secondary">This week</div><div className="text-metric-l">25.9 <span className="text-body-s font-normal text-ink-secondary">kg CO₂e</span></div></div>
        <SampleBadge />
      </div>
      <BarChart data={data} unit="kg CO₂e" ticks={[9, 6, 3, 0]} height={140} ariaLabel="Sample weekly carbon bars" />
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[{ i: Cloud, l: 'Carbon', v: '52%', t: 'brand' as const }, { i: Droplets, l: 'Water', v: '58%', t: 'water' as const }, { i: Trash2, l: 'Waste', v: '42%', t: 'waste' as const }].map((s) => (
          <div key={s.l} className="rounded-md bg-subtle p-3">
            <div className="mb-2 flex items-center gap-1.5 text-label-s text-ink-secondary"><s.i className="h-3.5 w-3.5" aria-hidden />{s.l}</div>
            <div className="mb-2 text-label-l">{s.v}</div>
            <Progress value={parseInt(s.v)} tone={s.t} label={`${s.l} of weekly goal`} className="h-1.5" />
          </div>
        ))}
      </div>
      <p className="mt-3 text-caption text-ink-secondary">Share of each weekly goal used so far.</p>
    </div>
  );
}
