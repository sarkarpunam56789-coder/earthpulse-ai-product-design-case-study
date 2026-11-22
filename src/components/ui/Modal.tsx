import { ReactNode, useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './Button';

export function Modal({ open, onClose, title, children, footer, size = 'md' }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; size?: 'md' | 'lg';
}) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  // Keep the latest onClose without re-running the effect (which would steal focus on every re-render).
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    const opener = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeRef.current(); };
    window.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); opener?.focus?.(); };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-inverse/55 p-0 sm:items-center sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId}
        className={`flex max-h-[92vh] w-full flex-col rounded-t-xl bg-surface shadow-elev-3 focus:outline-none sm:rounded-xl ${size === 'lg' ? 'sm:max-w-[680px]' : 'sm:max-w-[560px]'}`}>
        <div className="flex items-center justify-between gap-4 px-5 pb-2 pt-5 sm:px-8 sm:pt-8">
          <h2 id={titleId} className="text-h3">{title}</h2>
          <IconButton icon={X} label="Close" onClick={onClose} className="border-transparent" />
        </div>
        <div className="overflow-y-auto px-5 py-4 sm:px-8">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-3 px-5 pb-5 pt-2 sm:px-8 sm:pb-8">{footer}</div>}
      </div>
    </div>
  );
}
