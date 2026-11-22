import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ButtonLink } from '../../components/ui/Button';

const wrap = 'mx-auto max-w-site px-4 sm:px-6 lg:px-8';
const STEPS = [
  { n: '1', t: 'Set up your profile', d: 'Choose your city, how you get around, your diet and what you want to focus on. A rough starting point for electricity and travel is enough.', pts: ['About three minutes', 'Everything can be changed later', 'Skip the baseline if you prefer'] },
  { n: '2', t: 'Log what you do', d: 'Add trips, electricity use, meals, purchases, water and waste. Each entry shows its estimated impact before you save it.', pts: ['A few taps per entry', 'Undo from the confirmation message', 'Remove your own entries any time'] },
  { n: '3', t: 'Understand your impact', d: 'The dashboard totals your week, compares it with last week and shows where it comes from. The Copilot can explain any number.', pts: ['Weekly and monthly views', 'Category breakdown', 'Assumptions shown next to estimates'] },
  { n: '4', t: 'Improve week by week', d: 'Turn suggestions into planned actions, set weekly limits and habits, and test changes in the simulator first.', pts: ['Action planner with a day for each task', 'Goals with progress indicators', 'Monthly reports to review progress'] },
];
const FAQ = [
  ['Are the numbers exact?', 'No. They are estimates built from what you log and published-style factors. This prototype uses illustrative placeholder factors, and the Methodology page lists each one.'],
  ['Is the AI real?', 'The Copilot in this prototype runs in demo mode with scripted replies built from your sample data. It can be connected to a real service through a configuration setting.'],
  ['Where is my data stored?', 'In this prototype, only in your browser. There is no server and no real account.'],
  ['Does it work outside India?', 'The first version is designed around India: cities, transport modes and household patterns. The structure supports other regions once region-specific factors are added.'],
  ['Why does the dashboard show sample data?', 'So you can explore a populated product. Sample entries are labelled, and you can clear them in Settings to start fresh.'],
];

export default function HowItWorks() {
  useDocumentTitle('How it works');
  return (
    <>
      <section className={`${wrap} py-14 lg:py-20`}>
        <h1 className="max-w-3xl font-display text-display-m sm:text-display-l">From a few logs to a plan you can keep</h1>
        <p className="mt-5 max-w-2xl text-body-l text-ink-secondary">EarthPulse AI works in four steps. You stay in control of what you log, and every estimate shows how it was made.</p>
      </section>
      <section className={`${wrap} pb-16`}>
        <ol className="flex flex-col divide-y divide-line-subtle border-y border-line-subtle">
          {STEPS.map((s) => (
            <li key={s.n} className="grid gap-4 py-8 md:grid-cols-[96px_1fr_1fr] md:gap-8">
              <div className="font-display text-display-m text-brand">{s.n}</div>
              <div><h2 className="text-h2">{s.t}</h2><p className="mt-2 text-body-m text-ink-secondary">{s.d}</p></div>
              <ul className="flex list-disc flex-col gap-1.5 pl-5 text-body-m text-ink-secondary marker:text-brand">{s.pts.map((p) => <li key={p}>{p}</li>)}</ul>
            </li>
          ))}
        </ol>
      </section>
      <section className="border-t border-line-subtle bg-surface">
        <div className={`${wrap} grid gap-10 py-16 lg:grid-cols-[1fr_1.6fr]`}>
          <div><h2 className="text-h1">Common questions</h2><p className="mt-3 text-body-m text-ink-secondary">Straight answers about what this prototype does and doesn't do.</p></div>
          <div className="divide-y divide-line-subtle border-y border-line-subtle">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-label-l">{q}<span className="text-ink-secondary transition-transform group-open:rotate-45" aria-hidden>+</span></summary><p className="mt-2 max-w-xl text-body-m text-ink-secondary">{a}</p></details>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-brand-subtle"><div className={`${wrap} flex flex-col items-start justify-between gap-5 py-12 md:flex-row md:items-center`}><h2 className="text-h2">Ready to try it?</h2><div className="flex gap-3"><ButtonLink to="/get-started" size="lg">Get started</ButtonLink><ButtonLink to="/methodology" size="lg" variant="secondary">Read the methodology</ButtonLink></div></div></section>
    </>
  );
}
