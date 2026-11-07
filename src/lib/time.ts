export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Countdown label. Adds an hours segment once the session reaches an hour. */
export function formatCountdown(ms: number, showSeconds = true): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (!showSeconds) {
    const totalMinutes = Math.ceil(totalSeconds / 60);
    if (totalMinutes < 60) return String(totalMinutes);
    return `${Math.floor(totalMinutes / 60)}:${String(totalMinutes % 60).padStart(2, '0')}`;
  }

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Compact duration label, e.g. "45s", "25m", "1h 30m", "1h 30m 15s". */
export function formatDurationShort(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const rest = total % 60;
  if (hours > 0) {
    if (minutes === 0 && rest === 0) return `${hours}h`;
    if (rest === 0) return `${hours}h ${minutes}m`;
    return `${hours}h ${minutes}m ${rest}s`;
  }
  if (minutes > 0) return rest === 0 ? `${minutes}m` : `${minutes}m ${rest}s`;
  return `${rest}s`;
}

/** Human readable minutes, e.g. "45m", "3h 20m". */
export function humanMinutes(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  if (total < 60) return `${total}m`;
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

export function humanMs(ms: number): string {
  return humanMinutes(ms / 60000);
}

export function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function dayKey(ts: number): string {
  const d = new Date(ts);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function weekdayShort(ts: number): string {
  return WEEKDAYS[new Date(ts).getDay()];
}

export function formatClockTime(ts: number, clock24h: boolean): string {
  const d = new Date(ts);
  const minutes = String(d.getMinutes()).padStart(2, '0');
  if (clock24h) return `${String(d.getHours()).padStart(2, '0')}:${minutes}`;
  const hours = d.getHours() % 12 || 12;
  return `${hours}:${minutes} ${d.getHours() >= 12 ? 'PM' : 'AM'}`;
}

export function formatDayLabel(ts: number, now = Date.now()): string {
  const today = startOfDay(now);
  const day = startOfDay(ts);
  const diff = Math.round((today - day) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  const d = new Date(ts);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function plural(count: number, one: string, many = `${one}s`): string {
  return count === 1 ? one : many;
}
