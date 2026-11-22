import { LucideIcon, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { cn } from '../../lib/cn';

export interface Trend { text: string; kind: 'better' | 'worse' | 'neutral'; dir: 'down' | 'up' | 'flat' }

export function MetricCard({ icon: Icon, label, value, unit, trend, caption, progress }: {
  icon: LucideIcon; label: string; value: string; unit: string; trend: Trend; caption: string;
  progress?: { pct: number; tone: 'brand' | 'water' | 'waste'; caption: string };
}) {
  const TIcon = trend.dir === 'down' ? TrendingDown : trend.dir === 'up' ? TrendingUp : Minus;
  const color = trend.kind === 'better' ? 'text-success-fg' : trend.kind === 'worse' ? 'text-danger-fg' : 'text-ink-secondary';
  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-brand-subtle"><Icon className="h-[18px] w-[18px] text-brand" aria-hidden /></span>
        <span className="text-label-m text-ink-secondary">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-metric-l">{value}</span>
        <span className="text-body-s text-ink-secondary">{unit}</span>
      </div>
      <div className="flex items-center gap-2">
        <TIcon className={cn('h-4 w-4', color)} aria-hidden />
        <span className={cn('text-label-s', color)}>{trend.text}</span>
        <span className="text-caption text-ink-secondary">{caption}</span>
      </div>
      {progress && (
        <div>
          <Progress value={progress.pct} tone={progress.tone} label={`${label} progress`} />
          <p className="mt-2 text-caption text-ink-secondary">{progress.caption}</p>
        </div>
      )}
    </Card>
  );
}
