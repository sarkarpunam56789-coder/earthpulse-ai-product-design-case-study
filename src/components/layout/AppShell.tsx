import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { CalendarCheck, Cloud, LayoutDashboard, Menu, Sparkles, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useApp } from '../../hooks/useApp';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { Avatar } from '../ui/Avatar';
import { IconButton } from '../ui/Button';
import { Logo } from './Logo';
import { Sidebar } from './Sidebar';

const TABS = [
  { to: '/app', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/app/carbon', label: 'Track', icon: Cloud },
  { to: '/app/copilot', label: 'Copilot', icon: Sparkles },
  { to: '/app/planner', label: 'Plan', icon: CalendarCheck },
];

export function AppShell() {
  const [drawer, setDrawer] = useState(false);
  const { state } = useApp();
  const loc = useLocation();
  useScrollToTop();
  useEffect(() => setDrawer(false), [loc.pathname]);
  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawer(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawer]);

  return (
    <div className="min-h-screen bg-page">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-surface focus:px-4 focus:py-2">Skip to content</a>
      {/* Desktop sidebar */}
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-line-subtle lg:block"><Sidebar /></aside>

      {/* Tablet + mobile top bar */}
      <header className="no-print sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line-subtle bg-surface px-4 lg:hidden">
        <Logo to="/app" />
        <div className="flex items-center gap-3">
          <Avatar name={state.profile.name} size="sm" />
          <IconButton icon={Menu} label="Open menu" onClick={() => setDrawer(true)} className="hidden md:inline-flex" />
        </div>
      </header>

      {/* Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="absolute inset-0 bg-inverse/55" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] bg-surface shadow-elev-3">
            <div className="absolute right-2 top-3"><IconButton icon={X} label="Close menu" onClick={() => setDrawer(false)} className="border-transparent" /></div>
            <Sidebar onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}

      <main id="main" className="lg:pl-[248px]">
        <div className="mx-auto w-full max-w-content px-4 pb-28 pt-6 sm:px-6 md:pb-10 lg:px-10 lg:pb-12 lg:pt-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      <nav aria-label="Primary" className="no-print fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch border-t border-line-subtle bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => cn('flex flex-1 flex-col items-center justify-center gap-0.5 text-label-s', isActive ? 'text-brand-700' : 'text-ink-secondary')}>
            <t.icon className="h-5 w-5" aria-hidden />{t.label}
          </NavLink>
        ))}
        <button type="button" onClick={() => setDrawer(true)} className="flex flex-1 flex-col items-center justify-center gap-0.5 text-label-s text-ink-secondary">
          <Menu className="h-5 w-5" aria-hidden />More
        </button>
      </nav>
    </div>
  );
}
