import { ArrowRight, Cloud, Droplets, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DECISIONS, LEARNINGS, NEXT_STEPS, PAINS_PREDICTED } from '../../../data/caseStudy';
import { RECOMMENDATIONS } from '../../../data/content';
import { DemoButton } from '../DemoButton';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Chip, TextField } from '../../ui/Fields';
import { Progress } from '../../ui/Progress';
import { BarChart } from '../../charts/BarChart';
import { ProgressRing } from '../../charts/ProgressRing';
import { InsightCard } from '../../features/InsightCard';
import { MetricCard } from '../../features/MetricCard';
import { BrowserFrame, EvidenceTag, PhoneFrame, SectionShell, SubHead } from '../primitives';

const WEEK = [{ label: 'Mon', value: 6.4 }, { label: 'Tue', value: 7.2 }, { label: 'Wed', value: 6.9 }, { label: 'Thu', value: 5.4, highlight: true }, { label: 'Fri', value: null }, { label: 'Sat', value: null }, { label: 'Sun', value: null }];
const noop = () => {};

export function Solution() {
  return (
    <SectionShell id="solution" n="09" title="Solution" tone="surface" tags={['built', 'heuristic', 'planned']}
      summary="The product as it stands, how to try it, the decisions behind it, and the problems that remain. A first version to learn from, not a finished answer.">
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <DemoButton to="/app" variant="primary" size="lg" iconRight={ArrowRight}>Open the interactive prototype</DemoButton>
        <DemoButton to="/app/carbon">Trackers</DemoButton><DemoButton to="/app/copilot">Copilot</DemoButton><DemoButton to="/app/planner">Planner</DemoButton><DemoButton to="/app/simulator">Simulator</DemoButton><DemoButton to="/app/reports">Reports</DemoButton>
        <Link to="/get-started" className="inline-flex h-10 items-center rounded-md px-4 text-label-m text-brand-700 hover:bg-brand-subtle">Start from sign-up</Link>
      </div>
      <p className="mb-6 text-body-s text-ink-secondary">The prototype is the live product. It opens with clearly labelled sample data, and nothing you enter leaves your browser.</p>

      <BrowserFrame url="earthpulse-ai.app/app">
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><div className="text-h3">Good morning, Ananya</div><div className="text-body-s text-ink-secondary">Your estimated impact this week</div></div><Badge>Sample data</Badge></div>
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard icon={Cloud} label="Carbon footprint" value="25.9" unit="kg CO₂e" trend={{ text: '8% lower', kind: 'better', dir: 'down' }} caption="than last week" progress={{ pct: 52, tone: 'brand', caption: '52% of your 50 kg goal' }} />
            <MetricCard icon={Droplets} label="Water use" value="612" unit="L" trend={{ text: '4% higher', kind: 'worse', dir: 'up' }} caption="than last week" progress={{ pct: 58, tone: 'water', caption: '58% of your 1,050 L goal' }} />
            <MetricCard icon={Trash2} label="Waste generated" value="2.1" unit="kg" trend={{ text: '12% lower', kind: 'better', dir: 'down' }} caption="than last week" progress={{ pct: 42, tone: 'waste', caption: '42% of your 5 kg goal' }} />
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
            <Card><div className="mb-3 text-label-l">Daily carbon footprint</div><BarChart height={140} unit="kg CO₂e" ticks={[9, 6, 3, 0]} ariaLabel="Sample weekly bars" data={WEEK} /></Card>
            <InsightCard headline="Water use is running slightly ahead of pace" body="You've used 58% of your weekly water goal with 57% of the week gone. Shorter showers are the quickest win." prompt="Why is my water use above pace?" />
          </div>
        </div>
      </BrowserFrame>
      <p className="mt-2 text-center text-caption text-ink-secondary">Desktop dashboard, composed from the real components with sample values. A simplified view, not a pixel capture.</p>

      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        <PhoneFrame label="Dashboard on mobile">
          <div className="flex flex-col gap-3">
            <div className="text-h4">Good morning, Ananya</div>
            <Card className="p-4"><div className="flex items-center gap-3"><ProgressRing size={72} value={62} label="62" ariaLabel="Eco score 62" /><div><div className="text-label-s text-ink-secondary">Eco score (demo)</div><div className="text-label-m">Your impact is easing</div></div></div></Card>
            <MetricCard icon={Cloud} label="Carbon" value="25.9" unit="kg CO₂e" trend={{ text: '8% lower', kind: 'better', dir: 'down' }} caption="vs last week" />
            <Progress value={58} tone="water" label="Water goal" />
          </div>
        </PhoneFrame>
        <PhoneFrame label="Quick log on mobile">
          <div className="flex flex-col gap-3">
            <div className="text-h4">Log a trip</div>
            <div className="flex flex-wrap gap-1.5"><Chip>Walk</Chip><Chip selected>Metro</Chip><Chip>Car</Chip></div>
            <TextField label="Distance (km)" value="8.4" readOnly onChange={noop} />
            <div className="rounded-md bg-subtle p-3 text-body-s"><div className="flex justify-between"><span className="text-label-m">Estimated impact</span><span className="text-label-m">0.3 kg CO₂e</span></div><p className="mt-1 text-caption text-ink-secondary">Demo factors, not verified data.</p></div>
            <Button full>Save activity</Button>
          </div>
        </PhoneFrame>
        <PhoneFrame label="Copilot on mobile">
          <div className="flex flex-col gap-3 text-body-s">
            <div className="text-h4">AI Copilot</div><Badge variant="warning" dot>Demo mode</Badge>
            <div className="ml-auto max-w-[88%] rounded-lg rounded-br-sm bg-brand px-3 py-2 text-white">What should I focus on this week?</div>
            <div className="rounded-lg rounded-tl-sm bg-subtle px-3 py-2">Water is closest to its weekly limit, so that's the best place to focus. These are estimates.</div>
            <div className="rounded-lg border border-success-border bg-brand-subtle p-3"><div className="text-label-s text-brand-700">Suggested action</div><div className="text-label-m">{RECOMMENDATIONS[2].title}</div><div className="mt-2"><Button size="sm">Add to my plan</Button></div></div>
          </div>
        </PhoneFrame>
      </div>

      <div className="mt-16">
        <SubHead>Final design decisions</SubHead>
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {DECISIONS.map((d) => (
            <li key={d.title} className="flex flex-col gap-2 rounded-lg border border-line bg-page p-5">
              <div className="flex items-start justify-between gap-2"><h4 className="text-h4">{d.title}</h4><EvidenceTag kind={d.status} /></div>
              <p className="text-body-s text-ink-secondary">{d.why}</p>
              <p className="mt-auto rounded-sm bg-subtle px-3 py-2 text-caption"><span className="text-ink-secondary">Next: </span>{d.next}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-caption text-ink-secondary">“Built” means it exists in the product. None of these decisions has been validated with users yet.</p>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <SubHead right={<EvidenceTag kind="heuristic" />}>Known problems in this version</SubHead>
          <ul className="flex flex-col gap-2">{PAINS_PREDICTED.filter((p) => p.sev === 4).map((p) => <li key={p.id} className="rounded-lg border border-danger-border bg-danger-bg/50 p-3 text-body-s"><span className="mr-2 text-label-s text-danger-fg">{p.id}</span>{p.text}</li>)}</ul>
          <p className="mt-3 text-caption text-ink-secondary">Also open: unverified emission factors, a scripted AI, no real accounts, and no usability data.</p>
        </div>
        <div>
          <SubHead right={<EvidenceTag kind="planned" />}>What happens next</SubHead>
          <ol className="flex flex-col gap-2">{NEXT_STEPS.map((n, i) => <li key={n.text} className="flex gap-3 rounded-lg border border-line bg-page p-3 text-body-s"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-subtle text-label-s text-brand-700">{i + 1}</span>{n.text}</li>)}</ol>
        </div>
      </div>

      <div className="mt-16">
        <SubHead>What building it taught me</SubHead>
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {LEARNINGS.map((l) => <li key={l.title} className="rounded-lg border border-line bg-page p-5"><h4 className="text-h4">{l.title}</h4><p className="mt-2 text-body-s text-ink-secondary">{l.text}</p></li>)}
        </ul>
        <p className="mt-3 text-caption text-ink-secondary">These are lessons from the build and the audit, not from users.</p>
      </div>
    </SectionShell>
  );
}
