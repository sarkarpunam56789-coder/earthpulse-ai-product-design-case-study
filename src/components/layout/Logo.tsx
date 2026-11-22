import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

export function Logo({ to = '/', onDark, className }: { to?: string; onDark?: boolean; className?: string }) {
  return (
    <Link to={to} className={cn('inline-flex items-center gap-3 rounded-md', className)} aria-label="EarthPulse AI home">
      <span className="grid h-8 w-8 place-items-center rounded-md bg-brand"><Leaf className="h-5 w-5 text-white" aria-hidden /></span>
      <span className={cn('text-h4', onDark && 'text-ink-inverse')}>EarthPulse AI</span>
    </Link>
  );
}
