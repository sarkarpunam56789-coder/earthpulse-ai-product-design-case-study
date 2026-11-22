import { Briefcase, Cpu, Database, LucideIcon, Sparkles } from 'lucide-react';
import { CONSTRAINTS, TRADEOFFS } from '../../../data/caseStudy';
import { SectionShell, SubHead } from '../primitives';

const ICONS: Record<string, LucideIcon> = { cpu: Cpu, sparkles: Sparkles, database: Database, briefcase: Briefcase };

export function Constraints() {
  return (
    <SectionShell id="constraints" n="02" title="System constraints" tone="surface" tags={['built', 'assumption']}
      summary="What the product can and cannot do today, and the trade-offs I chose because of it.">
      <div className="grid gap-4 md:grid-cols-2">
        {CONSTRAINTS.map((c) => {
          const Icon = ICONS[c.icon];
          return (
            <article key={c.key} className="flex flex-col rounded-lg border border-line bg-page p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-md bg-brand-subtle"><Icon className="h-5 w-5 text-brand" aria-hidden /></span><h3 className="text-h3">{c.title}</h3></div>
              <ul className="flex flex-1 flex-col gap-2 text-body-s">
                {c.items.map((i) => <li key={i} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-placeholder" aria-hidden />{i}</li>)}
              </ul>
              <div className="mt-4 rounded-md bg-brand-subtle p-3 text-body-s"><span className="text-label-s text-brand-700">Design response</span><br />{c.response}</div>
            </article>
          );
        })}
      </div>

      <div className="mt-14">
        <SubHead>Design trade-offs</SubHead>
        <p className="-mt-2 mb-6 max-w-2xl text-body-s text-ink-secondary">Each bar shows where the current build sits between two goods. The positions are my design judgements, not measurements.</p>
        <ul className="grid gap-4 lg:grid-cols-2">
          {TRADEOFFS.map((t) => (
            <li key={t.left} className="rounded-lg border border-line bg-page p-5">
              <div className="mb-3 flex justify-between text-label-m"><span>{t.left}</span><span>{t.right}</span></div>
              <div className="relative h-2 rounded-full bg-muted" role="img" aria-label={`${t.left} versus ${t.right}: the build leans ${t.pos > 50 ? 'towards ' + t.right : 'towards ' + t.left}`}>
                <div className="absolute inset-y-0 left-0 rounded-full bg-brand-200" style={{ width: `${t.pos}%` }} />
                <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-brand shadow-elev-1" style={{ left: `${t.pos}%` }} />
              </div>
              <dl className="mt-4 grid gap-1 text-body-s">
                <div className="flex gap-2"><dt className="w-14 shrink-0 text-ink-secondary">Chose</dt><dd>{t.chose}</dd></div>
                <div className="flex gap-2"><dt className="w-14 shrink-0 text-ink-secondary">Risk</dt><dd>{t.risk}</dd></div>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
