import { Activity, Category, Goal } from '../types';
import { MONTHLY_SAMPLE, MONTHLY_SHARES } from '../data/sample';
import { CARBON_CATEGORIES } from '../data/categories';
import { MONTH_SHORT, MONTH_LONG, DAY_MS, addDays, daysInMonth, startOfDay, startOfWeek, weekdayIndex } from './dates';
import { clamp, round1 } from './format';

export type CarbonCategory = 'transport' | 'electricity' | 'food' | 'shopping';

export interface Metrics {
  hasData: boolean;
  todayIdx: number;
  week: { carbon: (number | null)[]; water: (number | null)[]; waste: (number | null)[] };
  totals: { carbon: number; water: number; waste: number };
  prevTotals: { carbon: number; water: number; waste: number };
  trend: { carbon: number; water: number; waste: number }; // % change vs same days last week
  targets: { carbon: number; water: number; waste: number };
  goalPct: { carbon: number; water: number; waste: number };
  elapsedPct: number;
  ecoScore: number | null;
  categoryShare: { category: CarbonCategory; kg: number; share: number }[];
  monthCarbon: number;
  monthly: { label: string; weeklyAvg: number; partial: boolean }[];
  streak: number;
  segregationDays: number;
  topCategory: { category: CarbonCategory; share: number } | null;
}

const capTarget = (goals: Goal[], metric: 'carbon' | 'water' | 'waste', fallback: number) =>
  goals.find((g) => g.kind === 'cap' && g.metric === metric)?.target ?? fallback;

export function computeMetrics(acts: Activity[], goals: Goal[], now: Date): Metrics {
  const weekStart = startOfWeek(now);
  const todayIdx = weekdayIndex(now);
  const prevStart = addDays(weekStart, -7);

  const bucket = (start: Date) => {
    const c = Array(7).fill(0), w = Array(7).fill(0), s = Array(7).fill(0);
    for (const a of acts) {
      const idx = Math.round((startOfDay(new Date(a.at)).getTime() - start.getTime()) / DAY_MS);
      if (idx >= 0 && idx < 7) { c[idx] += a.carbonKg; w[idx] += a.waterL; s[idx] += a.wasteKg; }
    }
    return { c, w, s };
  };
  const cur = bucket(weekStart);
  const prev = bucket(prevStart);
  const sumTo = (arr: number[]) => arr.slice(0, todayIdx + 1).reduce((x, y) => x + y, 0);
  const totals = { carbon: sumTo(cur.c), water: sumTo(cur.w), waste: sumTo(cur.s) };
  const prevTotals = { carbon: sumTo(prev.c), water: sumTo(prev.w), waste: sumTo(prev.s) };
  const change = (a: number, b: number) => (b > 0 ? ((a - b) / b) * 100 : 0);
  const trend = {
    carbon: change(totals.carbon, prevTotals.carbon),
    water: change(totals.water, prevTotals.water),
    waste: change(totals.waste, prevTotals.waste),
  };
  const targets = { carbon: capTarget(goals, 'carbon', 50), water: capTarget(goals, 'water', 1050), waste: capTarget(goals, 'waste', 5) };
  const goalPct = {
    carbon: (totals.carbon / targets.carbon) * 100,
    water: (totals.water / targets.water) * 100,
    waste: (totals.waste / targets.waste) * 100,
  };
  const elapsed = (todayIdx + 1) / 7;
  const hasData = acts.some((a) => (new Date(a.at).getTime() - weekStart.getTime()) / DAY_MS >= 0);
  const weighted = 0.5 * (goalPct.carbon / 100 / elapsed) + 0.3 * (goalPct.water / 100 / elapsed) + 0.2 * (goalPct.waste / 100 / elapsed);
  const ecoScore = hasData ? clamp(Math.round(100 - 42 * weighted), 0, 100) : null;

  // month-to-date category shares
  const monthActs = acts.filter((a) => { const d = new Date(a.at); return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth(); });
  const kgBy: Record<CarbonCategory, number> = { transport: 0, electricity: 0, food: 0, shopping: 0 };
  for (const a of monthActs) if ((CARBON_CATEGORIES as Category[]).includes(a.category)) kgBy[a.category as CarbonCategory] += a.carbonKg;
  const monthCarbon = Object.values(kgBy).reduce((x, y) => x + y, 0);
  const categoryShare = (Object.keys(kgBy) as CarbonCategory[])
    .map((category) => ({ category, kg: kgBy[category], share: monthCarbon > 0 ? (kgBy[category] / monthCarbon) * 100 : 0 }));
  const top = [...categoryShare].sort((a, b) => b.share - a.share)[0];

  // six-month trend: weekly average
  const monthly: Metrics['monthly'] = [];
  for (let i = 5; i >= 1; i--) {
    const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const weeks = daysInMonth(m.getFullYear(), m.getMonth()) / 7;
    monthly.push({ label: MONTH_SHORT[m.getMonth()], weeklyAvg: round1(MONTHLY_SAMPLE[5 - i].carbonKg / weeks), partial: false });
  }
  monthly.push({ label: MONTH_SHORT[now.getMonth()], weeklyAvg: round1(monthCarbon / now.getDate() * 7), partial: true });

  // streak
  const days = new Set(acts.map((a) => startOfDay(new Date(a.at)).getTime()));
  let streak = 0;
  for (let d = 0; d < 60; d++) { if (days.has(startOfDay(addDays(now, -d)).getTime())) streak++; else break; }

  // segregation days in last 7
  const segDays = new Set<number>();
  for (const a of acts) {
    if (a.category === 'waste' && a.segregated) {
      const diff = Math.round((startOfDay(now).getTime() - startOfDay(new Date(a.at)).getTime()) / DAY_MS);
      if (diff >= 0 && diff < 7) segDays.add(diff);
    }
  }

  const wk = (arr: number[]) => arr.map((v, i) => (i <= todayIdx ? round1(v) : null));
  return {
    hasData, todayIdx,
    week: { carbon: wk(cur.c), water: wk(cur.w), waste: cur.s.map((v, i) => (i <= todayIdx ? Math.round(v * 10) / 10 : null)) },
    totals, prevTotals, trend, targets, goalPct, elapsedPct: elapsed * 100, ecoScore,
    categoryShare, monthCarbon, monthly, streak, segregationDays: segDays.size,
    topCategory: top && top.share > 0 ? { category: top.category, share: top.share } : null,
  };
}

export interface MonthReport {
  label: string;
  partial: boolean;
  carbonKg: number;
  waterL: number;
  wasteKg: number;
  byCategory: Record<CarbonCategory, number>;
}

/** offset 0 = current month (from logged activities); 1–5 = sample history. */
export function monthlyReport(acts: Activity[], now: Date, offset: number): MonthReport {
  const m = new Date(now.getFullYear(), now.getMonth() - offset, 1);
  const label = `${MONTH_LONG[m.getMonth()]} ${m.getFullYear()}`;
  if (offset === 0) {
    const by: Record<CarbonCategory, number> = { transport: 0, electricity: 0, food: 0, shopping: 0 };
    let carbonKg = 0, waterL = 0, wasteKg = 0;
    for (const a of acts) {
      const d = new Date(a.at);
      if (d.getFullYear() === m.getFullYear() && d.getMonth() === m.getMonth()) {
        carbonKg += a.carbonKg; waterL += a.waterL; wasteKg += a.wasteKg;
        if (a.category in by) by[a.category as CarbonCategory] += a.carbonKg;
      }
    }
    return { label, partial: true, carbonKg, waterL, wasteKg, byCategory: by };
  }
  const s = MONTHLY_SAMPLE[5 - offset];
  const by = {} as Record<CarbonCategory, number>;
  (Object.keys(MONTHLY_SHARES) as CarbonCategory[]).forEach((k) => { by[k] = s.carbonKg * MONTHLY_SHARES[k]; });
  return { label, partial: false, carbonKg: s.carbonKg, waterL: s.waterL, wasteKg: s.wasteKg, byCategory: by };
}
