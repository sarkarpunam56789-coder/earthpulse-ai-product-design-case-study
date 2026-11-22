// Server-renders every route to catch render-time errors, then checks key numbers.
// Run with: npm run smoke
import { createServer } from 'vite';

const store = {};
globalThis.localStorage = { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; }, removeItem: (k) => { delete store[k]; } };

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const content = await vite.ssrLoadModule('/src/data/content.ts');
const { buildSampleActivities } = await vite.ssrLoadModule('/src/data/sample.ts');
const { computeMetrics } = await vite.ssrLoadModule('/src/lib/metrics.ts');
const { render, renderCaseStudy } = await vite.ssrLoadModule('/scripts/smoke-entry.tsx');

let failed = 0;
const check = (name, ok, extra = '') => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  ' + extra : ''}`); if (!ok) failed++; };

// --- metrics vs the dashboard spec (Mon–Thu sample week) ---
const now = new Date();
const acts = buildSampleActivities(now);
const m = computeMetrics(acts, content.DEFAULT_GOALS, now);
console.log(`Today index ${m.todayIdx} (0=Mon). Totals:`, JSON.stringify(m.totals), 'trend%:', JSON.stringify(m.trend), 'eco:', m.ecoScore);
// Fixed Thursday (19 Nov 2026) so the spec numbers can be asserted on any day.
const thu = new Date(2026, 10, 19, 15, 0, 0);
const mt = computeMetrics(buildSampleActivities(thu), content.DEFAULT_GOALS, thu);
check('Thursday: carbon this week = 25.9', Math.abs(mt.totals.carbon - 25.9) < 0.15, `got ${mt.totals.carbon.toFixed(2)}`);
check('Thursday: water this week = 612', Math.abs(mt.totals.water - 612) <= 3, `got ${Math.round(mt.totals.water)}`);
check('Thursday: waste this week = 2.1', Math.abs(mt.totals.waste - 2.1) < 0.05, `got ${mt.totals.waste.toFixed(2)}`);
check('Thursday: eco score = 62', mt.ecoScore === 62, `got ${mt.ecoScore}`);
check('Thursday: carbon 52% of goal', Math.round(mt.goalPct.carbon) === 52);
check('Thursday: water 58% of goal', Math.round(mt.goalPct.water) === 58);
check('Thursday: waste 42% of goal', Math.round(mt.goalPct.waste) === 42);
check('Thursday: trends ≈ -8 / +4 / -12', Math.round(mt.trend.carbon) === -8 && Math.round(mt.trend.water) === 4 && Math.round(mt.trend.waste) === -12);
check('Thursday: shares ≈ 38/27/22/13', mt.categoryShare.every((c, i) => Math.abs(c.share - [38, 27, 22, 13][['transport','electricity','food','shopping'].indexOf(c.category)]) < 6));
check('segregation days = 5 (of 7)', m.segregationDays >= 4 && m.segregationDays <= 6, `got ${m.segregationDays}`);
check('category shares sum to 100', Math.abs(m.categoryShare.reduce((s, c) => s + c.share, 0) - 100) < 0.01);
check('6 monthly points', m.monthly.length === 6);

// --- render every route ---
const base = { profile: content.DEFAULT_PROFILE, settings: content.DEFAULT_SETTINGS, goals: content.DEFAULT_GOALS, plan: content.DEFAULT_PLAN, userActivities: [], chats: [], activeChatId: null, useSample: true };
const routes = [
  ['/', 'Know your footprint', false], ['/about', 'India first', false], ['/features', 'Carbon tracker', false], ['/how-it-works', 'Common questions', false],
  ['/copilot', 'What it doesn', false], ['/methodology', 'How an estimate is built', false], ['/case-study', 'Problem framing', false], ['/get-started', 'Welcome to EarthPulse AI', false],
  ['/signup', 'Create your account', false], ['/signin', 'Sign in', false], ['/onboarding', 'Tell us about you', true],
  ['/app', 'Overall impact this week', true], ['/app/carbon', 'Carbon tracker', true], ['/app/water', 'Water tracker', true], ['/app/waste', 'Waste tracker', true],
  ['/app/copilot', 'AI Sustainability Copilot', true], ['/app/planner', 'Action planner', true], ['/app/goals', 'Weekly limits', true],
  ['/app/simulator', 'What-if impact simulator', true], ['/app/reports', 'Six-month comparison', true], ['/app/settings', 'Profile and settings', true],
  ['/does-not-exist', 'Page not found', false],
];
for (const [path, needle, authed] of routes) {
  store['earthpulse-ai-demo-v1'] = JSON.stringify({ ...base, authed, onboarded: path !== '/onboarding' });
  try {
    const html = (path === '/case-study' ? renderCaseStudy() : render(path)).replace(/<!-- -->/g, '');
    check(`render ${path}`, html.length > 800 && html.includes(needle), `${html.length} bytes`);
  } catch (e) { check(`render ${path}`, false, String(e && e.message || e).slice(0, 200)); }
}

// --- guard redirects ---
store['earthpulse-ai-demo-v1'] = JSON.stringify({ ...base, authed: false, onboarded: false });
check('unauthenticated /app does not render the app', !render('/app').includes('Overall impact this week'));

// --- dashboard spec sections ---
store['earthpulse-ai-demo-v1'] = JSON.stringify({ ...base, authed: true, onboarded: true });
const dash = render('/app').replace(/<!-- -->/g, '');
for (const s of ['Log trip', 'Eco score', 'Daily carbon footprint', 'AI insights', 'Carbon footprint', 'Water use', 'Waste generated', 'Carbon trend by month', 'Carbon by category', 'Recent activity', "This week&#x27;s plan", 'Recommended for you']) {
  check(`dashboard section: ${s}`, dash.includes(s));
}
await vite.close();
console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
