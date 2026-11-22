import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';
import CaseStudy from '../src/pages/public/CaseStudy';
import { AppProvider } from '../src/context/AppContext';
import { ToastProvider } from '../src/context/ToastContext';

export const render = (path: string) =>
  renderToString(
    <MemoryRouter initialEntries={[path]}>
      <AppProvider><ToastProvider><App /></ToastProvider></AppProvider>
    </MemoryRouter>,
  );

export const renderCaseStudy = () =>
  renderToString(
    <MemoryRouter initialEntries={['/case-study']}>
      <AppProvider><ToastProvider><CaseStudy /></ToastProvider></AppProvider>
    </MemoryRouter>,
  );
