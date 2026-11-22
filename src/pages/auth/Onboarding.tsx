import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bike, Bus, Car, CheckCircle2, Cloud, Droplets, Footprints, Lightbulb, MapPin, Trash2, Utensils, RefreshCw, Target, Zap } from 'lucide-react';
import { POPULAR_CITIES, STATES_AND_CITIES } from '../../data/content';
import { useApp } from '../../hooks/useApp';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Profile } from '../../types';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Alert } from '../../components/ui/Alert';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Chip, RadioGroup, SelectField, TextField } from '../../components/ui/Fields';
import { OptionCard } from '../../components/ui/OptionCard';
import { Card } from '../../components/ui/Card';

const opts = (a: string[]) => a.map((x) => ({ value: x, label: x }));

const COPY: Record<number, { h: string; s: string }> = {
  1: { h: "Let's make this about you.", s: 'A few details help us personalise your estimates. Nothing here leaves your browser in this prototype.' },
  2: { h: 'Your city shapes your footprint.', s: 'Local travel options, climate and energy mix differ across India. We tailor suggestions to where you live.' },
  3: { h: 'Everyday habits, in your own words.', s: 'Tell us how you get around and eat. Estimates improve as you log.' },
  4: { h: 'Focus on what matters most.', s: 'Choose up to three areas and we will put them first.' },
  5: { h: 'A rough starting point is enough.', s: 'You can refine these numbers later from your profile.' },
  6: { h: "You're all set.", s: "Your dashboard is ready. Start by logging today's first activity." },
};

const INTERESTS = [
  { v: 'carbon', icon: Cloud, t: 'Cut my carbon footprint', d: 'Travel, energy and shopping' },
  { v: 'water', icon: Droplets, t: 'Use less water', d: 'Home and daily habits' },
  { v: 'waste', icon: Trash2, t: 'Reduce waste', d: 'Segregation and recycling' },
  { v: 'energy', icon: Zap, t: 'Save on electricity', d: 'Lower bills, lower impact' },
  { v: 'food', icon: Utensils, t: 'Eat more sustainably', d: 'Everyday meal choices' },
  { v: 'habits', icon: Target, t: 'Build lasting habits', d: 'Small weekly actions' },
];

export default function Onboarding() {
  useDocumentTitle('Set up your profile');
  const { state, setProfile, completeOnboarding } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [p, setP] = useState<Profile>({ ...state.profile, interests: state.profile.interests.length ? state.profile.interests : [] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => { setP((s) => ({ ...s, [k]: v })); setErrors((e) => ({ ...e, [k as string]: '' })); };
  const setBase = (k: keyof Profile['baseline'], v: string) => { setP((s) => ({ ...s, baseline: { ...s.baseline, [k]: v } })); setErrors((e) => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 1 && !p.name.trim()) e.name = 'Enter a display name';
    if (step === 2 && (!p.state || !p.city)) e.city = 'Choose your state and city';
    if (step === 4 && p.interests.length === 0) e.interests = 'Pick at least one focus area';
    if (step === 5) {
      if (p.baseline.kwh !== '' && !(parseFloat(p.baseline.kwh) >= 0)) e.kwh = 'Enter 0 or more';
      if (p.baseline.travelKm !== '' && !(parseFloat(p.baseline.travelKm) >= 0)) e.travelKm = 'Enter 0 or more';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const next = () => { if (!validate()) return; if (step === 5) setProfile(p); setStep((s) => s + 1); };
  const back = () => (step === 1 ? navigate('/signup') : setStep((s) => s - 1));
  const toggleInterest = (v: string) => { const has = p.interests.includes(v); set('interests', has ? p.interests.filter((x) => x !== v) : [...p.interests, v]); };
  const finish = (sample: boolean) => { completeOnboarding(sample); navigate('/app', { replace: true }); };

  const footer = (label = 'Continue') => (
    <div className="mt-10 flex gap-3">
      <Button variant="secondary" size="lg" className="w-[120px]" onClick={back}>Back</Button>
      <Button size="lg" full onClick={next}>{label}</Button>
    </div>
  );
  const c = COPY[step];

  return (
    <AuthLayout headline={c.h} support={c.s} step={step <= 5 ? step : undefined} onBack={step > 1 && step <= 5 ? back : undefined} wide={step === 3 || step === 4 || step === 5}>
      {step === 1 && (
        <>
          <h1 className="text-h1">Tell us about you</h1>
          <p className="mt-2 text-body-m text-ink-secondary">This helps personalise your estimates.</p>
          <div className="mt-8 flex flex-col gap-5">
            <TextField label="Display name" value={p.name} error={errors.name} onChange={(e) => set('name', e.target.value)} autoComplete="given-name" />
            <SelectField label="Age group (optional)" placeholder="Select your age group" value={p.ageGroup} options={opts(['18–24', '25–34', '35–44', '45–54', '55+'])} onChange={(v) => set('ageGroup', v)} />
            <SelectField label="People in your household" placeholder="Select number" value={p.household} options={opts(['1', '2', '3', '4', '5 or more'])} onChange={(v) => set('household', v)} />
            <SelectField label="Home type" placeholder="Select home type" value={p.homeType} options={opts(['Apartment', 'Independent house', 'Hostel or PG', 'Other'])} onChange={(v) => set('homeType', v)} />
          </div>
          {footer()}
        </>
      )}
      {step === 2 && (
        <>
          <h1 className="text-h1">Where are you based?</h1>
          <p className="mt-2 text-body-m text-ink-secondary">You can change this any time in Settings.</p>
          <div className="mt-8 flex flex-col gap-5">
            <SelectField label="State or union territory" value={p.state} options={opts(Object.keys(STATES_AND_CITIES))} onChange={(v) => setP((s) => ({ ...s, state: v, city: STATES_AND_CITIES[v][0] }))} />
            <SelectField label="City" value={p.city} error={errors.city} options={opts(STATES_AND_CITIES[p.state] ?? [])} onChange={(v) => set('city', v)} />
            <div>
              <div className="mb-2 text-overline uppercase text-ink-secondary">Popular cities</div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_CITIES.map((c) => (
                  <Chip key={c.city} selected={p.city === c.city} onClick={() => setP((s) => ({ ...s, state: c.state, city: c.city }))}>{c.city}</Chip>
                ))}
              </div>
            </div>
            <Alert variant="info"><MapPin className="mr-1 inline h-4 w-4" aria-hidden />We use your city to tailor suggestions. This prototype never reads your device location.</Alert>
          </div>
          {footer()}
        </>
      )}
      {step === 3 && (
        <>
          <h1 className="text-h1">How do you live day to day?</h1>
          <p className="mt-2 text-body-m text-ink-secondary">Pick what fits best. Estimates improve as you log.</p>
          <div className="mt-8 flex flex-col gap-7">
            <div role="radiogroup" aria-label="How do you usually get around?">
              <div className="mb-3 text-label-m">How do you usually get around?</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <OptionCard icon={Footprints} title="Walk or cycle" description="Short trips on foot or by bike" selected={p.commute === 'active'} onClick={() => set('commute', 'active')} />
                <OptionCard icon={Bus} title="Public transport" description="Metro, bus or local train" selected={p.commute === 'public'} onClick={() => set('commute', 'public')} />
                <OptionCard icon={Bike} title="Two-wheeler" description="Scooter or motorbike" selected={p.commute === 'twowheeler'} onClick={() => set('commute', 'twowheeler')} />
                <OptionCard icon={Car} title="Car" description="Own or shared car" selected={p.commute === 'car'} onClick={() => set('commute', 'car')} />
              </div>
            </div>
            <div><div className="mb-3 text-label-m">What's your diet?</div><div className="flex flex-wrap gap-2">{['Vegetarian', 'Eggetarian', 'Non-vegetarian', 'Vegan'].map((x) => <Chip key={x} selected={p.diet === x} onClick={() => set('diet', x)}>{x}</Chip>)}</div></div>
            <RadioGroup legend="Do you use an air conditioner?" name="ac" inline value={p.ac} onChange={(v) => set('ac', v)} options={opts(['No', 'Sometimes', 'Most days'])} />
          </div>
          {footer()}
        </>
      )}
      {step === 4 && (
        <>
          <h1 className="text-h1">What matters most to you?</h1>
          <p className="mt-2 text-body-m text-ink-secondary">Pick up to 3. We'll focus your dashboard and suggestions here.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2" role="group" aria-label="Focus areas">
            {INTERESTS.map((i) => {
              const sel = p.interests.includes(i.v);
              return <OptionCard key={i.v} role="checkbox" icon={i.icon} title={i.t} description={i.d} selected={sel} disabled={!sel && p.interests.length >= 3} onClick={() => toggleInterest(i.v)} />;
            })}
          </div>
          <p className="mt-3 text-caption text-ink-secondary" aria-live="polite">{p.interests.length} of 3 selected</p>
          {errors.interests && <p className="mt-1 text-caption text-danger-fg" role="alert">{errors.interests}</p>}
          {footer()}
        </>
      )}
      {step === 5 && (
        <>
          <h1 className="text-h1">Set your starting point</h1>
          <p className="mt-2 text-body-m text-ink-secondary">Rough numbers are fine. You can refine them later.</p>
          <div className="mt-8 flex flex-col gap-5">
            <TextField label="Monthly electricity use (kWh)" type="number" min="0" inputMode="decimal" placeholder="e.g. 180" helper="Find this on your latest electricity bill." value={p.baseline.kwh} error={errors.kwh} onChange={(e) => setBase('kwh', e.target.value)} />
            <TextField label="Typical weekly travel (km)" type="number" min="0" inputMode="decimal" placeholder="e.g. 60" helper="Include all modes: metro, bus, auto, car." value={p.baseline.travelKm} error={errors.travelKm} onChange={(e) => setBase('travelKm', e.target.value)} />
            <SelectField label="Meals with meat or fish each week" placeholder="Select range" value={p.baseline.meat} options={opts(['None', '1–3', '4–7', '8 or more'])} onChange={(v) => setBase('meat', v)} />
            <RadioGroup legend="Do you separate wet and dry waste?" name="seg" value={p.baseline.segregation} onChange={(v) => setBase('segregation', v)} options={opts(['Always', 'Sometimes', 'Not yet'])} />
            <div><Button variant="ghost" iconLeft={RefreshCw} onClick={() => setP((s) => ({ ...s, baseline: { kwh: '150', travelKm: '50', meat: '1–3', segregation: 'Sometimes' } }))}>Estimate these for me</Button>
              <p className="mt-1 text-caption text-ink-secondary">Fills in rough placeholder values you can edit.</p></div>
          </div>
          {footer('Finish setup')}
          <div className="mt-4 text-center"><button type="button" onClick={() => { setProfile(p); setStep(6); }} className="text-label-m text-brand-700 hover:underline">Skip for now</button></div>
        </>
      )}
      {step === 6 && (
        <div className="text-center sm:text-left">
          <span className="mx-auto grid h-[72px] w-[72px] place-items-center rounded-full border border-success-border bg-success-bg sm:mx-0"><CheckCircle2 className="h-9 w-9 text-brand" aria-hidden /></span>
          <h1 className="mt-6 text-h1">Welcome aboard, {p.name.split(' ')[0] || 'friend'}</h1>
          <p className="mt-2 text-body-m text-ink-secondary">Here's what we set up for you.</p>
          <Card className="mt-6 divide-y divide-line-subtle p-0 text-left sm:p-0">
            {[
              ['Location', `${p.city}, ${p.state}`],
              ['Getting around', ({ active: 'Walk or cycle', public: 'Public transport', twowheeler: 'Two-wheeler', car: 'Car' } as Record<string, string>)[p.commute] ?? p.commute],
              ['Diet', p.diet],
            ].map(([k, v]) => <div key={k} className="flex items-center justify-between gap-4 px-5 py-3 text-body-s"><span className="text-ink-secondary">{k}</span><span className="text-label-m">{v}</span></div>)}
            <div className="flex items-center justify-between gap-4 px-5 py-3 text-body-s"><span className="text-ink-secondary">Focus areas</span><span className="flex flex-wrap justify-end gap-1">{p.interests.map((i) => <Badge key={i} variant="brand">{INTERESTS.find((x) => x.v === i)?.t.split(' ').slice(-1)[0] ?? i}</Badge>)}{p.interests.length === 0 && <span className="text-label-m">None picked</span>}</span></div>
            <div className="flex items-center justify-between gap-4 px-5 py-3 text-body-s"><span className="text-ink-secondary">Starting point</span><span className="text-right text-label-m">{p.baseline.kwh ? `${p.baseline.kwh} kWh a month` : 'Not set'}{p.baseline.travelKm ? ` · ${p.baseline.travelKm} km a week` : ''}</span></div>
          </Card>
          <div className="mt-8 flex flex-col gap-3">
            <Button size="lg" full onClick={() => finish(true)}>Go to dashboard with sample data</Button>
            <Button size="lg" full variant="secondary" onClick={() => finish(false)}>Start with an empty dashboard</Button>
            <Button variant="ghost" onClick={() => setStep(1)}>Edit my answers</Button>
          </div>
          <p className="mt-4 text-caption text-ink-secondary"><Lightbulb className="mr-1 inline h-3.5 w-3.5" aria-hidden />Sample data is clearly labelled and can be cleared any time in Settings.</p>
        </div>
      )}
    </AuthLayout>
  );
}
