import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { AppShell } from './shell/AppShell';
import { TodayScreen } from '../features/today/TodayScreen';
import { QuestsScreen } from '../features/quests/QuestsScreen';
import { MapScreen } from '../features/map/MapScreen';
import { ToolkitScreen } from '../features/toolkit/ToolkitScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { useGameStore } from '../state/store';
import { selectCurrentChapter, selectCurrentObjectiveCopy, selectNextMove, selectStats } from '../state/selectors';

export function App() {
  const activeTab = useGameStore((s) => s.ui.activeTab);
  const currentChapter = useGameStore(selectCurrentChapter);
  const nextMove = useGameStore(useShallow(selectNextMove));
  const stats = useGameStore(useShallow(selectStats));
  const objectiveCopy = useGameStore(selectCurrentObjectiveCopy);

  const screen = useMemo(() => {
    switch (activeTab) {
      case 'quests':
        return <QuestsScreen />;
      case 'map':
        return <MapScreen />;
      case 'toolkit':
        return <ToolkitScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'today':
      default:
        return <TodayScreen />;
    }
  }, [activeTab]);

  return (
    <AppShell
      title={currentChapter?.title ?? 'Independence Quest'}
      subtitle={objectiveCopy}
      stats={stats}
      nextMove={nextMove}
    >
      {screen}
    </AppShell>
  );
}
