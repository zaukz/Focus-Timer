export type Phase = 'focus' | 'short' | 'long';
export type TimerStatus = 'idle' | 'running' | 'paused';

export type SceneId =
  | 'rain'
  | 'stars'
  | 'minimal'
  | 'snow'
  | 'sand'
  | 'sage'
  | 'slate'
  | 'clay'
  | 'moss'
  | 'espresso'
  | 'twilight'
  | 'rose'
  | 'tide'
  | 'plum'
  | 'ash'
  | 'copper'
  | 'mist'
  | 'merlot';

export type ThemeId = 'midnight' | 'ink' | 'dusk';

export type TabId = 'scenes' | 'stats' | 'settings';

export interface Durations {
  /** Focus length in seconds. */
  focus: number;
  /** Short break length in seconds. */
  short: number;
  /** Long break length in seconds. */
  long: number;
  /** Focus sessions before a long break. */
  interval: number;
}

export interface Settings {
  durations: Durations;
  /** Marks durations as seconds; older saves are migrated from minutes. */
  durationUnit: 'seconds';
  /** Preset id, or "custom" once intervals are edited by hand. */
  preset: string;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  ticking: boolean;
  completionSound: boolean;
  notifications: boolean;
  showSeconds: boolean;
  clock24h: boolean;
  scene: SceneId;
  brightness: number;
  blur: number;
  overlay: number;
  intensity: number;
  theme: ThemeId;
}

export interface SessionRecord {
  id: string;
  /** Epoch ms when the focus session ended. */
  endedAt: number;
  /** Planned length of the session in minutes. */
  minutes: number;
}

export interface TimerState {
  phase: Phase;
  status: TimerStatus;
  /** Timestamp the running session ends at. Null when idle or paused. */
  endAt: number | null;
  /** Frozen remaining time used while idle or paused. */
  remainingMs: number;
  /** Length of the current session when it began. */
  totalMs: number;
  /** Focus sessions completed in the current cycle. */
  cycle: number;
}
