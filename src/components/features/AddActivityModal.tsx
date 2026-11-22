import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { FORMS, FormValues, impactText } from '../../lib/activityForms';
import { toLocalInputValue } from '../../lib/dates';
import { useApp } from '../../hooks/useApp';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Checkbox, Chip, SelectField, TextField } from '../ui/Fields';

export function AddActivityModal({ open, onClose, categories, initial }: {
  open: boolean; onClose: () => void; categories: Category[]; initial?: Category;
}) {
  const { addActivity, removeActivity, now } = useApp();
  const toast = useToast();
  const [cat, setCat] = useState<Category>(initial ?? categories[0]);
  const [values, setValues] = useState<FormValues>(FORMS[initial ?? categories[0]].defaults);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [when, setWhen] = useState(toLocalInputValue(new Date()));

  useEffect(() => {
    if (open) {
      const c = initial ?? categories[0];
      setCat(c); setValues(FORMS[c].defaults); setErrors({}); setWhen(toLocalInputValue(new Date()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial]);

  const form = FORMS[cat];
  const preview = useMemo(() => form.compute(values).result, [form, values]);
  const set = (k: string, v: string | boolean) => { setValues((s) => ({ ...s, [k]: v })); setErrors((e) => ({ ...e, [k]: '' })); };
  const switchCat = (c: Category) => { setCat(c); setValues(FORMS[c].defaults); setErrors({}); };

  const save = () => {
    const { errors: errs, result } = form.compute(values);
    const whenDate = new Date(when);
    if (Number.isNaN(whenDate.getTime())) errs.when = 'Enter a valid date and time';
    else if (whenDate.getTime() > Date.now() + 60_000) errs.when = 'Choose a time that has already happened';
    if (Object.keys(errs).length || !result) { setErrors(errs); return; }
    const id = addActivity({ category: cat, title: result.title, details: result.details, carbonKg: result.carbonKg, waterL: result.waterL, wasteKg: result.wasteKg, at: whenDate.toISOString(), sub: result.sub, segregated: result.segregated, recycled: result.recycled });
    toast.push('Activity saved. Your dashboard has been updated.', { actionLabel: 'Undo', onAction: () => removeActivity(id) });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={form.title}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={save}>Save activity</Button></>}>
      <div className="flex flex-col gap-5">
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Activity type">
            {categories.map((c) => <Chip key={c} selected={cat === c} onClick={() => switchCat(c)}>{CATEGORIES[c].label}</Chip>)}
          </div>
        )}
        {form.fields.map((f) => {
          if (f.kind === 'chips') {
            return (
              <div key={f.key}>
                <div className="mb-2 text-label-m">{f.label}</div>
                <div className="flex flex-wrap gap-2">
                  {f.options!.map((o) => <Chip key={o.value} selected={values[f.key] === o.value} onClick={() => set(f.key, o.value)}>{o.label}</Chip>)}
                </div>
              </div>
            );
          }
          if (f.kind === 'select') return <SelectField key={f.key} label={f.label} value={String(values[f.key])} options={f.options!} onChange={(v) => set(f.key, v)} />;
          if (f.kind === 'checkbox') return <Checkbox key={f.key} label={f.label} checked={!!values[f.key]} onChange={(v) => set(f.key, v)} />;
          const unit = f.unit?.(values);
          return (
            <TextField key={f.key} label={f.label} type="number" inputMode="decimal" min="0" step={f.step} placeholder={f.placeholder}
              value={String(values[f.key] ?? '')} error={errors[f.key]} onChange={(e) => set(f.key, e.target.value)}
              rightSlot={unit ? <span className="text-body-s text-ink-secondary">{unit}</span> : undefined} />
          );
        })}
        <TextField label="When" type="datetime-local" value={when} max={toLocalInputValue(new Date())} error={errors.when} onChange={(e) => { setWhen(e.target.value); setErrors((x) => ({ ...x, when: '' })); }} />
        <div className="rounded-md bg-subtle p-4" aria-live="polite">
          <div className="flex items-center justify-between">
            <span className="text-label-m">Estimated impact</span>
            <span className="text-label-l">{preview ? impactText(cat, preview) : '—'}</span>
          </div>
          <p className="mt-1 text-caption text-ink-secondary">
            Estimate based on illustrative demo factors, not verified data. <Link to="/methodology" target="_blank" className="text-brand-700 underline">See Methodology</Link>.
          </p>
        </div>
      </div>
    </Modal>
  );
}
