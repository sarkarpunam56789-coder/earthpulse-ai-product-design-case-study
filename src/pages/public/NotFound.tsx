import { ButtonLink } from '../../components/ui/Button';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Logo } from '../../components/layout/Logo';

export default function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-page px-4 text-center">
      <Logo />
      <h1 className="mt-6 font-display text-display-m">Page not found</h1>
      <p className="max-w-md text-body-m text-ink-secondary">The page you're looking for doesn't exist or has moved.</p>
      <div className="mt-2 flex gap-3"><ButtonLink to="/">Go home</ButtonLink><ButtonLink to="/app" variant="secondary">Open the app</ButtonLink></div>
    </div>
  );
}
