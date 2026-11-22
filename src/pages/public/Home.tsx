import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cloud, Droplets, Sparkles, Trash2 } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Button, ButtonLink } from '../../components/ui/Button';
import { HeroPreview } from '../../components/features/HeroPreview';

const wrap = 'mx-auto max-w-site px-4 sm:px-6 lg:px-8';

export default function Home() {
  useDocumentTitle('');
  const { startDemo } = useApp();
  const navigate = useNavigate();
  const demo = (to = '/app') => { startDemo(); navigate(to); };

  return (
    <>
      <section className={`${wrap} grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-24`}>
        <div>
          <h1 className="font-display text-display-m sm:text-display-l lg:text-display-xl">Know your footprint. Shrink it, one habit at a time.</h1>
          <p className="mt-6 max-w-xl text-body-l text-ink-secondary">EarthPulse AI helps you understand the carbon, water and waste behind everyday life in India, then turns what you learn into small weekly actions you can actually keep.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/get-started" size="lg" iconRight={ArrowRight}>Get started</ButtonLink>
            <Button size="lg" variant="secondary" onClick={() => demo()}>Try the demo</Button>
          </div>
          <p className="mt-4 text-body-s text-ink-secondary">The demo opens a dashboard with clearly labelled sample data. No sign-up needed.</p>
        </div>
        <HeroPreview />
      </section>

      <section className="border-y border-line-subtle bg-surface">
        <div className={`${wrap} py-16`}>
          <h2 className="max-w-2xl text-h1">Three numbers that describe your impact at home</h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3">
            {[
              { i: Cloud, c: '#16783C', t: 'Carbon', d: 'Log your commute, electricity, meals and shopping. See where your estimated carbon comes from and what moves it.' },
              { i: Droplets, c: '#2F80C8', t: 'Water', d: 'Track showers, laundry, cooking and cleaning against a weekly goal, and catch the days that run high.' },
              { i: Trash2, c: '#3FA796', t: 'Waste', d: 'Record what you throw away, how well you separate wet and dry, and what gets recycled.' },
            ].map((f) => (
              <div key={f.t} className="bg-surface p-6 sm:p-8">
                <span className="grid h-10 w-10 place-items-center rounded-md" style={{ backgroundColor: `${f.c}24` }}><f.i className="h-5 w-5" style={{ color: f.c }} aria-hidden /></span>
                <h3 className="mt-4 text-h3">{f.t}</h3>
                <p className="mt-2 text-body-m text-ink-secondary">{f.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-6"><ButtonLink to="/features" variant="ghost" iconRight={ArrowRight}>See all features</ButtonLink></div>
        </div>
      </section>

      <section className={`${wrap} py-16 lg:py-24`}>
        <h2 className="max-w-2xl text-h1">From a few logs to a plan you can follow</h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {[
            { n: '1', t: 'Tell us how you live', d: 'Pick your city, how you get around and what you eat. It takes about three minutes.' },
            { n: '2', t: 'Log as you go', d: 'Add a trip, a meal or a load of laundry in a few taps. Your dashboard updates straight away.' },
            { n: '3', t: 'Act on what you learn', d: 'Turn suggestions into weekly actions, set goals and test what-if changes before committing.' },
          ].map((s) => (
            <li key={s.n}>
              <div className="font-display text-display-m text-brand">{s.n}</div>
              <h3 className="mt-2 text-h3">{s.t}</h3>
              <p className="mt-2 text-body-m text-ink-secondary">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-inverse text-ink-inverse">
        <div className={`${wrap} grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-20`}>
          <div>
            <h2 className="text-h1 text-ink-inverse">An assistant that knows your week</h2>
            <p className="mt-4 text-body-l text-ink-soft">Ask the Copilot why your water use is high, what to change first, or how an estimate was made. It answers from your own logs and says plainly when a number is an estimate.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="primary" iconLeft={Sparkles} onClick={() => demo('/app/copilot')}>Try the Copilot demo</Button>
              <ButtonLink to="/copilot" variant="ghost" className="text-ink-inverse hover:bg-brand-800 hover:text-ink-inverse">How it works</ButtonLink>
            </div>
          </div>
          <div className="rounded-xl bg-surface p-5 text-ink sm:p-6" role="img" aria-label="Example Copilot conversation with sample content">
            <div className="ml-auto max-w-[85%] rounded-lg rounded-br-sm bg-brand px-4 py-3 text-body-s text-white">How can I reduce my commute emissions?</div>
            <div className="mt-4 flex gap-3"><span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-subtle"><Sparkles className="h-4 w-4 text-brand" aria-hidden /></span>
              <div className="rounded-lg rounded-tl-sm bg-subtle px-4 py-3 text-body-s">Transport is the largest share of the carbon you've logged this month. Replacing two weekday car or auto trips with the metro is the simplest change. These are estimates, not measurements.</div></div>
            <p className="mt-3 text-caption text-ink-secondary">Sample conversation. The in-app Copilot runs in demo mode.</p>
          </div>
        </div>
      </section>

      <section className={`${wrap} grid gap-10 py-16 lg:grid-cols-[1fr_1.1fr] lg:py-24`}>
        <div>
          <h2 className="text-h1">How we estimate impact, and what we don't claim</h2>
          <p className="mt-4 text-body-m text-ink-secondary">Every number in EarthPulse AI is an estimate: what you log, multiplied by a published emission or usage factor. We show the factors, the assumptions and the limits so you can judge the result for yourself.</p>
          <div className="mt-6"><ButtonLink to="/methodology" variant="secondary" iconRight={ArrowRight}>Read the methodology</ButtonLink></div>
        </div>
        <div className="rounded-lg border border-line bg-surface p-6">
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center sm:gap-4">
            <div className="rounded-md bg-subtle p-3"><div className="text-label-s text-ink-secondary">You log</div><div className="text-label-m">10 km by metro</div></div>
            <span className="text-h3 text-ink-placeholder" aria-hidden>×</span>
            <div className="rounded-md bg-subtle p-3"><div className="text-label-s text-ink-secondary">A factor</div><div className="text-label-m">kg CO₂e per km</div></div>
            <span className="text-h3 text-ink-placeholder" aria-hidden>=</span>
            <div className="rounded-md bg-brand-subtle p-3"><div className="text-label-s text-ink-secondary">An estimate</div><div className="text-label-m text-brand-700">kg CO₂e</div></div>
          </div>
          <p className="mt-4 text-body-s text-ink-secondary">This prototype uses illustrative placeholder factors. Before launch they will be replaced with sourced, region-specific data, and each source will be listed.</p>
        </div>
      </section>

      <section className="border-t border-line-subtle bg-surface">
        <div className={`${wrap} flex flex-col items-start justify-between gap-5 py-12 md:flex-row md:items-center`}>
          <div><h2 className="text-h2">Behind the product</h2><p className="mt-2 max-w-xl text-body-m text-ink-secondary">A design case study: an honest audit of this build, the problem it should solve, and a plan to test it with real people.</p></div>
          <ButtonLink to="/case-study" variant="secondary" size="lg" iconRight={ArrowRight}>Read the case study</ButtonLink>
        </div>
      </section>

      <section className="border-t border-line-subtle bg-brand-subtle">
        <div className={`${wrap} flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center`}>
          <div><h2 className="text-h1">Start with one small change</h2><p className="mt-2 text-body-m text-ink-secondary">Set up your profile, log a few activities and see where you stand.</p></div>
          <div className="flex flex-wrap gap-3"><ButtonLink to="/get-started" size="lg">Create your account</ButtonLink><Button size="lg" variant="secondary" onClick={() => demo()}>Try the demo</Button></div>
        </div>
      </section>
    </>
  );
}
