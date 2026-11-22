import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, LogOut, RotateCcw, Trash2 } from 'lucide-react';
import { DEFAULT_PROFILE, STATES_AND_CITIES } from '../../data/content';
import { downloadFile } from '../../lib/csv';
import { useApp } from '../../hooks/useApp';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useToast } from '../../hooks/useToast';
import { Alert } from '../../components/ui/Alert';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Chip, RadioGroup, SelectField, TextField, Toggle } from '../../components/ui/Fields';
import { Modal } from '../../components/ui/Modal';
import { Tabs } from '../../components/ui/Tabs';
import { PageHeader } from '../../components/features/PageHeader';
import { Profile } from '../../types';

type Tab = 'profile' | 'preferences' | 'notifications' | 'privacy' | 'account';
const TABS: { value: Tab; label: string }[] = [
  { value: 'profile', label: 'Profile' }, { value: 'preferences', label: 'Preferences' }, { value: 'notifications', label: 'Notifications' },
  { value: 'privacy', label: 'Privacy' }, { value: 'account', label: 'Account' },
];
const opts = (a: string[]) => a.map((x) => ({ value: x, label: x }));
const INTERESTS = [{ v: 'carbon', l: 'Carbon' }, { v: 'water', l: 'Water' }, { v: 'waste', l: 'Waste' }, { v: 'energy', l: 'Electricity' }, { v: 'food', l: 'Food' }, { v: 'habits', l: 'Habits' }];

export default function Settings() {
  useDocumentTitle('Profile and settings');
  const { state, activities, setProfile, updateSettings, clearSample, loadSample, resetDemo, signOut } = useApp();
  const toast = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('profile');
  const [draft, setDraft] = useState<Profile>(state.profile);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [confirm, setConfirm] = useState<null | 'reset' | 'delete'>(null);
  const s = state.settings;
  const d = <K extends keyof Profile>(k: K, v: Profile[K]) => setDraft((x) => ({ ...x, [k]: v }));

  const saveProfile = (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!draft.name.trim()) errs.name = 'Enter your name';
    if (!/^\S+@\S+\.\S+$/.test(draft.email)) errs.email = 'Enter a valid email address';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setProfile({ ...draft, name: draft.name.trim() }); setErrors({}); toast.push('Profile saved.');
  };
  const toggleInterest = (v: string) => {
    const has = draft.interests.includes(v);
    if (!has && draft.interests.length >= 3) { toast.push('You can pick up to 3 interests.'); return; }
    d('interests', has ? draft.interests.filter((x) => x !== v) : [...draft.interests, v]);
  };
  const exportJson = () => { downloadFile('earthpulse-data.json', JSON.stringify({ profile: state.profile, settings: s, goals: state.goals, plan: state.plan, activities }, null, 2), 'application/json'); toast.push('Data exported.'); };

  return (
    <div>
      <PageHeader title="Profile and settings" subtitle="Manage your details, preferences, notifications and data." />
      <Tabs label="Settings sections" value={tab} onChange={setTab} tabs={TABS} className="mb-6" />
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="max-w-3xl">
        {tab === 'profile' && (
          <Card>
            <div className="mb-6 flex items-center gap-4"><Avatar name={draft.name} size="lg" /><div><div className="text-h4">{state.profile.name}</div><div className="text-body-s text-ink-secondary">{state.profile.city}, {state.profile.state}</div></div></div>
            <form onSubmit={saveProfile} className="grid gap-5 sm:grid-cols-2" noValidate>
              <TextField label="Full name" value={draft.name} error={errors.name} onChange={(e) => { d('name', e.target.value); setErrors((x) => ({ ...x, name: undefined })); }} />
              <TextField label="Email" type="email" value={draft.email} error={errors.email} onChange={(e) => { d('email', e.target.value); setErrors((x) => ({ ...x, email: undefined })); }} />
              <SelectField label="Age group" value={draft.ageGroup} options={opts(['18–24', '25–34', '35–44', '45–54', '55+'])} onChange={(v) => d('ageGroup', v)} />
              <SelectField label="People in household" value={draft.household} options={opts(['1', '2', '3', '4', '5 or more'])} onChange={(v) => d('household', v)} />
              <SelectField label="Home type" value={draft.homeType} options={opts(['Apartment', 'Independent house', 'Hostel or PG', 'Other'])} onChange={(v) => d('homeType', v)} />
              <span className="hidden sm:block" />
              <SelectField label="State or union territory" value={draft.state} options={opts(Object.keys(STATES_AND_CITIES))} onChange={(v) => setDraft((x) => ({ ...x, state: v, city: STATES_AND_CITIES[v][0] }))} />
              <SelectField label="City" value={draft.city} options={opts(STATES_AND_CITIES[draft.state] ?? [draft.city])} onChange={(v) => d('city', v)} />
              <div className="flex gap-3 sm:col-span-2"><Button type="submit">Save changes</Button><Button type="button" variant="secondary" onClick={() => { setDraft(state.profile); setErrors({}); }}>Discard</Button></div>
            </form>
          </Card>
        )}
        {tab === 'preferences' && (
          <Card className="flex flex-col gap-6">
            <RadioGroup legend="How do you usually get around?" name="commute" value={draft.commute} onChange={(v) => d('commute', v)} options={[{ value: 'active', label: 'Walk or cycle' }, { value: 'public', label: 'Public transport' }, { value: 'twowheeler', label: 'Two-wheeler' }, { value: 'car', label: 'Car' }]} />
            <div><div className="mb-2 text-label-m">Diet</div><div className="flex flex-wrap gap-2">{['Vegetarian', 'Eggetarian', 'Non-vegetarian', 'Vegan'].map((x) => <Chip key={x} selected={draft.diet === x} onClick={() => d('diet', x)}>{x}</Chip>)}</div></div>
            <RadioGroup legend="Air conditioner use" name="ac" value={draft.ac} onChange={(v) => d('ac', v)} inline options={opts(['No', 'Sometimes', 'Most days'])} />
            <div><div className="mb-2 text-label-m">Focus areas (up to 3)</div><div className="flex flex-wrap gap-2">{INTERESTS.map((i) => <Chip key={i.v} selected={draft.interests.includes(i.v)} onClick={() => toggleInterest(i.v)}>{i.l}</Chip>)}</div></div>
            <div className="grid gap-5 sm:grid-cols-2"><SelectField label="Units" value="metric" disabled options={[{ value: 'metric', label: 'Metric (km, kg, L)' }]} helper="Only metric units are available in this prototype." /><SelectField label="Language" value="English" options={[{ value: 'English', label: 'English' }]} helper="More languages are planned." /></div>
            <div><Button onClick={() => { setProfile(draft); toast.push('Preferences saved.'); }}>Save preferences</Button></div>
          </Card>
        )}
        {tab === 'notifications' && (
          <Card>
            <CardHeader title="Email notifications" subtitle="Changes save automatically. No emails are sent in this prototype." />
            <div className="divide-y divide-line-subtle">
              {([['weeklySummary', 'Weekly summary', 'A short recap of your impact each Monday.'], ['goalReminders', 'Goal reminders', 'A nudge when you are close to a weekly limit.'], ['tips', 'Tips and ideas', 'Occasional suggestions for your city.'], ['productUpdates', 'Product updates', 'New features and changes.']] as const).map(([k, l, desc]) => (
                <Toggle key={k} label={l} description={desc} checked={s.notifications[k]} onChange={(v) => { updateSettings({ notifications: { ...s.notifications, [k]: v } }); toast.push('Notification preference saved.'); }} />
              ))}
            </div>
          </Card>
        )}
        {tab === 'privacy' && (
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader title="Privacy" subtitle="Controls for how your information is used." />
              <div className="divide-y divide-line-subtle">
                {([['personalised', 'Personalised suggestions', 'Use your logged data to tailor suggestions.'], ['analytics', 'Product analytics', 'Share anonymous usage data to improve the product.'], ['shareProgress', 'Share progress', 'Let others see your weekly progress.']] as const).map(([k, l, desc]) => (
                  <Toggle key={k} label={l} description={desc} checked={s.privacy[k]} onChange={(v) => { updateSettings({ privacy: { ...s.privacy, [k]: v } }); toast.push('Privacy setting saved.'); }} />
                ))}
              </div>
            </Card>
            <Card>
              <CardHeader title="Sample data" subtitle="This prototype starts with sample activities so the dashboard is not empty." />
              <div className="flex flex-wrap gap-3">
                {state.useSample ? <Button variant="secondary" onClick={() => { clearSample(); toast.push('Sample data cleared. Your own entries are kept.'); }}>Clear sample data</Button> : <Button variant="secondary" onClick={() => { loadSample(); toast.push('Sample data loaded.'); }}>Load sample data</Button>}
              </div>
            </Card>
          </div>
        )}
        {tab === 'account' && (
          <div className="flex flex-col gap-6">
            <Alert variant="info">Demo account: your data lives only in this browser (local storage). There is no server or real sign-in.</Alert>
            <Card>
              <CardHeader title="Your data" />
              <div className="flex flex-wrap gap-3"><Button variant="secondary" iconLeft={Download} onClick={exportJson}>Export my data (JSON)</Button><Button variant="secondary" iconLeft={RotateCcw} onClick={() => setConfirm('reset')}>Reset demo data</Button></div>
            </Card>
            <Card>
              <CardHeader title="Session" />
              <div className="flex flex-wrap gap-3"><Button variant="secondary" iconLeft={LogOut} onClick={() => { signOut(); navigate('/'); }}>Sign out</Button><Button variant="danger" iconLeft={Trash2} onClick={() => setConfirm('delete')}>Delete account</Button></div>
            </Card>
          </div>
        )}
      </div>
      <Modal open={confirm !== null} onClose={() => setConfirm(null)} title={confirm === 'delete' ? 'Delete your demo account?' : 'Reset demo data?'}
        footer={<><Button variant="secondary" onClick={() => setConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => { if (confirm === 'delete') { resetDemo(); signOut(); localStorage.removeItem('earthpulse-ai-demo-v1'); setConfirm(null); navigate('/'); } else { resetDemo(); setDraft(DEFAULT_PROFILE); setConfirm(null); toast.push('Demo data reset.'); } }}>{confirm === 'delete' ? 'Delete account' : 'Reset data'}</Button></>}>
        <p className="text-body-m text-ink-secondary">{confirm === 'delete' ? 'This removes everything stored in this browser, including your profile, goals and logged activities, and signs you out.' : 'This restores the sample activities, goals and plan, and removes entries you added.'}</p>
      </Modal>
    </div>
  );
}
