import { ReactNode, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RotateCcw, Sparkles } from 'lucide-react';
import { TRANSPORT_MODES } from '../../data/factors';
import { DEFAULT_SIM, simulate, SimInputs } from '../../lib/simulator';
import { fmt0, fmt1 } from '../../lib/format';
import { useApp } from '../../hooks/useApp';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useToast } from '../../hooks/useToast';
import { Alert } from '../../components/ui/Alert';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { SelectField } from '../../components/ui/Fields';
import { PageHeader } from '../../components/features/PageHeader';
import { cn } from '../../lib/cn';

function Slider({ id, label, value, min, max, step = 1, unit, onChange }: { id: string; label: string; value: number; min: number; max: number; step?: number; unit: string; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between"><label htmlFor={id} className="text-label-m">{label}</label><span className="text-label-m text-brand-700">{value} {unit}</span></div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-brand" />
    </div>
  );
}

function Group({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return <fieldset className="flex flex-col gap-4 border-b border-line-subtle pb-6 last:border-0 last:pb-0"><legend className="text-h4">{title}</legend><p className="-mt-2 text-body-s text-ink-secondary">{hint}</p>{children}</fieldset>;
}

export default function Simulator() {
  useDocumentTitle('What-if simulator');
  const { addPlan } = useApp();
  const toast = useToast();
  const navigate = useNavigate();
  const [i, setI] = useState<SimInputs>(DEFAULT_SIM);
  const set = <K extends keyof SimInputs>(k: K, v: SimInputs[K]) => setI((s) => ({ ...s, [k]: v }));
  const r = useMemo(() => simulate(i), [i]);
  const max = Math.max(...r.rows.map((x) => Math.max(x.before, x.after)), 1);
  const modeOpts = TRANSPORT_MODES.map((m) => ({ value: m.value, label: m.label }));
  const mode = (v: string) => TRANSPORT_MODES.find((m) => m.value === v)?.label ?? v;

  const addToPlan = () => {
    addPlan({ title: `Commute by ${mode(i.toMode).toLowerCase()} instead of ${mode(i.fromMode).toLowerCase()} on ${i.daysPerWeek} days`, description: 'From your what-if simulation.', impact: `Est. saves about ${fmt1(r.rows[0].before - r.rows[0].after)} kg CO₂e a month`, category: 'transport', day: null });
    toast.push('Scenario added to your plan.');
  };

  return (
    <div>
      <PageHeader title="What-if impact simulator" subtitle="Compare a hypothetical change with your current habits. Adjust the sliders and see the estimated difference per month."
        actions={<Button variant="secondary" iconLeft={RotateCcw} onClick={() => setI(DEFAULT_SIM)}>Reset</Button>} />
      <Alert variant="warning" className="mb-6">These results use illustrative placeholder factors, not verified data. Treat them as a way to compare options, not as measurements.</Alert>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Card className="flex flex-col gap-6">
          <Group title="Commute" hint="Swap how you travel on regular work or study days.">
            <Slider id="days" label="Days per week" value={i.daysPerWeek} min={0} max={7} unit="days" onChange={(v) => set('daysPerWeek', v)} />
            <Slider id="km" label="Distance each way" value={i.kmOneWay} min={1} max={40} unit="km" onChange={(v) => set('kmOneWay', v)} />
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Currently travel by" value={i.fromMode} options={modeOpts} onChange={(v) => set('fromMode', v)} />
              <SelectField label="What if you travelled by" value={i.toMode} options={modeOpts} onChange={(v) => set('toMode', v)} />
            </div>
          </Group>
          <Group title="Electricity" hint="Reduce your monthly electricity use, for example by raising the AC setting.">
            <Slider id="kwh" label="Current use per month" value={i.kwhMonth} min={50} max={500} step={10} unit="kWh" onChange={(v) => set('kwhMonth', v)} />
            <Slider id="ecut" label="Reduction" value={i.electricityCutPct} min={0} max={50} step={5} unit="%" onChange={(v) => set('electricityCutPct', v)} />
          </Group>
          <Group title="Food waste" hint="Plan meals and store leftovers to waste less.">
            <Slider id="fw" label="Food waste per week" value={i.foodWasteKgWeek} min={0} max={5} step={0.5} unit="kg" onChange={(v) => set('foodWasteKgWeek', v)} />
            <Slider id="fcut" label="Reduction" value={i.foodWasteCutPct} min={0} max={100} step={10} unit="%" onChange={(v) => set('foodWasteCutPct', v)} />
          </Group>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Estimated difference" subtitle="kg CO₂e per month" right={<Badge variant="neutral">Demo factors</Badge>} />
            <div className="mb-5 rounded-lg bg-brand-subtle p-4" aria-live="polite">
              <div className="text-body-s text-ink-secondary">Estimated saving</div>
              <div className="text-metric-xl text-brand-700">{fmt1(Math.max(r.saved, 0))}<span className="ml-2 text-body-m font-normal text-ink-secondary">kg CO₂e a month</span></div>
              <div className="text-body-s text-ink-secondary">{fmt0(Math.max(r.savedPct, 0))}% lower than your current estimate of {fmt1(r.beforeTotal)} kg across these three areas.</div>
            </div>
            <ul className="flex flex-col gap-5">
              {r.rows.map((x) => (
                <li key={x.key}>
                  <div className="mb-1 flex justify-between text-label-m"><span>{x.label}</span><span className={cn(x.after < x.before ? 'text-success-fg' : 'text-ink-secondary')}>{fmt1(x.before)} → {fmt1(x.after)} kg</span></div>
                  <div className="flex flex-col gap-1.5" role="img" aria-label={`${x.label}: now ${fmt1(x.before)} kilograms, with the change ${fmt1(x.after)} kilograms`}>
                    <div className="h-2.5 rounded-full bg-muted"><div className="h-full rounded-full bg-line-strong" style={{ width: `${(x.before / max) * 100}%` }} /></div>
                    <div className="h-2.5 rounded-full bg-muted"><div className="h-full rounded-full bg-brand" style={{ width: `${(x.after / max) * 100}%` }} /></div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-4 text-caption text-ink-secondary"><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-line-strong" />Now</span><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-brand" />With the change</span></div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={addToPlan} disabled={r.rows[0].before - r.rows[0].after <= 0}>Add commute change to plan</Button>
              <Button variant="secondary" iconLeft={Sparkles} onClick={() => navigate('/app/copilot', { state: { prompt: 'How can I reduce my commute emissions?' } })}>Ask Copilot</Button>
            </div>
          </Card>
          <Card>
            <CardHeader title="Assumptions" />
            <ul className="flex list-disc flex-col gap-2 pl-5 text-body-s text-ink-secondary">{r.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
            <p className="mt-3 text-body-s">See the full list on the <Link to="/methodology" className="text-brand-700 underline">Methodology</Link> page.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
