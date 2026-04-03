import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { useGameStore } from '../../state/store';
import { NextMoveCard } from '../../features/today/NextMoveCard';

type Props = {
  title: string;
  subtitle: string;
  stats: { level: number; xp: number; progress: number; active: number };
  nextMove: { type: string; heading: string; copy: string; button: string };
  children: ReactNode;
};

export function AppShell({ title, subtitle, stats, nextMove, children }: Props) {
  const setTab = useGameStore((s) => s.setActiveTab);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Mobile campaign shell</p>
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
        </div>
        <div className="hud-grid">
          <span>Lvl {stats.level}</span>
          <span>{stats.xp} XP</span>
          <span>{stats.progress}% map</span>
          <span>{stats.active} live</span>
        </div>
      </header>

      <main className="screen-frame">{children}</main>

      <aside className="floating-next-move">
        <NextMoveCard nextMove={nextMove} onOpenQuests={() => setTab('quests')} />
      </aside>

      <BottomNav />
    </div>
  );
}
