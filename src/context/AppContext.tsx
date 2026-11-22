import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Activity, Chat, Goal, PlanItem, Profile, Settings, Suggestion } from '../types';
import { buildSampleActivities } from '../data/sample';
import { DEFAULT_GOALS, DEFAULT_PLAN, DEFAULT_PROFILE, DEFAULT_SETTINGS } from '../data/content';
import { computeMetrics, Metrics } from '../lib/metrics';
import { uid } from '../lib/format';

interface State {
  authed: boolean;
  onboarded: boolean;
  useSample: boolean;
  profile: Profile;
  settings: Settings;
  userActivities: Activity[];
  goals: Goal[];
  plan: PlanItem[];
  chats: Chat[];
  activeChatId: string | null;
}

const KEY = 'earthpulse-ai-demo-v1';

const freshState = (): State => ({
  authed: false, onboarded: false, useSample: true,
  profile: DEFAULT_PROFILE, settings: DEFAULT_SETTINGS, userActivities: [],
  goals: DEFAULT_GOALS, plan: DEFAULT_PLAN, chats: [], activeChatId: null,
});

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as State;
      if (s && s.profile && s.goals) return { ...freshState(), ...s };
    }
  } catch { /* ignore corrupt storage */ }
  return freshState();
}

interface Ctx {
  state: State;
  now: Date;
  activities: Activity[];
  metrics: Metrics;
  signUp: (name: string, email: string) => void;
  signIn: (email: string) => void;
  signOut: () => void;
  startDemo: () => void;
  setProfile: (patch: Partial<Profile>) => void;
  completeOnboarding: (useSample: boolean) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  addActivity: (a: Omit<Activity, 'id'>) => string;
  removeActivity: (id: string) => void;
  clearSample: () => void;
  loadSample: () => void;
  resetDemo: () => void;
  togglePlan: (id: string) => void;
  addPlan: (p: Omit<PlanItem, 'id' | 'done'>) => void;
  addSuggestionToPlan: (s: Suggestion) => boolean;
  inPlan: (recId: string) => boolean;
  setPlanDay: (id: string, day: number | null) => void;
  removePlan: (id: string) => void;
  addGoal: (g: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  setChats: (fn: (c: Chat[]) => Chat[]) => void;
  setActiveChat: (id: string | null) => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const now = useMemo(() => new Date(), []);
  const [state, setState] = useState<State>(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage may be unavailable */ }
  }, [state]);

  const activities = useMemo(
    () => [...(state.useSample ? buildSampleActivities(now) : []), ...state.userActivities],
    [state.useSample, state.userActivities, now],
  );
  const metrics = useMemo(() => computeMetrics(activities, state.goals, now), [activities, state.goals, now]);
  const patch = useCallback((p: Partial<State>) => setState((s) => ({ ...s, ...p })), []);

  const value: Ctx = {
    state, now, activities, metrics,
    // A new account starts from a neutral profile (not the demo user's answers).
    signUp: (name, email) => setState((s) => ({
      ...s, authed: true, onboarded: false,
      profile: { ...DEFAULT_PROFILE, name: name || 'Friend', email, ageGroup: '', household: '', homeType: '', interests: [], baseline: { kwh: '', travelKm: '', meat: '', segregation: 'Always' } },
    })),
    signIn: (email) => setState((s) => ({ ...s, authed: true, onboarded: true, profile: { ...s.profile, email: email || s.profile.email } })),
    signOut: () => patch({ authed: false }),
    startDemo: () => setState({ ...freshState(), authed: true, onboarded: true }),
    setProfile: (p) => setState((s) => ({ ...s, profile: { ...s.profile, ...p } })),
    completeOnboarding: (useSample) => patch({ onboarded: true, useSample }),
    updateSettings: (p) => setState((s) => ({ ...s, settings: { ...s.settings, ...p } })),
    addActivity: (a) => {
      const id = uid('act');
      setState((s) => ({ ...s, userActivities: [{ ...a, id }, ...s.userActivities] }));
      return id;
    },
    removeActivity: (id) => setState((s) => ({ ...s, userActivities: s.userActivities.filter((a) => a.id !== id) })),
    clearSample: () => patch({ useSample: false }),
    loadSample: () => patch({ useSample: true }),
    resetDemo: () => setState((s) => ({ ...freshState(), authed: s.authed, onboarded: s.onboarded })),
    togglePlan: (id) => setState((s) => ({ ...s, plan: s.plan.map((p) => (p.id === id ? { ...p, done: !p.done } : p)) })),
    addPlan: (p) => setState((s) => ({ ...s, plan: [...s.plan, { ...p, id: uid('plan'), done: false }] })),
    addSuggestionToPlan: (sg) => {
      let added = false;
      setState((s) => {
        if (s.plan.some((p) => p.recId === sg.id)) return s;
        added = true;
        return { ...s, plan: [...s.plan, { id: uid('plan'), title: sg.title, description: sg.description, impact: sg.impact, category: sg.category, day: null, done: false, recId: sg.id }] };
      });
      return added;
    },
    inPlan: (recId) => state.plan.some((p) => p.recId === recId),
    setPlanDay: (id, day) => setState((s) => ({ ...s, plan: s.plan.map((p) => (p.id === id ? { ...p, day } : p)) })),
    removePlan: (id) => setState((s) => ({ ...s, plan: s.plan.filter((p) => p.id !== id) })),
    addGoal: (g) => setState((s) => ({ ...s, goals: [...s.goals, { ...g, id: uid('goal') }] })),
    updateGoal: (id, p) => setState((s) => ({ ...s, goals: s.goals.map((g) => (g.id === id ? { ...g, ...p } : g)) })),
    removeGoal: (id) => setState((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) })),
    setChats: (fn) => setState((s) => ({ ...s, chats: fn(s.chats) })),
    setActiveChat: (id) => patch({ activeChatId: id }),
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useAppContext() {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp must be used inside AppProvider');
  return c;
}
