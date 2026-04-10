import { useMemo, useState } from 'react';
import { LOW_ENERGY_OPTIONS, RESCUE_ITEMS } from '../../state/store';


const PROACTIVE_SUGGESTIONS = [
  { id: 'blocked', title: 'Blocked quest', why: 'Shows rescue plan and smallest-step guidance.' },
  { id: 'focus', title: 'Focus slipping', why: 'Highlights the body-double and micro-win tools.' },
  { id: 'discover', title: 'Find a tool', why: 'Opens the discovery surface when the user is exploring.' },
];

const DISCOVERY_ITEMS = [
  { id: 'rescue', title: 'Rescue plan', copy: 'Quick way to recover a stuck quest.', rationale: 'Use when the next step is blocked or the task feels too big.' },
  { id: 'micro-win', title: 'Micro-win route', copy: 'Two-minute progress for bad days.', rationale: 'Best when the user needs momentum without committing to a full session.' },
  { id: 'body-double', title: 'Body-double mode', copy: 'Add a little social pressure.', rationale: 'Useful when focus is drifting and the user wants accountability.' },
  { id: 'toolkit', title: 'Toolkit explorer', copy: 'Browse the available survival kit.', rationale: 'Use to discover what the app already offers without menu spelunking.' },
];

export function ToolkitScreen() {
  const [query, setQuery] = useState('');
  const [activeIntent, setActiveIntent] = useState('all');

  const discovery = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DISCOVERY_ITEMS.filter((item) => {
      const haystack = `${item.title} ${item.copy} ${item.rationale}`.toLowerCase();
      return (!q || haystack.includes(q)) && (activeIntent === 'all' || haystack.includes(activeIntent));
    });
  }, [query, activeIntent]);

  return (
    <div className="screen-stack">
      <section className="card">
        <p className="eyebrow">Tool discovery</p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by intent, like blocked, focus, or support"
          style={{ width: '100%', marginBottom: 10, padding: '0.8rem', borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          {['all', 'blocked', 'focus', 'support'].map((intent) => (
            <button key={intent} className="pill" onClick={() => setActiveIntent(intent)} style={{ border: 'none', cursor: 'pointer', background: activeIntent === intent ? '#3b82f6' : '#1e293b', color: '#e2e8f0' }}>
              {intent}
            </button>
          ))}
        </div>
        <div className="stack-list">
          {discovery.map((item) => (
            <article key={item.id} className="inline-card">
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <p style={{ color: '#93c5fd', fontSize: '0.82rem', marginTop: 6 }}>{item.rationale}</p>
            </article>
          ))}
          {!discovery.length && <p style={{ color: '#94a3b8' }}>No matching tools. Try a different intent, Boss.</p>}
        </div>
      </section>

      <section className="card">
        <p className="eyebrow">Proactive suggestions</p>
        <div className="stack-list">
          {PROACTIVE_SUGGESTIONS.map((item) => (
            <article key={item.id} className="inline-card">
              <h3>{item.title}</h3>
              <p>{item.why}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <p className="eyebrow">Contextual tool cards</p>
        <div className="stack-list">
          {discovery.slice(0, 3).map((item) => (
            <article key={item.id} className="inline-card">
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <p style={{ color: '#93c5fd', fontSize: '0.82rem', marginTop: 6 }}>{item.rationale}</p>
            </article>
          ))}
        </div>
      </section>

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
