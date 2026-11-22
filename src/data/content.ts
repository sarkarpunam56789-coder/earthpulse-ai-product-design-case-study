import { Goal, PlanItem, Suggestion, Profile, Settings } from '../types';

export const RECOMMENDATIONS: Suggestion[] = [
  { id: 'r-metro', title: 'Take the metro twice more this week', description: 'Replace two short car or auto trips on weekdays.', impact: 'Est. saves about 1.2 kg CO₂e (demo factors)', category: 'transport' },
  { id: 'r-ac', title: 'Set the AC to 24–26 °C', description: 'A slightly higher setting can reduce evening electricity use.', impact: 'Est. saves about 0.8 kg CO₂e a week', category: 'electricity' },
  { id: 'r-tap', title: 'Fix the dripping kitchen tap', description: 'Small leaks add up over a week.', impact: 'Est. saves about 20 L a day', category: 'water' },
  { id: 'r-veg', title: 'Plan two extra vegetarian dinners', description: 'Swap one or two non-vegetarian meals for a vegetarian option.', impact: 'Est. saves about 1.9 kg CO₂e a week', category: 'food' },
  { id: 'r-bag', title: 'Carry a cloth bag for groceries', description: 'Skip single-use carry bags on your market trips.', impact: 'Est. avoids a small amount of plastic waste', category: 'waste' },
  { id: 'r-load', title: 'Run full loads in the washing machine', description: 'Wait until you have a full load before washing.', impact: 'Est. saves about 40 L a week', category: 'water' },
];

export const DEFAULT_GOALS: Goal[] = [
  { id: 'g-carbon', title: 'Keep weekly carbon under 50 kg CO₂e', kind: 'cap', metric: 'carbon', target: 50, unit: 'kg CO₂e', current: 0 },
  { id: 'g-water', title: 'Keep weekly water use under 1,050 L', kind: 'cap', metric: 'water', target: 1050, unit: 'L', current: 0 },
  { id: 'g-waste', title: 'Keep weekly waste under 5 kg', kind: 'cap', metric: 'waste', target: 5, unit: 'kg', current: 0 },
  { id: 'g-metro', title: 'Take the metro on 3 weekdays', kind: 'habit', target: 3, unit: 'days', current: 2, note: 'Counts days you travelled by metro this week.' },
  { id: 'g-segregate', title: 'Segregate wet and dry waste every day', kind: 'habit', target: 7, unit: 'days', current: 5 },
];

export const DEFAULT_PLAN: PlanItem[] = [
  { id: 'p-ac', title: 'Switch off the AC when leaving the room', description: 'A quick habit for evenings at home.', impact: 'Est. saves about 0.5 kg CO₂e', category: 'electricity', day: 0, done: true },
  { id: 'p-seg', title: 'Segregate wet and dry waste daily', description: 'Keep two bins in the kitchen.', impact: 'Supports your waste goal', category: 'waste', day: 1, done: true },
  { id: 'p-shower', title: 'Keep showers under 5 minutes on three days', description: 'Use a timer if it helps.', impact: 'Est. saves about 25 L per shower', category: 'water', day: 2, done: true },
  { id: 'p-metro', title: 'Take the metro for the Friday commute', description: 'Leave the car or auto at home for one more day.', impact: 'Est. saves about 0.6 kg CO₂e', category: 'transport', day: 4, done: false },
  { id: 'p-log', title: 'Log meals for three more days', description: 'Better logs make your estimates more useful.', impact: 'Improves estimate quality', category: 'food', day: null, done: false },
];

export const DEFAULT_PROFILE: Profile = {
  name: 'Ananya Rao',
  email: 'ananya@example.com',
  ageGroup: '25–34',
  household: '2',
  homeType: 'Apartment',
  state: 'Karnataka',
  city: 'Bengaluru',
  commute: 'public',
  diet: 'Vegetarian',
  ac: 'Sometimes',
  interests: ['carbon', 'water', 'waste'],
  baseline: { kwh: '180', travelKm: '60', meat: 'None', segregation: 'Always' },
};

export const DEFAULT_SETTINGS: Settings = {
  units: 'metric',
  language: 'English',
  notifications: { weeklySummary: true, goalReminders: true, tips: false, productUpdates: false },
  privacy: { analytics: false, personalised: true, shareProgress: false },
};

export const STATES_AND_CITIES: Record<string, string[]> = {
  Karnataka: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi'],
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
  Delhi: ['New Delhi', 'Delhi NCR'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
  Telangana: ['Hyderabad', 'Warangal'],
  'West Bengal': ['Kolkata', 'Siliguri'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara'],
  Meghalaya: ['Shillong', 'Tura'],
  Assam: ['Guwahati', 'Dibrugarh'],
  Kerala: ['Kochi', 'Thiruvananthapuram', 'Kozhikode'],
};

export const POPULAR_CITIES: { city: string; state: string }[] = [
  { city: 'Bengaluru', state: 'Karnataka' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Delhi NCR', state: 'Delhi' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Ahmedabad', state: 'Gujarat' },
];

export const COPILOT_PROMPTS = [
  'How can I reduce my commute emissions?',
  'Why is my water use above pace?',
  'What should I focus on this week?',
  'How is my impact estimated?',
  'Help me cut waste at home',
];
