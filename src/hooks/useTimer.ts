import { useCallback, useEffect, useRef, useState } from 'react';
import { playTick } from '../lib/audio';
import { loadJSON, saveJSON, STORAGE_KEYS } from '../lib/storage';
import { clamp } from '../lib/time';
import type { Durations, Phase, TimerState, TimerStatus } from '../types';

const MAX_SESSION_MS = 4 * 60 * 60 * 1000;

export interface CompletionInfo {
  phase: Phase;
  nextPhase: Phase;
  minutes: number;
  endedAt: number;
  autoStarted: boolean;
}

interface TimerOptions {
  durations: Durations;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  ticking: boolean;
  onComplete: (info: CompletionInfo) => void;
}

function isPhase(value: unknown): value is Phase {
  return value === 'focus' || value === 'short' || value === 'long';
}

function isStatus(value: unknown): value is TimerStatus {
  return value === 'idle' || value === 'running' || value === 'paused';
}

function initialState(durations: Durations): TimerState {
  const freshMs = durations.focus * 1000;
  const fresh: TimerState = {
    phase: 'focus',
    status: 'idle',
    endAt: null,
    remainingMs: freshMs,
    totalMs: freshMs,
    cycle: 0,
  };

  const raw = loadJSON<Partial<TimerState> | null>(STORAGE_KEYS.timer, null);
  if (!raw || typeof raw !== 'object') return fresh;

  const phase = isPhase(raw.phase) ? raw.phase : 'focus';
  const status = isStatus(raw.status) ? raw.status : 'idle';
  const fallbackMs = durations[phase] * 1000;
  const totalMs = clamp(
    typeof raw.totalMs === 'number' && Number.isFinite(raw.totalMs) ? raw.totalMs : fallbackMs,
    1000,
    MAX_SESSION_MS,
  );
  const remainingMs = clamp(
    typeof raw.remainingMs === 'number' && Number.isFinite(raw.remainingMs)
      ? raw.remainingMs
      : totalMs,
    0,
    totalMs,
  );
  const endAt =
    typeof raw.endAt === 'number' && Number.isFinite(raw.endAt) ? raw.endAt : null;
  const cycle = clamp(
    typeof raw.cycle === 'number' && Number.isFinite(raw.cycle) ? Math.round(raw.cycle) : 0,
    0,
    20,
  );

  if (status === 'running' && endAt === null) return fresh;

  return { phase, status, endAt, remainingMs, totalMs, cycle };
}

export interface TimerApi {
  phase: Phase;
  status: TimerStatus;
  remainingMs: number;
  totalMs: number;
  progress: number;
  cycle: number;
  interval: number;
  started: boolean;
  start: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  skip: () => void;
}

export function useTimer(options: TimerOptions): TimerApi {
  const { durations, ticking } = options;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const [state, setState] = useState<TimerState>(() => initialState(durations));
  const stateRef = useRef(state);
  stateRef.current = state;

  const [now, setNow] = useState(() => Date.now());
  const finishing = useRef(false);

  const interval = durations.interval;

  const finish = useCallback((endedAtOverride?: number) => {
    const prev = stateRef.current;
    if (prev.status !== 'running' || finishing.current) return;
    finishing.current = true;

    const current = optionsRef.current;
    const endedAt = endedAtOverride ?? prev.endAt ?? Date.now();
    const late = Date.now() - endedAt > 15000;

    let nextPhase: Phase;
    let nextCycle = prev.cycle;

    if (prev.phase === 'focus') {
      nextCycle = (prev.cycle + 1) % current.durations.interval;
      nextPhase = nextCycle === 0 ? 'long' : 'short';
    } else {
      nextPhase = 'focus';
    }

    const nextMs = current.durations[nextPhase] * 1000;
    const auto =
      !late &&
      (nextPhase === 'focus' ? current.autoStartFocus : current.autoStartBreaks);

    setState({
      phase: nextPhase,
      cycle: nextCycle,
      status: auto ? 'running' : 'idle',
      endAt: auto ? Date.now() + nextMs : null,
      remainingMs: nextMs,
      totalMs: nextMs,
    });
    setNow(Date.now());

    if (prev.phase === 'focus') {
      current.onComplete({
        phase: prev.phase,
        nextPhase,
        minutes: Math.round(prev.totalMs / 60000),
        endedAt,
        autoStarted: auto,
      });
    } else {
      current.onComplete({
        phase: prev.phase,
        nextPhase,
        minutes: 0,
        endedAt,
        autoStarted: auto,
      });
    }

    finishing.current = false;
  }, []);

  // Timestamp-driven countdown: safe across inactive tabs and device sleep.
  useEffect(() => {
    if (state.status !== 'running') return;
    const id = window.setInterval(() => {
      const time = Date.now();
      setNow(time);
      const current = stateRef.current;
      if (current.endAt !== null && time >= current.endAt) {
        finish(current.endAt);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [state.status, finish]);

  // Catch up immediately when the tab becomes visible again.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      const time = Date.now();
      setNow(time);
      const current = stateRef.current;
      if (current.status === 'running' && current.endAt !== null && time >= current.endAt) {
        finish(current.endAt);
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [finish]);

  // Optional ticking, once per second while a focus session runs.
  useEffect(() => {
    if (!ticking || state.status !== 'running' || state.phase !== 'focus') return;
    const id = window.setInterval(() => {
      playTick(0.9);
    }, 1000);
    return () => window.clearInterval(id);
  }, [ticking, state.status, state.phase]);

  // Keep idle durations in sync with settings without disturbing live sessions.
  useEffect(() => {
    setState((prev) => {
      const durationMs = durations[prev.phase] * 1000;
      const cycle = Math.min(prev.cycle, Math.max(0, durations.interval - 1));
      if (prev.status === 'running') {
        return cycle === prev.cycle ? prev : { ...prev, cycle };
      }
      if (prev.status === 'idle') {
        if (
          prev.remainingMs === durationMs &&
          prev.totalMs === durationMs &&
          cycle === prev.cycle
        ) {
          return prev;
        }
        return { ...prev, cycle, remainingMs: durationMs, totalMs: durationMs };
      }
      return {
        ...prev,
        cycle,
        totalMs: durationMs,
        remainingMs: Math.min(prev.remainingMs, durationMs),
      };
    });
  }, [durations.focus, durations.short, durations.long, durations.interval, durations]);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.timer, state);
  }, [state]);

  const start = useCallback(() => {
    const time = Date.now();
    setNow(time);
    setState((prev) => {
      if (prev.status === 'running') return prev;
      const remaining = prev.status === 'idle' ? prev.totalMs : Math.max(prev.remainingMs, 1);
      return {
        ...prev,
        status: 'running',
        endAt: time + remaining,
        remainingMs: remaining,
      };
    });
  }, []);

  const pause = useCallback(() => {
    const time = Date.now();
    setNow(time);
    setState((prev) => {
      if (prev.status !== 'running' || prev.endAt === null) return prev;
      return {
        ...prev,
        status: 'paused',
        endAt: null,
        remainingMs: Math.max(0, prev.endAt - time),
      };
    });
  }, []);

  const toggle = useCallback(() => {
    if (stateRef.current.status === 'running') pause();
    else start();
  }, [pause, start]);

  const reset = useCallback(() => {
    const durationMs = optionsRef.current.durations[stateRef.current.phase] * 1000;
    setNow(Date.now());
    setState((prev) => ({
      ...prev,
      status: 'idle',
      endAt: null,
      remainingMs: durationMs,
      totalMs: durationMs,
    }));
  }, []);

  const skip = useCallback(() => {
    const prev = stateRef.current;
    const current = optionsRef.current;
    const nextPhase: Phase =
      prev.phase === 'focus'
        ? ((prev.cycle + 1) % current.durations.interval === 0 ? 'long' : 'short')
        : 'focus';
    const nextMs = current.durations[nextPhase] * 1000;
    setNow(Date.now());
    setState({
      phase: nextPhase,
      cycle: prev.cycle,
      status: 'idle',
      endAt: null,
      remainingMs: nextMs,
      totalMs: nextMs,
    });
  }, []);

  const remainingMs =
    state.status === 'running' && state.endAt !== null
      ? Math.max(0, state.endAt - now)
      : state.remainingMs;

  const totalMs = Math.max(1, state.totalMs);
  const progress = clamp(1 - remainingMs / totalMs, 0, 1);
  const started = state.status !== 'idle' || remainingMs < state.totalMs - 500;

  return {
    phase: state.phase,
    status: state.status,
    remainingMs,
    totalMs,
    progress,
    cycle: state.cycle,
    interval,
    started,
    start,
    pause,
    toggle,
    reset,
    skip,
  };
}

export type { TimerState };
