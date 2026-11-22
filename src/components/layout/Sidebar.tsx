import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { useApp } from '../../hooks/useApp';
import { Avatar } from '../ui/Avatar';
import { Logo } from './Logo';
import { NAV_GROUPS, NavEntry, SETTINGS_NAV } from './nav';

function Item({ item, onNavigate }: { item: NavEntry; onNavigate?: () => void }) {
  const Icon = item.icon;
  return (
    <NavLink to={item.to} end={item.end} onClick={onNavigate}
      className={({ isActive }) => cn('flex h-11 items-center gap-3 rounded-md px-3 text-label-m transition-colors',
        isActive ? 'bg-brand-subtle text-brand-700' : 'text-ink hover:bg-subtle')}>
      {({ isActive }) => (<><Icon className={cn('h-5 w-5', isActive ? 'text-brand' : 'text-ink-secondary')} aria-hidden />{item.label}</>)}
    </NavLink>
  );
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { state } = useApp();
  return (
    <nav aria-label="Main" className="flex h-full w-full flex-col bg-surface px-2 py-6">
      <div className="px-3"><Logo to="/app" /></div>
      <div className="flex-1 overflow-y-auto">
        {NAV_GROUPS.map((g) => (
          <div key={g.label}>
            <div className="px-3 pb-1 pt-6 text-overline uppercase text-ink-secondary">{g.label}</div>
            <div className="flex flex-col gap-0.5">{g.items.map((i) => <Item key={i.to} item={i} onNavigate={onNavigate} />)}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-0.5">
        <Item item={SETTINGS_NAV} onNavigate={onNavigate} />
        <div className="flex items-center gap-3 px-3 pt-4">
          <Avatar name={state.profile.name} size="sm" />
          <div className="min-w-0">
            <div className="truncate text-label-m">{state.profile.name}</div>
            <div className="truncate text-caption text-ink-secondary">{state.profile.city}, {state.profile.state}</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
