import { ArrowRight, RotateCcw } from 'lucide-react';
import { LOOP, MOSCOW, MVP_DEFINITION, PRIORITY_ITEMS, VERDICTS, VISION } from '../../../data/caseStudy';
import { cn } from '../../../lib/cn';
import { Badge } from '../../ui/Badge';
import { EvidenceTag, ScatterMatrix, SectionShell, SubHead } from '../primitives';

export function Strategy() {
  return (
    <SectionShell id="strategy" n="04" title="Strategy" tone="subtle" tags={['assumption', 'heuristic', 'expected']}
      summary="A narrower product than the one I built: what it is for, who it is for, and what a first version should and should not include.">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
          <div className="mb-3 flex items-center gap-2 text-label-s text-ink-secondary">Product vision <EvidenceTag kind="assumption" /></div>
          <p className="font-display text-display-m">{VISION}</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-6">
          <div className="mb-3 flex items-center justify-between"><h3 className="text-h4">Primary user</h3><EvidenceTag kind="assumption" /></div>
          <p className="text-body-s text-ink-secondary">Proto-persona from the concept, not from research.</p>
          <ul className="mt-3 flex flex-col gap-2 text-body-s">
            {['Urban adult in India, about 22–40', 'Cares about sustainability, not an expert', 'Has a regular commute', 'Pays or shares an electricity bill', 'Comfortable with English and apps'].map((t) => <li key={t} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" aria-hidden />{t}</li>)}
          </ul>
          <p className="mt-3 text-caption text-ink-secondary">Secondary user for the MVP: none. A household layer is deferred.</p>
        </div>
      </div>

      <div className="mt-14">
        <SubHead>The core loop</SubHead>
        <ol className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
          {LOOP.map((l, i) => (
            <li key={l.step} className="flex flex-1 flex-col items-center gap-2 md:flex-row">
              <div className="w-full flex-1 rounded-lg border border-line bg-surface p-4 text-center">
                <div className="text-label-s text-ink-placeholder">0{i + 1}</div><div className="text-h4">{l.step}</div><div className="text-body-s text-ink-secondary">{l.text}</div>
              </div>
              {i < LOOP.length - 1 && <ArrowRight className="h-5 w-5 shrink-0 rotate-90 text-ink-placeholder md:rotate-0" aria-hidden />}
            </li>
          ))}
        </ol>
        <p className="mt-3 flex items-center gap-2 text-body-s text-ink-secondary"><RotateCcw className="h-4 w-4" aria-hidden />Repeats weekly. The audit found most of the current product sits in “log” and “see”; “understand” and “act” are thinner.</p>
      </div>

      <div className="mt-14">
        <SubHead right={<EvidenceTag kind="expected" />}>MVP definition</SubHead>
        <p className="max-w-3xl rounded-lg border border-brand bg-brand-subtle p-5 text-body-l">{MVP_DEFINITION}</p>
      </div>

      <div className="mt-14">
        <SubHead>Feature prioritisation (MoSCoW, proposed)</SubHead>
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {MOSCOW.map((m) => (
            <li key={m.key} className={cn('rounded-lg border p-4', m.tone)}>
              <h4 className="mb-3 text-h4">{m.title}</h4>
              <ul className="flex flex-col gap-2 text-body-s">{m.items.map((i) => <li key={i} className="rounded-sm bg-surface/80 px-3 py-2">{i}</li>)}</ul>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-caption text-ink-secondary">A proposal to validate, not a verdict. Several of these features already exist in the build; the question is whether they belong in a first version.</p>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SubHead right={<EvidenceTag kind="heuristic" />}>What I would do with today’s features</SubHead>
          <ul className="divide-y divide-line-subtle rounded-lg border border-line bg-surface">
            {VERDICTS.map((v) => <li key={v.feature} className="flex items-center justify-between gap-3 px-4 py-3 text-body-s"><span>{v.feature}</span><Badge variant={v.tone}>{v.verdict}</Badge></li>)}
          </ul>
        </div>
        <div>
          <SubHead right={<EvidenceTag kind="assumption" />}>Value against effort</SubHead>
          <ScatterMatrix items={PRIORITY_ITEMS} xLabel="Effort (low → high)" yLabel="Hypothesised user value" quad={['Do first', 'Plan carefully', 'Fill-in', 'Avoid for now']} highlight="tl"
            ariaLabel="Priority matrix. Quick-start estimate, repeat-last and separating sample data are high value and low effort."
            note="Positions are my judgements. They set an order to test, not a final roadmap." />
        </div>
      </div>
    </SectionShell>
  );
}
