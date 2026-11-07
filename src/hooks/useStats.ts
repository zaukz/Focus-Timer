import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadJSON, saveJSON, STORAGE_KEYS } from '../lib/storage';
import type { SessionRecord } from '../types';

function normalizeSessions(raw: unknown): SessionRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is SessionRecord => {
      if (!item || typeof item !== 'object') return false;
      const record = item as Partial<SessionRecord>;
      return (
        typeof record.id === 'string' &&
        typeof record.endedAt === 'number' &&
        Number.isFinite(record.endedAt) &&
        typeof record.minutes === 'number' &&
        Number.isFinite(record.minutes) &&
        record.minutes > 0
      );
    })
    .slice(-3000);
}

export interface StatsApi {
  sessions: SessionRecord[];
  addSession: (minutes: number, endedAt: number) => void;
  clear: () => void;
}

export function useStats(): StatsApi {
  const [sessions, setSessions] = useState<SessionRecord[]>(() =>
    normalizeSessions(loadJSON<unknown>(STORAGE_KEYS.stats, [])),
  );

  useEffect(() => {
    saveJSON(STORAGE_KEYS.stats, sessions);
  }, [sessions]);

  const addSession = useCallback((minutes: number, endedAt: number) => {
    if (!Number.isFinite(minutes) || minutes <= 0) return;
    setSessions((prev) => [
      ...prev.slice(-2999),
      {
        id: `${endedAt}-${Math.random().toString(36).slice(2, 8)}`,
        endedAt,
        minutes: Math.round(minutes),
      },
    ]);
  }, []);

  const clear = useCallback(() => setSessions([]), []);

  return useMemo(() => ({ sessions, addSession, clear }), [sessions, addSession, clear]);
}
