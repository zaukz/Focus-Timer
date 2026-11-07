import type { Durations, Phase, SceneId, Settings, ThemeId } from '../types';

export interface Preset {
  id: string;
  name: string;
  hint: string;
  durations: Durations;
}

export const PRESETS: Preset[] = [
  {
    id: 'pomodoro',
    name: 'Pomodoro',
    hint: '25 focus · 5 break',
    durations: { focus: 1500, short: 300, long: 900, interval: 4 },
  },
  {
    id: 'extended',
    name: 'Extended',
    hint: '50 focus · 10 break',
    durations: { focus: 3000, short: 600, long: 1500, interval: 3 },
  },
  {
    id: 'deep',
    name: 'Deep Work',
    hint: '90 focus · 20 break',
    durations: { focus: 5400, short: 1200, long: 1800, interval: 2 },
  },
];

export const DEFAULT_DURATIONS: Durations = PRESETS[0].durations;

export interface SceneMeta {
  id: SceneId;
  name: string;
  mood: string;
  preview: string;
  group?: 'simple';
}

export const SCENES: SceneMeta[] = [
  {
    id: 'rain',
    name: 'Rainy window',
    mood: 'City rain, low light',
    preview:
      'radial-gradient(120% 100% at 74% 4%, #2b4358 0%, #132330 45%, #060a0e 100%)',
  },
  {
    id: 'stars',
    name: 'Starry night',
    mood: 'A clear, still sky',
    preview:
      'radial-gradient(130% 100% at 50% 2%, #212c54 0%, #0a1022 52%, #04060d 100%)',
  },
  {
    id: 'minimal',
    name: 'Stillness',
    mood: 'A quiet dark gradient',
    preview:
      'radial-gradient(130% 110% at 50% 0%, #24272e 0%, #0c0e12 48%, #06070a 100%)',
  },
  {
    id: 'snow',
    name: 'Snowfall',
    mood: 'Quiet flakes, cold blue light',
    preview:
      'radial-gradient(125% 105% at 50% 0%, #3a4b66 0%, #162134 52%, #070b12 100%)',
  },
  {
    id: 'sand',
    name: 'Sand',
    mood: 'Warm neutral, no motion',
    preview:
      'radial-gradient(125% 105% at 50% 0%, #3b342a 0%, #1c1814 56%, #0b0908 100%)',
    group: 'simple',
  },
  {
    id: 'sage',
    name: 'Sage',
    mood: 'Muted green, no motion',
    preview:
      'radial-gradient(125% 105% at 50% 0%, #2f3b32 0%, #141b16 56%, #080b09 100%)',
    group: 'simple',
  },
  {
    id: 'slate',
    name: 'Slate',
    mood: 'Cool grey, no motion',
    preview:
      'radial-gradient(125% 105% at 50% 0%, #2b3440 0%, #151a21 56%, #080a0d 100%)',
    group: 'simple',
  },
  {
    id: 'clay',
    name: 'Clay',
    mood: 'Soft terracotta, no motion',
    preview:
      'radial-gradient(125% 105% at 50% 0%, #3d2d27 0%, #1d1512 56%, #0b0807 100%)',
    group: 'simple',
  },
  {
    id: 'moss',
    name: 'Moss',
    mood: 'Deep olive, no motion',
    preview:
      'radial-gradient(125% 105% at 50% 0%, #35402f 0%, #171d13 56%, #090c07 100%)',
    group: 'simple',
  },
  {
    id: 'espresso',
    name: 'Espresso',
    mood: 'Dark coffee, no motion',
    preview:
      'radial-gradient(125% 105% at 50% 0%, #3a2a23 0%, #1a120e 56%, #0b0705 100%)',
    group: 'simple',
  },
  {
    id: 'twilight',
    name: 'Twilight',
    mood: 'Dusty indigo, no motion',
    preview:
      'radial-gradient(125% 105% at 50% 0%, #333a52 0%, #171a26 56%, #080a0f 100%)',
    group: 'simple',
  },
  {
    id: 'rose',
    name: 'Rose',
    mood: 'Muted rose, no motion',
    preview:
      'radial-gradient(125% 105% at 50% 0%, #493238 0%, #201518 56%, #0b0708 100%)',
    group: 'simple',
  },
  {
    id: 'tide',
    name: 'Tide',
    mood: 'Deep teal, no motion',
    preview:
      'radial-gradient(125% 105% at 50% 0%, #26424a 0%, #101e21 56%, #050b0d 100%)',
    group: 'simple',
  },
  {
    id: 'plum',
    name: 'Plum',
    mood: 'Soft purple, no motion',
    preview:
      'radial-gradient(125% 105% at 50% 0%, #3d3049 0%, #1a141f 56%, #0a080d 100%)',
    group: 'simple',
  },
  {
    id: 'ash',
    name: 'Ash',
    mood: 'Neutral charcoal, no motion',
    preview:
      'radial-gradient(125% 105% at 50% 0%, #36383b 0%, #18191b 56%, #08090a 100%)',
    group: 'simple',
  },
  {
    id: 'copper',
    name: 'Copper',
    mood: 'Warm rust, no motion',
    preview:
      'radial-gradient(125% 105% at 50% 0%, #4a3524 0%, #21160e 56%, #0c0805 100%)',
    group: 'simple',
  },
  {
    id: 'mist',
    name: 'Mist',
    mood: 'Cool grey green, no motion',
    preview:
      'radial-gradient(125% 105% at 50% 0%, #2f3b3e 0%, #141c1d 56%, #070b0c 100%)',
    group: 'simple',
  },
  {
    id: 'merlot',
    name: 'Merlot',
    mood: 'Muted wine, no motion',
    preview:
      'radial-gradient(125% 105% at 50% 0%, #462b32 0%, #1e1316 56%, #0b0708 100%)',
    group: 'simple',
  },
];

export const THEMES: { id: ThemeId; name: string; swatch: string }[] = [
  { id: 'midnight', name: 'Midnight', swatch: 'linear-gradient(145deg,#22262e,#07080a)' },
  { id: 'ink', name: 'Ink', swatch: 'linear-gradient(145deg,#111,#000)' },
  { id: 'dusk', name: 'Dusk', swatch: 'linear-gradient(145deg,#3a2a20,#0d0907)' },
];

export interface AccentPalette {
  light: string;
  deep: string;
  label: string;
}

export const ACCENTS: Record<Phase, AccentPalette> = {
  focus: { light: '244 216 179', deep: '199 137 84', label: 'Focus' },
  short: { light: '188 226 207', deep: '114 162 139', label: 'Short break' },
  long: { light: '201 210 244', deep: '128 140 200', label: 'Long break' },
};

export const DEFAULT_SETTINGS: Settings = {
  durations: { ...DEFAULT_DURATIONS },
  durationUnit: 'seconds',
  preset: 'pomodoro',
  autoStartBreaks: true,
  autoStartFocus: false,
  ticking: false,
  completionSound: true,
  notifications: false,
  showSeconds: true,
  clock24h: true,
  scene: 'rain',
  brightness: 1,
  blur: 0,
  overlay: 0.28,
  intensity: 0.6,
  theme: 'midnight',
};

export const LIMITS = {
  focus: [30, 14400],
  short: [30, 3600],
  long: [60, 10800],
  interval: [1, 12],
} as const;
