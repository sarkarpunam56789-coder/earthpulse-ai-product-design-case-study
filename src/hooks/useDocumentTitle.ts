import { useEffect } from 'react';
export function useDocumentTitle(title: string) {
  useEffect(() => { document.title = title ? `${title} · EarthPulse AI` : 'EarthPulse AI'; }, [title]);
}
