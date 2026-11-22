export const DAY_MS = 86_400_000;
export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MONTH_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
export const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const weekdayIndex = (d: Date) => (d.getDay() + 6) % 7; // Monday = 0
export const startOfWeek = (d: Date) => addDays(startOfDay(d), -weekdayIndex(d));
export const dayDiff = (a: Date, b: Date) => Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / DAY_MS);
export const isSameDay = (a: Date, b: Date) => dayDiff(a, b) === 0;
export const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

export function fmtClock(d: Date) {
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ap = h >= 12 ? 'pm' : 'am';
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
}

export function fmtWhen(iso: string, now: Date) {
  const d = new Date(iso);
  const diff = dayDiff(now, d);
  if (diff === 0) return `Today, ${fmtClock(d)}`;
  if (diff === 1) return `Yesterday, ${fmtClock(d)}`;
  if (diff < 7) return `${DAY_LABELS[weekdayIndex(d)]}, ${fmtClock(d)}`;
  return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}, ${fmtClock(d)}`;
}

export function fmtRange(start: Date, end: Date) {
  return `${start.getDate()}–${end.getDate()} ${MONTH_SHORT[end.getMonth()]} ${end.getFullYear()}`;
}

export function greeting(now: Date) {
  const h = now.getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

export const toLocalInputValue = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};
