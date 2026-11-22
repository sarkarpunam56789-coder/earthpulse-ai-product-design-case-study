# EarthPulse AI

A personal sustainability platform for individuals, India first. This repository is a complete, independently runnable front-end: a public website plus a logged-in web application.

**Stack:** React 18 · Vite 5 · TypeScript (strict) · Tailwind CSS 3 · React Router 6 · Lucide icons.

> **This is a prototype.** All data is sample data, accounts are simulated and stored only in your browser, and every impact figure is an *illustrative estimate* built from *placeholder* factors. See [What is real and what is demo](#what-is-real-and-what-is-demo).

---

## Quick start

Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript only |
| `npm test` | 23 tests: 16 product flows + 7 case-study checks (Vitest + Testing Library) |
| `npm run smoke` | Server-renders every route and checks the dashboard numbers against the spec |

Fonts (Inter, Junge) load from Google Fonts. Without a network connection the app falls back to system fonts.

## Deploy to Vercel (via GitHub)

1. Create a GitHub repository and push this folder.
2. In Vercel choose **Add New → Project**, import the repository.
3. Framework preset **Vite** is detected automatically (build `npm run build`, output `dist`).
4. Deploy. `vercel.json` already rewrites all paths to `index.html`, so deep links such as `/app/carbon` work on refresh.

Optional: add `VITE_COPILOT_API_URL` under **Settings → Environment Variables** (see below).

## Try it

- **Fastest path:** on the home page click **Try the demo**. It opens the dashboard with sample data.
- **Full flow:** Home → Get started → Sign up → 5-step onboarding → Dashboard. (Sign-up and sign-in accept any valid email; nothing is sent anywhere.)
- **Copilot error state:** in the Copilot, send `/error` to preview the error and retry UI.
- **Empty state:** Settings → Privacy → *Clear sample data*, then open the Dashboard.

---

## Design case study (`/case-study`)

A nine-section UX/UI case study built into the site: **Problem framing, System constraints, Research, Strategy, Exploration, Design system, Key experiences and flows, Impact, Solution.** It reuses the product's own components, tokens and sample data, so every visual is the real UI.

**Honesty by design.** No user research, test result or impact metric has been invented. Every claim carries an evidence tag (*Assumption, Heuristic finding, Secondary source, Planned, Expected, Built, Validated by users*). "Validated" only appears for findings you add yourself. Competitor columns stay empty ("Not yet analysed") until you fill them. Impact targets read "Set before testing".

**Where things live**

| What | File |
|---|---|
| All copy, data and evidence labels (edit this) | `src/data/caseStudy.ts` |
| Page composition and hero | `src/pages/public/CaseStudy.tsx` |
| Nine sections | `src/components/case-study/sections/*.tsx` |
| Shared pieces (flow diagram, matrices, frames, tags) | `src/components/case-study/primitives.tsx` |
| Sticky scroll-spy navigation and progress bar | `src/components/case-study/CaseStudyNav.tsx`, `src/hooks/useScrollSpy.ts` |
| "Open in the live prototype" buttons | `src/components/case-study/DemoButton.tsx` |
| Your own sketches (optional) | `public/case-study/` + `sketchImages` in `caseStudy.ts` |

**Make it yours (in `src/data/caseStudy.ts`)**

1. Set `CASE.role`, `CASE.timeline` and check `CASE.aiDisclosure` so it states exactly what you did.
2. Optionally set `CASE.figmaUrl` to show a Figma button.
3. After each piece of research, update `CASE.research` (`interviewsCompleted`, `usabilitySessionsCompleted`, `competitorsAnalysed`). The status banners and evidence ladder update themselves.
4. Add real findings to `CASE.findings` using Observation, Pattern, Insight, Opportunity and an `evidence` note (for example "1 of 1 participants; session 14 Dec"). They replace the template and are tagged *Validated by users*.
5. Fill the competitor cells in `Research.tsx` once you have analysed them, and replace the `Not yet analysed` status.
6. Add your hand sketches to `public/case-study/` and list them in `sketchImages`.
7. Set real targets in the Impact table only before you test, and only report results afterwards with the number of participants.

The case study is code-split (`React.lazy`), so it adds nothing to the load time of the rest of the site.

## Routes

**Public:** `/` · `/features` · `/how-it-works` · `/copilot` (AI Copilot introduction) · `/methodology` · `/case-study` (design case study) · `/about` · `/get-started` · `/signup` · `/signin`

**Onboarding:** `/onboarding` (5 steps plus completion)

**App** (requires sign-in and completed onboarding): `/app` Dashboard · `/app/carbon` · `/app/water` · `/app/waste` · `/app/copilot` · `/app/planner` · `/app/goals` · `/app/simulator` · `/app/reports` · `/app/settings`

## Project structure

```
src/
  components/
    ui/          Button, Card, Badge, Fields (text, select, checkbox, radio, toggle, chip),
                 Tabs, Segmented, Modal, Alert, Progress, Avatar, OptionCard, EmptyState
    charts/      BarChart, LineChart, Donut, ProgressRing (HTML/SVG, responsive, keyboard-focusable tooltips)
    layout/      AppShell, Sidebar, PublicLayout, AuthLayout, Logo, nav config
    features/    MetricCard, InsightCard, ActivityRow/List, ActionItem, AddActivityModal,
                 TrackerPage (shared by Carbon/Water/Waste), HeroPreview, PageHeader
    case-study/  primitives, CaseStudyNav, DemoButton, sections/ (nine case-study sections)
  pages/
    public/      Home, Features, HowItWorks, CopilotIntro, Methodology, About, NotFound
    auth/        GetStarted, SignUp, SignIn, Onboarding
    app/         Dashboard, CarbonTracker, WaterTracker, WasteTracker, Copilot,
                 Planner, Goals, Simulator, Reports, Settings
  data/          factors (placeholder), categories, sample-data generator, default content,
                 caseStudy (all case-study copy and evidence labels)
  hooks/         useApp, useMetrics, useToast, useDocumentTitle, useScrollToTop, useScrollSpy
  context/       AppContext (state + persistence), ToastContext
  lib/           metrics, activityForms, simulator, copilot, series, csv, dates, format
  styles/        index.css (Tailwind layers)
  test/          Vitest setup and flow tests
scripts/         smoke.mjs (SSR route + number checks)
```

## Design system

`tailwind.config.js` mirrors the variables, text styles and effect styles built in the Figma file *EarthPulse AI – Complete Product*.

| Figma token | Tailwind |
|---|---|
| `color/bg/page` `#FAFAF5` · `bg/surface` `#FFFFFF` · `bg/subtle` `#F3F6F0` · `bg/muted` `#E7ECE5` · `bg/inverse` `#193329` | `bg-page` `bg-surface` `bg-subtle` `bg-muted` `bg-inverse` |
| `color/text/primary` · `secondary` · `placeholder` · `disabled` · `on-inverse` | `text-ink` `text-ink-secondary` `text-ink-placeholder` `text-ink-disabled` `text-ink-inverse` |
| `color/border/default` · `subtle` · `strong` | `border-line` `border-line-subtle` `border-line-strong` |
| `color/action/primary` `#16783C` (hover `#225C32`, pressed `#1B4527`) · `bg/brand-subtle` `#EDF7E6` | `bg-brand` `hover:bg-brand-hover` `active:bg-brand-pressed` `bg-brand-subtle` |
| `color/action/accent` `#84CC16` | `bg-accent` |
| `color/status/{success,warning,danger,info}-{bg,fg,border}` | `bg-success-bg` `text-success-fg` `border-success-border` … |
| `color/chart/series-1…6` | `viz-transport` `viz-water` `viz-electricity` `viz-food` `viz-shopping` `viz-waste` |
| Text styles `Display/*` `Heading/H1–H4` `Body/*` `Label/*` `Caption` `Overline` `Metric/*` | `text-display-xl` … `text-h1` … `text-body-m` … `text-label-m` … `text-caption` `text-overline` `text-metric-l` |
| Radius `xs 4` `sm 6` `md 10` `lg 12` `xl 20` | `rounded-xs` … `rounded-xl` |
| Effects `Elevation/1–3`, `Focus/Ring` | `shadow-elev-1…3`, `shadow-focus` |

Category colours are consistent across charts, legends and activity rows. All key text/background pairs were checked to meet WCAG AA 4.5:1.

## What is real and what is demo

**Works for real (in the browser):** sidebar and responsive navigation; onboarding with validation; activity logging forms for all six categories (with undo); dashboard, trackers, goals and reports recalculating from logged activities; working tabs, filters, search and chart range toggles; goal progress; planner with scheduling; what-if simulator; CSV and JSON export; profile and settings; sample-data clearing and reset. State persists in `localStorage`.

**Demo / placeholder (clearly labelled in the UI):**

- **Accounts.** There is no backend. Sign-up and sign-in are simulated.
- **AI Copilot.** Without configuration it returns *scripted* replies built from your totals, labelled "Demo mode". It never pretends to be a live model.
- **Emission and usage factors.** `src/data/factors.ts` holds **illustrative placeholders, not verified data**. Replace them with sourced, India-specific factors and cite each source on the Methodology page before any real use. The Eco score is also a demo formula (`100 − 42 × weighted pace ratio`).
- **Sample data.** Generated relative to today so the current week is always populated. Earlier months in trend and report views are fixed sample totals.

### Connecting a real AI service (optional)

Copy `.env.example` to `.env` and set:

```
VITE_COPILOT_API_URL=https://your-service.example.com/copilot
```

The app then sends `POST` with JSON `{ "message": string, "context": { firstName, city, carbonKg, waterL, wasteKg, carbonPct, waterPct, wastePct, elapsedPct, shares, segregationDays, ecoScore } }` and expects `{ "text": string, "suggestion"?: { "title", "description", "impact", "category" } }`. `category` is one of `transport | electricity | food | shopping | water | waste`.

Do **not** put secrets in `VITE_*` variables: they are bundled into the browser. Call your model provider from a server or serverless function and point `VITE_COPILOT_API_URL` at that.

## Testing

`npm test` runs 23 tests in jsdom (7 cover the case study; see the case-study section). The 16 product flow tests cover: sign-up validation through onboarding to the dashboard; sign-in errors; logging a trip and undo; dashboard filters, range toggle and *Add to plan*; tracker tabs, search and goal editing; waste logging; Copilot reply, suggested action, error and retry; new-chat behaviour; planner; goals; simulator; reports; settings; empty state; route guards; and the demo entry.

`npm run smoke` renders all 22 routes and asserts the Thursday sample week reproduces the specification: 25.9 kg CO₂e, 612 L, 2.1 kg, eco score 62, and 52 / 58 / 42 % of weekly goals.

## Known limitations

- Layouts are built mobile-first with Tailwind breakpoints (bottom tab bar on phones, drawer on tablets, fixed sidebar from 1024 px), but they have **not been checked visually in real browsers** in the environment this was built in. Please review at 360, 768 and 1280 px.
- Modals set initial focus, close on Escape and restore focus, but do not fully trap Tab focus.
- No dark mode, no loading skeletons and no activity-detail drawer yet.
- The Dashboard "Carbon trend by month" shows *average kg CO₂e per week* for each month, because the current month is incomplete and a raw monthly total would look like a false drop.
- Data lives only in the browser. Clearing site data removes it.
