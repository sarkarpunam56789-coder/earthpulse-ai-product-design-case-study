import { Check } from 'lucide-react';
import { Suggestion } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { Button } from '../ui/Button';

export function ActionItem({ suggestion, added, onAdd }: { suggestion: Suggestion; added: boolean; onAdd: () => void }) {
  const cat = CATEGORIES[suggestion.category];
  const Icon = cat.icon;
  return (
    <li className="flex items-center gap-4 border-b border-line-subtle py-4 last:border-b-0">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md" style={{ backgroundColor: `${cat.color}24` }}>
        <Icon className="h-5 w-5" style={{ color: cat.color }} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-label-m">{suggestion.title}</div>
        <div className="text-body-s text-ink-secondary">{suggestion.description}</div>
        <div className="text-label-s text-success-fg">{suggestion.impact}</div>
      </div>
      {added
        ? <Button variant="ghost" size="sm" iconLeft={Check} disabled>Added</Button>
        : <Button variant="secondary" size="sm" onClick={onAdd}>Add</Button>}
    </li>
  );
}
