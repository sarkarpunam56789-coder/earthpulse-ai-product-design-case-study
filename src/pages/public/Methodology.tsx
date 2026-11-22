import { FACTOR_DISCLAIMER, FACTOR_ROWS, FACTOR_VERSION, WATER_USES } from '../../data/factors';
import { FOOD_WASTE_KG_CO2E_PER_KG } from '../../lib/simulator';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Alert } from '../../components/ui/Alert';
import { Badge } from '../../components/ui/Badge';
import { ButtonLink } from '../../components/ui/Button';

const wrap = 'mx-auto max-w-site px-4 sm:px-6 lg:px-8';

export default function Methodology() {
  useDocumentTitle('Methodology');
  return (
    <>
      <section className={`${wrap} py-14 lg:py-20`}>
        <h1 className="max-w-3xl font-display text-display-m sm:text-display-l">How EarthPulse AI estimates impact</h1>
        <p className="mt-5 max-w-2xl text-body-l text-ink-secondary">Every figure in the product is an estimate. This page shows how each one is built, which assumptions it relies on and what is still missing.</p>
        <Alert variant="warning" className="mt-8 max-w-3xl"><strong className="font-medium">Prototype notice.</strong> {FACTOR_DISCLAIMER}</Alert>
      </section>

      <section className={`${wrap} grid gap-10 pb-12 lg:grid-cols-[260px_1fr]`}>
        <nav aria-label="On this page" className="hidden lg:block"><ul className="sticky top-24 flex flex-col gap-2 text-body-s">
          {[['#how', 'How an estimate is built'], ['#factors', 'Factors used'], ['#water', 'Water and waste'], ['#score', 'Eco score'], ['#limits', 'Limitations'], ['#sources', 'Data sources'], ['#before', 'Before launch']].map(([h, l]) => <li key={h}><a href={h} className="text-ink-secondary hover:text-brand-700">{l}</a></li>)}
        </ul></nav>
        <div className="flex max-w-3xl flex-col gap-12">
          <section id="how" className="scroll-mt-24"><h2 className="text-h2">How an estimate is built</h2>
            <p className="mt-3 text-body-m text-ink-secondary">For carbon, EarthPulse AI multiplies an amount you log by a factor for that activity.</p>
            <div className="mt-4 rounded-lg border border-line bg-surface p-5 text-body-m"><code>estimate (kg CO₂e) = amount you log × emission factor</code></div>
            <p className="mt-3 text-body-m text-ink-secondary">Examples: distance in km × a per-km factor for the travel mode; hours × appliance power (kW) × a per-kWh factor; servings × a per-meal factor.</p></section>

          <section id="factors" className="scroll-mt-24"><div className="flex items-center gap-3"><h2 className="text-h2">Factors used in this prototype</h2><Badge variant="warning">Placeholders</Badge></div>
            <p className="mt-3 text-body-m text-ink-secondary">Version <code>{FACTOR_VERSION}</code>. These values illustrate the method. They are not sourced measurements.</p>
            <div className="mt-5 flex flex-col gap-6">
              {FACTOR_ROWS.map((g) => (
                <div key={g.area}><h3 className="mb-2 text-h4">{g.area} <span className="text-body-s font-normal text-ink-secondary">({g.unit})</span></h3>
                  <div className="overflow-x-auto rounded-lg border border-line bg-surface"><table className="w-full text-left text-body-s"><thead className="bg-subtle text-ink-secondary"><tr><th scope="col" className="px-4 py-2 font-medium">Item</th><th scope="col" className="px-4 py-2 font-medium">Factor</th></tr></thead>
                    <tbody>{g.rows.map(([k, v]) => <tr key={k} className="border-t border-line-subtle"><td className="px-4 py-2">{k}</td><td className="px-4 py-2">{v}</td></tr>)}</tbody></table></div></div>
              ))}
            </div></section>

          <section id="water" className="scroll-mt-24"><h2 className="text-h2">Water and waste</h2>
            <p className="mt-3 text-body-m text-ink-secondary">Water is the amount you log multiplied by litres per unit: {WATER_USES.map((w) => `${w.label.toLowerCase()} ${w.litresPer} L per ${w.unit === 'litres' ? 'litre' : w.unit.slice(0, -1)}`).join('; ')}. Waste is recorded directly by weight, so there is no conversion. Segregation and recycling are whatever you mark when logging.</p></section>

          <section id="score" className="scroll-mt-24"><h2 className="text-h2">Eco score</h2>
            <p className="mt-3 text-body-m text-ink-secondary">The eco score is a demo formula, not a scientific index. For the week so far, each of carbon, water and waste is compared with its weekly limit and the share of the week that has passed. The three ratios are weighted 50%, 30% and 20%.</p>
            <div className="mt-4 rounded-lg border border-line bg-surface p-5 text-body-m"><code>score = 100 − 42 × weighted pace ratio, limited to 0–100</code></div>
            <p className="mt-3 text-body-m text-ink-secondary">The what-if simulator also assumes {FOOD_WASTE_KG_CO2E_PER_KG} kg CO₂e per kg of food waste (placeholder).</p></section>

          <section id="limits" className="scroll-mt-24"><h2 className="text-h2">Limitations</h2>
            <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-body-m text-ink-secondary marker:text-brand">
              <li>Factors are averages. Real impact varies by vehicle, appliance, supplier, region and season.</li>
              <li>Estimates depend on what you remember to log. Gaps lower the total.</li>
              <li>Shopping and food factors are broad categories and exclude many real-world details.</li>
              <li>Sample history before this month is illustrative and not derived from your activity.</li>
            </ul></section>

          <section id="sources" className="scroll-mt-24"><h2 className="text-h2">Data sources</h2>
            <p className="mt-3 text-body-m text-ink-secondary">No third-party data sources are cited yet, because the factors above are placeholders. Before launch, each factor will list its source, publication year, geography and version here.</p></section>

          <section id="before" className="scroll-mt-24"><h2 className="text-h2">Before launch</h2>
            <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-body-m text-ink-secondary marker:text-brand">
              <li>Replace placeholder factors with sourced, India-specific data and cite each one.</li>
              <li>Have the method reviewed by someone qualified in carbon accounting.</li>
              <li>Publish a change log whenever a factor or the score formula changes.</li>
            </ul>
            <div className="mt-6"><ButtonLink to="/get-started" iconRight={undefined}>Try the prototype</ButtonLink></div></section>
        </div>
      </section>
    </>
  );
}
