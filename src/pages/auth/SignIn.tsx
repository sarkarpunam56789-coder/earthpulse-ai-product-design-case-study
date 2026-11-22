import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Checkbox, TextField } from '../../components/ui/Fields';

export default function SignIn() {
  useDocumentTitle('Sign in');
  const { signIn, startDemo } = useApp();
  const navigate = useNavigate();
  const loc = useLocation();
  const from = (loc.state as { from?: string } | null)?.from ?? '/app';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keep, setKeep] = useState(true);
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 1) { setError("That email and password don't match. Enter a valid email and your password."); return; }
    setError(''); setLoading(true);
    setTimeout(() => { signIn(email); navigate(from, { replace: true }); }, 500);
  };

  return (
    <AuthLayout headline="Welcome back. Your latest impact is waiting." support="Sign in to see your dashboard, goals and weekly plan." onBack={() => navigate('/')}>
      <h1 className="text-h1">Sign in</h1>
      <p className="mt-2 text-body-m text-ink-secondary">Pick up where you left off.</p>
      {error && <Alert variant="error" className="mt-6">{error}</Alert>}
      <form onSubmit={submit} className="mt-6 flex flex-col gap-5" noValidate>
        <TextField label="Email" type="email" leftIcon={Mail} autoComplete="email" placeholder="name@example.com" value={email} error={error ? ' ' : undefined} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type={show ? 'text' : 'password'} autoComplete="current-password" value={password} error={error ? ' ' : undefined} onChange={(e) => setPassword(e.target.value)}
          rightSlot={<button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow((s) => !s)} className="rounded-sm p-1 text-ink-secondary">{show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>} />
        <div className="flex items-center justify-between"><Checkbox checked={keep} onChange={setKeep} label="Keep me signed in on this device" /></div>
        <Button type="submit" size="lg" full loading={loading}>Sign in</Button>
      </form>
      <div className="my-6 flex items-center gap-3 text-caption text-ink-secondary"><span className="h-px flex-1 bg-line-subtle" />or<span className="h-px flex-1 bg-line-subtle" /></div>
      <Button size="lg" full variant="secondary" onClick={() => { startDemo(); navigate('/app'); }}>Explore the demo with sample data</Button>
      <p className="mt-6 text-center text-body-s text-ink-secondary">New to EarthPulse AI? <Link to="/signup" className="text-label-m text-brand-700 hover:underline">Create an account</Link></p>
      <p className="mt-3 text-center text-caption text-ink-secondary">Prototype sign-in: any valid email and password works. Nothing is sent to a server.</p>
    </AuthLayout>
  );
}
