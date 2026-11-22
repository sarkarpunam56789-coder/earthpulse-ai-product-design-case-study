import { Trash2 } from 'lucide-react';
import { Activity } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { fmtWhen } from '../../lib/dates';
import { fmt1 } from '../../lib/format';

export function activityValue(a: Activity) {
  if (a.category === 'water') return `${Math.round(a.waterL)} L`;
  if (a.category === 'waste') return `${fmt1(a.wasteKg)} kg`;
  return `${fmt1(a.carbonKg)} kg CO₂e`;
}

export function ActivityRow({ activity, now, onDelete }: { activity: Activity; now: Date; onDelete?: (id: string) => void }) {
  const cat = CATEGORIES[activity.category];
  const Icon = cat.icon;
  return (
    <li className="flex items-center gap-4 border-b border-line-subtle py-4 last:border-b-0">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md" style={{ backgroundColor: `${cat.color}24` }}>
        <Icon className="h-5 w-5" style={{ color: cat.color }} aria-hidden />
        <span className="sr-only">{cat.label}</span>
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-label-m">{activity.title}</div>
        <div className="truncate text-body-s text-ink-secondary">{activity.details}</div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-label-m">{activityValue(activity)}</div>
        <div className="text-caption text-ink-secondary">{fmtWhen(activity.at, now)}</div>
      </div>
      {onDelete && !activity.sample && (
        <button type="button" aria-label={`Remove ${activity.title}`} title="Remove" onClick={() => onDelete(activity.id)} className="rounded-sm p-1.5 text-ink-secondary hover:bg-subtle hover:text-danger">
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      )}
    </li>
  );
}
