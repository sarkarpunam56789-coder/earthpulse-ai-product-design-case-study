import { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';
import { Logo } from './Logo';

export function StepProgress({ step, total = 5 }: { step: number; total?: number }) {
  return (
    <div className="w-full max-w-[480px]" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step} aria-label={`Step ${step} of ${total}`}>
      <div className="mb-2 text-label-s text-ink-secondary">Step {step} of {total}</div>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => <span key={i} className={cn('h-1 flex-1 rounded-full', i < step ? 'bg-brand' : 'bg-muted')} />)}
      </div>
    </div>
  );
}

/** Split layout used by sign up, sign in and every onboarding step. */
export function AuthLayout({ headline, support, children, onBack, topRight, wide, step }: {
  headline: string; support: string; children: ReactNode; onBack?: () => void; topRight?: ReactNode; wide?: boolean; step?: number;
}) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[minmax(380px,560px)_1fr]">
      <aside className="hidden flex-col justify-between bg-inverse p-12 text-ink-inverse lg:flex xl:p-16">
        <Logo onDark />
        <div>
          <h2 className="max-w-md font-display text-display-m text-ink-inverse">{headline}</h2>
          <p className="mt-4 max-w-md text-body-l text-ink-soft">{support}</p>
        </div>
        <p className="text-caption text-ink-soft">India-first sustainability tracking</p>
      </aside>
      <div className="flex min-h-screen flex-col bg-page">
        <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-4">
            <div className="lg:hidden"><Logo /></div>
            {onBack && <Button variant="ghost" size="sm" iconLeft={ChevronLeft} onClick={onBack}>Back</Button>}
          </div>
          {step ? <div className="hidden flex-1 justify-end sm:flex"><StepProgress step={step} /></div> : topRight}
        </div>
        {step && <div className="px-4 sm:hidden"><StepProgress step={step} /></div>}
        <main id="main" className="flex flex-1 justify-center px-4 pb-12 pt-6 sm:px-8 sm:pt-10">
          <div className={cn('w-full', wide ? 'max-w-[560px]' : 'max-w-[480px]')}>{children}</div>
        </main>
      </div>
    </div>
  );
}
