export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function notificationPermission(): NotificationPermission | 'unsupported' {
  if (!notificationsSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!notificationsSupported()) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

export function showNotification(title: string, body: string): boolean {
  if (!notificationsSupported() || Notification.permission !== 'granted') return false;
  try {
    const note = new Notification(title, {
      body,
      icon: new URL('favicon.svg', document.baseURI).href,
      badge: new URL('favicon.svg', document.baseURI).href,
      tag: 'focus-session',
    });
    note.onclick = () => {
      window.focus();
      note.close();
    };
    return true;
  } catch {
    // Some browsers only allow notifications from a service worker.
    return false;
  }
}
