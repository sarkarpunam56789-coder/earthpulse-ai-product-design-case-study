import { useMemo, useState } from 'react';
import { History } from 'lucide-react';
import { Activity, Category } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { Chip } from '../ui/Fields';
import { EmptyState } from '../ui/EmptyState';
import { ActivityRow } from './ActivityRow';

export function ActivityList({ activities, now, filters, limit = 6, onDelete, emptyAction, onSearch }: {
  activities: Activity[]; now: Date; filters: { value: 'all' | Category | 'energy'; label: string }[]; limit?: number;
  onDelete?: (id: string) => void; emptyAction?: React.ReactNode; onSearch?: string;
}) {
  const [filter, setFilter] = useState<string>('all');
  const rows = useMemo(() => {
    const list = [...activities].sort((a, b) => b.at.localeCompare(a.at));
    const f = filter === 'all' ? list : list.filter((a) => (filter === 'energy' ? a.category === 'electricity' : a.category === filter));
    const q = (onSearch ?? '').trim().toLowerCase();
    const s = q ? f.filter((a) => `${a.title} ${a.details}`.toLowerCase().includes(q)) : f;
    return s.slice(0, limit);
  }, [activities, filter, limit, onSearch]);
  return (
    <div>
      {filters.length > 1 && (
        <div className="mb-2 flex flex-wrap gap-2" role="group" aria-label="Filter activity by category">
          {filters.map((f) => <Chip key={f.value} selected={filter === f.value} onClick={() => setFilter(f.value)}>{f.label}</Chip>)}
        </div>
      )}
      {rows.length === 0 ? (
        <EmptyState icon={History} title="Nothing logged yet" text="Activities you log will appear here, newest first." action={emptyAction} />
      ) : (
        <ul>{rows.map((a) => <ActivityRow key={a.id} activity={a} now={now} onDelete={onDelete} />)}</ul>
      )}
    </div>
  );
}

export const categoryFilter = (c: Category) => ({ value: c, label: CATEGORIES[c].label });
