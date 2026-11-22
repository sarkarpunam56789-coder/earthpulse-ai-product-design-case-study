import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarCheck, Cloud, Sparkles } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';

const BENEFITS = [
  { icon: Cloud, title: 'Track carbon, water and waste', text: 'Log activities in seconds and see your estimated impact in one place.' },
  { icon: Sparkles, title: 'Ask your AI Sustainability Copilot', text: 'Get suggestions tailored to life in your city.' },
  { icon: CalendarCheck, title: 'Follow a simple weekly plan', text: 'Pick small actions and watch your progress build.' },
];

export default function GetStarted() {
  useDocumentTitle('Get started');
  const navigate = useNavigate();
  return (
    <AuthLayout headline="Know your footprint. Shrink it, one habit at a time." support="EarthPulse AI turns everyday choices, like your commute, your electricity and your meals, into clear insights and small weekly actions.">
      <h1 className="text-h1">Welcome to EarthPulse AI</h1>
      <p className="mt-2 text-body-m text-ink-secondary">Setup takes about 3 minutes.</p>
      <ul className="mt-8 flex flex-col gap-5">
        {BENEFITS.map((b) => (
          <li key={b.title} className="flex gap-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand-subtle"><b.icon className="h-5 w-5 text-brand" aria-hidden /></span>
            <div><div className="text-label-l">{b.title}</div><div className="text-body-s text-ink-secondary">{b.text}</div></div>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-col gap-3">
        <Button size="lg" full iconRight={ArrowRight} onClick={() => navigate('/signup')}>Get started</Button>
        <Button size="lg" full variant="secondary" onClick={() => navigate('/signin')}>I already have an account</Button>
      </div>
      <p className="mt-4 text-caption text-ink-secondary">This is a prototype. Accounts are simulated and stored only in your browser.</p>
    </AuthLayout>
  );
}
