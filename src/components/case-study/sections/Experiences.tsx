import { useState } from 'react';
import { ArrowRight, Bike, Bus, Car, Check, Cloud, Footprints, Sparkles } from 'lucide-react';
import { EXPERIENCES } from '../../../data/caseStudy';
import { RECOMMENDATIONS } from '../../../data/content';
import { DemoButton } from '../DemoButton';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Chip, TextField } from '../../ui/Fields';
import { OptionCard } from '../../ui/OptionCard';
import { Progress } from '../../ui/Progress';
import { Tabs } from '../../ui/Tabs';
import { BarChart } from '../../charts/BarChart';
import { Donut, DonutLegend } from '../../charts/Donut';
import { ProgressRing } from '../../charts/ProgressRing';
import { StepProgress } from '../../layout/AuthLayout';
import { ActionItem } from '../../features/ActionItem';
import { InsightCard } from '../../features/InsightCard';
import { EvidenceTag, FlowDiagram, SectionShell, SubHead } from '../primitives';

const noop = () => {};
const DONUT = [{ label: 'Transport', value: 38, color: '#16783C' }, { label: 'Electricity', value: 27, color: '#F5A524' }, { label: 'Food', value: 22, color: '#8A6BC2' }, { label: 'Shopping', value: 13, color: '#D9585F' }];

function Preview({ id }: { id: string }) {
  switch (id) {
    case 'onboarding':
      return (
        <div className="mx-auto flex max-w-md flex-col gap-4">
          <StepProgress step={3} />
          <h4 className="text-h3">How do you live day to day?</h4>
          <div className="grid gap-2 sm:grid-cols-2"><OptionCard icon={Footprints} title="Walk or cycle" description="Short trips" /><OptionCard icon={Bus} title="Public transport" description="Metro or bus" selected /><OptionCard icon={Bike} title="Two-wheeler" description="Scooter or bike" /><OptionCard icon={Car} title="Car" description="Own or shared" /></div>
          <div className="flex flex-wrap gap-2"><Chip selected>Vegetarian</Chip><Chip>Eggetarian</Chip><Chip>Non-vegetarian</Chip></div>
        </div>
      );
    case 'logging':
      return (
        <div className="mx-auto flex max-w-md flex-col gap-4">
          <h4 className="text-h3">Log a trip</h4>
          <div className="flex flex-wrap gap-2"><Chip>Walk</Chip><Chip>Metro or train</Chip><Chip selected>Car</Chip></div>
          <TextField label="Distance (km)" value="10" readOnly onChange={noop} rightSlot={<span className="text-body-s text-ink-secondary">km</span>} />
          <div className="rounded-md bg-subtle p-4"><div className="flex items-center justify-between"><span className="text-label-m">Estimated impact</span><span className="text-label-l">1.8 kg CO₂e</span></div><p className="mt-1 text-caption text-ink-secondary">Estimate based on illustrative demo factors, not verified data.</p></div>
          <div className="flex justify-end gap-2"><Button variant="secondary">Cancel</Button><Button>Save activity</Button></div>
        </div>
      );
    case 'tracking':
      return (
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div><div className="mb-3 text-label-l">This week by day</div><BarChart height={140} unit="kg CO₂e" ticks={[9, 6, 3, 0]} ariaLabel="Sample weekly bars" data={[{ label: 'Mon', value: 6.4 }, { label: 'Tue', value: 7.2 }, { label: 'Wed', value: 6.9 }, { label: 'Thu', value: 5.4, highlight: true }, { label: 'Fri', value: null }, { label: 'Sat', value: null }, { label: 'Sun', value: null }]} /></div>
          <div><div className="mb-3 text-label-l">By category</div><div className="flex flex-wrap items-center gap-4"><Donut data={DONUT} size={120} centerValue="171" centerLabel="kg CO₂e" ariaLabel="Sample category donut" /><DonutLegend data={DONUT} /></div><div className="mt-4"><div className="mb-1 flex justify-between text-label-s"><span>Weekly limit</span><Badge variant="success">On pace</Badge></div><Progress value={52} label="Weekly limit" /></div></div>
        </div>
      );
    case 'copilot':
      return (
        <div className="mx-auto flex max-w-lg flex-col gap-3 text-body-s">
          <div className="ml-auto max-w-[85%] rounded-lg rounded-br-sm bg-brand px-4 py-3 text-white">How can I reduce my commute emissions?</div>
          <div className="flex gap-3"><span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-subtle"><Sparkles className="h-4 w-4 text-brand" aria-hidden /></span>
            <div><div className="rounded-lg rounded-tl-sm bg-subtle px-4 py-3">Transport is the largest share of the carbon you've logged this month. Replacing two weekday car or auto trips with the metro is the simplest change. These are estimates, not measurements.</div><p className="mt-1 text-caption text-ink-secondary">Demo reply, not from a live AI service.</p>
              <div className="mt-3 rounded-lg border border-success-border bg-brand-subtle p-4"><div className="text-label-s text-brand-700">Suggested action</div><div className="text-label-l">{RECOMMENDATIONS[0].title}</div><div className="text-label-s text-success-fg">{RECOMMENDATIONS[0].impact}</div><div className="mt-3"><Button size="sm">Add to my plan</Button></div></div></div></div>
        </div>
      );
    case 'planner':
      return (
        <div className="mx-auto grid max-w-2xl items-center gap-6 sm:grid-cols-[1fr_auto]">
          <ul className="flex flex-col gap-2 text-body-s">
            {[['Switch off the AC when leaving the room', true], ['Keep showers under 5 minutes on three days', true], ['Take the metro for the Friday commute', false]].map(([t, d]) => (
              <li key={String(t)} className="flex items-center gap-3 rounded-md border border-line bg-surface px-3 py-2.5"><span className={`grid h-6 w-6 place-items-center rounded-full border-[1.5px] ${d ? 'border-brand bg-brand' : 'border-line-strong'}`}>{d && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} aria-hidden />}</span><span className={d ? 'text-ink-secondary line-through' : ''}>{t}</span></li>
            ))}
          </ul>
          <div className="text-center"><ProgressRing value={60} label="3/5" ariaLabel="3 of 5 actions done" /><div className="mt-1 text-caption text-ink-secondary">3 of 5 done</div></div>
        </div>
      );
    default:
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <InsightCard headline="Water use is running slightly ahead of pace" body="You've used 58% of your weekly water goal with 57% of the week gone. Shorter showers and fixing a dripping tap are the quickest wins." prompt="Why is my water use above pace?" />
          <ul className="rounded-lg border border-line bg-surface px-4">{RECOMMENDATIONS.slice(1, 3).map((r, i) => <ActionItem key={r.id} suggestion={r} added={i === 1} onAdd={noop} />)}</ul>
        </div>
      );
  }
}

export function Experiences() {
  const [tab, setTab] = useState(EXPERIENCES[0].id);
  const ex = EXPERIENCES.find((e) => e.id === tab)!;
  return (
    <SectionShell id="experiences" n="07" title="Key experiences and flows" tags={['built', 'heuristic']}
      summary="The six journeys that carry the product. Red tags mark friction I predicted from the audit; none of it has been seen with real users yet.">
      <Tabs label="Key experiences" value={tab} onChange={setTab} tabs={EXPERIENCES.map((e) => ({ value: e.id, label: e.tab }))} className="mb-8" />
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><h3 className="text-h2">{ex.title}</h3><p className="mt-1 text-body-m text-ink-secondary">User goal: {ex.goal}</p></div>
          <DemoButton to={ex.route} variant="primary" iconRight={ArrowRight}>Open in the live prototype</DemoButton>
        </div>
        <div>
          <SubHead right={<EvidenceTag kind="heuristic" />}>Flow</SubHead>
          <div className="rounded-xl border border-line bg-surface p-5 sm:p-6"><FlowDiagram nodes={ex.nodes} label={`${ex.title} flow`} /></div>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <SubHead right={<EvidenceTag kind="built" />}>Key screen</SubHead>
            <Card className="bg-page"><Preview id={ex.id} /><p className="mt-4 text-caption text-ink-secondary">Rendered with the real product components and sample data. It is a static specimen, not an interactive screen.</p></Card>
          </div>
          <div>
            <SubHead>Design decisions</SubHead>
            <ul className="flex flex-col gap-3">{ex.decisions.map((d) => <li key={d} className="flex gap-3 rounded-lg border border-line bg-surface p-4 text-body-s"><Cloud className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />{d}</li>)}</ul>
            <p className="mt-3 text-caption text-ink-secondary">Reasons are design intent. Whether they work is for testing to show.</p>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
