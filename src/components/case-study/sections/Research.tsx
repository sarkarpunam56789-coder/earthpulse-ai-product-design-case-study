import { Check, ChevronDown, Minus } from 'lucide-react';
import { ASSUMPTIONS, CASE, COMPARE_DIMENSIONS, COMPETITORS, EARTHPULSE_COLUMN, INTERVIEW_QS, LADDER, NEEDS, RESEARCH_ACTIVITIES, SCHEDULE } from '../../../data/caseStudy';
import { cn } from '../../../lib/cn';
import { Badge } from '../../ui/Badge';
import { Callout, EvidenceTag, ScatterMatrix, SectionShell, SubHead } from '../primitives';

const STEPS = ['Observation', 'Pattern', 'Insight', 'Design opportunity'];

export function Research() {
  const r = CASE.research;
  const none = r.interviewsCompleted + r.usabilitySessionsCompleted === 0;
  const reached = [true, true, r.competitorsAnalysed > 0, !none, CASE.findings.length > 0];
  const maxH = Math.max(...SCHEDULE.map((s) => s.h));
  return (
    <SectionShell id="research" n="03" title="Research" tags={['assumption', 'planned', 'secondary', 'validated']}
      summary="What I plan to learn, how, and what I can and cannot claim. No interviews, quotes or statistics are invented.">
      {none ? (
        <Callout kind="warning" title="Research status: planned, not yet done">
          {r.interviewsCompleted} interviews and {r.usabilitySessionsCompleted} usability sessions completed. {r.participantsPlanned} participant planned, online. Everything below is an assumption, a plan or a template.
        </Callout>
      ) : (
        <Callout kind="success" title="Research in progress">{r.interviewsCompleted} interviews and {r.usabilitySessionsCompleted} usability sessions completed. Findings appear below with their evidence.</Callout>
      )}

      <div className="mt-12">
        <SubHead>The evidence ladder</SubHead>
        <ol className="grid gap-3 md:grid-cols-5">
          {LADDER.map((l, i) => (
            <li key={l.title} className={cn('relative rounded-lg border p-4', reached[i] ? 'border-brand bg-brand-subtle' : 'border-dashed border-line-strong bg-surface')} style={{ marginTop: `${(4 - i) * 0}px` }}>
              <div className="mb-2 flex items-center justify-between"><EvidenceTag kind={l.kind} />{reached[i] ? <Check className="h-4 w-4 text-brand" aria-label="Reached" /> : <Minus className="h-4 w-4 text-ink-placeholder" aria-label="Not yet reached" />}</div>
              <div className="text-label-m">{l.title}</div>
              <p className="mt-1 text-caption text-ink-secondary">{l.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-caption text-ink-secondary">The case study states which rung every claim stands on. With one participant I can reach “primary, n = 1” and no higher.</p>
      </div>

      <div className="mt-14">
        <SubHead right={<EvidenceTag kind="assumption" />}>Assumptions to test first</SubHead>
        <ScatterMatrix items={ASSUMPTIONS} xLabel="Uncertainty (low → high)" yLabel="Impact if wrong" quad={['Important, fairly known', 'Test first', 'Park', 'Watch']} highlight="tr"
          ariaLabel="Assumption risk matrix. The most uncertain and most important assumptions are A1, A2, A9, A3 and A10." note="Positions are my judgements. A1 (people will keep logging manually) is the riskiest bet in the product." />
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <div>
          <SubHead right={<EvidenceTag kind="planned" />}>Research plan</SubHead>
          <ul className="flex flex-col gap-3">
            {RESEARCH_ACTIVITIES.map((a) => (
              <li key={a.n} className="flex gap-4 rounded-lg border border-line bg-surface p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-subtle text-label-m text-brand-700">{a.n}</span>
                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-label-l">{a.title}</span><EvidenceTag kind={a.evidence} /></div><p className="text-body-s text-ink-secondary">{a.detail}</p></div>
                <span className="shrink-0 text-label-m text-ink-secondary">{a.hours} h</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SubHead>Two working days</SubHead>
          {['Day 1', 'Day 2'].map((d) => (
            <div key={d} className="mb-5">
              <div className="mb-2 flex items-center justify-between text-label-m"><span>{d}</span><span className="text-ink-secondary">{SCHEDULE.filter((s) => s.day === d).reduce((x, y) => x + y.h, 0)} h</span></div>
              <ul className="flex flex-col gap-2">
                {SCHEDULE.filter((s) => s.day === d).map((s) => (
                  <li key={s.block} className="grid grid-cols-[1fr_auto] items-center gap-x-3 text-body-s">
                    <span>{s.block}</span><span className="text-ink-secondary">{s.h} h</span>
                    <div className="col-span-2 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-brand" style={{ width: `${(s.h / maxH) * 100}%` }} /></div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <SubHead right={<Badge variant="neutral">{r.competitorsAnalysed} of {COMPETITORS.length} analysed</Badge>}>Competitor scan</SubHead>
        <div className="overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full min-w-[820px] text-left text-body-s">
            <caption className="sr-only">Comparison of EarthPulse AI with four products. Competitor cells are empty until analysed.</caption>
            <thead className="bg-subtle align-top">
              <tr>
                <th scope="col" className="w-40 px-4 py-3 text-label-m">Dimension</th>
                <th scope="col" className="px-4 py-3"><div className="text-label-m">EarthPulse AI</div><div className="text-caption font-normal text-ink-secondary">audited from code</div></th>
                {COMPETITORS.map((c) => <th scope="col" key={c.name} className="px-4 py-3"><div className="text-label-m">{c.name}</div><div className="text-caption font-normal text-ink-secondary">{c.note}</div></th>)}
              </tr>
            </thead>
            <tbody>
              {COMPARE_DIMENSIONS.map((d) => (
                <tr key={d} className="border-t border-line-subtle">
                  <th scope="row" className="px-4 py-3 text-label-m">{d}</th>
                  <td className="px-4 py-3">{EARTHPULSE_COLUMN[d]}</td>
                  {COMPETITORS.map((c) => <td key={c.name} className="px-4 py-3 text-ink-placeholder">{c.status}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-caption text-ink-secondary">Competitor names came from a web search and public descriptions. I have not used them yet, so their columns stay empty rather than guessed.</p>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <div>
          <SubHead right={<EvidenceTag kind="assumption" />}>Hypothesised user needs</SubHead>
          <ul className="flex flex-wrap gap-2">{NEEDS.map((n, i) => <li key={n} className="rounded-full border border-line bg-surface px-3 py-1.5 text-body-s"><span className="mr-1.5 text-label-s text-ink-placeholder">N{i + 1}</span>{n}</li>)}</ul>
        </div>
        <div>
          <SubHead right={<EvidenceTag kind="planned" />}>Interview guide</SubHead>
          <ol className="divide-y divide-line-subtle rounded-lg border border-line bg-surface">
            {INTERVIEW_QS.map((q, i) => (
              <li key={i}>
                <details className="group px-4 py-3">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-body-s"><span><span className="mr-2 text-label-s text-ink-placeholder">Q{i + 1}</span>{q.q}</span><ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-ink-secondary transition-transform group-open:rotate-180" aria-hidden /></summary>
                  <p className="mt-2 text-caption text-ink-secondary">Tests: {q.tests}</p>
                </details>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-14">
        <SubHead right={CASE.findings.length ? <EvidenceTag kind="validated" /> : <Badge variant="neutral">Template, not data</Badge>}>From observation to opportunity</SubHead>
        {CASE.findings.length === 0 ? (
          <>
            <ol className="grid gap-3 md:grid-cols-4">
              {STEPS.map((s, i) => (
                <li key={s} className="rounded-lg border border-dashed border-line-strong bg-surface p-4">
                  <div className="text-label-s text-ink-placeholder">Step {i + 1}</div><div className="text-label-l">{s}</div>
                  <p className="mt-1 text-caption text-ink-secondary">{['What a participant did or said, in their own words.', 'The same thing seen in more than one place.', 'Why it happens, in one sentence.', 'What the design could do about it.'][i]}</p>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-caption text-ink-secondary">Filled in from my own sessions once they exist. Until then this is the method, not a result.</p>
          </>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {CASE.findings.map((f) => (
              <li key={f.id} className="rounded-lg border border-success-border bg-surface p-4 text-body-s">
                <dl className="grid gap-2">{[['Observation', f.observation], ['Pattern', f.pattern], ['Insight', f.insight], ['Opportunity', f.opportunity]].map(([k, v]) => <div key={k}><dt className="text-label-s text-ink-secondary">{k}</dt><dd>{v}</dd></div>)}</dl>
                <p className="mt-2 text-caption text-ink-secondary">Evidence: {f.evidence}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SectionShell>
  );
}
