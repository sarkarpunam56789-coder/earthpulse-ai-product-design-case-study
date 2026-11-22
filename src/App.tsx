import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { lazy, ReactNode, Suspense } from 'react';
import { useApp } from './hooks/useApp';
import { PublicLayout } from './components/layout/PublicLayout';
import { AppShell } from './components/layout/AppShell';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Features from './pages/public/Features';
import HowItWorks from './pages/public/HowItWorks';
import CopilotIntro from './pages/public/CopilotIntro';
import Methodology from './pages/public/Methodology';
import NotFound from './pages/public/NotFound';
import GetStarted from './pages/auth/GetStarted';
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import Onboarding from './pages/auth/Onboarding';
import Dashboard from './pages/app/Dashboard';
import CarbonTracker from './pages/app/CarbonTracker';
import WaterTracker from './pages/app/WaterTracker';
import WasteTracker from './pages/app/WasteTracker';
import Copilot from './pages/app/Copilot';
import Planner from './pages/app/Planner';
import Goals from './pages/app/Goals';
import Simulator from './pages/app/Simulator';
import Reports from './pages/app/Reports';
import Settings from './pages/app/Settings';

// The case study is code-split so it does not add weight to the rest of the site.
const CaseStudy = lazy(() => import('./pages/public/CaseStudy'));

function RequireAuth({ children, needOnboarded }: { children: ReactNode; needOnboarded?: boolean }) {
  const { state } = useApp();
  const loc = useLocation();
  if (!state.authed) return <Navigate to="/signin" replace state={{ from: loc.pathname }} />;
  if (needOnboarded && !state.onboarded) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="features" element={<Features />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="copilot" element={<CopilotIntro />} />
        <Route path="methodology" element={<Methodology />} />
        <Route path="case-study" element={
          <Suspense fallback={<div role="status" className="mx-auto max-w-site px-4 py-24 text-center text-body-m text-ink-secondary">Loading the case study…</div>}>
            <CaseStudy />
          </Suspense>
        } />
      </Route>
      <Route path="get-started" element={<GetStarted />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="signin" element={<SignIn />} />
      <Route path="onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
      <Route path="app" element={<RequireAuth needOnboarded><AppShell /></RequireAuth>}>
        <Route index element={<Dashboard />} />
        <Route path="carbon" element={<CarbonTracker />} />
        <Route path="water" element={<WaterTracker />} />
        <Route path="waste" element={<WasteTracker />} />
        <Route path="copilot" element={<Copilot />} />
        <Route path="planner" element={<Planner />} />
        <Route path="goals" element={<Goals />} />
        <Route path="simulator" element={<Simulator />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
