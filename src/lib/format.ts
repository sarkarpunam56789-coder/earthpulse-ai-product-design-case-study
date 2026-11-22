export const round1 = (n: number) => Math.round(n * 10) / 10;
export const fmt1 = (n: number) => round1(n).toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const fmt0 = (n: number) => Math.round(n).toLocaleString('en-IN');
export const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
export const pct = (part: number, whole: number) => (whole > 0 ? (part / whole) * 100 : 0);
export const uid = (p = 'id') => `${p}-${Math.random().toString(36).slice(2, 9)}`;

/** Round a maximum up to a "nice" axis value and return 4 ticks (top → 0). */
export function niceTicks(max: number): number[] {
  const raw = Math.max(max, 1) / 3;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const steps = [1, 2, 2.5, 5, 10];
  const step = (steps.find((s) => s * pow >= raw) ?? 10) * pow;
  return [step * 3, step * 2, step, 0];
}
