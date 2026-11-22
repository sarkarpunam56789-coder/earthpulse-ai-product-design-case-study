/**
 * CASE STUDY CONTENT
 * Everything the /case-study page says lives in this file so you can edit it without touching components.
 *
 * Honesty rules built into the page:
 *  - Every claim carries an evidence tag (assumption, heuristic, planned, expected, built, secondary, validated).
 *  - "validated" is only shown for items you add to `CASE.findings` after real research.
 *  - Nothing here is a research result, a test result or a measured impact.
 */

export type EvidenceKind = 'assumption' | 'heuristic' | 'planned' | 'expected' | 'built' | 'secondary' | 'validated';

export const CASE = {
  title: 'EarthPulse AI: a design case study',
  subtitle: 'From an AI-generated first build to a product worth testing: a critical audit, a problem worth solving, and an honest research plan.',
  // EDIT: describe exactly what you did.
  role: 'Product designer (edit: add your name and role)',
  timeline: 'Edit: add your dates',
  tools: ['Figma', 'React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Claude (AI assistant)'],
  aiDisclosure:
    'The first working build of EarthPulse AI was generated with an AI assistant (Claude) from my written briefs. This case study starts with a critical audit of that build and shows where my own design thinking, research and decisions begin. (Edit this note so it describes exactly what you did.)',
  // Optional: link to your Figma file (leave empty to hide the button).
  figmaUrl: '',
  // UPDATE these numbers as you complete research. They drive the status banners on the page.
  research: { interviewsCompleted: 0, usabilitySessionsCompleted: 0, competitorsAnalysed: 0, participantsPlanned: 1 },
  // ADD validated findings here after your sessions (see README). While empty, the page shows a template, not data.
  findings: [] as { id: string; observation: string; pattern: string; insight: string; opportunity: string; evidence: string }[],
  // OPTIONAL: your own sketches or photos. Put files in /public/case-study/ and list them here.
  sketchImages: [] as { src: string; caption: string }[],
};

export const SECTIONS = [
  { id: 'problem', n: '01', short: 'Problem', title: 'Problem framing' },
  { id: 'constraints', n: '02', short: 'Constraints', title: 'System constraints' },
  { id: 'research', n: '03', short: 'Research', title: 'Research' },
  { id: 'strategy', n: '04', short: 'Strategy', title: 'Strategy' },
  { id: 'exploration', n: '05', short: 'Exploration', title: 'Exploration' },
  { id: 'design-system', n: '06', short: 'Design system', title: 'Design system' },
  { id: 'experiences', n: '07', short: 'Experiences', title: 'Key experiences and flows' },
  { id: 'impact', n: '08', short: 'Impact', title: 'Impact' },
  { id: 'solution', n: '09', short: 'Solution', title: 'Solution' },
] as const;

export const FACTS = [
  { value: '6', label: 'activity categories logged' },
  { value: '10 + 1', label: 'app screens plus onboarding' },
  { value: '21', label: 'routes in the build' },
  { value: '0', label: 'users tested so far' },
];

/* ---------- 1. Problem framing ---------- */
export const PROBLEM_STATEMENT =
  'Urban adults in India who want to live more sustainably have no quick, trustworthy way to see which of their everyday habits matter most, or to turn that knowledge into small changes they can keep.';

export const PAINS_ASSUMED = [
  { id: 'PA1', text: 'I don’t know which of my habits has the biggest effect.' },
  { id: 'PA2', text: 'Footprint tools feel generic, foreign or too technical.' },
  { id: 'PA3', text: 'Tracking everything is tedious, so I stop.' },
  { id: 'PA4', text: 'Advice is vague or preachy. I don’t know what to do first.' },
  { id: 'PA5', text: 'I can’t tell whether small actions matter.' },
  { id: 'PA6', text: 'I can’t tell whether to trust a number I can’t check.' },
];

export const PAINS_PREDICTED = [
  { id: 'PC1', text: 'Long setup that ends without a personal result', ref: 'H1, H2, H3', sev: 4 },
  { id: 'PC2', text: 'Logging many small items every day, with no shortcuts', ref: 'H5', sev: 4 },
  { id: 'PC3', text: 'Not knowing which numbers are mine (sample data mixed in)', ref: 'H4', sev: 4 },
  { id: 'PC4', text: 'Unclear difference between goal, habit, action and plan', ref: 'H6, H7', sev: 3 },
  { id: 'PC5', text: 'Jargon (CO₂e) and an unexplained score', ref: 'H8', sev: 3 },
  { id: 'PC6', text: 'Hard to find Water, Waste, Goals, Reports on mobile', ref: 'H11', sev: 3 },
  { id: 'PC7', text: 'Keyboard and focus problems; skipped heading levels', ref: 'H13', sev: 3 },
];

export const HMWS = [
  { theme: 'Time to value', q: 'How might we show a new person a believable first estimate within minutes, using only what they already know?', ref: 'PC1' },
  { theme: 'Effort', q: 'How might we make recording everyday activity take seconds, or make most of it unnecessary?', ref: 'PC2' },
  { theme: 'Trust', q: 'How might we help people understand, and sensibly trust, an estimate they cannot verify?', ref: 'PC5' },
  { theme: 'Trust', q: 'How might we be clear about uncertainty without discouraging people?', ref: 'N3' },
  { theme: 'Clarity', q: 'How might we show the one most useful thing about this week without a dashboard of everything?', ref: 'PC1, PC4' },
  { theme: 'Action', q: 'How might we turn an insight into one small action that fits this person’s week?', ref: 'PA4' },
  { theme: 'Action', q: 'How might we make “what I’m doing this week” one idea instead of six?', ref: 'PC4' },
  { theme: 'Motivation', q: 'How might we show progress without guilt or false precision?', ref: 'PA5' },
  { theme: 'Context', q: 'How might we make advice feel relevant to life in a specific Indian city?', ref: 'PA2' },
  { theme: 'Inclusion', q: 'How might we serve people with no fixed commute or shared bills?', ref: 'A10' },
  { theme: 'Access', q: 'How might we make every core action reachable one-handed on a phone?', ref: 'PC6' },
];

/* ---------- 2. System constraints ---------- */
export const CONSTRAINTS = [
  {
    key: 'technical', title: 'Technical', icon: 'cpu',
    items: ['Front-end only: no server, no database', 'State lives in the browser (localStorage)', 'Sign-in is simulated', 'English only; no translation layer'],
    response: 'Label demo behaviour clearly; keep data export and reset one tap away.',
  },
  {
    key: 'ai', title: 'AI', icon: 'sparkles',
    items: ['Copilot is scripted: 7 keyword intents', 'A real model could state wrong things confidently', 'Replies cannot cite sources yet', 'Only totals and city would be sent to a service'],
    response: 'Show “Demo mode”. Say when a number is an estimate. Never put keys in the browser.',
  },
  {
    key: 'data', title: 'Data', icon: 'database',
    items: ['Emission and usage factors are placeholders', 'All input is self-reported and recalled', 'Sample and real entries can mix', 'No verified India-specific dataset yet'],
    response: 'Publish factors on the Methodology page; separate sample data from the user’s own.',
  },
  {
    key: 'business', title: 'Business and research', icon: 'briefcase',
    items: ['No business model defined', 'Solo designer, about 2 working days for research', 'One participant reachable, online only', 'Personal-data law to check before launch'],
    response: 'Run a small, honest study; report limits; don’t invent market numbers.',
  },
];

export const TRADEOFFS = [
  { left: 'Precision', right: 'Low effort', pos: 78, chose: 'Estimates from simple inputs', risk: 'Numbers may feel vague or untrustworthy' },
  { left: 'Honesty', right: 'Motivation', pos: 28, chose: 'Always label estimates and samples', risk: 'Caveats add visual weight and may dampen delight' },
  { left: 'Depth', right: 'Breadth', pos: 80, chose: 'Carbon, water and waste together', risk: 'Three trackers dilute the core loop' },
  { left: 'Realistic demo', right: 'Clean data', pos: 30, chose: 'Pre-filled sample week', risk: 'Sample entries mix with the user’s own' },
  { left: 'Scripted AI', right: 'Real AI', pos: 25, chose: 'Labelled demo Copilot', risk: 'Cannot test trust in real AI answers' },
  { left: 'Ship fast', right: 'Accessibility rigour', pos: 38, chose: 'AA contrast and labelled charts, not full audit', risk: 'Tabs, focus and modal gaps remain' },
];

/* ---------- 3. Research ---------- */
export const LADDER = [
  { kind: 'assumption' as const, title: 'Assumption', text: 'Believed at concept stage. Untested.' },
  { kind: 'heuristic' as const, title: 'Heuristic finding', text: 'Found by inspecting the product.' },
  { kind: 'secondary' as const, title: 'Secondary evidence', text: 'Published work and products analysed.' },
  { kind: 'planned' as const, title: 'Primary, n = 1', text: 'One interview and test. Directional only.' },
  { kind: 'validated' as const, title: 'Validated pattern', text: 'Repeated across several participants.' },
];

// x = uncertainty, y = impact if wrong (both 0–100). These are my judgements, not data.
export const ASSUMPTIONS = [
  { id: 'A1', text: 'People will log manually and keep doing it', x: 85, y: 95 },
  { id: 'A2', text: 'Seeing a footprint changes behaviour', x: 78, y: 82 },
  { id: 'A3', text: 'Generic factors are accurate enough to motivate', x: 60, y: 73 },
  { id: 'A4', text: 'Users want carbon, water and waste together', x: 62, y: 46 },
  { id: 'A5', text: 'Weekly limits are a motivating frame', x: 50, y: 40 },
  { id: 'A6', text: 'India-first means city list, transit modes, segregation', x: 42, y: 38 },
  { id: 'A7', text: 'A chat assistant is a valued way to get advice', x: 70, y: 45 },
  { id: 'A8', text: 'Individuals act alone; no household layer needed', x: 48, y: 30 },
  { id: 'A9', text: 'Users can recall AC hours, km and kWh', x: 70, y: 72 },
  { id: 'A10', text: 'One urban-commuter persona represents the audience', x: 66, y: 64 },
  { id: 'A11', text: 'Desktop-first dashboards suit real use', x: 54, y: 56 },
];

export const NEEDS = [
  'Understand what matters most in my life',
  'Know it will cost little time',
  'Understand and trust the numbers',
  'See progress without feeling judged',
  'Get specific, doable next steps',
  'Stay motivated over weeks',
  'Control my data',
  'Advice that reflects Indian daily life',
];

export const RESEARCH_ACTIVITIES = [
  { n: 1, title: 'Interview + usability session', hours: 3.5, detail: '30 min interview, then 35 min test on the live prototype. One participant, online.', evidence: 'planned' as const },
  { n: 2, title: 'Competitor teardown', hours: 4, detail: 'Four products plus one adjacent habit tracker.', evidence: 'secondary' as const },
  { n: 3, title: 'Effort audit', hours: 1.5, detail: 'Time and count taps to log a realistic day. Measures effort, not users.', evidence: 'planned' as const },
  { n: 4, title: 'Secondary reading', hours: 1.5, detail: 'Three or four published sources on carbon apps and tracker fatigue.', evidence: 'secondary' as const },
];

export const SCHEDULE = [
  { day: 'Day 1', block: 'Deploy, pilot, fix blockers', h: 1.5 },
  { day: 'Day 1', block: 'Consent, scripts, templates', h: 1 },
  { day: 'Day 1', block: 'Recruit', h: 0.5 },
  { day: 'Day 1', block: 'Competitor teardown', h: 4 },
  { day: 'Day 2', block: 'Participant session', h: 1.25 },
  { day: 'Day 2', block: 'Debrief notes', h: 0.75 },
  { day: 'Day 2', block: 'Effort audit', h: 1.5 },
  { day: 'Day 2', block: 'Secondary reading', h: 1.5 },
  { day: 'Day 2', block: 'Organise evidence', h: 1.5 },
];

export const INTERVIEW_QS = [
  { q: 'Tell me about the last time you thought about your environmental impact. What was going on?', tests: 'PH1' },
  { q: 'What have you done in the last few months to reduce it? Walk me through one example.', tests: 'PH3' },
  { q: 'Have you ever tracked something regularly? Tell me about the last time. What happened to it?', tests: 'A1, PH4' },
  { q: 'If I asked what contributes most to your personal footprint, what would you say? How do you know?', tests: 'PH1' },
  { q: 'When you see a footprint or energy number, how do you decide whether to believe it?', tests: 'PH5' },
  { q: 'Think of sustainability advice you have come across. What did you ignore, and why?', tests: 'PA4' },
  { q: 'How would you find out how much electricity your home uses in a month?', tests: 'A9' },
  { q: 'How do you feel about scores, streaks or rankings in apps?', tests: 'N4' },
];

export const COMPETITORS = [
  { name: 'CarbonWatch', note: 'Government app (India) for a personal footprint estimate', status: 'Not yet analysed' },
  { name: 'Earth Hero', note: 'Survey, then a gamified action plan; volunteer-run', status: 'Not yet analysed' },
  { name: 'Commons (was Joro)', note: 'Estimates from spending data; little manual logging', status: 'Not yet analysed' },
  { name: 'Klima / MyEarth', note: 'Survey-first with subscription, or a diary-style logger', status: 'Not yet analysed' },
];

export const COMPARE_DIMENSIONS = [
  'Onboarding length', 'Logging effort', 'Shows its method', 'Action model', 'India fit',
];
export const EARTHPULSE_COLUMN: Record<string, string> = {
  'Onboarding length': '7 screens, up to 18 inputs',
  'Logging effort': 'Manual; 2–4 fields per entry',
  'Shows its method': 'Yes: Methodology page, labels',
  'Action model': 'Goals, planner, recommendations (overlap)',
  'India fit': 'City list, metro and auto, segregation',
};

/* ---------- 4. Strategy ---------- */
export const VISION =
  'Help people in Indian cities see which everyday habits matter most for their footprint, and take one small, believable action each week.';

export const LOOP = [
  { step: 'Log', text: 'Record in seconds' },
  { step: 'See', text: 'Own numbers, clearly' },
  { step: 'Understand', text: 'One insight, with its basis' },
  { step: 'Act', text: 'One small weekly action' },
];

export const MVP_DEFINITION =
  'The smallest product that lets a new user get a believable personal estimate in minutes, log a day with little effort, understand one insight, and commit to one action.';

export const MOSCOW = [
  { key: 'must', title: 'Must', tone: 'bg-success-bg border-success-border', items: ['Quick setup that ends in a first estimate', 'Fast logging for transport, electricity, food', 'One weekly insight and one action', 'Estimates labelled; method visible', 'Mobile-first navigation, accessible controls'] },
  { key: 'should', title: 'Should', tone: 'bg-info-bg border-info-border', items: ['Water and waste tracking', 'One merged weekly plan (goals + planner)', 'Repeat-last and saved commute', 'Weekly recap'] },
  { key: 'could', title: 'Could', tone: 'bg-warning-bg border-warning-border', items: ['Real AI Copilot', 'What-if simulator', 'Monthly reports and export', 'Shopping logging'] },
  { key: 'wont', title: 'Won’t (for now)', tone: 'bg-subtle border-line', items: ['Social or community layer', 'Offsets or marketplace', 'Ranks and leaderboards', 'Bank or UPI integrations'] },
];

export const VERDICTS = [
  { feature: 'Onboarding steps 3–5', verdict: 'Cut or make useful', tone: 'error' as const },
  { feature: 'Eco score', verdict: 'Simplify or defer', tone: 'warning' as const },
  { feature: 'Three AI insights', verdict: 'Reduce to one', tone: 'warning' as const },
  { feature: 'Goals + Planner + recommendations', verdict: 'Merge', tone: 'info' as const },
  { feature: 'Quick actions + tracker log buttons', verdict: 'Keep one pattern', tone: 'info' as const },
  { feature: 'What-if simulator', verdict: 'Defer', tone: 'neutral' as const },
  { feature: 'Monthly reports', verdict: 'Defer or simplify', tone: 'neutral' as const },
  { feature: 'Notification bell and inert toggles', verdict: 'Remove until real', tone: 'error' as const },
];

// x = effort (0 low – 100 high), y = hypothesised user value. My judgements, to validate.
export const PRIORITY_ITEMS = [
  { id: 'F1', text: 'Quick-start estimate in onboarding', x: 38, y: 92 },
  { id: 'F2', text: 'Repeat-last and saved commute', x: 22, y: 84 },
  { id: 'F3', text: 'Separate sample data from the user’s own', x: 24, y: 74 },
  { id: 'F4', text: 'Merge goals and planner', x: 48, y: 68 },
  { id: 'F5', text: 'Explain CO₂e and the score in place', x: 10, y: 60 },
  { id: 'F6', text: 'Fix accessibility defects', x: 20, y: 62 },
  { id: 'F7', text: 'Real AI Copilot', x: 85, y: 55 },
  { id: 'F8', text: 'What-if simulator', x: 40, y: 32 },
  { id: 'F9', text: 'Monthly reports', x: 30, y: 24 },
  { id: 'F10', text: 'Bank or UPI integration', x: 94, y: 48 },
];

/* ---------- 6. Design system ---------- */
export const PRINCIPLES = [
  { title: 'Honest by default', text: 'Label estimates and sample data. Show the method.', status: 'Met' },
  { title: 'Calm, not guilty', text: 'Reward progress. Avoid blame and alarm.', status: 'Partly' },
  { title: 'One clear next step', text: 'Each screen leads to a single obvious action.', status: 'Not yet' },
  { title: 'Respect the effort budget', text: 'Every entry should cost seconds, not minutes.', status: 'Not yet' },
  { title: 'Accessible from the start', text: 'AA contrast, labels, keyboard use.', status: 'Partly' },
];

export const SWATCHES = [
  { group: 'Surface', items: [['page', '#FAFAF5'], ['surface', '#FFFFFF'], ['subtle', '#F3F6F0'], ['muted', '#E7ECE5'], ['inverse', '#193329']] },
  { group: 'Brand', items: [['brand', '#16783C'], ['brand-hover', '#225C32'], ['brand-subtle', '#EDF7E6'], ['accent', '#84CC16']] },
  { group: 'Category', items: [['transport', '#16783C'], ['electricity', '#F5A524'], ['food', '#8A6BC2'], ['shopping', '#D9585F'], ['water', '#2F80C8'], ['waste', '#3FA796']] },
  { group: 'Status', items: [['success', '#225C32'], ['warning', '#8A5300'], ['danger', '#9F1D2C'], ['info', '#174A85']] },
];

export const CONTRAST_PAIRS = [
  { name: 'Body text on page', fg: '#193329', bg: '#FAFAF5' },
  { name: 'Secondary text on card', fg: '#4A574E', bg: '#FFFFFF' },
  { name: 'Placeholder on card', fg: '#65736A', bg: '#FFFFFF' },
  { name: 'White on primary button', fg: '#FFFFFF', bg: '#16783C' },
  { name: 'Brand text on brand tint', fg: '#225C32', bg: '#EDF7E6' },
  { name: 'Danger text on danger tint', fg: '#9F1D2C', bg: '#FDECEE' },
  { name: 'Warning text on warning tint', fg: '#8A5300', bg: '#FFF6E0' },
  { name: 'Soft text on inverse panel', fg: '#B8C4B8', bg: '#193329' },
];

export const TYPE_SCALE = [
  { cls: 'font-display text-display-m', name: 'Display / M', spec: 'Junge 36/44', sample: 'Know your footprint' },
  { cls: 'text-h1', name: 'Heading / H1', spec: 'Inter 600 32/40', sample: 'Good morning, Ananya' },
  { cls: 'text-h3', name: 'Heading / H3', spec: 'Inter 600 20/28', sample: 'Overall impact this week' },
  { cls: 'text-body-m', name: 'Body / M', spec: 'Inter 400 16/24', sample: 'Log activities in seconds.' },
  { cls: 'text-label-m', name: 'Label / M', spec: 'Inter 500 14/20', sample: 'Save activity' },
  { cls: 'text-caption', name: 'Caption', spec: 'Inter 400 12/16', sample: 'Estimates use demo factors.' },
  { cls: 'text-metric-l', name: 'Metric / L', spec: 'Inter 600 32/40', sample: '25.9 kg CO₂e' },
];

export const SPACING = [2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96];

export const DS_GAPS = [
  'Spacing is not tokenised in code: 29 off-scale values (such as 6 px gaps)',
  '21 hard-coded hex colours bypass tokens in pages and charts',
  'Figma lacks Sidebar, Activity row, Insight card, Action item',
  'No documented grid or layout rules',
];

/* ---------- 7. Key experiences and flows ---------- */
export type FlowNode = { label: string; kind?: 'start' | 'step' | 'decision' | 'end'; friction?: string };

export const EXPERIENCES: {
  id: string; tab: string; title: string; goal: string; route: string; nodes: FlowNode[]; decisions: string[];
}[] = [
  {
    id: 'onboarding', tab: 'Onboarding', title: 'First-time setup', goal: 'Get set up and see something useful.', route: '/get-started',
    nodes: [
      { label: 'Landing', kind: 'start' },
      { label: 'Sign up', friction: '4 inputs' },
      { label: 'Valid?', kind: 'decision' },
      { label: 'Profile and city' },
      { label: 'Lifestyle and interests', friction: 'Answers not yet used (H1)' },
      { label: 'Baseline', friction: 'Needs kWh and km (A9)' },
      { label: 'Choose sample or empty', friction: 'No personal estimate (H2)' },
      { label: 'Dashboard', kind: 'end' },
    ],
    decisions: ['Progress bar and plain step titles keep a long form legible', 'Option cards for single choice, chips for short lists', 'Estimate-it-for-me button softens the baseline step'],
  },
  {
    id: 'logging', tab: 'Logging', title: 'Log an activity', goal: 'Record something in a few seconds.', route: '/app',
    nodes: [
      { label: 'Dashboard or tracker', kind: 'start' },
      { label: 'Tap Log' },
      { label: 'Pick category', friction: 'Opens from two screens only' },
      { label: 'Fill 1–3 fields', friction: 'No repeat-last (H5)' },
      { label: 'Valid?', kind: 'decision' },
      { label: 'Save with Undo' },
      { label: 'Totals update', kind: 'end' },
    ],
    decisions: ['Impact preview appears before saving, so users see the effect of their input', 'Undo in the confirmation replaces a “are you sure?” step', 'Errors appear next to the field in plain words'],
  },
  {
    id: 'tracking', tab: 'Carbon, water, waste', title: 'Track and review', goal: 'See where impact comes from and stay inside a weekly limit.', route: '/app/carbon',
    nodes: [
      { label: 'Open a tracker', kind: 'start', friction: 'Hidden behind More on mobile (H11)' },
      { label: 'Pick a tab' },
      { label: 'Read summary' },
      { label: 'Change chart range' },
      { label: 'Check breakdown' },
      { label: 'Search history' },
      { label: 'Adjust weekly limit', kind: 'end', friction: 'Goal editing in six places (H6)' },
    ],
    decisions: ['One shared tracker template keeps the three areas consistent', 'Pace indicator compares use with how much of the week has passed', 'Category colours and icons stay identical across charts and rows'],
  },
  {
    id: 'copilot', tab: 'AI Copilot', title: 'Ask the Copilot', goal: 'Get an explanation and a next step.', route: '/app/copilot',
    nodes: [
      { label: 'Insight card or Copilot', kind: 'start' },
      { label: 'Suggested question or typed', friction: 'Scripted, 7 intents (H14)' },
      { label: 'Reply (labelled demo)' },
      { label: 'Suggested action?', kind: 'decision' },
      { label: 'Add to my plan' },
      { label: 'Planner', kind: 'end' },
    ],
    decisions: ['“Demo mode” is always visible, so the assistant never poses as live AI', 'Replies end in one concrete action, not a list', 'Error state with Retry covers failed or slow replies'],
  },
  {
    id: 'planner', tab: 'Action planner', title: 'Plan the week', goal: 'Choose a few actions and tick them off.', route: '/app/planner',
    nodes: [
      { label: 'Open planner', kind: 'start' },
      { label: 'See the week' },
      { label: 'Add suggestion or own action', friction: 'Overlaps with Goals (H6)' },
      { label: 'Assign a day' },
      { label: 'Tick off' },
      { label: 'Progress updates', kind: 'end' },
    ],
    decisions: ['Days as sections, not a calendar grid, so it works on a phone', 'Progress ring gives a single, calm summary', 'Added actions can be rescheduled in place'],
  },
  {
    id: 'insight', tab: 'Insight to action', title: 'Understand, then act', goal: 'Understand a number and decide what to do.', route: '/app',
    nodes: [
      { label: 'Dashboard insight', kind: 'start' },
      { label: 'Read headline and basis', friction: 'CO₂e not defined (H8)' },
      { label: 'Want detail?', kind: 'decision' },
      { label: 'Methodology', friction: 'Leaves the app layout' },
      { label: 'Recommendation' },
      { label: 'Add to plan', kind: 'end' },
    ],
    decisions: ['Each insight states the numbers it is based on', 'Recommendations show an estimated effect, always marked “Est.”', 'Added state confirms the action without a modal'],
  },
];

/* ---------- 8. Impact ---------- */
export const NORTH_STAR = 'Weekly active loggers who complete at least one action (proposal, not measured)';

export const METRICS = [
  { goal: 'A new user reaches a first personal insight quickly', metric: 'Time and steps from sign-up to own estimate', how: 'Timed task in a usability test', status: 'Measurable in a test' },
  { goal: 'Logging feels effortless', metric: 'Seconds per entry; Single Ease Question (1–7)', how: 'Effort audit; usability test', status: 'Measurable in a test' },
  { goal: 'People understand their numbers', metric: 'Comprehension check; trust rating', how: 'Usability test, own-words question', status: 'Measurable in a test' },
  { goal: 'People take action', metric: 'Participants who add an action after an insight', how: 'Observation in a test', status: 'Measurable in a test' },
  { goal: 'People come back', metric: 'Day-7 and day-30 retention', how: 'Product analytics', status: 'Needs a live product' },
  { goal: 'Weekly habit forms', metric: 'Entries per active user per week; action rate', how: 'Product analytics', status: 'Needs a live product' },
];

export const EXPECTED = [
  { if: 'a first estimate appears during setup', then: 'more new users reach the dashboard with a number that is theirs', ref: 'PC1' },
  { if: 'logging has shortcuts such as repeat-last', then: 'entries per active user hold up after the first week', ref: 'PC2' },
  { if: 'each estimate shows its basis in place', then: 'comprehension and trust ratings improve', ref: 'PC5' },
  { if: 'goals and planner become one concept', then: 'participants can explain how the model works', ref: 'PC4' },
];

export const FUNNEL = ['Sign up', 'Finish setup', 'First log', 'Return in week 1', 'Complete an action'];

export const WONT_CLAIM = [
  'A reduction in anyone’s footprint',
  'Percentages from a sample of one',
  'That users prefer anything yet',
  'That the estimates are accurate',
];

/* ---------- 9. Solution ---------- */
export const DECISIONS = [
  { title: 'Estimates are always labelled', why: 'Numbers built from placeholder factors should never look like measurements.', status: 'built' as const, next: 'Test comprehension and trust' },
  { title: 'Pace-aware goal bars', why: 'Used-versus-week-elapsed says more than a raw total.', status: 'built' as const, next: 'Check people read it correctly' },
  { title: 'Impact preview before saving, plus Undo', why: 'Shows the effect of an entry and removes the need for confirmation dialogs.', status: 'built' as const, next: 'Time the logging task' },
  { title: 'One colour and icon per category', why: 'Lets people recognise a category across charts, rows and forms.', status: 'built' as const, next: 'Verify for colour-blind users' },
  { title: 'Labelled demo Copilot', why: 'Avoids implying a live AI that does not exist.', status: 'built' as const, next: 'Needs a real model to test trust' },
  { title: 'Five-step onboarding', why: 'Collects context for personalisation.', status: 'heuristic' as const, next: 'Flagged for redesign: answers unused (H1)' },
];

export const LEARNINGS = [
  { title: 'Tests catch what review misses', text: 'Interaction tests found a modal that stole focus on every keystroke when its parent re-rendered.' },
  { title: 'Self-audit finds promise gaps', text: 'Onboarding step 4 promised a personalised dashboard that the product never delivered.' },
  { title: 'Honesty costs space', text: 'Labels, notes and caveats compete with the numbers they qualify. Where they sit is a design decision.' },
  { title: 'A stale value can look like a feature', text: '“Ask Copilot” appended to the previous chat because a closure kept an old id.' },
];

export const NEXT_STEPS = [
  { text: 'Run the one-participant session and the effort audit', kind: 'planned' as const },
  { text: 'Redesign onboarding around a first personal estimate', kind: 'planned' as const },
  { text: 'Merge goals, planner and recommendations into one weekly plan', kind: 'planned' as const },
  { text: 'Separate sample data from the user’s own entries', kind: 'planned' as const },
  { text: 'Re-test the same tasks and compare, with n stated', kind: 'planned' as const },
];
