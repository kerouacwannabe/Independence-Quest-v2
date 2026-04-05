import { useGameStore } from '../state/store';
import { TodayScreen } from '../features/today/TodayScreen';
import { QuestsScreen } from '../features/quests/QuestsScreen';
import { MapScreen } from '../features/map/MapScreen';
import { ToolkitScreen } from '../features/toolkit/ToolkitScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';

const TABS = [
  { id: 'today', icon: '☀️', label: 'Today' },
  { id: 'quests', icon: '🗂️', label: 'Quests' },
  { id: 'map', icon: '🗺️', label: 'Map' },
  { id: 'toolkit', icon: '🧰', label: 'Toolkit' },
  { id: 'profile', icon: '🧙', label: 'Profile' },
];

export function App() {
  const activeTab = useGameStore((s) => s.ui.activeTab);
  const setActiveTab = useGameStore((s) => s.setActiveTab);

  const screen = (() => {
    switch (activeTab as string) {
      case 'quests': return <QuestsScreen />;
      case 'map': return <MapScreen />;
      case 'toolkit': return <ToolkitScreen />;
      case 'profile': return <ProfileScreen />;
      case 'today':
      default: return <TodayScreen />;
    }
  })();

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#0a0e14', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
      <main style={{ flex: 1, overflow: 'auto', padding: '0.75rem 1rem 5.5rem' }}>
        {screen}
      </main>
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        display: 'flex', background: '#111827',
        borderTop: '1px solid #1e293b', zIndex: 50
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1, padding: '0.5rem 0.25rem',
              background: activeTab === tab.id ? '#3b82f6' : 'transparent',
              color: activeTab === tab.id ? '#fff' : '#94a3b8',
              border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
              fontSize: '0.65rem', lineHeight: 1.2
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
