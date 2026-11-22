import { CASE } from '../../../data/caseStudy';
import { cn } from '../../../lib/cn';
import { Badge } from '../../ui/Badge';
import { Callout, EvidenceTag, SectionShell, SubHead, Wf } from '../primitives';

const LEVEL = { Low: 'bg-muted text-ink-secondary', Medium: 'bg-warning-bg text-warning-fg', High: 'bg-info-bg text-info-fg' } as const;

const ONBOARDING = [
  {
    id: 'A', name: 'Five-step wizard', tag: 'Current build', note: 'Profile, location, lifestyle, interests, baseline, then a sample or empty dashboard.',
    screens: [
      { t: 'Step 1: profile', el: <><Wf.Bar w="40%" h={10} /><Wf.Box label="Name" h={26} /><Wf.Box label="Age group" h={26} /><Wf.Box label="Household" h={26} /><Wf.Btn label="Continue" /></> },
      { t: 'Step 3: lifestyle', el: <><Wf.Bar w="55%" h={10} /><div className="grid grid-cols-2 gap-1.5"><Wf.Box label="Walk" h={40} /><Wf.Box label="Metro" h={40} accent /><Wf.Box label="Bike" h={40} /><Wf.Box label="Car" h={40} /></div><Wf.Btn label="Continue" /></> },
      { t: 'Step 5: baseline', el: <><Wf.Bar w="50%" h={10} /><Wf.Box label="kWh a month" h={26} /><Wf.Box label="km a week" h={26} /><Wf.Box label="Waste habits" h={26} /><Wf.Btn label="Finish" /></> },
    ],
    rate: [['Time to a first personal result', 'High'], ['Richness of data collected', 'High'], ['Effort asked of the user', 'High']] as const,
    risk: 'Collects answers the product does not yet use (H1).',
  },
  {
    id: 'B', name: 'Estimate first', tag: 'Concept', note: 'Three questions, then an immediate rough week. Accuracy improves optionally.',
    screens: [
      { t: 'Screen 1: three questions', el: <><Wf.Bar w="60%" h={10} /><Wf.Box label="City" h={28} /><Wf.Box label="Commute km" h={28} /><Wf.Box label="Monthly kWh" h={28} /><Wf.Btn label="Show my week" /></> },
      { t: 'Screen 2: rough estimate', el: <><Wf.Bar w="45%" h={10} /><Wf.Box label="Estimate ring" h={70} accent /><Wf.Box label="Biggest contributor" h={30} /><Wf.Box label="Improve accuracy" h={26} /></> },
    ],
    rate: [['Time to a first personal result', 'Low'], ['Richness of data collected', 'Medium'], ['Effort asked of the user', 'Low']] as const,
    risk: 'A very rough estimate may feel untrustworthy.',
  },
  {
    id: 'C', name: 'Log first', tag: 'Concept', note: 'Start from “what did you do today?” and defer setup until it is needed.',
    screens: [
      { t: 'Screen 1: today', el: <><Wf.Bar w="55%" h={10} /><div className="grid grid-cols-3 gap-1.5"><Wf.Box label="Trip" h={50} accent /><Wf.Box label="Meal" h={50} /><Wf.Box label="Power" h={50} /></div><Wf.Box label="Pick one to start" h={26} /></> },
      { t: 'Screen 2: first entry', el: <><Wf.Bar w="45%" h={10} /><Wf.Box label="Impact preview" h={56} accent /><Wf.Box label="Add another" h={26} /><Wf.Btn label="Done" /></> },
    ],
    rate: [['Time to a first personal result', 'Low'], ['Richness of data collected', 'Low'], ['Effort asked of the user', 'Low']] as const,
    risk: 'An almost empty dashboard until enough is logged.',
  },
];

const DASH = [
  { t: 'Current: dense overview', note: 'About 12 cards plus quick actions.', el: <><Wf.Box label="Quick actions" h={22} /><Wf.Box label="Impact + chart" h={56} /><div className="grid grid-cols-3 gap-1"><Wf.Box h={26} /><Wf.Box h={26} /><Wf.Box h={26} /></div><div className="grid grid-cols-2 gap-1"><Wf.Box h={40} /><Wf.Box h={40} /></div></> },
  { t: 'Focus: one insight, one action', note: 'One headline, one next step, a week strip.', el: <><Wf.Bar w="50%" h={10} /><Wf.Box label="This week's one insight" h={66} accent /><Wf.Box label="One next action" h={34} /><div className="grid grid-cols-7 gap-1"><Wf.Box h={26} /><Wf.Box h={26} /><Wf.Box h={26} /><Wf.Box h={26} /><Wf.Box h={26} /><Wf.Box h={26} /><Wf.Box h={26} /></div></> },
  { t: 'Journal: timeline first', note: 'Today’s log leads; totals sit in a small header.', el: <><div className="grid grid-cols-3 gap-1"><Wf.Box label="kg" h={26} /><Wf.Box label="L" h={26} /><Wf.Box label="kg" h={26} /></div><Wf.Box label="Today" h={22} /><Wf.Box label="Entry" h={26} /><Wf.Box label="Entry" h={26} /><Wf.Btn label="+ Log" /></> },
];

const VERSIONS = [
  { v: 'v0', title: 'First build', text: 'Working product from my briefs, audited in Phase 1.', kind: 'built' as const },
  { v: 'v1', title: 'Audit-led fixes', text: 'Onboarding that pays off, sample data separated, one plan concept, plain language.', kind: 'planned' as const },
  { v: 'v2', title: 'Test-led changes', text: 'Decided after the session. Not defined yet because the evidence does not exist.', kind: 'planned' as const },
];

export function Exploration() {
  return (
    <SectionShell id="exploration" n="05" title="Exploration" tags={['built', 'planned']}
      summary="Alternative approaches to the two biggest problems: a setup that ends without value, and a dashboard that tries to show everything.">
      <Callout kind="warning" title="Concept studies, not tested designs">These low-fidelity wireframes compare ideas. Ratings are my judgements and the ideas have not been tried with anyone.</Callout>

      <div className="mt-12">
        <SubHead>Onboarding: three approaches</SubHead>
        <ul className="grid gap-6 lg:grid-cols-3">
          {ONBOARDING.map((o) => (
            <li key={o.id} className="flex flex-col rounded-xl border border-line bg-surface p-5">
              <div className="mb-1 flex items-center justify-between"><h4 className="text-h4"><span className="mr-2 text-brand">{o.id}</span>{o.name}</h4><Badge variant={o.tag === 'Current build' ? 'success' : 'neutral'}>{o.tag}</Badge></div>
              <p className="mb-4 text-body-s text-ink-secondary">{o.note}</p>
              <div className={cn('grid gap-3', o.screens.length === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
                {o.screens.map((s) => <Wf.Screen key={s.t} title={s.t}>{s.el}</Wf.Screen>)}
              </div>
              <dl className="mt-5 flex flex-col gap-2 text-body-s">
                {o.rate.map(([k, v]) => <div key={k} className="flex items-center justify-between gap-2"><dt className="text-ink-secondary">{k}</dt><dd><span className={cn('rounded-full px-2 py-0.5 text-label-s', LEVEL[v])}>{v}</span></dd></div>)}
              </dl>
              <p className="mt-4 rounded-md bg-subtle p-3 text-body-s"><span className="text-label-s text-ink-secondary">Main risk: </span>{o.risk}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-caption text-ink-secondary">My leaning is B, because it answers the biggest audit finding (setup without a result). It is a hypothesis to test against A with the same tasks.</p>
      </div>

      <div className="mt-14">
        <SubHead>Dashboard: three layouts</SubHead>
        <ul className="grid gap-6 md:grid-cols-3">
          {DASH.map((d) => (
            <li key={d.t} className="rounded-xl border border-line bg-surface p-5"><Wf.Screen title={d.t}>{d.el}</Wf.Screen><p className="mt-1 text-body-s text-ink-secondary">{d.note}</p></li>
          ))}
        </ul>
      </div>

      <div className="mt-14">
        <SubHead>Sketches</SubHead>
        {CASE.sketchImages.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CASE.sketchImages.map((s) => <li key={s.src}><figure><img src={s.src} alt={s.caption} className="w-full rounded-lg border border-line" loading="lazy" /><figcaption className="mt-2 text-caption text-ink-secondary">{s.caption}</figcaption></figure></li>)}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-line-strong bg-surface p-8 text-center">
            <p className="text-label-l">Your hand sketches go here</p>
            <p className="mx-auto mt-1 max-w-md text-body-s text-ink-secondary">Add photos to <code>public/case-study/</code> and list them under <code>sketchImages</code> in <code>src/data/caseStudy.ts</code>. Real sketches carry more credibility than generated wireframes.</p>
          </div>
        )}
      </div>

      <div className="mt-14">
        <SubHead>Iterations</SubHead>
        <ol className="grid gap-4 md:grid-cols-3">
          {VERSIONS.map((v, i) => (
            <li key={v.v} className="relative rounded-lg border border-line bg-surface p-5">
              <div className="mb-2 flex items-center justify-between"><span className="font-display text-display-m text-brand-300">{v.v}</span><EvidenceTag kind={v.kind} /></div>
              <h4 className="text-h4">{v.title}</h4><p className="mt-1 text-body-s text-ink-secondary">{v.text}</p>
              {i < VERSIONS.length - 1 && <span aria-hidden className="absolute -right-3 top-1/2 hidden h-px w-6 bg-line-strong md:block" />}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-caption text-ink-secondary">Only v0 exists. I will not show before-and-after improvements until I have evidence for them.</p>
      </div>
    </SectionShell>
  );
}
