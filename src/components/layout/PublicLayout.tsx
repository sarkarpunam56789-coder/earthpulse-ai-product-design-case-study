import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { ButtonLink, IconButton } from '../ui/Button';
import { Logo } from './Logo';

const LINKS = [
  { to: '/features', label: 'Features' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/copilot', label: 'AI Copilot' },
  { to: '/methodology', label: 'Methodology' },
  { to: '/case-study', label: 'Case study' },
  { to: '/about', label: 'About' },
];

export function PublicLayout() {
  const [open, setOpen] = useState(false);
  useScrollToTop();
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-surface focus:px-4 focus:py-2">Skip to content</a>
      <header className="sticky top-0 z-40 border-b border-line-subtle bg-page/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-site items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => cn('rounded-md px-3 py-2 text-label-m', isActive ? 'text-brand-700' : 'text-ink-secondary hover:text-ink')}>{l.label}</NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <ButtonLink to="/signin" variant="ghost">Sign in</ButtonLink>
            <ButtonLink to="/get-started">Get started</ButtonLink>
          </div>
          <IconButton icon={open ? X : Menu} label={open ? 'Close menu' : 'Open menu'} className="lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} />
        </div>
        {open && (
          <div className="border-t border-line-subtle bg-page px-4 pb-4 lg:hidden">
            <nav aria-label="Mobile" className="flex flex-col py-2">
              {LINKS.map((l) => <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-label-l">{l.label}</NavLink>)}
            </nav>
            <div className="flex gap-3">
              <ButtonLink to="/signin" variant="secondary" full onClick={() => setOpen(false)}>Sign in</ButtonLink>
              <ButtonLink to="/get-started" full onClick={() => setOpen(false)}>Get started</ButtonLink>
            </div>
          </div>
        )}
      </header>
      <main id="main" className="flex-1"><Outlet /></main>
      <footer className="bg-inverse text-ink-inverse">
        <div className="mx-auto grid max-w-site gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div>
            <Logo onDark />
            <p className="mt-4 max-w-sm text-body-s text-ink-soft">A personal sustainability platform that turns everyday choices into clear insights and small weekly actions. India first.</p>
          </div>
          <div>
            <h2 className="mb-3 text-label-m">Product</h2>
            <ul className="flex flex-col gap-2 text-body-s text-ink-soft">
              {LINKS.slice(0, 3).map((l) => <li key={l.to}><NavLink to={l.to} className="hover:text-ink-inverse">{l.label}</NavLink></li>)}
              <li><NavLink to="/signup" className="hover:text-ink-inverse">Create an account</NavLink></li>
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-label-m">Company</h2>
            <ul className="flex flex-col gap-2 text-body-s text-ink-soft">
              <li><NavLink to="/about" className="hover:text-ink-inverse">About</NavLink></li>
              <li><NavLink to="/methodology" className="hover:text-ink-inverse">Methodology</NavLink></li>
              <li><NavLink to="/case-study" className="hover:text-ink-inverse">Design case study</NavLink></li>
              <li><NavLink to="/signin" className="hover:text-ink-inverse">Sign in</NavLink></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-brand-800">
          <p className="mx-auto max-w-site px-4 py-5 text-caption text-ink-soft sm:px-6 lg:px-8">
            EarthPulse AI is a prototype. All figures shown are sample data, and impact values are illustrative estimates, not verified measurements.
          </p>
        </div>
      </footer>
    </div>
  );
}
