import { Activity, Category } from '../types';
import { addDays, dayDiff, startOfDay, startOfWeek, weekdayIndex, DAY_MS } from '../lib/dates';

/**
 * SAMPLE DATA. Generated relative to "now" so the demo always has a current week.
 * Daily targets (Mon → Sun) are illustrative; they are not real measurements.
 */
const CARBON_TARGET = [6.4, 7.2, 6.9, 5.4, 6.1, 7.4, 4.8];
const WATER_TARGET = [160, 155, 150, 147, 158, 172, 165];
const WASTE_TARGET = [0.6, 0.5, 0.6, 0.4, 0.5, 0.7, 0.4];
const CARBON_MULT = [1, 1.087, 1.05, 1.1, 1.06, 1.08];
const WATER_MULT = [1, 0.96, 1.0, 1.03, 0.98, 1.02];
const WASTE_MULT = [1, 1.14, 1.05, 1.0, 1.1, 0.95];

type CarbonItem = [Category, string, string, number, number, string]; // category, title, details, weight, hour, sub

function carbonItems(wd: number): CarbonItem[] {
  const weekend = wd >= 5;
  return [
    ['food', 'Breakfast', 'Idli and sambar · vegetarian', 0.07, 7.25, 'veg'],
    weekend
      ? ['transport', 'Metro to Cubbon Park', '5.2 km', 0.12, 9.5, 'metro']
      : ['transport', 'Metro to office', 'Indiranagar to MG Road · 8.4 km', 0.12, 8.7, 'metro'],
    ['food', 'Lunch', 'Thali · vegetarian', 0.08, 13.2, 'veg'],
    ['shopping', wd % 2 === 0 ? 'Groceries' : 'Online order', wd % 2 === 0 ? 'Vegetables and household items' : 'Household items', 0.13, 16.5, wd % 2 === 0 ? 'groceries' : 'delivery'],
    ['transport', 'Auto-rickshaw to market', '3.1 km', 0.14, 17.4, 'auto'],
    ['transport', 'Metro home', weekend ? '5.2 km' : 'MG Road to Indiranagar · 8.4 km', 0.12, 18.3, 'metro'],
    ['electricity', 'Home appliances', 'Fridge, fans and lights', 0.07, 19.5, 'other'],
    ['food', 'Dinner', 'Dal, rice and sabzi · vegetarian', 0.07, 20.2, 'veg'],
    ['electricity', 'Air conditioner', 'Bedroom · 3 hrs', 0.2, 21.0, 'ac'],
  ];
}

const WATER_ITEMS = (wd: number): [string, string, number, number, string][] => [
  ['Morning shower', '6 min', 0.28, 6.8, 'shower'],
  ['Cooking and drinking', 'Kitchen use', 0.22, 12.0, 'kitchen'],
  wd === 2 || wd === 6 ? ['Laundry', '1 load', 0.18, 16.0, 'laundry'] : ['Cleaning', 'Floors and bathroom', 0.18, 16.0, 'cleaning'],
  ['Washing dishes', 'After dinner', 0.12, 20.3, 'dishes'],
  ['Evening shower', '5 min', 0.2, 21.5, 'shower'],
];

const WASTE_ITEMS: [string, string, number, number, string, boolean][] = [
  ['Wet waste', 'Kitchen waste', 0.5, 19.0, 'wet', false],
  ['Dry waste', 'Packaging and paper', 0.3, 19.1, 'dry', false],
  ['Recyclables', 'Bottles and cans', 0.2, 19.2, 'recyclable', true],
];

const r1 = (n: number) => Math.round(n * 10) / 10;
const r2 = (n: number) => Math.round(n * 100) / 100;

export function buildSampleActivities(now: Date): Activity[] {
  const out: Activity[] = [];
  const weekStart = startOfWeek(now);
  for (let d = 34; d >= 0; d--) {
    const day = startOfDay(addDays(now, -d));
    const wd = weekdayIndex(day);
    const weeksAgo = Math.max(0, Math.ceil((weekStart.getTime() - day.getTime()) / (7 * DAY_MS)));
    const wk = Math.min(weeksAgo, CARBON_MULT.length - 1);
    const isToday = dayDiff(now, day) === 0;
    const stamp = (hour: number, idx: number, total: number) => {
      const t = new Date(day);
      t.setHours(Math.floor(hour), Math.round((hour % 1) * 60), 0, 0);
      if (isToday && t > now) return new Date(now.getTime() - (total - idx) * 7 * 60_000);
      return t;
    };

    // Carbon-bearing activities
    const target = CARBON_TARGET[wd] * CARBON_MULT[wk];
    const items = carbonItems(wd);
    let sum = 0;
    const vals = items.map((it) => { const v = r1(target * it[3]); sum += v; return v; });
    const acIdx = items.findIndex((it) => it[1] === 'Air conditioner');
    vals[acIdx] = r1(vals[acIdx] + (r1(target) - sum));
    items.forEach((it, i) => {
      out.push({
        id: `s-${d}-c${i}`, category: it[0], title: it[1], details: it[2],
        carbonKg: Math.max(0, vals[i]), waterL: 0, wasteKg: 0,
        at: stamp(it[4], i, items.length).toISOString(), sub: it[5], sample: true,
      });
    });

    // Water
    const wTarget = WATER_TARGET[wd] * WATER_MULT[wk];
    const wItems = WATER_ITEMS(wd);
    let wsum = 0;
    const wv = wItems.map((it) => { const v = Math.round(wTarget * it[2]); wsum += v; return v; });
    wv[0] += Math.round(wTarget) - wsum;
    wItems.forEach((it, i) => {
      out.push({
        id: `s-${d}-w${i}`, category: 'water', title: it[0], details: it[1],
        carbonKg: 0, waterL: wv[i], wasteKg: 0, at: stamp(it[3], i, wItems.length).toISOString(), sub: it[4], sample: true,
      });
    });

    // Waste
    const sTarget = WASTE_TARGET[wd] * WASTE_MULT[wk];
    const segregated = wd !== 1 && wd !== 4;
    WASTE_ITEMS.forEach((it, i) => {
      out.push({
        id: `s-${d}-s${i}`, category: 'waste', title: it[0], details: it[1] + (segregated ? ' · segregated' : ' · not segregated'),
        carbonKg: 0, waterL: 0, wasteKg: r2(sTarget * it[2]), at: stamp(it[3], i, WASTE_ITEMS.length).toISOString(),
        sub: it[4], segregated, recycled: it[5] && segregated, sample: true,
      });
    });
  }
  return out;
}

/** Previous five months, oldest first. Sample totals, used for trend and report comparisons. */
export const MONTHLY_SAMPLE = [
  { carbonKg: 214, waterL: 2750, wasteKg: 20.0 },
  { carbonKg: 205, waterL: 2680, wasteKg: 19.4 },
  { carbonKg: 211, waterL: 2720, wasteKg: 19.8 },
  { carbonKg: 196, waterL: 2610, wasteKg: 18.6 },
  { carbonKg: 182, waterL: 2540, wasteKg: 17.9 },
];
export const MONTHLY_SHARES: Record<'transport' | 'electricity' | 'food' | 'shopping', number> = {
  transport: 0.4, electricity: 0.28, food: 0.21, shopping: 0.11,
};
