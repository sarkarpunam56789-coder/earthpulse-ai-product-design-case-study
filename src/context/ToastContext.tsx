import { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastItem { id: number; message: string; actionLabel?: string; onAction?: () => void }
interface ToastApi { push: (message: string, opts?: { actionLabel?: string; onAction?: () => void }) => void }

const ToastCtx = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);
  const dismiss = useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), []);
  const push = useCallback<ToastApi['push']>((message, opts) => {
    const id = ++seq.current;
    setItems((l) => [...l, { id, message, ...opts }]);
    setTimeout(() => dismiss(id), 4500);
  }, [dismiss]);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} role="status" className="pointer-events-auto flex w-full max-w-[400px] items-center gap-3 rounded-md bg-inverse px-4 py-3 text-body-s text-ink-inverse shadow-elev-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-300" aria-hidden />
            <span className="flex-1">{t.message}</span>
            {t.actionLabel && (
              <button className="text-label-m text-brand-300 underline-offset-2 hover:underline" onClick={() => { t.onAction?.(); dismiss(t.id); }}>
                {t.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToastContext() {
  const c = useContext(ToastCtx);
  if (!c) throw new Error('useToast must be used inside ToastProvider');
  return c;
}
