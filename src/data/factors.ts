/**
 * ILLUSTRATIVE PLACEHOLDER FACTORS
 * These numbers exist so the prototype can show how an estimate is built.
 * They are NOT verified measurements. Replace them with sourced, region-specific
 * factors (and cite the sources on the Methodology page) before any real use.
 */
export const FACTOR_DISCLAIMER =
  'Illustrative placeholder factors for this prototype. They are not verified measurements and must be replaced with sourced, region-specific data before real-world use.';

export const FACTOR_VERSION = 'demo-0.1';

export const TRANSPORT_MODES = [
  { value: 'walk', label: 'Walk', kgPerKm: 0 },
  { value: 'cycle', label: 'Cycle', kgPerKm: 0 },
  { value: 'metro', label: 'Metro or train', kgPerKm: 0.04 },
  { value: 'bus', label: 'Bus', kgPerKm: 0.08 },
  { value: 'auto', label: 'Auto-rickshaw', kgPerKm: 0.1 },
  { value: 'twowheeler', label: 'Two-wheeler', kgPerKm: 0.07 },
  { value: 'car', label: 'Car', kgPerKm: 0.18 },
];

export const GRID_KG_PER_KWH = 0.7;

export const APPLIANCES = [
  { value: 'ac', label: 'Air conditioner', kw: 1.2 },
  { value: 'fan', label: 'Fan', kw: 0.07 },
  { value: 'geyser', label: 'Water heater', kw: 2.0 },
  { value: 'lights', label: 'Lights', kw: 0.1 },
  { value: 'washer', label: 'Washing machine', kw: 0.5 },
  { value: 'fridge', label: 'Refrigerator', kw: 0.15 },
  { value: 'other', label: 'Other appliance', kw: 0.3 },
];

export const MEALS = [
  { value: 'veg', label: 'Vegetarian meal', kg: 0.5 },
  { value: 'vegan', label: 'Vegan meal', kg: 0.4 },
  { value: 'egg', label: 'Meal with egg', kg: 0.8 },
  { value: 'chicken', label: 'Meal with chicken', kg: 1.5 },
  { value: 'fish', label: 'Meal with fish', kg: 1.6 },
  { value: 'mutton', label: 'Meal with mutton', kg: 3.0 },
];

export const SHOPPING_ITEMS = [
  { value: 'groceries', label: 'Groceries (one basket)', kg: 2 },
  { value: 'household', label: 'Household item', kg: 3 },
  { value: 'clothing', label: 'Clothing item', kg: 6 },
  { value: 'electronics', label: 'Electronic item', kg: 30 },
  { value: 'delivery', label: 'Online delivery', kg: 0.5 },
];

export const WATER_USES = [
  { value: 'shower', label: 'Shower', unit: 'minutes', litresPer: 9 },
  { value: 'bucket', label: 'Bucket bath', unit: 'buckets', litresPer: 15 },
  { value: 'laundry', label: 'Laundry', unit: 'loads', litresPer: 50 },
  { value: 'dishes', label: 'Washing dishes', unit: 'sessions', litresPer: 15 },
  { value: 'kitchen', label: 'Cooking and drinking', unit: 'litres', litresPer: 1 },
  { value: 'cleaning', label: 'Cleaning', unit: 'litres', litresPer: 1 },
  { value: 'garden', label: 'Garden and plants', unit: 'minutes', litresPer: 6 },
];

export const WASTE_TYPES = [
  { value: 'wet', label: 'Wet or kitchen waste' },
  { value: 'dry', label: 'Dry waste' },
  { value: 'recyclable', label: 'Recyclables (paper, metal, glass)' },
  { value: 'ewaste', label: 'E-waste' },
  { value: 'hazardous', label: 'Hazardous (batteries, medicines)' },
];

/** Shown on the Methodology page. */
export const FACTOR_ROWS = [
  { area: 'Transport', unit: 'kg CO₂e per km', rows: TRANSPORT_MODES.map((m) => [m.label, String(m.kgPerKm)]) },
  { area: 'Electricity', unit: 'kg CO₂e per kWh', rows: [['Grid average (placeholder)', String(GRID_KG_PER_KWH)]] },
  { area: 'Food', unit: 'kg CO₂e per meal', rows: MEALS.map((m) => [m.label, String(m.kg)]) },
  { area: 'Shopping', unit: 'kg CO₂e per item', rows: SHOPPING_ITEMS.map((m) => [m.label, String(m.kg)]) },
];
