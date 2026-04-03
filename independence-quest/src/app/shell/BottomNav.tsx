import { useGameStore, type AppTab } from '../../state/store';

const tabs: Array<{ id: AppTab; label: string; icon: string }> = [
  { id: 'today', label: 'Today', icon: '☀️' },
  { id: 'quests', label: 'Quests', icon: '🗂️' },
  { id: 'map', label: 'Map', icon: '🗺️' },
  { id: 'toolkit', label: 'Toolkit', icon: '🧰' },
  { id: 'profile', label: 'Profile', icon: '🧙' }
];

export function BottomNav() {
  const activeTab = useGameStore((s) => s.ui.activeTab);
  const setActiveTab = useGameStore((s) => s.setActiveTab);

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-item ${activeTab === tab.id ? 'is-active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
