import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { AppProvider } from '../context/AppContext';
import { ToastProvider } from '../context/ToastContext';
import { CASE, SECTIONS } from '../data/caseStudy';

const mount = (path: string) =>
  render(<MemoryRouter initialEntries={[path]}><AppProvider><ToastProvider><App /></ToastProvider></AppProvider></MemoryRouter>);

describe('Design case study', () => {
  it('renders all nine sections in order, each with a heading and an anchor', async () => {
    mount('/case-study');
    expect(await screen.findByRole('heading', { level: 1, name: 'EarthPulse AI: a design case study' })).toBeInTheDocument();
    const ids = SECTIONS.map((s) => s.id);
    const found = Array.from(document.querySelectorAll('main section[id]')).map((e) => e.id).filter((id) => ids.includes(id as never));
    expect(found).toEqual(ids);
    for (const s of SECTIONS) expect(screen.getByRole('heading', { level: 2, name: s.title })).toBeInTheDocument();
  });

  it('has a section navigation with one link per section', async () => {
    mount('/case-study');
    await screen.findByRole('heading', { level: 1 });
    const nav = screen.getByRole('navigation', { name: 'Case study sections' });
    const links = within(nav).getAllByRole('link');
    expect(links).toHaveLength(9);
    expect(links.map((l) => l.getAttribute('href'))).toEqual(SECTIONS.map((s) => `#${s.id}`));
  });

  it('does not present research, results or findings that do not exist', async () => {
    mount('/case-study');
    await screen.findByRole('heading', { level: 1 });
    expect(CASE.findings).toHaveLength(0);
    expect(CASE.research.interviewsCompleted).toBe(0);
    expect(screen.getByText('Research status: planned, not yet done')).toBeInTheDocument();
    expect(screen.getByText('0 so far')).toBeInTheDocument();
    expect(screen.getByText('No results, on purpose')).toBeInTheDocument();
    expect(screen.getByText('Template, not data')).toBeInTheDocument();
    expect(screen.getAllByText('Not yet analysed')).toHaveLength(4 * 5); // 4 competitors x 5 dimensions: left empty, not guessed
    expect(screen.getAllByText('Set before testing').length).toBeGreaterThanOrEqual(6); // no invented targets
    expect(screen.getByText(/Only v0 exists/)).toBeInTheDocument();
    // nothing in the page should claim a measured improvement
    const text = document.body.textContent ?? '';
    expect(text).not.toMatch(/users (said|reported|preferred)|participants (said|reported)|% of users|improved by \d|increased by \d/i);
  });

  it('computes contrast ratios live from the tokens', async () => {
    mount('/case-study');
    await screen.findByRole('heading', { level: 1 });
    const row = screen.getByText('White on primary button').closest('tr')!;
    expect(row).toHaveTextContent(/5\.5\d : 1/);
    expect(within(row).getByText('AA')).toBeInTheDocument();
  });

  it('switches between the six key experiences and flags friction as heuristic', async () => {
    const user = userEvent.setup();
    mount('/case-study');
    expect(await screen.findByRole('heading', { level: 3, name: 'First-time setup' })).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'Logging' }));
    expect(screen.getByRole('heading', { level: 3, name: 'Log an activity' })).toBeInTheDocument();
    expect(screen.getByText(/No repeat-last \(H5\)/)).toBeInTheDocument();
    for (const t of ['Carbon, water, waste', 'AI Copilot', 'Action planner', 'Insight to action']) {
      await user.click(screen.getByRole('tab', { name: t }));
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    }
  });

  it('opens the live prototype from the case study without a sign-in', async () => {
    const user = userEvent.setup();
    mount('/case-study');
    await user.click(await screen.findByRole('button', { name: 'Open the interactive prototype' }));
    expect(await screen.findByText('Overall impact this week')).toBeInTheDocument();
  });

  it('is linked from the existing site navigation and home page, without removing anything', () => {
    mount('/');
    const nav = screen.getByRole('navigation', { name: 'Main' });
    for (const l of ['Features', 'How it works', 'AI Copilot', 'Methodology', 'Case study', 'About']) expect(within(nav).getByRole('link', { name: l })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read the case study' })).toHaveAttribute('href', '/case-study');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Know your footprint');
  });
});
