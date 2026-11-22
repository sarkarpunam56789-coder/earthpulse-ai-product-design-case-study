import { X } from 'lucide-react';
import { EXPECTED, FUNNEL, METRICS, NORTH_STAR, WONT_CLAIM } from '../../../data/caseStudy';
import { Badge } from '../../ui/Badge';
import { Callout, EvidenceTag, SectionShell, SubHead } from '../primitives';

const WIDTHS = [100, 80, 60, 42, 28];

export function Impact() {
  return (
    <SectionShell id="impact" n="08" title="Impact" tone="subtle" tags={['expected', 'planned']}
      summary="What success would look like and how I would find out. There are no results here, because nothing has been measured yet.">
      <Callout kind="warning" title="No results, on purpose">Every statement below is an expectation or a measurement plan. I will only report numbers after I have collected them, and I will state how many people they came from.</Callout>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-xl border border-brand bg-surface p-6">
          <div className="mb-2 flex items-center gap-2 text-label-s text-ink-secondary">North-star metric <EvidenceTag kind="assumption" /></div>
          <p className="font-display text-display-m">{NORTH_STAR}</p>
          <p className="mt-3 text-body-s text-ink-secondary">It combines the habit (logging) with the purpose (acting). Either alone could mislead.</p>
        </div>
        <div>
          <SubHead right={<Badge variant="neutral">Shape only, no data</Badge>}>The journey I want to measure</SubHead>
          <ol className="flex flex-col gap-2" aria-label="Illustrative funnel. No numbers exist.">
            {FUNNEL.map((f, i) => (
              <li key={f} className="flex items-center justify-center rounded-md bg-brand text-label-m text-white" style={{ width: `${WIDTHS[i]}%`, minHeight: 40, opacity: 1 - i * 0.12, marginInline: 'auto' }}>{f}</li>
            ))}
          </ol>
          <p className="mt-2 text-center text-caption text-ink-secondary">The narrowing is a convention for drawing a funnel. I have no drop-off figures.</p>
        </div>
      </div>

      <div className="mt-14">
        <SubHead>Metrics and how I would measure them</SubHead>
        <div className="overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full min-w-[760px] text-left text-body-s">
            <caption className="sr-only">Goals, metrics, measurement method, target and status</caption>
            <thead className="bg-subtle"><tr>{['Goal', 'Metric', 'How', 'Target', 'Status'].map((h) => <th key={h} scope="col" className="px-4 py-3 text-label-m">{h}</th>)}</tr></thead>
            <tbody>
              {METRICS.map((m) => (
                <tr key={m.goal} className="border-t border-line-subtle align-top">
                  <th scope="row" className="px-4 py-3 text-label-m font-medium">{m.goal}</th><td className="px-4 py-3">{m.metric}</td><td className="px-4 py-3 text-ink-secondary">{m.how}</td>
                  <td className="px-4 py-3 text-ink-placeholder">Set before testing</td>
                  <td className="px-4 py-3"><Badge variant={m.status === 'Needs a live product' ? 'neutral' : 'info'}>{m.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-caption text-ink-secondary">Targets are agreed before each test so I cannot move the goalposts. With one participant I report what I observed, not rates.</p>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <SubHead right={<EvidenceTag kind="expected" />}>Expected impact</SubHead>
          <ul className="grid gap-3 sm:grid-cols-2">
            {EXPECTED.map((e) => (
              <li key={e.ref} className="rounded-lg border border-line bg-surface p-4 text-body-s"><p><span className="text-label-s text-ink-secondary">If </span>{e.if},</p><p className="mt-1"><span className="text-label-s text-ink-secondary">then </span>{e.then}.</p><p className="mt-2 text-caption text-ink-placeholder">Addresses {e.ref}</p></li>
            ))}
          </ul>
        </div>
        <div>
          <SubHead>What I will not claim</SubHead>
          <ul className="flex flex-col gap-2">{WONT_CLAIM.map((w) => <li key={w} className="flex items-start gap-2 rounded-lg border border-line bg-surface p-3 text-body-s"><X className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden />{w}</li>)}</ul>
        </div>
      </div>
    </SectionShell>
  );
}
