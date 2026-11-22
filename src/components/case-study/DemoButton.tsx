import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { Button } from '../ui/Button';

/**
 * Opens a screen of the live product. If nobody is signed in, it starts the sample-data demo first.
 * If you are already signed in, your own data is left untouched.
 */
export function DemoButton({ to, children, variant = 'secondary', size = 'md', iconRight }: {
  to: string; children: string; variant?: 'primary' | 'secondary' | 'ghost'; size?: 'sm' | 'md' | 'lg'; iconRight?: LucideIcon;
}) {
  const { state, startDemo } = useApp();
  const navigate = useNavigate();
  return (
    <Button variant={variant} size={size} iconRight={iconRight} onClick={() => { if (!state.authed || !state.onboarded) startDemo(); navigate(to); }}>
      {children}
    </Button>
  );
}
