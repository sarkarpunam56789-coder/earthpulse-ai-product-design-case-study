import { CASE, FACTS, HMWS, PAINS_ASSUMED, PAINS_PREDICTED, PROBLEM_STATEMENT } from '../../../data/caseStudy';
import { cn } from '../../../lib/cn';
import { Badge } from '../../ui/Badge';
import { EvidenceTag, SectionShell, Stat, SubHead } from '../primitives';

function Severity({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`My severity rating ${n} of 4`}>
      {[1, 2, 3, 4].map((i) => <span key={i} className={cn('h-2 w-3 rounded-xs', i <= n ? 'bg-danger' : 'bg-muted')} />)}
    </span>
  );
}

export function ProblemFraming() {
  const validated = CASE.findings.length;
  return (
    <SectionShell id="problem" n="01" title="Problem framing" tags={['assumption', 'heuristic']}
      summary="A problem worth solving, stated honestly: what I assume, what I found by inspection, and what I still have to learn from people.">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <figure className="flex flex-col justify-between rounded-xl bg-inverse p-6 text-ink-inverse sm:p-8">
          <div className="mb-6 flex flex-wrap items-center gap-2"><span className="text-label-s text-ink-soft">Draft problem statement v0.1</span><EvidenceTag kind="assumption" /></div>
          <blockquote className="font-display text-display-m text-ink-inverse">{PROBLEM_STATEMENT}</blockquote>
          <figcaption className="mt-6 text-body-s text-ink-soft">Every clause is an assumption. It will be rewritten from observations after research.</figcaption>
        </figure>
        <div className="grid grid-cols-2 content-start gap-4" aria-label="Project facts">
          {FACTS.map((f) => <Stat key={f.label} {...f} />)}
        </div>
      </div>

      <div className="mt-14">
        <SubHead>Pain points, sorted by how much I actually know</SubHead>
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-lg border border-warning-border bg-warning-bg/50 p-5">
            <div className="mb-3 flex items-center justify-between"><h4 className="text-h4">Assumed</h4><EvidenceTag kind="assumption" /></div>
            <ul className="flex flex-col gap-2.5">{PAINS_ASSUMED.map((p) => <li key={p.id} className="flex gap-2 text-body-s"><span className="shrink-0 text-label-s text-warning-fg">{p.id}</span>{p.text}</li>)}</ul>
          </div>
          <div className="rounded-lg border border-info-border bg-info-bg/50 p-5">
            <div className="mb-3 flex items-center justify-between"><h4 className="text-h4">Predicted in the product</h4><EvidenceTag kind="heuristic" /></div>
            <ul className="flex flex-col gap-3">{PAINS_PREDICTED.map((p) => (
              <li key={p.id} className="text-body-s"><div className="flex items-start justify-between gap-3"><span><span className="mr-2 text-label-s text-info-fg">{p.id}</span>{p.text}</span><Severity n={p.sev} /></div><div className="text-caption text-ink-secondary">From audit {p.ref}</div></li>
            ))}</ul>
          </div>
          <div className="flex flex-col rounded-lg border border-dashed border-line-strong bg-surface p-5">
            <div className="mb-3 flex items-center justify-between"><h4 className="text-h4">Validated by users</h4><Badge variant={validated ? 'success' : 'neutral'}>{validated} so far</Badge></div>
            {validated === 0
              ? <p className="text-body-s text-ink-secondary">None yet, on purpose. A pain point moves here only when I hold evidence from my own sessions and can say how many participants raised it.</p>
              : <ul className="flex flex-col gap-2 text-body-s">{CASE.findings.map((f) => <li key={f.id}>{f.insight}</li>)}</ul>}
          </div>
        </div>
        <p className="mt-3 text-caption text-ink-secondary">Heuristic findings say the product is likely to cause friction. They do not prove people have the underlying problem. Severity is my rating, 1 (minor) to 4 (serious).</p>
      </div>

      <div className="mt-14">
        <SubHead right={<EvidenceTag kind="assumption" />}>How might we…</SubHead>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {HMWS.map((h, i) => (
            <li key={i} className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4">
              <div className="flex items-center justify-between"><Badge variant="brand">{h.theme}</Badge><span className="text-caption text-ink-placeholder">{h.ref}</span></div>
              <p className="text-body-s">{h.q}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-caption text-ink-secondary">Provisional. I will keep one or two as the spine of this story once research shapes them.</p>
      </div>
    </SectionShell>
  );
}
