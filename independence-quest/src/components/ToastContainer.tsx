import { useEffect } from 'react';
import { useGameStore } from '../state/store';

const STAGE_STYLE: Record<string, { bg: string; border: string; label: string }> = {
  subquest: { bg: '#172554', border: '#2563eb', label: 'Subquest Complete' },
  quest: { bg: '#052e16', border: '#16a34a', label: 'Quest Cleared' },
  boss: { bg: '#3f1d0d', border: '#ea580c', label: 'Boss Shift' },
  chapter: { bg: '#3b0764', border: '#a855f7', label: 'Chapter Progress' },
  default: { bg: '#111827', border: '#475569', label: 'Progress' },
};

export function ToastContainer() {
  const toasts = useGameStore((s) => s.ui.toasts);
  const dismissToast = useGameStore((s) => s.dismissToast);

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((toast) => window.setTimeout(() => dismissToast(toast.id), 2200));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [toasts, dismissToast]);

  return (
    <div style={{ position: 'fixed', inset: 'auto 12px 88px 12px', display: 'flex', flexDirection: 'column', gap: 8, zIndex: 1200, pointerEvents: 'none' }}>
      {toasts.slice(0, 2).map((toast) => {
        const style = STAGE_STYLE[toast.stage] || STAGE_STYLE.default;
        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              background: style.bg,
              border: `1px solid ${style.border}`,
              color: '#f8fafc',
              borderRadius: 14,
              padding: '0.8rem 0.95rem',
              boxShadow: '0 12px 32px rgba(2,6,23,0.35)',
            }}
          >
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#cbd5e1', marginBottom: 4 }}>{style.label}</div>
            <div style={{ fontWeight: 700 }}>{toast.text}</div>
          </div>
        );
      })}
    </div>
  );
}
