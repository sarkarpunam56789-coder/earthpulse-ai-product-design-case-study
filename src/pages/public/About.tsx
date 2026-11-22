import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ButtonLink } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const wrap = 'mx-auto max-w-site px-4 sm:px-6 lg:px-8';
const PRINCIPLES = [
  { t: 'Honest about estimates', d: 'Every figure is labelled as an estimate, with its assumptions one click away.' },
  { t: 'Small, specific actions', d: 'We favour changes you can make this week over long lists of advice.' },
  { t: 'Built for where you live', d: 'Cities, transport modes and household patterns in India come first.' },
  { t: 'Your data stays yours', d: 'You can export everything and clear it at any time.' },
];
const ROADMAP = [
  ['Sourced emission factors for India', 'Planned'], ['Real AI service for the Copilot', 'Planned'], ['Accounts and cloud sync', 'Planned'], ['Hindi and other Indian languages', 'Planned'], ['Support for other regions', 'Later'],
];

export default function About() {
  useDocumentTitle('About');
  return (
    <>
      <section className={`${wrap} py-14 lg:py-20`}>
        <h1 className="max-w-3xl font-display text-display-m sm:text-display-l">Making everyday sustainability easier to see and easier to act on</h1>
        <p className="mt-5 max-w-2xl text-body-l text-ink-secondary">EarthPulse AI is a personal sustainability platform. It helps individuals understand the carbon, water and waste behind their daily routines and take small, steady steps to reduce them.</p>
      </section>
      <section className="border-y border-line-subtle bg-surface"><div className={`${wrap} grid gap-10 py-14 lg:grid-cols-[1fr_1.4fr]`}>
        <h2 className="text-h1">What we believe</h2>
        <dl className="grid gap-8 sm:grid-cols-2">{PRINCIPLES.map((p) => <div key={p.t}><dt className="text-h4">{p.t}</dt><dd className="mt-1 text-body-m text-ink-secondary">{p.d}</dd></div>)}</dl>
      </div></section>
      <section className={`${wrap} grid gap-10 py-14 lg:grid-cols-[1fr_1.4fr]`}>
        <div><h2 className="text-h1">India first</h2></div>
        <p className="text-body-m text-ink-secondary">Footprint tools are often built around other countries' routines. EarthPulse AI starts with how people in Indian cities travel, cook, cool their homes and manage waste: metro and auto-rickshaws, shared household appliances, wet and dry segregation. The structure is designed so other regions can be added once region-specific data is in place.</p>
      </section>
      <section className="border-y border-line-subtle bg-surface"><div className={`${wrap} grid gap-10 py-14 lg:grid-cols-[1fr_1.4fr]`}>
        <div><h2 className="text-h1">Where this stands</h2><p className="mt-3 text-body-m text-ink-secondary">This is a working prototype. Here is what is still ahead.</p></div>
        <ul className="divide-y divide-line-subtle border-y border-line-subtle">{ROADMAP.map(([t, s]) => <li key={t} className="flex items-center justify-between gap-4 py-3 text-body-m">{t}<Badge variant={s === 'Planned' ? 'brand' : 'neutral'}>{s}</Badge></li>)}</ul>
      </div></section>
      <section className={`${wrap} flex flex-col items-start justify-between gap-5 py-12 md:flex-row md:items-center`}><h2 className="text-h2">See how it works in practice</h2><div className="flex gap-3"><ButtonLink to="/get-started" size="lg">Get started</ButtonLink><ButtonLink to="/methodology" size="lg" variant="secondary">Methodology</ButtonLink></div></section>
    </>
  );
}
