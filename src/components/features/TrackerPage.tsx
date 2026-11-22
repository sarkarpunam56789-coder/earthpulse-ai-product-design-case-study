import { useMemo, useState } from 'react';
import { Check, Cloud, Droplets, Plus, Search, Trash2, X } from 'lucide-react';
import { Activity, Category } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { TRANSPORT_MODES, WASTE_TYPES, WATER_USES } from '../../data/factors';
import { useApp } from '../../hooks/useApp';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useToast } from '../../hooks/useToast';
import { startOfDay, addDays, weekdayIndex, startOfWeek, DAY_MS } from '../../lib/dates';
import { fmt0, fmt1 } from '../../lib/format';
import { rangeSeries, weekSeries } from '../../lib/series';
import { Alert } from '../ui/Alert';
import { Badge, SampleBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardHeader } from '../ui/Card';
import { TextField } from '../ui/Fields';
import { Progress } from '../ui/Progress';
import { Segmented } from '../ui/Segmented';
import { Tabs } from '../ui/Tabs';
import { BarChart } from '../charts/BarChart';
import { Donut, DonutLegend } from '../charts/Donut';
import { ActivityList } from './ActivityList';
import { AddActivityModal } from './AddActivityModal';
import { MetricCard } from './MetricCard';
import { PageHeader, Footnote } from './PageHeader';

type Kind = 'carbon' | 'water' | 'waste';
const PALETTE = ['#2F80C8', '#3FA796', '#8A6BC2', '#F5A524', '#D9585F', '#16783C', '#7A877C'];

const CFG = {
  carbon: {
    title: 'Carbon tracker', icon: Cloud, unit: 'kg CO₂e', digits: 1, barClass: 'bg-viz-transport',
    subtitle: 'Log trips, electricity, meals and purchases to see where your estimated carbon footprint comes from.',
    cats: ['transport', 'electricity', 'food', 'shopping'] as Category[],
    get: (a: Activity) => a.carbonKg, fmt: fmt1,
    tabs: [{ value: 'all', label: 'All' }, { value: 'transport', label: 'Transport' }, { value: 'electricity', label: 'Electricity' }, { value: 'food', label: 'Food' }, { value: 'shopping', label: 'Shopping' }],
    match: (a: Activity, t: string) => t === 'all' || a.category === t,
  },
  water: {
    title: 'Water tracker', icon: Droplets, unit: 'L', digits: 0, barClass: 'bg-viz-water',
    subtitle: 'Track daily water use by activity and work towards a weekly reduction goal.',
    cats: ['water'] as Category[],
    get: (a: Activity) => a.waterL, fmt: fmt0,
    tabs: [{ value: 'all', label: 'All uses' }, ...WATER_USES.slice(0, 5).map((u) => ({ value: u.value, label: u.label }))],
    match: (a: Activity, t: string) => t === 'all' || a.sub === t,
  },
  waste: {
    title: 'Waste tracker', icon: Trash2, unit: 'kg', digits: 1, barClass: 'bg-viz-waste',
    subtitle: 'Log what you throw away, how well you separate it and what gets recycled.',
    cats: ['waste'] as Category[],
    get: (a: Activity) => a.wasteKg, fmt: fmt1,
    tabs: [{ value: 'all', label: 'All waste' }, ...WASTE_TYPES.map((w) => ({ value: w.value, label: w.label.split(' (')[0].replace(' or kitchen waste', '') }))],
    match: (a: Activity, t: string) => t === 'all' || a.sub === t,
  },
};

export function TrackerPage({ kind }: { kind: Kind }) {
  const c = CFG[kind];
  useDocumentTitle(c.title);
  const { state, now, activities, metrics, removeActivity, updateGoal, loadSample } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState('all');
  const [range, setRange] = useState<'week' | '30'>('week');
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(8);
  const [editing, setEditing] = useState(false);
  const goal = state.goals.find((g) => g.kind === 'cap' && g.metric === kind)!;
  const [target, setTarget] = useState(String(goal?.target ?? ''));
  const [targetErr, setTargetErr] = useState('');

  const mine = useMemo(() => activities.filter((a) => (c.cats as Category[]).includes(a.category)), [activities, c.cats]);
  const filtered = useMemo(() => mine.filter((a) => c.match(a, tab)), [mine, c, tab]);

  const week = useMemo(() => weekSeries(filtered, now, c.get, c.unit, c.digits), [filtered, now, c]);
  const series = useMemo(() => (range === 'week' ? week : rangeSeries(filtered, now, 30, c.get, c.unit, c.digits)), [range, week, filtered, now, c]);
  const weekTotal = week.reduce((s, p) => s + (p.value ?? 0), 0);
  const today = weekdayIndex(now);
  const todayTotal = week[today].value ?? 0;
  const monthTotal = filtered.filter((a) => { const d = new Date(a.at); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).reduce((s, a) => s + c.get(a), 0);
  const avg = weekTotal / (today + 1);

  // breakdown
  const breakdown = useMemo(() => {
    const m = new Map<string, number>();
    const inMonth = mine.filter((a) => { const d = new Date(a.at); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
    if (kind === 'carbon') inMonth.forEach((a) => m.set(a.category, (m.get(a.category) ?? 0) + a.carbonKg));
    else if (kind === 'water') inMonth.forEach((a) => { const k = WATER_USES.find((u) => u.value === a.sub)?.label ?? 'Other'; m.set(k, (m.get(k) ?? 0) + a.waterL); });
    else inMonth.forEach((a) => { const k = a.segregated ? 'Segregated' : 'Not segregated'; m.set(k, (m.get(k) ?? 0) + a.wasteKg); });
    const entries = [...m.entries()].sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((s, e) => s + e[1], 0);
    return {
      total,
      data: entries.map(([k, v], i) => ({
        label: kind === 'carbon' ? CATEGORIES[k as Category].label : k, value: total ? (v / total) * 100 : 0,
        color: kind === 'carbon' ? CATEGORIES[k as Category].color : kind === 'waste' ? (k === 'Segregated' ? '#3FA796' : '#D9585F') : PALETTE[i % PALETTE.length],
      })),
    };
  }, [mine, kind, now]);

  // waste extras
  const wasteStats = useMemo(() => {
    if (kind !== 'waste') return null;
    const ws = startOfWeek(now);
    let total = 0, seg = 0, rec = 0;
    const days: ('yes' | 'no' | 'none')[] = Array(7).fill('none');
    for (const a of mine) {
      const idx = Math.round((startOfDay(new Date(a.at)).getTime() - ws.getTime()) / DAY_MS);
      if (idx < 0 || idx > 6) continue;
      total += a.wasteKg; if (a.segregated) seg += a.wasteKg; if (a.recycled) rec += a.wasteKg;
      if (a.segregated) days[idx] = days[idx] === 'no' ? 'no' : 'yes'; else days[idx] = 'no';
    }
    return { segPct: total ? (seg / total) * 100 : 0, recPct: total ? (rec / total) * 100 : 0, days };
  }, [kind, mine, now]);

  const saveTarget = () => {
    const v = parseFloat(target);
    if (!(v > 0)) { setTargetErr('Enter a target above 0'); return; }
    updateGoal(goal.id, { target: v, title: goal.title.replace(/[\d,.]+/, fmt0(v)) });
    setEditing(false); setTargetErr(''); toast.push('Weekly goal updated.');
  };

  const unitLabel = kind === 'carbon' ? 'kg CO₂e' : c.unit;
  const empty = mine.length === 0;
  const first = c.cats[0];

  return (
    <div>
      <PageHeader title={c.title} subtitle={c.subtitle} actions={<Button iconLeft={Plus} onClick={() => setModal(true)}>Log activity</Button>} />
      {empty && (
        <Alert variant="info" className="mb-6" action={!state.useSample ? <Button size="sm" variant="secondary" onClick={loadSample}>Load sample data</Button> : undefined}>
          You haven't logged anything here yet. Use Log activity to add your first entry.
        </Alert>
      )}
      <Tabs label={`${c.title} filters`} value={tab} onChange={(t) => { setTab(t); setLimit(8); }} tabs={c.tabs} className="mb-6" />

      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
        <section className="mb-6 grid gap-4 md:grid-cols-3 lg:gap-6" aria-label="Summary">
          {kind === 'waste' && wasteStats ? (
            <>
              <MetricCard icon={c.icon} label="Waste this week" value={fmt1(weekTotal)} unit="kg" trend={{ text: `${Math.round(metrics.goalPct.waste)}% of goal`, kind: 'neutral', dir: 'flat' }} caption="so far this week" />
              <MetricCard icon={Check} label="Segregated" value={String(Math.round(wasteStats.segPct))} unit="% by weight" trend={{ text: wasteStats.segPct >= 80 ? 'Strong' : 'Room to improve', kind: wasteStats.segPct >= 80 ? 'better' : 'neutral', dir: 'flat' }} caption="this week" />
              <MetricCard icon={Trash2} label="Recycled" value={String(Math.round(wasteStats.recPct))} unit="% by weight" trend={{ text: 'Logged as recycled', kind: 'neutral', dir: 'flat' }} caption="this week" />
            </>
          ) : (
            <>
              <MetricCard icon={c.icon} label="This week" value={c.fmt(weekTotal)} unit={unitLabel} trend={{ text: `${Math.round((kind === 'carbon' ? metrics.goalPct.carbon : metrics.goalPct.water))}% of goal`, kind: 'neutral', dir: 'flat' }} caption="all activity" />
              <MetricCard icon={c.icon} label={kind === 'carbon' ? 'This month' : 'Today'} value={c.fmt(kind === 'carbon' ? monthTotal : todayTotal)} unit={unitLabel} trend={{ text: kind === 'carbon' ? 'Month to date' : 'So far', kind: 'neutral', dir: 'flat' }} caption="estimated" />
              <MetricCard icon={c.icon} label="Daily average" value={c.fmt(avg)} unit={`${unitLabel} per day`} trend={{ text: 'This week', kind: 'neutral', dir: 'flat' }} caption="so far" />
            </>
          )}
        </section>

        <section className="mb-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card>
            <CardHeader title={range === 'week' ? 'This week by day' : 'Last 30 days'} subtitle={`${unitLabel} per day`}
              right={<><SampleBadge label={state.useSample ? 'Includes sample data' : 'Your data'} /><Segmented<'week' | '30'> label="Chart range" value={range} onChange={setRange} options={[{ value: 'week', label: 'Week' }, { value: '30', label: '30 days' }]} /></>} />
            <BarChart data={series} unit={unitLabel} barClass={c.barClass} ariaLabel={`${c.title} per day. Total this week ${c.fmt(weekTotal)} ${unitLabel}.`} />
          </Card>
          <Card>
            <CardHeader title={kind === 'carbon' ? 'By category' : kind === 'water' ? 'Where water goes' : 'Segregation'} subtitle="This month" />
            {breakdown.total > 0 ? (
              <div className="flex flex-wrap items-center gap-6">
                <Donut data={breakdown.data} size={148} centerValue={c.fmt(breakdown.total)} centerLabel={unitLabel} ariaLabel={`${c.title} breakdown this month.`} />
                <DonutLegend data={breakdown.data} />
              </div>
            ) : <p className="py-8 text-center text-body-s text-ink-secondary">Nothing logged this month yet.</p>}
          </Card>
        </section>

        <section className="mb-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader title="Weekly reduction goal" subtitle={goal?.title} right={!editing ? <Button variant="secondary" size="sm" onClick={() => { setTarget(String(goal.target)); setEditing(true); }}>Edit goal</Button> : undefined} />
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-metric-m">{c.fmt(kind === 'carbon' ? metrics.totals.carbon : kind === 'water' ? metrics.totals.water : metrics.totals.waste)}<span className="ml-1 text-body-s font-normal text-ink-secondary">of {fmt0(goal.target)} {unitLabel}</span></span>
              <Badge variant={metrics.goalPct[kind] - metrics.elapsedPct > 5 ? 'warning' : 'success'}>{metrics.goalPct[kind] - metrics.elapsedPct > 5 ? 'Ahead of pace' : 'On pace'}</Badge>
            </div>
            <Progress value={metrics.goalPct[kind]} tone={kind === 'carbon' ? 'brand' : kind === 'water' ? 'water' : 'waste'} label={`${c.title} weekly goal progress`} />
            <p className="mt-2 text-caption text-ink-secondary">{Math.round(metrics.goalPct[kind])}% used with {Math.round(metrics.elapsedPct)}% of the week gone.</p>
            {editing && (
              <div className="mt-4 flex flex-wrap items-start gap-3">
                <TextField className="w-40" label={`Weekly limit (${unitLabel})`} type="number" min="0" value={target} error={targetErr} onChange={(e) => { setTarget(e.target.value); setTargetErr(''); }} />
                <div className="mt-6 flex gap-2"><Button onClick={saveTarget}>Save goal</Button><Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button></div>
              </div>
            )}
          </Card>
          {kind === 'waste' && wasteStats ? (
            <Card>
              <CardHeader title="Segregation this week" subtitle="Did you separate wet and dry waste each day?" />
              <ul className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                  <li key={d} className="flex flex-col items-center gap-1.5">
                    <span className={`grid h-9 w-9 place-items-center rounded-full border ${wasteStats.days[i] === 'yes' ? 'border-success-border bg-success-bg text-success-fg' : wasteStats.days[i] === 'no' ? 'border-danger-border bg-danger-bg text-danger-fg' : 'border-line bg-subtle text-ink-placeholder'}`}>
                      {wasteStats.days[i] === 'yes' ? <Check className="h-4 w-4" aria-hidden /> : wasteStats.days[i] === 'no' ? <X className="h-4 w-4" aria-hidden /> : <span aria-hidden>–</span>}
                      <span className="sr-only">{d}: {wasteStats.days[i] === 'yes' ? 'segregated' : wasteStats.days[i] === 'no' ? 'not segregated' : 'no entry'}</span>
                    </span>
                    <span className="text-caption text-ink-secondary" aria-hidden>{d}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : (
            <Card>
              <CardHeader title={kind === 'carbon' ? 'Lower-carbon ways to travel' : 'Quick water-saving ideas'} subtitle="Generic ideas. Ask Copilot for tips based on your own data." />
              <ul className="flex flex-col gap-3 text-body-s">
                {(kind === 'carbon'
                  ? ['Take the metro or a bus for regular trips.', 'Combine errands into one auto or car trip.', 'Walk or cycle for short distances.']
                  : ['Keep showers short and turn off the tap while soaping.', 'Fix small leaks promptly.', 'Run washing machines with full loads.']).map((t) => (
                  <li key={t} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />{t}</li>
                ))}
              </ul>
            </Card>
          )}
        </section>

        <Card>
          <CardHeader title="History" right={<Badge>Estimates</Badge>} />
          <div className="mb-3 max-w-sm">
            <TextField label="Search history" hideLabel leftIcon={Search} placeholder="Search by title or details" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <ActivityList activities={filtered} now={now} filters={[{ value: 'all', label: 'All' }]} limit={limit} onSearch={search} onDelete={removeActivity}
            emptyAction={<Button iconLeft={Plus} onClick={() => setModal(true)}>Log your first activity</Button>} />
          {filtered.length > limit && <div className="mt-3 text-center"><Button variant="secondary" onClick={() => setLimit((l) => l + 10)}>Show more</Button></div>}
        </Card>
      </div>

      <Footnote />
      <AddActivityModal open={modal} onClose={() => setModal(false)} categories={c.cats} initial={tab !== 'all' && kind === 'carbon' ? (tab as Category) : first} />
    </div>
  );
}
