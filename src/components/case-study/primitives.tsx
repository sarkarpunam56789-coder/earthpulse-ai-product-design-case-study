import { ReactNode } from 'react';
import { AlertTriangle, ArrowDown, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Badge, BadgeVariant } from '../ui/Badge';
import { EvidenceKind, FlowNode } from '../../data/caseStudy';

export const TAGS: Record<EvidenceKind, { label: string; variant: BadgeVariant; def: string }> = {
  assumption: { label: 'Assumption', variant: 'warning', def: 'Believed at concept stage. Not tested.' },
  heuristic: { label: 'Heuristic finding', variant: 'info', def: 'Found by inspecting the product. Not proven with users.' },
  secondary: { label: 'Secondary source', variant: 'neutral', def: 'Other people’s published work or products I analysed.' },
  planned: { label: 'Planned', variant: 'neutral', def: 'Part of the research plan. Not done yet.' },
  expected: { label: 'Expected, not measured', variant: 'brand', def: 'A hypothesis about the outcome. Not a result.' },
  built: { label: 'Built', variant: 'success', def: 'Exists in the working product.' },
  validated: { label: 'Validated by users', variant: 'success', def: 'Observed in my own research, with evidence.' },
};

export function EvidenceTag({ kind, className }: { kind: EvidenceKind; className?: string }) {
  const t = TAGS[kind];
  return <Badge variant={t.variant} className={className}>{t.label}</Badge>;
}

export function EvidenceLegend() {
  return (
    <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
      {(Object.keys(TAGS) as EvidenceKind[]).map((k) => (
        <div key={k} className="flex flex-col gap-1"><dt><EvidenceTag kind={k} /></dt><dd className="text-body-s text-ink-secondary">{TAGS[k].def}</dd></div>
      ))}
    </dl>
  );
}

const tones = {
  page: 'bg-page',
  surface: 'border-y border-line-subtle bg-surface',
  subtle: 'border-y border-line-subtle bg-subtle',
} as const;

export function SectionShell({ id, n, title, summary, tags, tone = 'page', children }: {
  id: string; n: string; title: string; summary: string; tags?: EvidenceKind[]; tone?: keyof typeof tones; children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={cn('scroll-mt-32', tones[tone])}>
      <div className="mx-auto max-w-site px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <header className="mb-10 grid gap-3 lg:mb-12 lg:grid-cols-[120px_1fr] lg:gap-8">
          <div aria-hidden className="font-display text-display-xl leading-none text-brand-200">{n}</div>
          <div>
            <h2 id={`${id}-h`} className="font-display text-display-m sm:text-display-l">{title}</h2>
            <p className="mt-3 max-w-2xl text-body-l text-ink-secondary">{summary}</p>
            {tags && <div className="mt-4 flex flex-wrap gap-2" aria-label="Evidence types in this section">{tags.map((k) => <EvidenceTag key={k} kind={k} />)}</div>}
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}

export function Callout({ kind = 'info', title, children }: { kind?: 'info' | 'warning' | 'success'; title: string; children: ReactNode }) {
  const c = { info: 'border-info-border bg-info-bg', warning: 'border-warning-border bg-warning-bg', success: 'border-success-border bg-success-bg' }[kind];
  return (
    <div className={cn('rounded-lg border p-4 sm:p-5', c)}>
      <div className="text-label-l">{title}</div>
      <div className="mt-1 text-body-s text-ink-secondary">{children}</div>
    </div>
  );
}

export function SubHead({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return <div className="mb-4 flex items-center justify-between gap-3"><h3 className="text-h3">{children}</h3>{right}</div>;
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="text-metric-l">{value}</div>
      <div className="text-body-s text-ink-secondary">{label}</div>
    </div>
  );
}

/* ---------- Flow diagram ---------- */
function NodeBox({ n }: { n: FlowNode }) {
  const base = 'flex min-h-[56px] w-full items-center justify-center px-3 py-2 text-center text-label-s';
  if (n.kind === 'start') return <div className={cn(base, 'rounded-full bg-inverse text-ink-inverse')}>{n.label}</div>;
  if (n.kind === 'end') return <div className={cn(base, 'rounded-full bg-brand text-white')}>{n.label}</div>;
  if (n.kind === 'decision')
    return <div className={cn(base, 'bg-warning-bg text-warning-fg')} style={{ clipPath: 'polygon(12% 0,88% 0,100% 50%,88% 100%,12% 100%,0 50%)' }}><span className="px-3">{n.label}</span></div>;
  return <div className={cn(base, 'rounded-md border border-line bg-surface text-ink')}>{n.label}</div>;
}

export function FlowDiagram({ nodes, label }: { nodes: FlowNode[]; label: string }) {
  return (
    <ol aria-label={label} className="flex flex-col items-center md:flex-row md:items-start md:overflow-x-auto md:pb-3">
      {nodes.map((n, i) => (
        <li key={i} className="flex w-full max-w-[220px] flex-col items-center md:w-auto md:max-w-none md:flex-row md:items-start">
          <div className="flex w-full flex-col items-center gap-2 md:w-[128px]">
            <NodeBox n={n} />
            {n.friction && (
              <span className="inline-flex items-start gap-1 rounded-sm border border-danger-border bg-danger-bg px-2 py-1 text-caption text-danger-fg">
                <AlertTriangle className="mt-px h-3 w-3 shrink-0" aria-hidden /><span><span className="sr-only">Potential friction: </span>{n.friction}</span>
              </span>
            )}
          </div>
          {i < nodes.length - 1 && (
            <span className="my-1.5 text-ink-placeholder md:mx-1 md:mt-4 md:my-0" aria-hidden>
              <ArrowRight className="hidden h-5 w-5 md:block" /><ArrowDown className="h-5 w-5 md:hidden" />
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

/* ---------- Scatter matrix ---------- */
export function ScatterMatrix({ items, xLabel, yLabel, quad, highlight, ariaLabel, note }: {
  items: { id: string; text: string; x: number; y: number }[]; xLabel: string; yLabel: string;
  quad: [string, string, string, string]; highlight: 'tl' | 'tr'; ariaLabel: string; note: string;
}) {
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <div className="flex gap-2">
          <div className="flex w-5 items-center justify-center text-caption text-ink-secondary" aria-hidden><span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{yLabel}</span></div>
          <div className="min-w-0 flex-1">
            <div role="img" aria-label={ariaLabel} className="relative aspect-square w-full overflow-hidden rounded-lg border border-line bg-surface">
              <div className={cn('absolute h-1/2 w-1/2 bg-brand-subtle', highlight === 'tr' ? 'right-0 top-0' : 'left-0 top-0')} />
              <div className="absolute inset-x-0 top-1/2 h-px bg-line" /><div className="absolute inset-y-0 left-1/2 w-px bg-line" />
              <span className="absolute left-2 top-2 max-w-[44%] text-caption text-ink-secondary">{quad[0]}</span>
              <span className="absolute right-2 top-2 max-w-[44%] text-right text-caption text-ink-secondary">{quad[1]}</span>
              <span className="absolute bottom-2 left-2 max-w-[44%] text-caption text-ink-secondary">{quad[2]}</span>
              <span className="absolute bottom-2 right-2 max-w-[44%] text-right text-caption text-ink-secondary">{quad[3]}</span>
              {items.map((i) => (
                <span key={i.id} className="absolute grid h-7 w-7 -translate-x-1/2 translate-y-1/2 place-items-center rounded-full bg-brand text-[11px] font-semibold text-white shadow-elev-1" style={{ left: `${i.x}%`, bottom: `${i.y}%` }}>{i.id.replace(/^[A-Z]/, '')}</span>
              ))}
            </div>
            <div className="mt-1 text-center text-caption text-ink-secondary" aria-hidden>{xLabel}</div>
          </div>
        </div>
        <p className="mt-3 text-caption text-ink-secondary">{note}</p>
      </div>
      <ol className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-1" aria-label="Key to the chart">
        {items.map((i) => (
          <li key={i.id} className="flex items-start gap-2 text-body-s"><span className="mt-0.5 grid h-5 min-w-[28px] place-items-center rounded-full bg-brand-subtle px-1 text-label-s text-brand-700">{i.id}</span><span>{i.text}</span></li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- Device frames ---------- */
export function BrowserFrame({ url = 'earthpulse-ai.app/app', children, className }: { url?: string; children: ReactNode; className?: string }) {
  return (
    <figure className={cn('overflow-hidden rounded-xl border border-line bg-surface shadow-elev-2', className)}>
      <div className="flex items-center gap-3 border-b border-line-subtle bg-subtle px-4 py-2.5" aria-hidden>
        <span className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-line" /><i className="h-2.5 w-2.5 rounded-full bg-line" /><i className="h-2.5 w-2.5 rounded-full bg-line" /></span>
        <span className="truncate rounded-sm bg-surface px-3 py-0.5 text-caption text-ink-secondary">{url}</span>
      </div>
      <div className="bg-page">{children}</div>
    </figure>
  );
}

export function PhoneFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <figure className="mx-auto w-full max-w-[300px]">
      <div className="overflow-hidden rounded-[28px] border-[6px] border-inverse bg-page shadow-elev-3">
        <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-line" aria-hidden />
        <div className="h-[540px] overflow-y-auto p-3 scrollbar-none">{children}</div>
      </div>
      <figcaption className="mt-2 text-center text-caption text-ink-secondary">{label}</figcaption>
    </figure>
  );
}

/* ---------- Low-fidelity wireframe pieces ---------- */
export const Wf = {
  Screen: ({ children, title }: { children: ReactNode; title: string }) => (
    <figure>
      <div className="flex h-[230px] flex-col gap-2 rounded-md border-2 border-dashed border-line-strong bg-surface p-3" aria-hidden>{children}</div>
      <figcaption className="mt-2 text-caption text-ink-secondary">{title}</figcaption>
    </figure>
  ),
  Bar: ({ w = '100%', h = 8 }: { w?: string; h?: number }) => <div className="rounded-full bg-muted" style={{ width: w, height: h }} />,
  Box: ({ label, h = 40, accent }: { label?: string; h?: number; accent?: boolean }) => (
    <div className={cn('grid place-items-center rounded-sm border border-line text-[10px] text-ink-placeholder', accent ? 'bg-brand-subtle' : 'bg-subtle')} style={{ height: h }}>{label}</div>
  ),
  Btn: ({ label }: { label: string }) => <div className="mt-auto grid h-7 place-items-center rounded-sm bg-brand text-[10px] text-white">{label}</div>,
};
