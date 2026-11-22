import { FormEvent, useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { CATEGORIES, ALL_CATEGORIES } from '../../data/categories';
import { RECOMMENDATIONS } from '../../data/content';
import { useApp } from '../../hooks/useApp';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useToast } from '../../hooks/useToast';
import { DAY_NAMES, weekdayIndex } from '../../lib/dates';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { SelectField, TextField } from '../../components/ui/Fields';
import { ActionItem } from '../../components/features/ActionItem';
import { PageHeader } from '../../components/features/PageHeader';
import { ProgressRing } from '../../components/charts/ProgressRing';
import { Category, PlanItem } from '../../types';
import { cn } from '../../lib/cn';

export default function Planner() {
  useDocumentTitle('Action planner');
  const { state, now, togglePlan, setPlanDay, removePlan, addPlan, addSuggestionToPlan, inPlan } = useApp();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [day, setDay] = useState('');
  const [cat, setCat] = useState<Category>('transport');
  const [err, setErr] = useState('');
  const today = weekdayIndex(now);
  const done = state.plan.filter((p) => p.done).length;
  const pct = state.plan.length ? (done / state.plan.length) * 100 : 0;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 3) { setErr('Describe the action in at least 3 characters'); return; }
    addPlan({ title: title.trim(), description: 'Added by you', impact: 'Impact not estimated', category: cat, day: day === '' ? null : Number(day) });
    setTitle(''); setDay(''); setErr(''); toast.push('Action added to your plan.');
  };

  const Item = ({ p }: { p: PlanItem }) => {
    const c = CATEGORIES[p.category]; const I = c.icon;
    return (
      <li className="flex items-start gap-3 border-b border-line-subtle py-3 last:border-b-0">
        <button type="button" role="checkbox" aria-checked={p.done} aria-label={`Mark "${p.title}" as ${p.done ? 'not done' : 'done'}`} onClick={() => togglePlan(p.id)}
          className={cn('mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-[1.5px]', p.done ? 'border-brand bg-brand' : 'border-line-strong bg-surface hover:border-brand')}>
          {p.done && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} aria-hidden />}
        </button>
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md" style={{ backgroundColor: `${c.color}24` }}><I className="h-4 w-4" style={{ color: c.color }} aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <div className={cn('text-label-m', p.done && 'text-ink-secondary line-through')}>{p.title}</div>
          <div className="text-body-s text-ink-secondary">{p.description}</div>
          <div className="text-label-s text-success-fg">{p.impact}</div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <SelectField label={`Day for ${p.title}`} hideLabel value={p.day === null ? '' : String(p.day)} onChange={(v) => setPlanDay(p.id, v === '' ? null : Number(v))}
            options={[{ value: '', label: 'Any day' }, ...DAY_NAMES.map((n, i) => ({ value: String(i), label: n.slice(0, 3) }))]} className="w-28 [&>div]:h-9" />
          <button type="button" aria-label={`Remove ${p.title}`} onClick={() => removePlan(p.id)} className="rounded-sm p-1.5 text-ink-secondary hover:bg-subtle hover:text-danger"><X className="h-4 w-4" aria-hidden /></button>
        </div>
      </li>
    );
  };

  const unscheduled = state.plan.filter((p) => p.day === null);

  return (
    <div>
      <PageHeader title="Action planner" subtitle="Pick small actions, give them a day and tick them off. Your dashboard keeps count." />
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="This week" subtitle="Tap the circle to mark an action as done." />
            {state.plan.length === 0 && <p className="py-6 text-center text-body-s text-ink-secondary">Your plan is empty. Add an action below or pick a suggestion.</p>}
            {DAY_NAMES.map((n, i) => {
              const items = state.plan.filter((p) => p.day === i);
              if (!items.length) return null;
              return (
                <section key={n} className="mb-2" aria-label={n}>
                  <h3 className="mt-3 flex items-center gap-2 text-label-m text-ink-secondary">{n}{i === today && <Badge variant="brand">Today</Badge>}</h3>
                  <ul>{items.map((p) => <Item key={p.id} p={p} />)}</ul>
                </section>
              );
            })}
            {unscheduled.length > 0 && (
              <section aria-label="Any day"><h3 className="mt-3 text-label-m text-ink-secondary">Any day this week</h3><ul>{unscheduled.map((p) => <Item key={p.id} p={p} />)}</ul></section>
            )}
          </Card>
          <Card>
            <CardHeader title="Add your own action" />
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
              <TextField className="sm:col-span-2" label="What will you do?" placeholder="e.g. Carry a cloth bag to the market" value={title} error={err} onChange={(e) => { setTitle(e.target.value); setErr(''); }} />
              <SelectField label="Category" value={cat} onChange={(v) => setCat(v as Category)} options={ALL_CATEGORIES.map((c) => ({ value: c, label: CATEGORIES[c].label }))} />
              <SelectField label="Day" value={day} onChange={setDay} options={[{ value: '', label: 'Any day' }, ...DAY_NAMES.map((n, i) => ({ value: String(i), label: n }))]} />
              <div className="sm:col-span-2"><Button type="submit" iconLeft={Plus}>Add to plan</Button></div>
            </form>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Progress" />
            <div className="flex items-center gap-5">
              <ProgressRing value={pct} label={`${done}/${state.plan.length}`} ariaLabel={`${done} of ${state.plan.length} actions done`} />
              <div><div className="text-label-l">{done} of {state.plan.length} done</div>
                <p className="mt-1 text-body-s text-ink-secondary">{state.plan.length - done === 0 ? 'Plan complete. Add something new if you like.' : `${state.plan.length - done} left this week.`}</p></div>
            </div>
          </Card>
          <Card>
            <CardHeader title="Suggestions" right={<Badge variant="brand">AI · sample</Badge>} />
            <ul>{RECOMMENDATIONS.map((r) => <ActionItem key={r.id} suggestion={r} added={inPlan(r.id)} onAdd={() => { if (addSuggestionToPlan(r)) toast.push(`Added to your plan: ${r.title}`); }} />)}</ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
