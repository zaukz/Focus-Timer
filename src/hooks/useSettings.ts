import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_SETTINGS,
  LIMITS,
  PRESETS,
  SCENES,
  THEMES,
} from '../lib/constants';
import { loadJSON, saveJSON, STORAGE_KEYS } from '../lib/storage';
import { clamp } from '../lib/time';
import type { Durations, SceneId, Settings, ThemeId } from '../types';

function num(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function isScene(value: unknown): value is SceneId {
  return SCENES.some((scene) => scene.id === value);
}

function isTheme(value: unknown): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}

export function normalizeSettings(raw: unknown): Settings {
  const source = (raw && typeof raw === 'object' ? raw : {}) as Partial<Settings>;
  const rawDurations = source.durations as Partial<Durations> | undefined;
  const defaults = DEFAULT_SETTINGS;
  const legacyMinutes = !!rawDurations && source.durationUnit !== 'seconds';
  const durationSeconds = (key: 'focus' | 'short' | 'long'): number => {
    const raw = rawDurations?.[key];
    const fallback = defaults.durations[key];
    if (typeof raw !== 'number' || !Number.isFinite(raw)) return fallback;
    return legacyMinutes ? raw * 60 : raw;
  };

  const durations: Durations = {
    focus: Math.round(clamp(durationSeconds('focus'), ...LIMITS.focus)),
    short: Math.round(clamp(durationSeconds('short'), ...LIMITS.short)),
    long: Math.round(clamp(durationSeconds('long'), ...LIMITS.long)),
    interval: Math.round(
      clamp(num(rawDurations?.interval, defaults.durations.interval), ...LIMITS.interval),
    ),
  };

  const preset =
    typeof source.preset === 'string' &&
    (source.preset === 'custom' || PRESETS.some((p) => p.id === source.preset))
      ? source.preset
      : defaults.preset;

  return {
    durations,
    durationUnit: 'seconds',
    preset,
    autoStartBreaks: bool(source.autoStartBreaks, defaults.autoStartBreaks),
    autoStartFocus: bool(source.autoStartFocus, defaults.autoStartFocus),
    ticking: bool(source.ticking, defaults.ticking),
    completionSound: bool(source.completionSound, defaults.completionSound),
    notifications: bool(source.notifications, defaults.notifications),
    showSeconds: bool(source.showSeconds, defaults.showSeconds),
    clock24h: bool(source.clock24h, defaults.clock24h),
    scene: isScene(source.scene) ? source.scene : defaults.scene,
    brightness: clamp(num(source.brightness, defaults.brightness), 0.4, 1.4),
    blur: clamp(num(source.blur, defaults.blur), 0, 24),
    overlay: clamp(num(source.overlay, defaults.overlay), 0, 0.8),
    intensity: clamp(num(source.intensity, defaults.intensity), 0, 1),
    theme: isTheme(source.theme) ? source.theme : defaults.theme,
  };
}

export interface SettingsApi {
  settings: Settings;
  patch: (patch: Partial<Settings>) => void;
  setDurations: (patch: Partial<Durations>) => void;
  applyPreset: (id: string) => void;
  reset: () => void;
}

export function useSettings(): SettingsApi {
  const [settings, setSettings] = useState<Settings>(() =>
    normalizeSettings(loadJSON<unknown>(STORAGE_KEYS.settings, null)),
  );

  useEffect(() => {
    saveJSON(STORAGE_KEYS.settings, settings);
  }, [settings]);

  const patch = useCallback((next: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...next }));
  }, []);

  const setDurations = useCallback((patchDurations: Partial<Durations>) => {
    setSettings((prev) => ({
      ...prev,
      preset: 'custom',
      durations: {
        ...prev.durations,
        ...patchDurations,
      },
    }));
  }, []);

  const applyPreset = useCallback((id: string) => {
    const preset = PRESETS.find((item) => item.id === id);
    if (!preset) return;
    setSettings((prev) => ({ ...prev, preset: preset.id, durations: { ...preset.durations } }));
  }, []);

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return useMemo(
    () => ({ settings, patch, setDurations, applyPreset, reset }),
    [settings, patch, setDurations, applyPreset, reset],
  );
}
