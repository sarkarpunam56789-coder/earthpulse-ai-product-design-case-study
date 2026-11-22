import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { SECTIONS } from '../../data/caseStudy';
import { useScrollSpy } from '../../hooks/useScrollSpy';

const IDS = SECTIONS.map((s) => s.id);

/** Sticky section navigation with reading progress. Sits just below the site header (h-16). */
export function CaseStudyNav() {
  const active = useScrollSpy(IDS);
  const [progress, setProgress] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[aria-current="location"]');
    el?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [active]);

  return (
    <div className="no-print sticky top-16 z-30 border-b border-line-subtle bg-page/95 backdrop-blur">
      <nav aria-label="Case study sections" className="mx-auto max-w-site px-2 sm:px-6 lg:px-8">
        <ul ref={listRef} className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
          {SECTIONS.map((s) => {
            const on = active === s.id;
            return (
              <li key={s.id} className="shrink-0">
                <a href={`#${s.id}`} aria-current={on ? 'location' : undefined}
                  className={cn('flex h-9 items-center gap-2 rounded-md px-3 text-label-m transition-colors', on ? 'bg-brand-subtle text-brand-700' : 'text-ink-secondary hover:bg-subtle hover:text-ink')}>
                  <span className={cn('text-label-s', on ? 'text-brand' : 'text-ink-placeholder')}>{s.n}</span>{s.short}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-muted" aria-hidden><div className="h-full bg-brand transition-[width] duration-150" style={{ width: `${progress}%` }} /></div>
    </div>
  );
}
