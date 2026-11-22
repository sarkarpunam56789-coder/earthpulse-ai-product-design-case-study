import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Download, Droplets, Printer, Trash2 } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { RECOMMENDATIONS } from '../../data/content';
import { activitiesToCsv, downloadFile } from '../../lib/csv';
import { fmt0, fmt1 } from '../../lib/format';
import { monthlyReport, CarbonCategory } from '../../lib/metrics';
import { useApp } from '../../hooks/useApp';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useToast } from '../../hooks/useToast';
import { Alert } from '../../components/ui/Alert';
import { Badge, SampleBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Fields';
import { Progress } from '../../components/ui/Progress';
import { BarChart } from '../../components/charts/BarChart';
import { Donut, DonutLegend } from '../../components/charts/Donut';
import { ActionItem } from '../../components/features/ActionItem';
import { MetricCard, Trend } from '../../components/features/MetricCard';
import { Footnote, PageHeader } from '../../components/features/PageHeader';
import { MONTH_SHORT } from '../../lib/dates';

const trend = (cur: number, prev: number | null): Trend => {
  if (prev == null || prev <= 0) return { text: 'No earlier month', kind: 'neutral', dir: 'flat' };
  const p = ((cur - prev) / prev) * 100; const a = Math.abs(Math.round(p));
  if (a < 1) return { text: 'No change', kind: 'neutral', dir: 'flat' };
  return p < 0 ? { text: `${a}% lower`, kind: 'better', dir: 'down' } : { text: `${a}% higher`, kind: 'worse', dir: 'up' };
};

export default function Reports() {
  useDocumentTitle('Impact reports');
  const { state, now, activities, metrics, inPlan, addSuggestionToPlan } = useApp();
  const toast = useToast();
  const [offset, setOffset] = useState(0);
  const reports = useMemo(() => [0, 1, 2, 3, 4, 5].map((o) => monthlyReport(activities, now, o)), [activities, now]);
  const rep = reports[offset];
  const prev = offset < 5 ? reports[offset + 1] : null;

  const bars = [...reports].reverse().map((r, i) => {
    const o = 5 - i; const m = new Date(now.getFullYear(), now.getMonth() - o, 1);
    return { label: MONTH_SHORT[m.getMonth()], value: Math.round(r.carbonKg), highlight: o === offset, tooltip: `${r.label} · ${fmt0(r.carbonKg)} kg CO₂e${r.partial ? ' (to date)' : ''}` };
  });
  const cats = (Object.keys(rep.byCategory) as CarbonCategory[]).map((c) => ({ label: CATEGORIES[c].label, value: rep.byCategory[c], color: CATEGORIES[c].color }));
  const catTotal = cats.reduce((s, c) => s + c.value, 0);
  const lead = [...cats].sort((a, b) => b.value - a.value)[0];

  const exportCsv = () => { downloadFile('earthpulse-activities.csv', activitiesToCsv(activities), 'text/csv'); toast.push('CSV downloaded.'); };

  return (
    <div>
      <PageHeader title="Impact reports" subtitle="A monthly look at your estimated footprint, how it compares and where to focus next."
        actions={<div className="no-print flex gap-3"><Button variant="secondary" iconLeft={Download} onClick={exportCsv}>Download CSV</Button><Button variant="secondary" iconLeft={Printer} onClick={() => window.print()}>Print or save as PDF</Button></div>} />
      <div className="no-print mb-6 flex flex-wrap gap-2" role="group" aria-label="Report month">
        {reports.map((r, o) => <Chip key={o} selected={offset === o} onClick={() => setOffset(o)}>{r.label.split(' ')[0]}{o === 0 ? ' (to date)' : ''}</Chip>)}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 className="text-h3">{rep.label}</h2>
        {rep.partial && <Badge variant="info">Month to date</Badge>}
        {offset > 0 || state.useSample ? <SampleBadge label={offset > 0 ? 'Sample history' : 'Includes sample data'} /> : null}
      </div>
      {rep.carbonKg === 0 && rep.waterL === 0 && <Alert variant="info" className="mb-6">No activity logged in this month yet. Log activities and this report fills in.</Alert>}

      <section className="mb-6 grid gap-4 md:grid-cols-3 lg:gap-6" aria-label="Month summary">
        <MetricCard icon={Cloud} label="Carbon footprint" value={fmt0(rep.carbonKg)} unit="kg CO₂e" trend={trend(rep.carbonKg, prev && !prev.partial ? prev.carbonKg : null)} caption="than the month before" />
        <MetricCard icon={Droplets} label="Water use" value={fmt0(rep.waterL)} unit="L" trend={trend(rep.waterL, prev?.waterL ?? null)} caption="than the month before" />
        <MetricCard icon={Trash2} label="Waste generated" value={fmt1(rep.wasteKg)} unit="kg" trend={trend(rep.wasteKg, prev?.wasteKg ?? null)} caption="than the month before" />
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader title="Six-month comparison" subtitle="Carbon footprint, kg CO₂e per month" />
          <BarChart data={bars} unit="kg CO₂e" ariaLabel="Monthly carbon footprint for the last six months. The current month is to date." />
        </Card>
        <Card>
          <CardHeader title="Category breakdown" subtitle={rep.label} />
          {catTotal > 0 ? (
            <>
              <div className="flex flex-wrap items-center gap-6"><Donut data={cats} size={148} centerValue={fmt0(catTotal)} centerLabel="kg CO₂e" ariaLabel="Category breakdown of the month's carbon footprint." /><DonutLegend data={cats.map((c) => ({ ...c, value: (c.value / catTotal) * 100 }))} /></div>
              <p className="mt-4 text-body-s text-ink-secondary">{lead.label} is the largest category at about {Math.round((lead.value / catTotal) * 100)}%.</p>
            </>
          ) : <p className="py-8 text-center text-body-s text-ink-secondary">No carbon activity in this month.</p>}
        </Card>
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Goal progress this week" subtitle="Weekly limits from your Goals page" />
          <ul className="flex flex-col gap-5">
            {state.goals.filter((g) => g.kind === 'cap' && g.metric).map((g) => {
              const v = metrics.totals[g.metric!]; const pct = (v / g.target) * 100;
              return (
                <li key={g.id}>
                  <div className="mb-1 flex justify-between text-label-m"><span>{g.title}</span><span>{Math.round(pct)}%</span></div>
                  <Progress value={pct} tone={pct > 100 ? 'danger' : g.metric === 'water' ? 'water' : g.metric === 'waste' ? 'waste' : 'brand'} label={g.title} />
                </li>
              );
            })}
            {state.goals.filter((g) => g.kind === 'habit').map((g) => (
              <li key={g.id}><div className="mb-1 flex justify-between text-label-m"><span>{g.title}</span><span>{g.current}/{g.target} {g.unit}</span></div><Progress value={(g.current / g.target) * 100} label={g.title} /></li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Recommendations" right={<Badge variant="brand">AI · sample</Badge>} />
          <ul>{RECOMMENDATIONS.slice(0, 3).map((r) => <ActionItem key={r.id} suggestion={r} added={inPlan(r.id)} onAdd={() => { if (addSuggestionToPlan(r)) toast.push(`Added to your plan: ${r.title}`); }} />)}</ul>
        </Card>
      </section>
      <Footnote>Estimates use illustrative factors. See <Link to="/methodology" className="text-brand-700 underline">Methodology</Link> for the assumptions behind each number.</Footnote>
    </div>
  );
}
