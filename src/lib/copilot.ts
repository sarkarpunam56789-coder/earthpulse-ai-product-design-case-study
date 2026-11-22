import { RECOMMENDATIONS } from '../data/content';
import { CATEGORIES } from '../data/categories';
import { Suggestion } from '../types';
import { Metrics } from './metrics';

export const COPILOT_ENDPOINT = (import.meta.env.VITE_COPILOT_API_URL as string | undefined)?.trim() || '';
export const IS_DEMO = !COPILOT_ENDPOINT;

export interface CopilotContext {
  firstName: string;
  city: string;
  carbonKg: number;
  waterL: number;
  wasteKg: number;
  carbonPct: number;
  waterPct: number;
  wastePct: number;
  elapsedPct: number;
  shares: Record<string, number>;
  segregationDays: number;
  ecoScore: number | null;
}

export function buildContext(name: string, city: string, m: Metrics): CopilotContext {
  const shares: Record<string, number> = {};
  m.categoryShare.forEach((c) => { shares[c.category] = Math.round(c.share); });
  return {
    firstName: name.split(' ')[0] || 'there', city,
    carbonKg: Math.round(m.totals.carbon * 10) / 10, waterL: Math.round(m.totals.water), wasteKg: Math.round(m.totals.waste * 10) / 10,
    carbonPct: Math.round(m.goalPct.carbon), waterPct: Math.round(m.goalPct.water), wastePct: Math.round(m.goalPct.waste),
    elapsedPct: Math.round(m.elapsedPct), shares, segregationDays: m.segregationDays, ecoScore: m.ecoScore,
  };
}

export interface CopilotReply { text: string; suggestion?: Suggestion; demo: boolean }

const rec = (id: string) => RECOMMENDATIONS.find((r) => r.id === id);
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function demoReply(q: string, c: CopilotContext): CopilotReply {
  const s = q.toLowerCase();
  const note = ' This is a demo reply built from your sample data and placeholder factors.';
  if (/(commute|transport|car|metro|travel|auto|bike|bus)/.test(s)) {
    const share = c.shares.transport ?? 0;
    return { demo: true, suggestion: rec('r-metro'), text: `Transport is about ${share}% of the carbon you've logged this month, so your commute is the biggest lever in your data. The simplest change is replacing two weekday car or auto trips with the metro. With the demo factors that could save roughly 1.2 kg CO₂e a week. These are estimates, not measurements.` };
  }
  if (/(water|shower|tap|leak|laundry)/.test(s)) {
    const pace = c.waterPct - c.elapsedPct;
    return { demo: true, suggestion: rec('r-tap'), text: pace > 0
      ? `You've used ${c.waterPct}% of your weekly water goal and ${c.elapsedPct}% of the week has passed, so you're running slightly ahead of pace. Shorter showers and fixing small leaks are usually the quickest wins.${note}`
      : `You've used ${c.waterPct}% of your weekly water goal with ${c.elapsedPct}% of the week gone, so you're on track. Keep an eye on laundry days, which tend to push totals up.${note}` };
  }
  if (/(waste|segregat|recycl|plastic|bin)/.test(s)) {
    return { demo: true, suggestion: rec('r-bag'), text: `You logged wet and dry separation on ${c.segregationDays} of the last 7 days, and you've used ${c.wastePct}% of your weekly waste goal. A second bin in the kitchen and a cloth bag for market trips usually make the biggest difference.${note}` };
  }
  if (/(electric|ac\b|air con|power|energy|kwh|fan)/.test(s)) {
    return { demo: true, suggestion: rec('r-ac'), text: `Electricity makes up about ${c.shares.electricity ?? 0}% of your logged carbon. The air conditioner is usually the largest single item. Setting it to 24–26 °C and switching it off when you leave the room can help.${note}` };
  }
  if (/(how.*(estimat|calculat)|method|factor|explain|accurate)/.test(s)) {
    return { demo: true, text: `Each activity you log is multiplied by an emission factor. For example, a 10 km metro trip is distance × a per-km factor. This prototype uses illustrative placeholder factors, not verified data, so treat every number as an estimate. The Methodology page lists the factors and the assumptions behind them.` };
  }
  if (/(focus|week|plan|start|priorit|next)/.test(s)) {
    const ratios = [['carbon', c.carbonPct], ['water', c.waterPct], ['waste', c.wastePct]] as const;
    const worst = [...ratios].sort((a, b) => b[1] - a[1])[0][0];
    const id = worst === 'carbon' ? 'r-metro' : worst === 'water' ? 'r-tap' : 'r-bag';
    return { demo: true, suggestion: rec(id), text: `This week you've used ${c.carbonPct}% of your carbon goal, ${c.waterPct}% of your water goal and ${c.wastePct}% of your waste goal. ${worst === 'carbon' ? 'Carbon' : worst === 'water' ? 'Water' : 'Waste'} is closest to its limit, so that's the best place to focus.${note}` };
  }
  if (/^(hi|hello|hey|namaste)/.test(s)) {
    return { demo: true, text: `Hi ${c.firstName}. I can explain your impact, suggest changes for ${c.city} living, and turn ideas into actions for your weekly plan. Try one of the suggested questions.` };
  }
  return { demo: true, text: `Here's where you stand this week: ${c.carbonKg} kg CO₂e, ${c.waterL} L of water and ${c.wasteKg} kg of waste so far. I can dig into transport, electricity, water or waste, or suggest a plan for the week. What would you like to look at?` };
}

export async function askCopilot(message: string, ctx: CopilotContext): Promise<CopilotReply> {
  if (!COPILOT_ENDPOINT) {
    await wait(900);
    if (message.trim().toLowerCase() === '/error') throw new Error('Simulated error');
    return demoReply(message, ctx);
  }
  const res = await fetch(COPILOT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context: ctx }),
  });
  if (!res.ok) throw new Error(`Copilot service returned ${res.status}`);
  const data = (await res.json()) as { text: string; suggestion?: Omit<Suggestion, 'id'> & { id?: string } };
  return {
    demo: false, text: data.text,
    suggestion: data.suggestion ? { id: data.suggestion.id ?? `ai-${Date.now()}`, ...data.suggestion } as Suggestion : undefined,
  };
}

export const categoryLabel = (c: keyof typeof CATEGORIES) => CATEGORIES[c].label;
