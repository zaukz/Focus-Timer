import type { SessionRecord } from '../types';
import { dayKey, startOfDay, weekdayShort } from './time';

export interface DayBucket {
  key: string;
  ts: number;
  label: string;
  minutes: number;
  sessions: number;
  isToday: boolean;
}

export interface StatsSummary {
  totalMinutes: number;
  totalSessions: number;
  todayMinutes: number;
  todaySessions: number;
  weekMinutes: number;
  weekSessions: number;
  streak: number;
  days: DayBucket[];
  activeDays: number;
}

export function computeStats(sessions: SessionRecord[], now = Date.now()): StatsSummary {
  const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);
  const todayKey = dayKey(now);

  const perDay = new Map<string, { minutes: number; sessions: number }>();
  for (const session of sessions) {
    const key = dayKey(session.endedAt);
    const entry = perDay.get(key) ?? { minutes: 0, sessions: 0 };
    entry.minutes += session.minutes;
    entry.sessions += 1;
    perDay.set(key, entry);
  }

  const days: DayBucket[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const ts = d.getTime();
    const key = dayKey(ts);
    const entry = perDay.get(key);
    days.push({
      key,
      ts,
      label: weekdayShort(ts),
      minutes: entry?.minutes ?? 0,
      sessions: entry?.sessions ?? 0,
      isToday: key === todayKey,
    });
  }

  const today = perDay.get(todayKey);
  const weekMinutes = days.reduce((sum, day) => sum + day.minutes, 0);
  const weekSessions = days.reduce((sum, day) => sum + day.sessions, 0);

  // Streak counts consecutive days with at least one session. Today not being
  // finished yet doesn't break a streak that is alive from yesterday.
  let streak = 0;
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);
  if (!perDay.has(dayKey(cursor.getTime()))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (perDay.has(dayKey(cursor.getTime()))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return {
    totalMinutes,
    totalSessions: sessions.length,
    todayMinutes: today?.minutes ?? 0,
    todaySessions: today?.sessions ?? 0,
    weekMinutes,
    weekSessions,
    streak,
    days,
    activeDays: perDay.size,
  };
}

export interface RecentSession {
  record: SessionRecord;
  dateTs: number;
}

export function recentSessions(sessions: SessionRecord[], limit = 6): RecentSession[] {
  return [...sessions]
    .sort((a, b) => b.endedAt - a.endedAt)
    .slice(0, limit)
    .map((record) => ({ record, dateTs: startOfDay(record.endedAt) }));
}
