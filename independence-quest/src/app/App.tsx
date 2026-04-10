import { useEffect, useState } from 'react';
import { useGameStore } from '../state/store';
import { TodayScreen } from '../features/today/TodayScreen';
import { QuestsScreen } from '../features/quests/QuestsScreen';
import { MapScreen } from '../features/map/MapScreen';
import { ToolkitScreen } from '../features/toolkit/ToolkitScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { CampaignWizard } from '../features/setup/CampaignWizard';
import { FirstProofScreen } from '../features/setup/FirstProofScreen';
import { ToastContainer } from '../components/ToastContainer';
import { ClassHudCard } from '../components/ClassHudCard';
import { ensureNotificationPermission } from '../lib/native';

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
  const classId = useGameStore((s) => s.state.classId);
  const campaign = useGameStore((s) => s.state.campaign);
  const checkStreaks = useGameStore((s) => s.checkStreaks);
  const settings = useGameStore((s) => s.state.settings);
  const [showLaunchVeil, setShowLaunchVeil] = useState(true);

  useEffect(() => {
    checkStreaks();
    const timer = window.setTimeout(() => setShowLaunchVeil(false), 900);
    if (settings.effectsEnabled) ensureNotificationPermission();
    return () => window.clearTimeout(timer);
  }, [checkStreaks, settings.effectsEnabled]);

  // Setup wizard gate
  if (!classId || campaign.step < 5 || !campaign.complete) {
    return <CampaignWizard />;
  }

  // First proof overlay
  if (!campaign.firstProofDone) {
    return <FirstProofScreen />;
  }

  const screen = (() => {
    switch (activeTab as any) {
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
      {showLaunchVeil && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'grid', placeItems: 'center', background: 'radial-gradient(circle at top, #172554, #07111f 62%)', color: '#e0f2fe' }}>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>💀✨</div>
            <div style={{ fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7cc6fe' }}>Independence Quest</div>
            <div style={{ marginTop: 8, fontWeight: 700, fontSize: '1.25rem' }}>Claim your own keep</div>
            <div style={{ marginTop: 8, color: '#bfdbfe' }}>Sharpening the quest board and waking the goblins.</div>
          </div>
        </div>
      )}
      <main style={{ flex: 1, overflow: 'auto', padding: '0.75rem 1rem 5.5rem' }}>
        <ClassHudCard />
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
      <ToastContainer />
    </div>
  );
}
