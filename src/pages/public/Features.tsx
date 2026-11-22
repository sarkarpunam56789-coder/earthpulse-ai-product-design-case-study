import { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ButtonLink } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';
import { Donut, DonutLegend } from '../../components/charts/Donut';
import { BarChart } from '../../components/charts/BarChart';
import { ProgressRing } from '../../components/charts/ProgressRing';

const wrap = 'mx-auto max-w-site px-4 sm:px-6 lg:px-8';

function Row({ title, text, points, visual, flip }: { title: string; text: string; points: string[]; visual: ReactNode; flip?: boolean }) {
  return (
    <section className={`${wrap} grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-16 lg:py-16`}>
      <div className={flip ? 'lg:order-2' : ''}>
        <h2 className="text-h1">{title}</h2>
        <p className="mt-3 text-body-m text-ink-secondary">{text}</p>
        <ul className="mt-5 flex flex-col gap-2.5">{points.map((p) => <li key={p} className="flex items-start gap-2 text-body-m"><Check className="mt-1 h-4 w-4 shrink-0 text-brand" aria-hidden />{p}</li>)}</ul>
      </div>
      <div className={`rounded-xl border border-line bg-surface p-5 sm:p-6 ${flip ? 'lg:order-1' : ''}`} aria-hidden>{visual}<p className="mt-3 text-caption text-ink-secondary">Sample data</p></div>
    </section>
  );
}

export default function Features() {
  useDocumentTitle('Features');
  return (
    <>
      <section className={`${wrap} py-14 lg:py-20`}>
        <h1 className="max-w-3xl font-display text-display-m sm:text-display-l">Everything you need to understand and lower your footprint</h1>
        <p className="mt-5 max-w-2xl text-body-l text-ink-secondary">Trackers for carbon, water and waste, an assistant that explains your numbers, and planning tools that turn insight into action.</p>
      </section>
      <div className="divide-y divide-line-subtle border-t border-line-subtle">
        <Row title="Carbon tracker" text="See where your estimated carbon footprint comes from and how it changes week to week."
          points={['Log trips, electricity use, meals and purchases', 'Breakdown by category with a weekly goal', 'History you can search, filter and export']}
          visual={<div className="flex flex-wrap items-center gap-6"><Donut size={140} centerValue="171" centerLabel="kg CO₂e" ariaLabel="Sample carbon breakdown" data={[{ label: 'Transport', value: 38, color: '#16783C' }, { label: 'Electricity', value: 27, color: '#F5A524' }, { label: 'Food', value: 22, color: '#8A6BC2' }, { label: 'Shopping', value: 13, color: '#D9585F' }]} /><DonutLegend data={[{ label: 'Transport', value: 38, color: '#16783C' }, { label: 'Electricity', value: 27, color: '#F5A524' }, { label: 'Food', value: 22, color: '#8A6BC2' }, { label: 'Shopping', value: 13, color: '#D9585F' }]} /></div>} />
        <Row flip title="Water tracker" text="Work out where water goes at home and stay inside a weekly limit."
          points={['Showers, laundry, cooking and cleaning in one log', 'Daily and 30-day views', 'A pace indicator so you can adjust mid-week']}
          visual={<BarChart height={130} unit="L" barClass="bg-viz-water" ariaLabel="Sample" data={[{ label: 'Mon', value: 160 }, { label: 'Tue', value: 155 }, { label: 'Wed', value: 150 }, { label: 'Thu', value: 147, highlight: true }, { label: 'Fri', value: null }, { label: 'Sat', value: null }, { label: 'Sun', value: null }]} />} />
        <Row title="Waste tracker" text="Track how much you throw away and how well you separate it."
          points={['Wet, dry, recyclable, e-waste and hazardous types', 'A seven-day segregation check', 'Recycling share by weight']}
          visual={<div className="grid grid-cols-7 gap-2 text-center">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => <div key={d}><span className={`mx-auto grid h-9 w-9 place-items-center rounded-full border ${[1, 4].includes(i) ? 'border-danger-border bg-danger-bg text-danger-fg' : 'border-success-border bg-success-bg text-success-fg'}`}>{[1, 4].includes(i) ? '×' : '✓'}</span><div className="mt-1.5 text-caption text-ink-secondary">{d}</div></div>)}</div>} />
        <Row flip title="AI Sustainability Copilot" text="Ask questions in plain language and get answers grounded in your own logs."
          points={['Explains why a number is high or low', 'Suggests actions you can add to your plan in one tap', 'Clearly labels demo replies and estimates']}
          visual={<div className="flex flex-col gap-3 text-body-s"><div className="ml-auto max-w-[80%] rounded-lg rounded-br-sm bg-brand px-4 py-2.5 text-white">Why is my water use above pace?</div><div className="max-w-[85%] rounded-lg rounded-tl-sm bg-subtle px-4 py-2.5">You've used 58% of your weekly goal with 57% of the week gone. Shorter showers are the quickest win.</div></div>} />
        <Row title="Planner and goals" text="Choose a few actions for the week and track weekly limits and habits."
          points={['Give each action a day and tick it off', 'Weekly limits for carbon, water and waste', 'Habit goals with simple counters']}
          visual={<div className="flex items-center gap-6"><ProgressRing value={60} label="3/5" ariaLabel="3 of 5 done" /><div className="flex-1 space-y-3"><div><div className="mb-1 text-label-s">Carbon limit</div><Progress value={52} label="Carbon" /></div><div><div className="mb-1 text-label-s">Water limit</div><Progress value={58} tone="water" label="Water" /></div></div></div>} />
        <Row flip title="What-if simulator" text="Compare a change before you make it, such as swapping car trips for the metro."
          points={['Adjust commute, electricity and food waste', 'See before and after side by side', 'Every assumption listed next to the result']}
          visual={<div className="space-y-4"><div><div className="mb-1 flex justify-between text-label-s"><span>Commute</span><span className="text-success-fg">Lower</span></div><div className="h-2.5 rounded-full bg-muted"><div className="h-full w-[85%] rounded-full bg-line-strong" /></div><div className="mt-1.5 h-2.5 rounded-full bg-muted"><div className="h-full w-[25%] rounded-full bg-brand" /></div></div></div>} />
        <Row title="Impact reports" text="A monthly summary you can read, print or export."
          points={['Six-month comparison and category breakdown', 'Goal progress and recommendations', 'CSV export of your activities']}
          visual={<BarChart height={130} unit="kg" ariaLabel="Sample" ticks={[240, 160, 80, 0]} data={[{ label: 'Jun', value: 214 }, { label: 'Jul', value: 205 }, { label: 'Aug', value: 211 }, { label: 'Sep', value: 196 }, { label: 'Oct', value: 182 }, { label: 'Nov', value: 120, highlight: true }]} />} />
      </div>
      <section className="bg-brand-subtle"><div className={`${wrap} flex flex-col items-start justify-between gap-5 py-12 md:flex-row md:items-center`}><h2 className="text-h2">See it with sample data</h2><div className="flex gap-3"><ButtonLink to="/get-started" size="lg">Get started</ButtonLink><ButtonLink to="/how-it-works" size="lg" variant="secondary">How it works</ButtonLink></div></div></section>
    </>
  );
}
