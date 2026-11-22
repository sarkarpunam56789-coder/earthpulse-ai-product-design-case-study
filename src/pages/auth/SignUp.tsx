import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Checkbox, TextField } from '../../components/ui/Fields';

export default function SignUp() {
  useDocumentTitle('Create account');
  const { signUp } = useApp();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [agree, setAgree] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [e, setE] = useState<Record<string, string>>({});

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const errs: Record<string, string> = {};
    if (!f.name.trim()) errs.name = 'Enter your name';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) errs.email = 'Enter a valid email address';
    if (f.password.length < 8 || !/\d/.test(f.password)) errs.password = 'Password needs at least 8 characters and a number';
    if (!agree) errs.agree = 'Please accept the terms to continue';
    setE(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => { signUp(f.name.trim(), f.email); navigate('/onboarding'); }, 600);
  };
  const set = (k: string, v: string) => { setF((s) => ({ ...s, [k]: v })); setE((x) => ({ ...x, [k]: '' })); };

  return (
    <AuthLayout headline="Small choices add up. Let's measure yours." support="Create a free account to start tracking your estimated impact." onBack={() => navigate('/get-started')}>
      <h1 className="text-h1">Create your account</h1>
      <p className="mt-2 text-body-m text-ink-secondary">Start tracking your impact in minutes.</p>
      <form onSubmit={submit} className="mt-8 flex flex-col gap-5" noValidate>
        <TextField label="Full name" placeholder="e.g. Ananya Rao" autoComplete="name" value={f.name} error={e.name} onChange={(x) => set('name', x.target.value)} />
        <TextField label="Email" type="email" leftIcon={Mail} placeholder="name@example.com" autoComplete="email" value={f.email} error={e.email} onChange={(x) => set('email', x.target.value)} />
        <TextField label="Password" type={show ? 'text' : 'password'} placeholder="At least 8 characters" autoComplete="new-password" value={f.password} error={e.password}
          helper="Use 8+ characters including a number" onChange={(x) => set('password', x.target.value)}
          rightSlot={<button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow((s) => !s)} className="rounded-sm p-1 text-ink-secondary">{show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>} />
        <div>
          <Checkbox checked={agree} onChange={(v) => { setAgree(v); setE((x) => ({ ...x, agree: '' })); }} label="I agree to the Terms and Privacy Policy (placeholders in this prototype)" />
          {e.agree && <p className="mt-1 text-caption text-danger-fg" role="alert">{e.agree}</p>}
        </div>
        <Button type="submit" size="lg" full loading={loading}>{loading ? 'Creating account…' : 'Create account'}</Button>
      </form>
      <p className="mt-6 text-center text-body-s text-ink-secondary">Already have an account? <Link to="/signin" className="text-label-m text-brand-700 hover:underline">Sign in</Link></p>
      <p className="mt-3 text-center text-caption text-ink-secondary">Prototype only. Nothing is sent to a server.</p>
    </AuthLayout>
  );
}
