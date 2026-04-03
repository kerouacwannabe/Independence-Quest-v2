import { LOW_ENERGY_OPTIONS, RESCUE_ITEMS } from '../../state/store';

export function ToolkitScreen() {
  return (
    <div className="screen-stack">
      <section className="card">
        <p className="eyebrow">ADHD rescue kit</p>
        <div className="stack-list">
          {RESCUE_ITEMS.map((item) => (
            <article key={item.title} className="inline-card">
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="card">
        <p className="eyebrow">Low-energy routes</p>
        <div className="stack-list">
          {Object.entries(LOW_ENERGY_OPTIONS).slice(0, 5).map(([key, value]) => (
            <article key={key} className="inline-card">
              <h3>{value.title}</h3>
              <p>{value.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
