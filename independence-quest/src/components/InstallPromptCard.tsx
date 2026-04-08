import { useEffect, useState } from 'react';

type DeferredInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function InstallPromptCard() {
  const [promptEvent, setPromptEvent] = useState<DeferredInstallPromptEvent | null>(null);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault?.();
      setPromptEvent(event as DeferredInstallPromptEvent);
    };
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (!promptEvent && isOnline && dismissed) return null;
  if (!promptEvent && isOnline) return null;

  const handleInstall = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    await promptEvent.userChoice.catch(() => null);
    setPromptEvent(null);
    setDismissed(true);
  };

  return (
    <section className="card compact-list-card">
      <p className="eyebrow">Device Magic</p>
      {!isOnline ? (
        <>
          <strong>Offline mode active</strong>
          <p style={{ marginTop: 6 }}>The shell should still work for your last loaded content. If something is missing, reconnect and reload to refresh the cache.</p>
        </>
      ) : (
        <>
          <strong>Install Independence Quest</strong>
          <p style={{ marginTop: 6 }}>Add it to your home screen so it behaves more like a proper app and less like a wandering tab.</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button className="primary-button" onClick={handleInstall}>Install App</button>
            <button className="ghost-button" onClick={() => setDismissed(true)}>Not now</button>
          </div>
        </>
      )}
    </section>
  );
}
