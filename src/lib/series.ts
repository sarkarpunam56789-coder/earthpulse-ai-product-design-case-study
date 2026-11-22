import { Activity } from '../types';
import { addDays, DAY_LABELS, startOfDay, startOfWeek, weekdayIndex, DAY_MS } from './dates';

export type Accessor = (a: Activity) => number;

export interface Point { label: string; value: number | null; highlight?: boolean; tooltip?: string }

/** Monday → Sunday of the current week. Days after today are null. */
export function weekSeries(acts: Activity[], now: Date, get: Accessor, unit: string, digits = 1): Point[] {
  const ws = startOfWeek(now);
  const today = weekdayIndex(now);
  const sums = Array(7).fill(0);
  for (const a of acts) {
    const idx = Math.round((startOfDay(new Date(a.at)).getTime() - ws.getTime()) / DAY_MS);
    if (idx >= 0 && idx < 7) sums[idx] += get(a);
  }
  const f = Math.pow(10, digits);
  return sums.map((v, i) => ({
    label: DAY_LABELS[i], value: i <= today ? Math.round(v * f) / f : null, highlight: i === today,
    tooltip: `${DAY_LABELS[i]} · ${Math.round(v * f) / f} ${unit}`,
  }));
}

/** Last N days ending today. Only every 5th label is printed to keep the axis legible. */
export function rangeSeries(acts: Activity[], now: Date, days: number, get: Accessor, unit: string, digits = 1): Point[] {
  const today = startOfDay(now);
  const f = Math.pow(10, digits);
  const out: Point[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = addDays(today, -i);
    let sum = 0;
    for (const a of acts) if (startOfDay(new Date(a.at)).getTime() === d.getTime()) sum += get(a);
    const v = Math.round(sum * f) / f;
    out.push({ label: (days - 1 - i) % 5 === 0 || i === 0 ? String(d.getDate()) : '', value: v, highlight: i === 0, tooltip: `${d.getDate()}/${d.getMonth() + 1} · ${v} ${unit}` });
  }
  return out;
}
