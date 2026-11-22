import { useEffect } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { CASE } from '../../data/caseStudy';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ButtonLink } from '../../components/ui/Button';
import { Callout, EvidenceLegend } from '../../components/case-study/primitives';
import { CaseStudyNav } from '../../components/case-study/CaseStudyNav';
import { DemoButton } from '../../components/case-study/DemoButton';
import { ProblemFraming } from '../../components/case-study/sections/ProblemFraming';
import { Constraints } from '../../components/case-study/sections/Constraints';
import { Research } from '../../components/case-study/sections/Research';
import { Strategy } from '../../components/case-study/sections/Strategy';
import { Exploration } from '../../components/case-study/sections/Exploration';
import { DesignSystemSection } from '../../components/case-study/sections/DesignSystemSection';
import { Experiences } from '../../components/case-study/sections/Experiences';
import { Impact } from '../../components/case-study/sections/Impact';
import { Solution } from '../../components/case-study/sections/Solution';

export default function CaseStudy() {
  useDocumentTitle('Design case study');
  // Smooth in-page scrolling on this page only, and never when the visitor prefers reduced motion.
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const el = document.documentElement;
    const prev = el.style.scrollBehavior;
    if (!reduce) el.style.scrollBehavior = 'smooth';
    return () => { el.style.scrollBehavior = prev; };
  }, []);

  return (
    <>
      <section className="bg-inverse text-ink-inverse">
        <div className="mx-auto grid max-w-site gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-label-m text-ink-soft">Design case study</p>
            <h1 className="mt-3 font-display text-display-m text-ink-inverse sm:text-display-l lg:text-display-xl">{CASE.title}</h1>
            <p className="mt-5 max-w-2xl text-body-l text-ink-soft">{CASE.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="#problem" size="lg" iconRight={ArrowRight} onClick={(e) => { e.preventDefault(); document.getElementById('problem')?.scrollIntoView(); }}>Start reading</ButtonLink>
              <DemoButton to="/app" size="lg">Try the prototype</DemoButton>
              {CASE.figmaUrl && <a href={CASE.figmaUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-md px-5 text-label-l text-ink-inverse hover:bg-brand-800">Figma file <ExternalLink className="h-4 w-4" aria-hidden /></a>}
            </div>
          </div>
          <dl className="grid content-start gap-4 rounded-xl border border-brand-800 bg-brand-900/40 p-5 text-body-s">
            <div><dt className="text-label-s text-ink-soft">Role</dt><dd className="text-ink-inverse">{CASE.role}</dd></div>
            <div><dt className="text-label-s text-ink-soft">Timeline</dt><dd className="text-ink-inverse">{CASE.timeline}</dd></div>
            <div><dt className="text-label-s text-ink-soft">Tools</dt><dd className="mt-1 flex flex-wrap gap-1.5">{CASE.tools.map((t) => <span key={t} className="rounded-full border border-brand-700 px-2.5 py-0.5 text-label-s text-ink-inverse">{t}</span>)}</dd></div>
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-site px-4 pb-2 pt-8 sm:px-6 lg:px-8">
        <Callout kind="info" title="How this was made">{CASE.aiDisclosure}</Callout>
        <details className="mt-3 rounded-lg border border-line bg-surface p-4">
          <summary className="cursor-pointer text-label-m">How to read the evidence tags</summary>
          <div className="mt-4"><EvidenceLegend /></div>
        </details>
      </div>

      <CaseStudyNav />
      <ProblemFraming />
      <Constraints />
      <Research />
      <Strategy />
      <Exploration />
      <DesignSystemSection />
      <Experiences />
      <Impact />
      <Solution />

      <section className="bg-brand-subtle">
        <div className="mx-auto flex max-w-site flex-col items-start justify-between gap-5 px-4 py-12 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div><h2 className="text-h2">See the product behind the case study</h2><p className="mt-1 text-body-m text-ink-secondary">Everything here is live and uses labelled sample data.</p></div>
          <div className="flex flex-wrap gap-3"><DemoButton to="/app" variant="primary" size="lg">Open the prototype</DemoButton><ButtonLink to="/methodology" variant="secondary" size="lg">Read the methodology</ButtonLink></div>
        </div>
      </section>
    </>
  );
}
