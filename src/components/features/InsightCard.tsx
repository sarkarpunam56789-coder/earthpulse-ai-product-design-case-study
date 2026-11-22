import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export function InsightCard({ headline, body, prompt }: { headline: string; body: string; prompt: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-success-border bg-brand-subtle p-5">
      <div className="flex items-center gap-2 text-label-s text-brand-700">
        <Sparkles className="h-[18px] w-[18px] text-brand" aria-hidden /> AI insight (demo)
      </div>
      <h3 className="text-h4">{headline}</h3>
      <p className="flex-1 text-body-s text-ink-secondary">{body}</p>
      <div className="-ml-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/app/copilot', { state: { prompt } })}>Ask Copilot</Button>
      </div>
    </div>
  );
}
