import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronRight, Cloud, Droplets, Leaf, Plus, Sparkles, Trash2 } from 'lucide-react';
import { Category } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { RECOMMENDATIONS } from '../../data/content';
import { useApp } from '../../hooks/useApp';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useToast } from '../../hooks/useToast';
import { addDays, DAY_LABELS, fmtRange, greeting, MONTH_LONG, MONTH_SHORT, startOfWeek } from '../../lib/dates';
import { fmt0, fmt1, niceTicks, round1 } from '../../lib/format';
import { Alert } from '../../components/ui/Alert';
import { Avatar } from '../../components/ui/Avatar';
import { Badge, SampleBadge } from '../../components/ui/Badge';
import { Button, IconButton } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Segmented } from '../../components/ui/Segmented';
import { BarChart } from '../../components/charts/BarChart';
import { LineChart } from '../../components/charts/LineChart';
import { Donut, DonutLegend } from '../../components/charts/Donut';
import { ProgressRing } from '../../components/charts/ProgressRing';
import { ActionItem } from '../../components/features/ActionItem';
import { ActivityList } from '../../components/features/ActivityList';
import { AddActivityModal } from '../../components/features/AddActivityModal';
import { InsightCard } from '../../components/features/InsightCard';
import { MetricCard, Trend } from '../../components/features/MetricCard';
import { Footnote } from '../../components/features/PageHeader';

const QUICK: { label: string; cat: Category; icon: typeof Cloud }[] = [
  { label: 'Log trip', cat: 'transport', icon: CATEGORIES.transport.icon },
  { label: 'Log electricity', cat: 'electricity', icon: CATEGORIES.electricity.icon },
  { label: 'Log meal', cat: 'food', icon: CATEGORIES.food.icon },
  { label: 'Log water', cat: 'water', icon: CATEGORIES.water.icon },
  { label: 'Log waste', cat: 'waste', icon: CATEGORIES.waste.icon },
];

const TIPS: Record<string, string> = {
  transport: 'Swapping a couple of car or auto trips for the metro could lower it.',
  electricity: 'Setting the AC a little higher and switching it off when you leave a room can help.',
  food: 'A couple more vegetarian meals a week can lower it.',
  shopping: 'Buying fewer, longer-lasting items can lower it.',
};

const trendOf = (pct: number): Trend => {
  const a = Math.abs(Math.round(pct));
  if (a < 1) return { text: 'No change', kind: 'neutral', dir: 'flat' };
  return pct < 0 ? { text: `${a}% lower`, kind: 'better', dir: 'down' } : { text: `${a}% higher`, kind: 'worse', dir: 'up' };
};

export default function Dashboard() {
  useDocumentTitle('Dashboard');
  const { state, now, activities, metrics: m, removeActivity, inPlan, addSuggestionToPlan, loadSample } = useApp();
  const toast = useToast();
  const [range, setRange] = useState<'week' | 'month'>('week');
  const [modal, setModal] = useState<{ open: boolean; cat?: Category }>({ open: false });
  const [bell, setBell] = useState(false);

  const weekStart = startOfWeek(now);
  const firstName = state.profile.name.split(' ')[0];
  const showSample = state.useSample;

  const weeks = useMemo(() => {
    const out: { label: string; value: number; highlight: boolean }[] = [];
    for (let i = 5; i >= 0; i--) {
      const s = addDays(weekStart, -7 * i); const e = addDays(s, 7);
      let sum = 0;
      for (const a of activities) { const t = new Date(a.at).getTime(); if (t >= s.getTime() && t < e.getTime()) sum += a.carbonKg; }
      out.push({ label: i === 0 ? 'This wk' : `${s.getDate()} ${MONTH_SHORT[s.getMonth()]}`, value: round1(sum), highlight: i === 0 });
    }
    return out;
  }, [activities, weekStart]);

  const dayBars = DAY_LABELS.map((d, i) => ({ label: d, value: m.week.carbon[i], highlight: i === m.todayIdx }));
  const weekMax = Math.max(...dayBars.map((d) => d.value ?? 0), 0);
  const top = m.topCategory;
  const topLabel = top ? CATEGORIES[top.category].label : null;

  const insights = [
    top
      ? { headline: `${topLabel} drives most of your carbon`, body: `${topLabel} made up about ${Math.round(top.share)}% of the carbon you've logged this month. ${TIPS[top.category]}`, prompt: top.category === 'transport' ? 'How can I reduce my commute emissions?' : `How can I reduce my ${top.category} emissions?` }
      : { headline: 'Log a few activities to unlock insights', body: 'Insights appear once you have a few days of logs. Start with today\'s commute or meals.', prompt: 'What should I focus on this week?' },
    (() => {
      const ahead = m.goalPct.water - m.elapsedPct > 2;
      return { headline: ahead ? 'Water use is running slightly ahead of pace' : 'Water use is on track', body: `You've used ${Math.round(m.goalPct.water)}% of your weekly water goal with ${Math.round(m.elapsedPct)}% of the week gone. ${ahead ? 'Shorter showers and fixing a dripping tap are the quickest wins.' : 'Keep an eye on laundry days.'}`, prompt: 'Why is my water use above pace?' };
    })(),
    m.segregationDays >= 5
      ? { headline: 'Waste segregation is going well', body: `You've logged wet and dry separation on ${m.segregationDays} of the last 7 days. ${7 - m.segregationDays} more day${7 - m.segregationDays === 1 ? '' : 's'} would make it a full week.`, prompt: 'Help me cut waste at home' }
      : { headline: 'Segregation needs a push this week', body: `You've logged wet and dry separation on ${m.segregationDays} of the last 7 days. A second bin in the kitchen makes it easier.`, prompt: 'Help me cut waste at home' },
  ];

  const planDone = state.plan.filter((p) => p.done).length;
  const planPct = state.plan.length ? (planDone / state.plan.length) * 100 : 0;
  const remaining = state.plan.filter((p) => !p.done).slice(0, 2);
  const recs = RECOMMENDATIONS.slice(0, 3);
  const donutData = m.categoryShare.map((c) => ({ label: CATEGORIES[c.category].label, value: c.share, color: CATEGORIES[c.category].color }));

  const notifications = [
    `Your weekly summary for ${fmtRange(weekStart, addDays(weekStart, 6))} is ready.`,
    m.streak >= 2 ? `You're on a ${m.streak}-day logging streak. Keep it going.` : 'Log an activity today to start a streak.',
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-h2 sm:text-h1">{greeting(now)}, {firstName}</h1>
          <p className="mt-1 text-body-m text-ink-secondary">Here's your estimated impact for this week, {fmtRange(weekStart, addDays(weekStart, 6))}.</p>
        </div>
        <div className="flex items-center gap-3">
          <Segmented<'week' | 'month'> label="Chart range" value={range} onChange={setRange} options={[{ value: 'week', label: 'Weekly' }, { value: 'month', label: 'Monthly' }]} />
          <div className="relative">
            <IconButton icon={Bell} label="Notifications" aria-expanded={bell} onClick={() => setBell((b) => !b)} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" aria-hidden />
            {bell && (
              <div className="absolute right-0 z-20 mt-2 w-72 rounded-md border border-line bg-surface p-2 shadow-elev-2">
                {notifications.map((n) => <p key={n} className="rounded-sm p-2 text-body-s hover:bg-subtle">{n}</p>)}
              </div>
            )}
          </div>
          <Avatar name={state.profile.name} className="hidden sm:inline-flex" />
        </div>
      </div>

      {!m.hasData && (
        <Alert variant="info" className="mb-6" action={<div className="flex gap-2"><Button size="sm" onClick={() => setModal({ open: true })}>Log your first activity</Button>{!showSample && <Button size="sm" variant="secondary" onClick={loadSample}>Load sample data</Button>}</div>}>
          Nothing logged this week yet. Your dashboard fills in as you log trips, meals, water and waste.
        </Alert>
      )}

      {/* Quick actions */}
      <section aria-label="Quick actions" className="mb-6 flex gap-3 overflow-x-auto scrollbar-none sm:grid sm:grid-cols-3 sm:overflow-visible xl:grid-cols-5">
        {QUICK.map((q) => (
          <button key={q.cat} type="button" onClick={() => setModal({ open: true, cat: q.cat })}
            className="flex h-14 min-w-[170px] items-center gap-3 rounded-lg border border-line bg-surface px-4 text-left transition-colors hover:border-line-strong hover:bg-subtle sm:min-w-0">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-brand-subtle"><q.icon className="h-[18px] w-[18px] text-brand" aria-hidden /></span>
            <span className="flex-1 text-label-m">{q.label}</span>
            <ChevronRight className="h-4 w-4 text-ink-placeholder" aria-hidden />
          </button>
        ))}
      </section>

      {/* Overall impact */}
      <Card className="mb-6">
        <CardHeader title="Overall impact this week" right={showSample ? <SampleBadge /> : undefined} />
        <div className="grid gap-8 xl:grid-cols-[400px_1fr] xl:gap-10">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-5">
              <ProgressRing value={m.ecoScore ?? 0} label={m.ecoScore == null ? '—' : String(m.ecoScore)} ariaLabel={m.ecoScore == null ? 'Eco score not available yet' : `Eco score ${m.ecoScore} out of 100`} />
              <div>
                <div className="text-label-s text-ink-secondary">Eco score</div>
                <h3 className="text-h3">{m.ecoScore == null ? 'Log your first activity' : m.trend.carbon <= 0 ? 'Your impact is easing' : 'Your impact is rising'}</h3>
                <p className="mt-1 text-body-s text-ink-secondary">
                  {m.ecoScore == null ? 'Your score appears after a few logs.' : <>About {Math.abs(Math.round(m.trend.carbon))}% {m.trend.carbon <= 0 ? 'lower' : 'higher'} than the same days last week.{topLabel ? ` ${topLabel} is your largest category.` : ''}</>}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-line-subtle pt-4">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-brand-subtle"><Leaf className="h-[18px] w-[18px] text-brand" aria-hidden /></span>
                <div><div className="text-label-m">{m.streak}-day logging streak</div><div className="text-caption text-ink-secondary">Log tomorrow to reach {m.streak + 1}</div></div>
              </div>
              {top && (
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-brand-subtle">{(() => { const I = CATEGORIES[top.category].icon; return <I className="h-[18px] w-[18px] text-brand" aria-hidden />; })()}</span>
                  <div><div className="text-label-m">Largest category: {topLabel}</div><div className="text-caption text-ink-secondary">{Math.round(top.share)}% of this month's carbon</div></div>
                </div>
              )}
            </div>
            <p className="text-caption text-ink-secondary">
              Eco score is higher-is-better and uses a demo formula, so treat it as a sample value. <Link to="/methodology" className="text-brand-700 underline">How it's calculated</Link>
            </p>
          </div>
          <div className="min-w-0 xl:border-l xl:border-line-subtle xl:pl-10">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-label-l">{range === 'week' ? 'Daily carbon footprint' : 'Weekly carbon footprint'}</div>
                <div className="text-caption text-ink-secondary">{range === 'week' ? 'kg CO₂e per day, estimated' : 'kg CO₂e per week, last 6 weeks'}</div>
              </div>
              <div className="flex items-center gap-4 text-caption text-ink-secondary">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-xs bg-viz-transport" />{range === 'week' ? 'Earlier days' : 'Earlier weeks'}</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-xs bg-accent" />{range === 'week' ? 'Today' : 'This week'}</span>
              </div>
            </div>
            {range === 'week'
              ? <BarChart data={dayBars} unit="kg CO₂e" ticks={weekMax <= 9 ? [9, 6, 3, 0] : undefined} ariaLabel={`Daily carbon footprint this week. Total ${fmt1(m.totals.carbon)} kilograms CO2e so far.`} />
              : <BarChart data={weeks} unit="kg CO₂e" ticks={Math.max(...weeks.map((w) => w.value)) <= 60 ? [60, 40, 20, 0] : undefined} ariaLabel="Weekly carbon footprint over the last six weeks." />}
          </div>
        </div>
      </Card>

      {/* AI insights */}
      <section className="mb-6" aria-labelledby="insights-h">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3"><h2 id="insights-h" className="text-h3">AI insights</h2><Badge variant="brand">Demo</Badge></div>
          <Link to="/app/copilot" className="inline-flex items-center gap-1 text-label-m text-brand-700 hover:underline">Open Copilot <ChevronRight className="h-4 w-4" aria-hidden /></Link>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-none md:grid md:grid-cols-3 md:overflow-visible">
          {insights.map((i) => <div key={i.headline} className="min-w-[280px] flex-1"><InsightCard {...i} /></div>)}
        </div>
      </section>

      {/* Summary cards */}
      <section aria-label="Carbon, water and waste summary" className="mb-6 grid gap-4 md:grid-cols-3 lg:gap-6">
        <MetricCard icon={Cloud} label="Carbon footprint" value={fmt1(m.totals.carbon)} unit="kg CO₂e this week" trend={trendOf(m.trend.carbon)} caption="than same days last week"
          progress={{ pct: m.goalPct.carbon, tone: 'brand', caption: `${Math.round(m.goalPct.carbon)}% of your ${fmt0(m.targets.carbon)} kg weekly goal` }} />
        <MetricCard icon={Droplets} label="Water use" value={fmt0(m.totals.water)} unit="L this week" trend={trendOf(m.trend.water)} caption="than same days last week"
          progress={{ pct: m.goalPct.water, tone: 'water', caption: `${Math.round(m.goalPct.water)}% of your ${fmt0(m.targets.water)} L weekly goal` }} />
        <MetricCard icon={Trash2} label="Waste generated" value={fmt1(m.totals.waste)} unit="kg this week" trend={trendOf(m.trend.waste)} caption="than same days last week"
          progress={{ pct: m.goalPct.waste, tone: 'waste', caption: `${Math.round(m.goalPct.waste)}% of your ${fmt0(m.targets.waste)} kg weekly goal` }} />
      </section>

      {/* Trend + breakdown */}
      <section className="mb-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader title="Carbon trend by month" subtitle={`kg CO₂e per week on average · ${MONTH_LONG[now.getMonth()]} is month to date`} right={<SampleBadge label="Earlier months: sample" />} />
          <LineChart values={m.monthly.map((x) => x.weeklyAvg)} labels={m.monthly.map((x) => x.label)} unit="kg CO₂e per week" partialLast ariaLabel={`Average weekly carbon footprint by month for the last six months. Latest is ${m.monthly[5].weeklyAvg} kilograms, month to date.`} />
        </Card>
        <Card>
          <CardHeader title="Carbon by category" subtitle={`${MONTH_LONG[now.getMonth()]} so far`} />
          {m.monthCarbon > 0 ? (
            <div className="flex flex-wrap items-center gap-6">
              <Donut data={donutData} centerValue={fmt0(m.monthCarbon)} centerLabel="kg CO₂e" ariaLabel={`Carbon by category this month. ${donutData.map((d) => `${d.label} ${Math.round(d.value)} percent`).join(', ')}.`} />
              <DonutLegend data={donutData} />
            </div>
          ) : <p className="py-8 text-center text-body-s text-ink-secondary">No carbon activity logged this month yet.</p>}
          <p className="mt-4 text-caption text-ink-secondary">Shares of logged activity. See <Link to="/methodology" className="text-brand-700 underline">Methodology</Link> for assumptions.</p>
        </Card>
      </section>

      {/* Activity + plan */}
      <section className="mb-2 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader title="Recent activity" right={<><Badge>Estimates</Badge><Link to="/app/carbon" className="text-label-m text-brand-700 hover:underline">View all</Link></>} />
          <ActivityList activities={activities} now={now} onDelete={removeActivity}
            filters={[{ value: 'all', label: 'All' }, { value: 'transport', label: 'Transport' }, { value: 'energy', label: 'Energy' }, { value: 'food', label: 'Food' }, { value: 'water', label: 'Water' }, { value: 'waste', label: 'Waste' }]}
            emptyAction={<Button size="md" iconLeft={Plus} onClick={() => setModal({ open: true })}>Log your first activity</Button>} />
        </Card>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="This week's plan" />
            <div className="flex items-center gap-5">
              <ProgressRing value={planPct} label={`${planDone}/${state.plan.length}`} ariaLabel={`${planDone} of ${state.plan.length} plan actions done`} />
              <div>
                <div className="text-label-l">{planDone} of {state.plan.length} actions done</div>
                <p className="mt-1 text-body-s text-ink-secondary">{remaining.length ? `Still to do: ${remaining.map((r) => r.title.toLowerCase()).join(', and ')}.` : 'Everything in your plan is done. Nice work.'}</p>
              </div>
            </div>
            <div className="mt-4"><Link to="/app/planner" className="inline-flex h-8 items-center rounded-md border border-line px-3 text-label-m hover:bg-subtle">Open planner</Link></div>
          </Card>
          <Card>
            <CardHeader title="Recommended for you" right={<Badge variant="brand">AI · sample</Badge>} />
            <ul>
              {recs.map((r) => <ActionItem key={r.id} suggestion={r} added={inPlan(r.id)} onAdd={() => { if (addSuggestionToPlan(r)) toast.push(`Added to your plan: ${r.title}`); }} />)}
            </ul>
            <div className="mt-2"><Link to="/app/copilot" className="text-label-m text-brand-700 hover:underline">See more suggestions in Copilot</Link></div>
          </Card>
        </div>
      </section>

      <Footnote>
        {showSample ? 'Everything on this screen is sample data and estimates for demonstration. ' : 'Figures are estimates built from illustrative factors. '}
        Calculation assumptions are listed on the <Link to="/methodology" className="text-brand-700 underline">Methodology</Link> page.
      </Footnote>

      <AddActivityModal open={modal.open} onClose={() => setModal({ open: false })} categories={['transport', 'electricity', 'food', 'shopping', 'water', 'waste']} initial={modal.cat} />
    </div>
  );
}
