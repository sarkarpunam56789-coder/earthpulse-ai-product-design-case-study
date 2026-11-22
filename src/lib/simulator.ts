import { GRID_KG_PER_KWH, TRANSPORT_MODES } from '../data/factors';

/** Placeholder factor for food waste, shown on the Methodology page as a demo value. */
export const FOOD_WASTE_KG_CO2E_PER_KG = 2.5;
const WEEKS_PER_MONTH = 4.33;

export interface SimInputs {
  daysPerWeek: number;
  kmOneWay: number;
  fromMode: string;
  toMode: string;
  kwhMonth: number;
  electricityCutPct: number;
  foodWasteKgWeek: number;
  foodWasteCutPct: number;
}

export const DEFAULT_SIM: SimInputs = {
  daysPerWeek: 5, kmOneWay: 8, fromMode: 'car', toMode: 'metro',
  kwhMonth: 180, electricityCutPct: 15, foodWasteKgWeek: 1.5, foodWasteCutPct: 40,
};

export interface SimResult {
  rows: { key: 'transport' | 'electricity' | 'foodwaste'; label: string; before: number; after: number }[];
  beforeTotal: number;
  afterTotal: number;
  saved: number;
  savedPct: number;
  assumptions: string[];
}

const factor = (mode: string) => TRANSPORT_MODES.find((m) => m.value === mode)?.kgPerKm ?? 0;

export function simulate(i: SimInputs): SimResult {
  const monthlyKm = i.daysPerWeek * i.kmOneWay * 2 * WEEKS_PER_MONTH;
  const tBefore = monthlyKm * factor(i.fromMode);
  const tAfter = monthlyKm * factor(i.toMode);
  const eBefore = i.kwhMonth * GRID_KG_PER_KWH;
  const eAfter = eBefore * (1 - i.electricityCutPct / 100);
  const fBefore = i.foodWasteKgWeek * WEEKS_PER_MONTH * FOOD_WASTE_KG_CO2E_PER_KG;
  const fAfter = fBefore * (1 - i.foodWasteCutPct / 100);
  const rows = [
    { key: 'transport' as const, label: 'Commute', before: tBefore, after: tAfter },
    { key: 'electricity' as const, label: 'Electricity', before: eBefore, after: eAfter },
    { key: 'foodwaste' as const, label: 'Food waste', before: fBefore, after: fAfter },
  ];
  const beforeTotal = rows.reduce((s, r) => s + r.before, 0);
  const afterTotal = rows.reduce((s, r) => s + r.after, 0);
  const saved = beforeTotal - afterTotal;
  return {
    rows, beforeTotal, afterTotal, saved, savedPct: beforeTotal > 0 ? (saved / beforeTotal) * 100 : 0,
    assumptions: [
      `Commute: ${i.daysPerWeek} days a week, ${i.kmOneWay} km each way, ${WEEKS_PER_MONTH} weeks a month.`,
      `Mode factors: ${TRANSPORT_MODES.map((m) => `${m.label} ${m.kgPerKm}`).join(', ')} kg CO₂e per km (placeholders).`,
      `Electricity: ${GRID_KG_PER_KWH} kg CO₂e per kWh (placeholder grid factor), applied to your monthly kWh.`,
      `Food waste: ${FOOD_WASTE_KG_CO2E_PER_KG} kg CO₂e per kg (placeholder).`,
      'All factors are illustrative demo values. Results are estimates, not measurements.',
    ],
  };
}
