import { useEffect } from 'react';
import { useGameStore } from '../state/store';

export function ToastContainer() {
  const toasts = useGameStore((s) => s.ui.toasts);
  const removeToast = useGameStore((s) => s.removeToast);

  useEffect(() => {
    if (toasts.length === 0) return;
    // Auto-dismiss after 3.5s
    const timers = toasts.map((t) => setTimeout(() => removeToast(t.id), 3500));
    return () => timers.forEach(clearTimeout);
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', top: '12%', left: '50%', transform: 'translateX(-50%)',
      zIndex: 1001, display: 'flex', flexDirection: 'column', gap: 8, width: '90%', maxWidth: 360
    }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          padding: '0.75rem 1rem', borderRadius: 12, background: '#1e293b',
          border: t.stage === 'boss-defeated' ? '1px solid #dc2626' : t.stage === 'chapter-complete' ? '1px solid #7c3aed' : '1px solid #3b82f6',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)', color: '#e2e8f0',
          fontSize: '0.9rem', textAlign: 'center', animation: 'slideIn 0.25s ease-out'
        }}>
          {t.text}
        </div>
      ))}
    </div>
  );
}
