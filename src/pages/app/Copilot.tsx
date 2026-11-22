import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, History, MessageSquarePlus, RefreshCw, Send, Sparkles } from 'lucide-react';
import { COPILOT_PROMPTS } from '../../data/content';
import { CATEGORIES } from '../../data/categories';
import { askCopilot, buildContext, IS_DEMO } from '../../lib/copilot';
import { uid } from '../../lib/format';
import { useApp } from '../../hooks/useApp';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useToast } from '../../hooks/useToast';
import { Alert } from '../../components/ui/Alert';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Fields';
import { PageHeader } from '../../components/features/PageHeader';
import { ChatMessage, Suggestion } from '../../types';

export default function Copilot() {
  useDocumentTitle('AI Copilot');
  const { state, metrics, setChats, setActiveChat, addSuggestionToPlan, inPlan } = useApp();
  const toast = useToast();
  const loc = useLocation();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const prefilled = useRef(false);

  const chat = state.chats.find((c) => c.id === state.activeChatId) ?? null;
  const ctx = useMemo(() => buildContext(state.profile.name, state.profile.city, metrics), [state.profile, metrics]);

  const append = (chatId: string, msg: ChatMessage) =>
    setChats((cs) => cs.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, msg], updatedAt: new Date().toISOString() } : c)));

  const send = async (raw: string, retry = false, errorId?: string, forceNew = false) => {
    const text = raw.trim();
    if (!text || loading) return;
    let id = forceNew ? null : state.activeChatId;
    if (!id || !state.chats.some((c) => c.id === id)) {
      const newId = uid('chat'); id = newId;
      setChats((cs) => [{ id: newId, title: text.length > 40 ? `${text.slice(0, 40)}…` : text, messages: [], updatedAt: new Date().toISOString() }, ...cs]);
      setActiveChat(newId);
    }
    const chatId = id;
    if (retry && errorId) setChats((cs) => cs.map((c) => (c.id === chatId ? { ...c, messages: c.messages.filter((m) => m.id !== errorId) } : c)));
    else append(chatId, { id: uid('m'), role: 'user', text });
    setInput(''); setLoading(true);
    try {
      const r = await askCopilot(text, ctx);
      append(chatId, { id: uid('m'), role: 'assistant', text: r.text, suggestion: r.suggestion, demo: r.demo });
    } catch {
      append(chatId, { id: uid('m'), role: 'assistant', error: true, text: 'The Copilot could not answer just now. Check your connection and try again.' });
    } finally { setLoading(false); }
  };

  useEffect(() => {
    const p = (loc.state as { prompt?: string } | null)?.prompt;
    if (p && !prefilled.current) {
      prefilled.current = true;
      setActiveChat(null);
      navigate('.', { replace: true, state: null });
      setTimeout(() => send(p, false, undefined, true), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [chat?.messages.length, loading]);

  const lastUser = (msgs: ChatMessage[], idx: number) => [...msgs.slice(0, idx)].reverse().find((m) => m.role === 'user')?.text ?? '';
  const onSubmit = (e: FormEvent) => { e.preventDefault(); send(input); };
  const addAction = (s: Suggestion) => { if (addSuggestionToPlan(s)) toast.push(`Added to your plan: ${s.title}`); };

  const history = (
    <ul className="flex flex-col gap-1">
      {state.chats.length === 0 && <li className="px-2 py-2 text-body-s text-ink-secondary">Your conversations will appear here.</li>}
      {state.chats.map((c) => (
        <li key={c.id}>
          <button type="button" onClick={() => setActiveChat(c.id)} className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-body-s ${c.id === state.activeChatId ? 'bg-brand-subtle text-brand-700' : 'hover:bg-subtle'}`}>
            <History className="h-4 w-4 shrink-0" aria-hidden /><span className="truncate">{c.title}</span>
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <PageHeader title="AI Sustainability Copilot" subtitle="Ask about your footprint, get suggestions for your city and turn ideas into actions for your weekly plan."
        actions={<Badge variant={IS_DEMO ? 'warning' : 'success'} dot>{IS_DEMO ? 'Demo mode' : 'Connected'}</Badge>} />
      {IS_DEMO && (
        <Alert variant="info" className="mb-6">
          Demo mode: replies are scripted from your sample data and placeholder factors. No AI service is connected. To connect one, set <code className="rounded-xs bg-surface px-1">VITE_COPILOT_API_URL</code> (see README). Type <code className="rounded-xs bg-surface px-1">/error</code> to preview the error state.
        </Alert>
      )}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="flex flex-col gap-6">
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between"><h2 className="text-h4">Conversations</h2>
              <Button variant="secondary" size="sm" iconLeft={MessageSquarePlus} onClick={() => setActiveChat(null)}>New chat</Button></div>
            <div className="hidden lg:block">{history}</div>
            <details className="lg:hidden"><summary className="cursor-pointer text-label-m text-brand-700">Show history ({state.chats.length})</summary><div className="mt-2">{history}</div></details>
          </Card>
          <Card className="hidden p-4 lg:block">
            <h2 className="mb-1 text-h4">What Copilot can see</h2>
            <p className="mb-3 text-body-s text-ink-secondary">Only your logged totals and city. Nothing is sent anywhere in demo mode.</p>
            <dl className="grid grid-cols-2 gap-3 text-body-s">
              <div><dt className="text-ink-secondary">Carbon</dt><dd className="text-label-m">{ctx.carbonKg} kg CO₂e</dd></div>
              <div><dt className="text-ink-secondary">Water</dt><dd className="text-label-m">{ctx.waterL} L</dd></div>
              <div><dt className="text-ink-secondary">Waste</dt><dd className="text-label-m">{ctx.wasteKg} kg</dd></div>
              <div><dt className="text-ink-secondary">Eco score</dt><dd className="text-label-m">{ctx.ecoScore ?? '—'}</dd></div>
            </dl>
          </Card>
        </aside>

        <Card className="flex min-h-[560px] flex-col p-0 sm:p-0">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6" aria-live="polite">
            {!chat || chat.messages.length === 0 ? (
              <div className="mx-auto flex max-w-lg flex-col items-center py-8 text-center">
                <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-brand-subtle"><Sparkles className="h-6 w-6 text-brand" aria-hidden /></span>
                <h2 className="text-h3">How can I help, {ctx.firstName}?</h2>
                <p className="mt-1 text-body-s text-ink-secondary">Pick a question or type your own. Impact numbers are estimates, and I'll say so.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {COPILOT_PROMPTS.map((p) => <Chip key={p} onClick={() => send(p)}>{p}</Chip>)}
                </div>
              </div>
            ) : (
              <ul className="flex flex-col gap-5">
                {chat.messages.map((m, i) => (
                  <li key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex gap-3'}>
                    {m.role === 'assistant' && <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-subtle"><Sparkles className="h-4 w-4 text-brand" aria-hidden /></span>}
                    <div className={m.role === 'user' ? 'max-w-[85%] rounded-lg rounded-br-sm bg-brand px-4 py-3 text-body-s text-white' : 'max-w-[90%]'}>
                      {m.role === 'assistant' ? (
                        <>
                          {m.error ? <Alert variant="error" action={<Button size="sm" variant="secondary" iconLeft={RefreshCw} onClick={() => send(lastUser(chat.messages, i), true, m.id)}>Retry</Button>}>{m.text}</Alert>
                            : <div className="rounded-lg rounded-tl-sm bg-subtle px-4 py-3 text-body-s">{m.text}</div>}
                          {m.demo && !m.error && <p className="mt-1 text-caption text-ink-secondary">Demo reply, not from a live AI service.</p>}
                          {m.suggestion && (
                            <div className="mt-3 rounded-lg border border-success-border bg-brand-subtle p-4">
                              <div className="flex items-center gap-2 text-label-s text-brand-700">{(() => { const I = CATEGORIES[m.suggestion.category].icon; return <I className="h-4 w-4" aria-hidden />; })()} Suggested action</div>
                              <div className="mt-1 text-label-l">{m.suggestion.title}</div>
                              <div className="text-body-s text-ink-secondary">{m.suggestion.description}</div>
                              <div className="text-label-s text-success-fg">{m.suggestion.impact}</div>
                              <div className="mt-3">{inPlan(m.suggestion.id)
                                ? <Button size="sm" variant="ghost" iconLeft={Check} disabled>Added to plan</Button>
                                : <Button size="sm" onClick={() => addAction(m.suggestion!)}>Add to my plan</Button>}</div>
                            </div>
                          )}
                        </>
                      ) : m.text}
                    </div>
                  </li>
                ))}
                {loading && <li className="flex gap-3"><span className="mt-1 grid h-8 w-8 place-items-center rounded-full bg-brand-subtle"><Sparkles className="h-4 w-4 text-brand" aria-hidden /></span><div className="rounded-lg bg-subtle px-4 py-3 text-body-s text-ink-secondary" role="status">Thinking…</div></li>}
              </ul>
            )}
            <div ref={endRef} />
          </div>
          {chat && chat.messages.length > 0 && (
            <div className="flex gap-2 overflow-x-auto border-t border-line-subtle px-4 py-3 scrollbar-none sm:px-6">
              {COPILOT_PROMPTS.slice(0, 3).map((p) => <Chip key={p} disabled={loading} onClick={() => send(p)}>{p}</Chip>)}
            </div>
          )}
          <form onSubmit={onSubmit} className="flex items-end gap-3 border-t border-line p-4 sm:p-5">
            <div className="flex-1"><label htmlFor="copilot-input" className="sr-only">Message to Copilot</label>
              <div className="flex h-11 items-center rounded-md border border-line bg-surface px-3 focus-within:border-brand-500 focus-within:shadow-focus">
                <input id="copilot-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your footprint…" className="h-full w-full bg-transparent text-body-m placeholder:text-ink-placeholder focus-visible:shadow-none" autoComplete="off" />
              </div></div>
            <Button type="submit" iconLeft={Send} disabled={!input.trim() || loading}>Send</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
