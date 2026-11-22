import { Category } from '../types';
import { fmt1 } from './format';
import {
  APPLIANCES, GRID_KG_PER_KWH, MEALS, SHOPPING_ITEMS, TRANSPORT_MODES, WASTE_TYPES, WATER_USES,
} from '../data/factors';

export type FormValues = Record<string, string | boolean>;

export interface FieldDef {
  key: string;
  label: string;
  kind: 'chips' | 'number' | 'select' | 'checkbox';
  options?: { value: string; label: string }[];
  placeholder?: string;
  helper?: string;
  unit?: (v: FormValues) => string;
  step?: string;
}

export interface Computed {
  title: string;
  details: string;
  carbonKg: number;
  waterL: number;
  wasteKg: number;
  sub: string;
  segregated?: boolean;
  recycled?: boolean;
}

export interface FormDef {
  title: string;
  fields: FieldDef[];
  defaults: FormValues;
  compute: (v: FormValues) => { errors: Record<string, string>; result?: Computed };
}

const num = (v: string | boolean | undefined) => (typeof v === 'string' ? parseFloat(v) : NaN);
const opts = <T extends { value: string; label: string }>(a: T[]) => a.map(({ value, label }) => ({ value, label }));

export const FORMS: Record<Category, FormDef> = {
  transport: {
    title: 'Log a trip',
    fields: [
      { key: 'mode', label: 'How did you travel?', kind: 'chips', options: opts(TRANSPORT_MODES) },
      { key: 'distance', label: 'Distance (km)', kind: 'number', placeholder: 'e.g. 8.4', step: '0.1' },
    ],
    defaults: { mode: 'metro', distance: '' },
    compute: (v) => {
      const d = num(v.distance);
      const errors: Record<string, string> = {};
      if (!(d > 0)) errors.distance = 'Enter a distance above 0';
      else if (d > 2000) errors.distance = 'Enter a distance under 2,000 km';
      if (Object.keys(errors).length) return { errors };
      const m = TRANSPORT_MODES.find((x) => x.value === v.mode)!;
      return { errors, result: { title: `${m.label} trip`, details: `${d} km`, carbonKg: d * m.kgPerKm, waterL: 0, wasteKg: 0, sub: m.value } };
    },
  },
  electricity: {
    title: 'Log electricity use',
    fields: [
      { key: 'appliance', label: 'Appliance', kind: 'select', options: opts(APPLIANCES) },
      { key: 'hours', label: 'Hours used', kind: 'number', placeholder: 'e.g. 3', step: '0.5' },
    ],
    defaults: { appliance: 'ac', hours: '' },
    compute: (v) => {
      const h = num(v.hours);
      const errors: Record<string, string> = {};
      if (!(h > 0)) errors.hours = 'Enter hours above 0';
      else if (h > 24) errors.hours = 'Enter 24 hours or fewer';
      if (Object.keys(errors).length) return { errors };
      const a = APPLIANCES.find((x) => x.value === v.appliance)!;
      const kwh = a.kw * h;
      return { errors, result: { title: a.label, details: `${h} hrs · ${fmt1(kwh)} kWh`, carbonKg: kwh * GRID_KG_PER_KWH, waterL: 0, wasteKg: 0, sub: a.value } };
    },
  },
  food: {
    title: 'Log a meal',
    fields: [
      { key: 'meal', label: 'Meal type', kind: 'select', options: opts(MEALS) },
      { key: 'servings', label: 'Servings', kind: 'number', placeholder: '1', step: '1' },
    ],
    defaults: { meal: 'veg', servings: '1' },
    compute: (v) => {
      const s = num(v.servings);
      const errors: Record<string, string> = {};
      if (!(s > 0)) errors.servings = 'Enter servings above 0';
      else if (s > 20) errors.servings = 'Enter 20 servings or fewer';
      if (Object.keys(errors).length) return { errors };
      const m = MEALS.find((x) => x.value === v.meal)!;
      return { errors, result: { title: m.label, details: `${s} serving${s === 1 ? '' : 's'}`, carbonKg: m.kg * s, waterL: 0, wasteKg: 0, sub: m.value } };
    },
  },
  shopping: {
    title: 'Log a purchase',
    fields: [
      { key: 'item', label: 'What did you buy?', kind: 'select', options: opts(SHOPPING_ITEMS) },
      { key: 'count', label: 'How many?', kind: 'number', placeholder: '1', step: '1' },
    ],
    defaults: { item: 'groceries', count: '1' },
    compute: (v) => {
      const c = num(v.count);
      const errors: Record<string, string> = {};
      if (!(c > 0)) errors.count = 'Enter a number above 0';
      else if (c > 100) errors.count = 'Enter 100 or fewer';
      if (Object.keys(errors).length) return { errors };
      const s = SHOPPING_ITEMS.find((x) => x.value === v.item)!;
      return { errors, result: { title: s.label, details: `${c} × item`, carbonKg: s.kg * c, waterL: 0, wasteKg: 0, sub: s.value } };
    },
  },
  water: {
    title: 'Log water use',
    fields: [
      { key: 'use', label: 'What did you use water for?', kind: 'select', options: opts(WATER_USES) },
      { key: 'qty', label: 'Amount', kind: 'number', placeholder: 'e.g. 6', step: '1', unit: (v) => WATER_USES.find((x) => x.value === v.use)?.unit ?? '' },
    ],
    defaults: { use: 'shower', qty: '' },
    compute: (v) => {
      const q = num(v.qty);
      const errors: Record<string, string> = {};
      if (!(q > 0)) errors.qty = 'Enter an amount above 0';
      else if (q > 5000) errors.qty = 'Enter a smaller amount';
      if (Object.keys(errors).length) return { errors };
      const u = WATER_USES.find((x) => x.value === v.use)!;
      return { errors, result: { title: u.label, details: `${q} ${u.unit}`, carbonKg: 0, waterL: Math.round(q * u.litresPer), wasteKg: 0, sub: u.value } };
    },
  },
  waste: {
    title: 'Log waste',
    fields: [
      { key: 'type', label: 'Type of waste', kind: 'select', options: opts(WASTE_TYPES) },
      { key: 'kg', label: 'Weight (kg)', kind: 'number', placeholder: 'e.g. 0.6', step: '0.1' },
      { key: 'segregated', label: 'Segregated at home', kind: 'checkbox' },
      { key: 'recycled', label: 'Sent for recycling', kind: 'checkbox' },
    ],
    defaults: { type: 'wet', kg: '', segregated: true, recycled: false },
    compute: (v) => {
      const k = num(v.kg);
      const errors: Record<string, string> = {};
      if (!(k > 0)) errors.kg = 'Enter a weight above 0';
      else if (k > 100) errors.kg = 'Enter 100 kg or less';
      if (Object.keys(errors).length) return { errors };
      const t = WASTE_TYPES.find((x) => x.value === v.type)!;
      return {
        errors,
        result: {
          title: t.label.split(' (')[0], details: `${k} kg · ${v.segregated ? 'segregated' : 'not segregated'}`,
          carbonKg: 0, waterL: 0, wasteKg: k, sub: t.value, segregated: !!v.segregated, recycled: !!v.recycled,
        },
      };
    },
  },
};

export function impactText(category: Category, r: Computed) {
  if (category === 'water') return `${Math.round(r.waterL)} L`;
  if (category === 'waste') return `${fmt1(r.wasteKg)} kg`;
  return `${fmt1(r.carbonKg)} kg CO₂e`;
}
