import { FormEvent, useState } from 'react';
import { Minus, Plus, Target, Trash2 } from 'lucide-react';
import { Goal } from '../../types';
import { useApp } from '../../hooks/useApp';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useToast } from '../../hooks/useToast';
import { fmt0, fmt1 } from '../../lib/format';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { SelectField, TextField } from '../../components/ui/Fields';
import { Modal } from '../../components/ui/Modal';
import { Progress } from '../../components/ui/Progress';
import { PageHeader } from '../../components/features/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';

const UNIT = { carbon: 'kg CO₂e', water: 'L', waste: 'kg' } as const;

export default function Goals() {
  useDocumentTitle('Goals');
  const { state, metrics, addGoal, updateGoal, removeGoal } = useApp();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [kind, setKind] = useState<'cap' | 'habit'>('cap');
  const [metric, setMetric] = useState<'carbon' | 'water' | 'waste'>('carbon');
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [errors, setErrors] = useState<{ title?: string; target?: string }>({});

  const openNew = () => { setEditing(null); setKind('cap'); setMetric('carbon'); setTitle(''); setTarget(''); setErrors({}); setOpen(true); };
  const openEdit = (g: Goal) => { setEditing(g); setKind(g.kind); setMetric(g.metric ?? 'carbon'); setTitle(g.title); setTarget(String(g.target)); setErrors({}); setOpen(true); };

  const progressOf = (g: Goal) => (g.kind === 'cap' && g.metric ? metrics.totals[g.metric] : g.current);
  const onTrack = state.goals.filter((g) => (g.kind === 'cap' ? progressOf(g) / g.target * 100 <= metrics.elapsedPct + 5 : progressOf(g) >= g.target * 0.5)).length;

  const save = (e: FormEvent) => {
    e.preventDefault();
    const t = parseFloat(target); const errs: typeof errors = {};
    if (title.trim().length < 3) errs.title = 'Give the goal a name of at least 3 characters';
    if (!(t > 0)) errs.target = 'Enter a target above 0';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const unit = kind === 'cap' ? UNIT[metric] : 'days';
    if (editing) { updateGoal(editing.id, { title: title.trim(), target: t }); toast.push('Goal updated.'); }
    else { addGoal({ title: title.trim(), kind, metric: kind === 'cap' ? metric : undefined, target: t, unit, current: 0 }); toast.push('Goal added.'); }
    setOpen(false);
  };

  const caps = state.goals.filter((g) => g.kind === 'cap');
  const habits = state.goals.filter((g) => g.kind === 'habit');

  return (
    <div>
      <PageHeader title="Goals" subtitle={`${onTrack} of ${state.goals.length} goals on track this week.`} actions={<Button iconLeft={Plus} onClick={openNew}>Add goal</Button>} />
      {state.goals.length === 0 && <EmptyState icon={Target} title="No goals yet" text="Set a weekly limit or a habit to keep track of." action={<Button onClick={openNew}>Add your first goal</Button>} />}
      {caps.length > 0 && (
        <section className="mb-8" aria-labelledby="caps-h">
          <h2 id="caps-h" className="mb-3 text-h3">Weekly limits</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {caps.map((g) => {
              const val = progressOf(g); const pct = (val / g.target) * 100;
              const over = pct > 100; const ahead = pct - metrics.elapsedPct > 5;
              return (
                <Card key={g.id} className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2"><h3 className="text-h4">{g.title}</h3>
                    <Badge variant={over ? 'error' : ahead ? 'warning' : 'success'}>{over ? 'Over limit' : ahead ? 'Ahead of pace' : 'On track'}</Badge></div>
                  <div className="text-metric-m">{g.metric === 'water' ? fmt0(val) : fmt1(val)}<span className="ml-1 text-body-s font-normal text-ink-secondary">of {fmt0(g.target)} {g.unit}</span></div>
                  <Progress value={pct} tone={over ? 'danger' : g.metric === 'water' ? 'water' : g.metric === 'waste' ? 'waste' : 'brand'} label={`${g.title} progress`} />
                  <p className="text-caption text-ink-secondary">{Math.round(pct)}% used, {Math.round(metrics.elapsedPct)}% of the week gone.</p>
                  <div className="mt-auto flex gap-2"><Button size="sm" variant="secondary" onClick={() => openEdit(g)}>Edit</Button><Button size="sm" variant="ghost" iconLeft={Trash2} onClick={() => { removeGoal(g.id); toast.push('Goal removed.'); }}>Remove</Button></div>
                </Card>
              );
            })}
          </div>
        </section>
      )}
      {habits.length > 0 && (
        <section aria-labelledby="habits-h">
          <h2 id="habits-h" className="mb-3 text-h3">Habits</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {habits.map((g) => {
              const pct = (g.current / g.target) * 100; const complete = g.current >= g.target;
              return (
                <Card key={g.id} className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2"><h3 className="text-h4">{g.title}</h3>{complete && <Badge variant="success">Done</Badge>}</div>
                  {g.note && <p className="text-body-s text-ink-secondary">{g.note}</p>}
                  <div className="text-metric-m">{g.current}<span className="ml-1 text-body-s font-normal text-ink-secondary">of {g.target} {g.unit}</span></div>
                  <Progress value={pct} label={`${g.title} progress`} />
                  <div className="mt-auto flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="secondary" iconLeft={Minus} aria-label={`Remove one ${g.unit.slice(0, -1)} from ${g.title}`} disabled={g.current <= 0} onClick={() => updateGoal(g.id, { current: g.current - 1 })}>1</Button>
                    <Button size="sm" iconLeft={Plus} aria-label={`Add one ${g.unit.slice(0, -1)} to ${g.title}`} disabled={g.current >= g.target} onClick={() => { updateGoal(g.id, { current: g.current + 1 }); if (g.current + 1 >= g.target) toast.push('Habit goal reached. Nice work.'); }}>1</Button>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(g)}>Edit</Button>
                    <Button size="sm" variant="ghost" iconLeft={Trash2} onClick={() => { removeGoal(g.id); toast.push('Goal removed.'); }}>Remove</Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit goal' : 'Add a goal'}
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save as unknown as () => void}>Save goal</Button></>}>
        <form onSubmit={save} className="flex flex-col gap-5" noValidate>
          {!editing && <SelectField label="Type" value={kind} onChange={(v) => setKind(v as 'cap' | 'habit')} options={[{ value: 'cap', label: 'Weekly limit (stay under a number)' }, { value: 'habit', label: 'Habit (reach a number of days)' }]} />}
          {!editing && kind === 'cap' && <SelectField label="What to limit" value={metric} onChange={(v) => setMetric(v as 'carbon' | 'water' | 'waste')} options={[{ value: 'carbon', label: 'Carbon (kg CO₂e)' }, { value: 'water', label: 'Water (L)' }, { value: 'waste', label: 'Waste (kg)' }]} />}
          <TextField label="Goal name" placeholder="e.g. Keep weekly carbon under 45 kg" value={title} error={errors.title} onChange={(e) => { setTitle(e.target.value); setErrors((x) => ({ ...x, title: undefined })); }} />
          <TextField label={`Target (${kind === 'cap' ? UNIT[metric] : 'days'})`} type="number" min="0" value={target} error={errors.target} onChange={(e) => { setTarget(e.target.value); setErrors((x) => ({ ...x, target: undefined })); }} />
          <button type="submit" className="sr-only">Save</button>
        </form>
      </Modal>
    </div>
  );
}
