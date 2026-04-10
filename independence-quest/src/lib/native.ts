import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';

export function isNativeShell() {
  return Capacitor.isNativePlatform();
}

export async function triggerHaptic(kind: 'light' | 'medium' | 'heavy' = 'light') {
  try {
    if (isNativeShell()) {
      await Haptics.impact({ style: kind === 'heavy' ? ImpactStyle.Heavy : kind === 'medium' ? ImpactStyle.Medium : ImpactStyle.Light });
      return;
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(kind === 'heavy' ? 40 : kind === 'medium' ? 24 : 12);
    }
  } catch {
    // no-op
  }
}

export async function ensureNotificationPermission() {
  try {
    if (isNativeShell()) {
      const status = await LocalNotifications.checkPermissions();
      if (status.display !== 'granted') return LocalNotifications.requestPermissions();
      return status;
    }
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  } catch {
    // no-op
  }
}

export async function scheduleReengagementReminder() {
  try {
    if (isNativeShell()) {
      await ensureNotificationPermission();
      const when = new Date(Date.now() + 1000 * 60 * 60 * 24);
      await LocalNotifications.schedule({
        notifications: [{
          id: 4242,
          title: 'Independence Quest',
          body: 'Tiny quests beat dramatic guilt spirals. Come clear one.',
          schedule: { at: when },
        }]
      });
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
