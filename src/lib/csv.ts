import { Activity } from '../types';

const esc = (v: string | number | boolean | undefined) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function activitiesToCsv(acts: Activity[]) {
  const head = ['date_time', 'category', 'title', 'details', 'carbon_kg_co2e_estimate', 'water_litres_estimate', 'waste_kg', 'sample_data'];
  const rows = [...acts]
    .sort((a, b) => a.at.localeCompare(b.at))
    .map((a) => [a.at, a.category, a.title, a.details, a.carbonKg, a.waterL, a.wasteKg, a.sample ? 'yes' : 'no'].map(esc).join(','));
  return [head.join(','), ...rows].join('\n');
}

export function downloadFile(filename: string, content: string, mime = 'text/plain') {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
