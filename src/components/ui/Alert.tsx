import { ReactNode } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '../../lib/cn';

const map = {
  info: { cls: 'bg-info-bg border-info-border text-info-fg', Icon: Info },
  success: { cls: 'bg-success-bg border-success-border text-success-fg', Icon: CheckCircle2 },
  warning: { cls: 'bg-warning-bg border-warning-border text-warning-fg', Icon: AlertTriangle },
  error: { cls: 'bg-danger-bg border-danger-border text-danger-fg', Icon: AlertCircle },
};

export function Alert({ variant = 'info', children, action, className }: { variant?: keyof typeof map; children: ReactNode; action?: ReactNode; className?: string }) {
  const { cls, Icon } = map[variant];
  return (
    <div role={variant === 'error' ? 'alert' : 'status'} className={cn('flex items-start gap-2 rounded-md border p-3 text-body-s', cls, className)}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="flex-1">{children}</div>
      {action}
    </div>
  );
}
