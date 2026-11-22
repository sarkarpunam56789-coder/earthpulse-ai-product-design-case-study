import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, X } from 'lucide-react';
import { COPILOT_PROMPTS } from '../../data/content';
import { useApp } from '../../hooks/useApp';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Button, ButtonLink } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Chip } from '../../components/ui/Fields';

const wrap = 'mx-auto max-w-site px-4 sm:px-6 lg:px-8';

export default function CopilotIntro() {
  useDocumentTitle('AI Sustainability Copilot');
  const { startDemo } = useApp();
  const navigate = useNavigate();
  return (
    <>
      <section className={`${wrap} grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-20`}>
        <div>
          <Badge variant="warning" dot>Demo mode in this prototype</Badge>
          <h1 className="mt-4 font-display text-display-m sm:text-display-l">Ask about your footprint in plain language</h1>
          <p className="mt-5 text-body-l text-ink-secondary">The Copilot reads your logged totals and your city, explains what's driving your numbers, and suggests actions you can add to your weekly plan.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Button size="lg" iconLeft={Sparkles} onClick={() => { startDemo(); navigate('/app/copilot'); }}>Try the Copilot demo</Button><ButtonLink to="/features" size="lg" variant="secondary">All features</ButtonLink></div>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5 shadow-elev-2 sm:p-6" role="img" aria-label="Example Copilot conversation using sample content">
          <div className="mb-4 flex flex-wrap gap-2">{COPILOT_PROMPTS.slice(0, 3).map((p) => <Chip key={p}>{p}</Chip>)}</div>
          <div className="ml-auto max-w-[85%] rounded-lg rounded-br-sm bg-brand px-4 py-3 text-body-s text-white">What should I focus on this week?</div>
          <div className="mt-4 flex gap-3"><span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-subtle"><Sparkles className="h-4 w-4 text-brand" aria-hidden /></span>
            <div><div className="rounded-lg rounded-tl-sm bg-subtle px-4 py-3 text-body-s">This week you've used 52% of your carbon goal, 58% of your water goal and 42% of your waste goal. Water is closest to its limit, so that's the best place to focus.</div>
              <div className="mt-3 rounded-lg border border-success-border bg-brand-subtle p-4"><div className="text-label-s text-brand-700">Suggested action</div><div className="text-label-l">Fix the dripping kitchen tap</div><div className="text-label-s text-success-fg">Est. saves about 20 L a day</div></div></div></div>
          <p className="mt-3 text-caption text-ink-secondary">Sample conversation.</p>
        </div>
      </section>
      <section className="border-y border-line-subtle bg-surface"><div className={`${wrap} grid gap-10 py-14 md:grid-cols-2`}>
        <div><h2 className="text-h2">What it does</h2><ul className="mt-4 flex flex-col gap-3">{['Explains your totals and how they compare with last week', 'Suggests changes that fit life in your city', 'Turns a suggestion into a plan action in one tap', 'Says when a number is an estimate and points to the methodology'].map((t) => <li key={t} className="flex items-start gap-2 text-body-m"><Check className="mt-1 h-4 w-4 shrink-0 text-brand" aria-hidden />{t}</li>)}</ul></div>
        <div><h2 className="text-h2">What it doesn't do</h2><ul className="mt-4 flex flex-col gap-3">{['Present estimates as verified measurements', 'Give medical, legal or financial advice', 'Reach outside your own logged data in demo mode', 'Claim a live AI connection when none exists'].map((t) => <li key={t} className="flex items-start gap-2 text-body-m"><X className="mt-1 h-4 w-4 shrink-0 text-danger" aria-hidden />{t}</li>)}</ul></div>
      </div></section>
      <section className={`${wrap} py-14`}><h2 className="text-h2">Connecting a real AI service</h2><p className="mt-3 max-w-2xl text-body-m text-ink-secondary">The Copilot calls one function that either returns a scripted demo reply or sends your question and a small summary of your totals to a service you configure. See the project README for the setup variable and the expected response shape.</p></section>
    </>
  );
}
