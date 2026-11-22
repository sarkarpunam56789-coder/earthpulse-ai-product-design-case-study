import { CalendarCheck, Cloud, Droplets, FileText, LayoutDashboard, LucideIcon, Settings, SlidersHorizontal, Sparkles, Target, Trash2 } from 'lucide-react';

export interface NavEntry { to: string; label: string; icon: LucideIcon; end?: boolean }
export const NAV_GROUPS: { label: string; items: NavEntry[] }[] = [
  {
    label: 'Track',
    items: [
      { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/app/carbon', label: 'Carbon tracker', icon: Cloud },
      { to: '/app/water', label: 'Water tracker', icon: Droplets },
      { to: '/app/waste', label: 'Waste tracker', icon: Trash2 },
    ],
  },
  {
    label: 'Act',
    items: [
      { to: '/app/copilot', label: 'AI Copilot', icon: Sparkles },
      { to: '/app/planner', label: 'Action planner', icon: CalendarCheck },
      { to: '/app/goals', label: 'Goals', icon: Target },
      { to: '/app/simulator', label: 'What-if simulator', icon: SlidersHorizontal },
      { to: '/app/reports', label: 'Impact reports', icon: FileText },
    ],
  },
];
export const SETTINGS_NAV: NavEntry = { to: '/app/settings', label: 'Profile & settings', icon: Settings };
