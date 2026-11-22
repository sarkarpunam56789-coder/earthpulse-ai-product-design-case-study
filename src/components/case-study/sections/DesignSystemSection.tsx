import { useState } from 'react';
import { Cloud, Droplets, ExternalLink, Leaf, Plus } from 'lucide-react';
import { CASE, CONTRAST_PAIRS, DS_GAPS, PRINCIPLES, SPACING, SWATCHES, TYPE_SCALE } from '../../../data/caseStudy';
import { cn } from '../../../lib/cn';
import { Alert } from '../../ui/Alert';
import { Badge, BadgeVariant } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Checkbox, Chip, RadioGroup, SelectField, TextField, Toggle } from '../../ui/Fields';
import { OptionCard } from '../../ui/OptionCard';
import { Progress } from '../../ui/Progress';
import { Segmented } from '../../ui/Segmented';
import { BarChart } from '../../charts/BarChart';
import { Donut, DonutLegend } from '../../charts/Donut';
import { MetricCard } from '../../features/MetricCard';
import { EvidenceTag, SectionShell, SubHead } from '../primitives';

const lum = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
const grade = (r: number): { label: string; v: BadgeVariant } => (r >= 7 ? { label: 'AAA', v: 'success' } : r >= 4.5 ? { label: 'AA', v: 'success' } : r >= 3 ? { label: 'Large text only', v: 'warning' } : { label: 'Fails', v: 'error' });
const STATUS: Record<string, BadgeVariant> = { Met: 'success', Partly: 'warning', 'Not yet': 'error' };

function Specimen({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return <div className={cn('rounded-lg border border-line bg-page p-5', className)}><div className="mb-4 text-label-s text-ink-secondary">{title}</div>{children}</div>;
}

function Components() {
  const [chip, setChip] = useState('Metro');
  const [cb, setCb] = useState(true);
  const [radio, setRadio] = useState('Sometimes');
  const [tg, setTg] = useState(true);
  const [sel, setSel] = useState('Bengaluru');
  const [seg, setSeg] = useState<'week' | 'month'>('week');
  const [card, setCard] = useState('public');
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Specimen title="Buttons: 4 variants, 3 sizes">
        <div className="flex flex-wrap items-center gap-2"><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost</Button><Button variant="danger">Danger</Button></div>
        <div className="mt-3 flex flex-wrap items-center gap-2"><Button size="sm">Small</Button><Button size="md" iconLeft={Plus}>Medium</Button><Button size="lg">Large</Button><Button disabled>Disabled</Button></div>
      </Specimen>
      <Specimen title="Chips, badges, segmented control">
        <div className="flex flex-wrap gap-2">{['Walk', 'Metro', 'Car'].map((c) => <Chip key={c} selected={chip === c} onClick={() => setChip(c)}>{c}</Chip>)}<Chip disabled>Disabled</Chip></div>
        <div className="mt-3 flex flex-wrap gap-2"><Badge variant="success" dot>On track</Badge><Badge variant="warning">Ahead of pace</Badge><Badge variant="error">Over limit</Badge><Badge variant="info">Month to date</Badge><Badge>Sample data</Badge></div>
        <div className="mt-3"><Segmented<'week' | 'month'> label="Example range" value={seg} onChange={setSeg} options={[{ value: 'week', label: 'Weekly' }, { value: 'month', label: 'Monthly' }]} /></div>
      </Specimen>
      <Specimen title="Form fields">
        <div className="flex flex-col gap-3">
          <TextField label="Distance (km)" placeholder="e.g. 8.4" defaultValue="" helper="Helper text sits below the field" />
          <TextField label="Monthly electricity (kWh)" defaultValue="-20" error="Enter 0 or more" />
          <SelectField label="City" value={sel} onChange={setSel} options={['Bengaluru', 'Mumbai', 'Pune'].map((x) => ({ value: x, label: x }))} />
        </div>
      </Specimen>
      <Specimen title="Selection controls">
        <div className="flex flex-col gap-3">
          <Checkbox label="I use public transport" checked={cb} onChange={setCb} />
          <RadioGroup legend="Air conditioner use" name="cs-ac" inline value={radio} onChange={setRadio} options={['No', 'Sometimes', 'Most days'].map((x) => ({ value: x, label: x }))} />
          <Toggle label="Weekly summary email" checked={tg} onChange={setTg} />
        </div>
      </Specimen>
      <Specimen title="Option card (onboarding)">
        <div className="flex flex-col gap-2">
          <OptionCard icon={Leaf} title="Public transport" description="Metro, bus or local train" selected={card === 'public'} onClick={() => setCard('public')} />
          <OptionCard icon={Cloud} title="Car" description="Own or shared car" selected={card === 'car'} onClick={() => setCard('car')} />
        </div>
      </Specimen>
      <Specimen title="Progress and alerts">
        <div className="flex flex-col gap-3">
          <Progress value={52} label="Carbon goal" /><Progress value={58} tone="water" label="Water goal" /><Progress value={42} tone="waste" label="Waste goal" />
          <Alert variant="info">Estimates use illustrative factors.</Alert>
        </div>
      </Specimen>
      <Specimen title="Metric card" className="md:col-span-1">
        <MetricCard icon={Droplets} label="Water use" value="612" unit="L this week" trend={{ text: '4% higher', kind: 'worse', dir: 'up' }} caption="than same days last week" progress={{ pct: 58, tone: 'water', caption: '58% of your 1,050 L weekly goal' }} />
      </Specimen>
      <Specimen title="Charts (sample data)" className="md:col-span-1 xl:col-span-2">
        <div className="grid gap-5 lg:grid-cols-2">
          <BarChart height={130} unit="kg CO₂e" ticks={[9, 6, 3, 0]} ariaLabel="Sample weekly bars" data={[{ label: 'Mon', value: 6.4 }, { label: 'Tue', value: 7.2 }, { label: 'Wed', value: 6.9 }, { label: 'Thu', value: 5.4, highlight: true }, { label: 'Fri', value: null }]} />
          <div className="flex flex-wrap items-center gap-4"><Donut size={120} centerValue="38%" centerLabel="Transport" ariaLabel="Sample category donut" data={[{ label: 'Transport', value: 38, color: '#16783C' }, { label: 'Electricity', value: 27, color: '#F5A524' }, { label: 'Food', value: 22, color: '#8A6BC2' }, { label: 'Shopping', value: 13, color: '#D9585F' }]} />
            <DonutLegend data={[{ label: 'Transport', value: 38, color: '#16783C' }, { label: 'Electricity', value: 27, color: '#F5A524' }, { label: 'Food', value: 22, color: '#8A6BC2' }, { label: 'Shopping', value: 13, color: '#D9585F' }]} /></div>
        </div>
      </Specimen>
    </div>
  );
}

export function DesignSystemSection() {
  return (
    <SectionShell id="design-system" n="06" title="Design system" tone="surface" tags={['built', 'heuristic']}
      summary="A calm, honest visual language for numbers people may not fully trust. Everything below is rendered from the real product components.">
      <div>
        <SubHead>Design principles</SubHead>
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} className="flex flex-col gap-2 rounded-lg border border-line bg-page p-4">
              <div className="flex items-center justify-between"><span className="font-display text-display-m text-brand-300">{i + 1}</span><Badge variant={STATUS[p.status]}>{p.status}</Badge></div>
              <h4 className="text-h4">{p.title}</h4><p className="text-body-s text-ink-secondary">{p.text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-caption text-ink-secondary">The status tags are an honest read of whether the build lives up to each principle (from the audit).</p>
      </div>

      <div className="mt-14">
        <SubHead>Colour</SubHead>
        <div className="grid gap-6 md:grid-cols-2">
          {SWATCHES.map((g) => (
            <div key={g.group}>
              <div className="mb-2 text-label-s text-ink-secondary">{g.group}</div>
              <ul className="flex flex-wrap gap-2">
                {g.items.map(([name, hex]) => (
                  <li key={name} className="w-[92px]"><div className="h-12 rounded-md border border-line" style={{ backgroundColor: hex }} aria-hidden /><div className="mt-1 text-label-s">{name}</div><div className="text-caption text-ink-secondary">{hex}</div></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[520px] text-left text-body-s">
            <caption className="sr-only">Contrast ratios computed from the design tokens</caption>
            <thead className="bg-subtle"><tr><th scope="col" className="px-4 py-2">Pair</th><th scope="col" className="px-4 py-2">Sample</th><th scope="col" className="px-4 py-2">Ratio</th><th scope="col" className="px-4 py-2">WCAG</th></tr></thead>
            <tbody>
              {CONTRAST_PAIRS.map((c) => { const r = ratio(c.fg, c.bg); const g = grade(r); return (
                <tr key={c.name} className="border-t border-line-subtle"><td className="px-4 py-2">{c.name}</td><td className="px-4 py-2"><span className="rounded-sm px-2 py-0.5 text-label-s" style={{ color: c.fg, backgroundColor: c.bg, border: '1px solid #D5DDD3' }}>Aa</span></td><td className="px-4 py-2">{r.toFixed(2)} : 1</td><td className="px-4 py-2"><Badge variant={g.v}>{g.label}</Badge></td></tr>
              ); })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-caption text-ink-secondary">Ratios are calculated live from the token values above, not typed in.</p>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <div>
          <SubHead>Typography</SubHead>
          <ul className="divide-y divide-line-subtle rounded-lg border border-line bg-page">
            {TYPE_SCALE.map((t) => (
              <li key={t.name} className="grid items-baseline gap-1 px-4 py-3 sm:grid-cols-[150px_1fr]">
                <div><div className="text-label-s">{t.name}</div><div className="text-caption text-ink-secondary">{t.spec}</div></div>
                <div className={cn(t.cls, 'truncate')}>{t.sample}</div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SubHead>Spacing, radius, elevation</SubHead>
          <div className="rounded-lg border border-line bg-page p-4">
            <ul className="flex flex-col gap-1.5">{SPACING.map((s) => <li key={s} className="flex items-center gap-3 text-caption"><span className="w-8 text-right text-ink-secondary">{s}</span><span className="h-3 rounded-xs bg-brand" style={{ width: s }} /></li>)}</ul>
            <div className="mt-5 flex flex-wrap gap-3">{[['xs', 'rounded-xs'], ['sm', 'rounded-sm'], ['md', 'rounded-md'], ['lg', 'rounded-lg'], ['xl', 'rounded-xl']].map(([n, c]) => <div key={n} className="text-center"><div className={cn('h-12 w-12 border border-line-strong bg-brand-subtle', c)} /><div className="mt-1 text-caption text-ink-secondary">{n}</div></div>)}</div>
            <div className="mt-5 flex flex-wrap gap-4">{[['1', 'shadow-elev-1'], ['2', 'shadow-elev-2'], ['3', 'shadow-elev-3']].map(([n, c]) => <div key={n} className={cn('grid h-14 w-20 place-items-center rounded-md bg-surface text-caption text-ink-secondary', c)}>Level {n}</div>)}</div>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <SubHead right={CASE.figmaUrl ? <a href={CASE.figmaUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-label-m text-brand-700 hover:underline">Open the Figma file <ExternalLink className="h-4 w-4" aria-hidden /></a> : undefined}>Components, live</SubHead>
        <Components />
      </div>

      <div className="mt-14">
        <SubHead right={<EvidenceTag kind="heuristic" />}>Inconsistencies I found</SubHead>
        <ul className="grid gap-3 sm:grid-cols-2">{DS_GAPS.map((g) => <li key={g} className="rounded-lg border border-danger-border bg-danger-bg/50 p-4 text-body-s">{g}</li>)}</ul>
        <p className="mt-3 text-caption text-ink-secondary">Showing the gaps is part of the system: it makes the next round of work obvious.</p>
      </div>
    </SectionShell>
  );
}
