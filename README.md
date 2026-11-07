# Focus

A quiet, atmospheric focus timer for the browser. Focus pairs a timestamp-accurate
Pomodoro timer with four atmospheric scenes, a set of simple themes, and a small
record of the work you have done, all of it running entirely on your device.

No account. No backend. No tracking. No external assets.

## Features

- **Timer you can trust.** Remaining time is derived from timestamps, so the
  countdown survives background tabs, device sleep, and page refreshes.
- **Four atmospheric scenes.** Rainy window, starry night, stillness, and
  snowfall, each with its own generated motion layer. Fourteen flat themes are
  also included for a quieter, static background.
- **Atmosphere controls.** Brightness, blur, overlay darkness, and animation
  intensity, adjustable live.
- **Sessions that fit your work.** Pomodoro, Extended, and Deep Work presets, or
  your own focus, break, and round lengths, from seconds up to four hours.
- **Gentle transitions.** Optional automatic breaks and focus rounds, a soft
  completion chime, optional ticking, and desktop notifications.
- **Simple statistics.** Total focus time, completed sessions, today's total,
  a current streak, a seven-day chart, and recent history. Stored locally.
- **Thoughtful details.** Keyboard shortcuts, a tab title that shows the
  remaining time, confirmation before abandoning a session, and a responsive
  layout for phones and desktops.

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Scripts

| Command             | What it does                             |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start the Vite dev server with HMR       |
| `npm run build`     | Type-check and build the static site     |
| `npm run preview`   | Serve the production build locally       |
| `npm run typecheck` | Type-check the project                   |

## Deploying to GitHub Pages

The repository includes `.github/workflows/deploy.yml`, which builds the site and
publishes `dist` with GitHub's official Pages actions.

1. Push the project to a GitHub repository (the workflow runs on pushes to `main`).
2. In the repository, open **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. Push a commit, or run the workflow manually from the **Actions** tab.

The site will be available at `https://<user>.github.io/<repo>/`.

### Base path

`vite.config.ts` uses a relative asset base (`./`) by default, so the build works
from any subdirectory without configuration. If you prefer an absolute path, set
the `VITE_BASE_PATH` environment variable before building:

```bash
VITE_BASE_PATH=/focus/ npm run build
```

The workflow passes `VITE_BASE_PATH: ./`; change that line if you switch to an
absolute path.

Because Focus is a single page with no client-side routing, refreshing the page
works on GitHub Pages without a 404 redirect workaround.

## Keyboard shortcuts

| Key     | Action                        |
| ------- | ----------------------------- |
| `Space` | Start, pause, or resume       |
| `R`     | Reset the current session     |
| `S`     | Skip to the next session      |
| `Esc`   | Close the open panel          |
| `?`     | Open settings                 |

Shortcuts are ignored while typing in an input.

## How sessions and statistics work

- The timer stores the absolute timestamp at which a running session ends. Every
  tick compares that timestamp with the current clock instead of decrementing a
  counter, so throttled or suspended tabs stay accurate.
- Progress is persisted in `localStorage`; reloading restores a running session,
  and a session that ended while the tab was closed is recorded once at its real
  end time without starting a chain of extra sessions.
- Only completed focus sessions are recorded. Skipping or resetting a focus round
  does not add time to your statistics.
- The streak counts consecutive local days with at least one completed focus
  session. A day without sessions breaks the streak; an unfinished today does not.

## Privacy

Everything lives in `localStorage` under the `focus.*` keys. Clearing site data in
your browser removes it. There is no network request for scenes, audio, fonts, or
statistics.

## Tech

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Web Audio API for the tick and completion chime
- Canvas 2D for scene motion
- 100% client-side, with locally bundled fonts (Inter, Instrument Serif)

## Project structure

```
src/
  App.tsx                 app shell, shortcuts, orchestration
  components/
    AmbientBackdrop.tsx   scene layers + atmosphere filters
    AmbientCanvas.tsx     generated rain, snow, and stars
    SceneArt.tsx          hand-built CSS/SVG scene art
    Ring.tsx              circular progress visual
    TimerStage.tsx        main timer experience
    Drawer.tsx            right-hand panel with tabs
    ScenesPanel.tsx       scene picker and atmosphere sliders
    StatsPanel.tsx        statistics and weekly chart
    SettingsPanel.tsx     timer, alerts, display, data settings
  hooks/
    useTimer.ts           timestamp-driven timer state machine
    useSettings.ts        validated persisted preferences
    useStats.ts           persisted session history
  lib/
    audio.ts              Web Audio helpers (chime and tick)
    constants.ts          presets, scenes, defaults
    stats.ts              local aggregation, streak, weekly buckets
    storage.ts            safe localStorage access
    time.ts               time and number formatting
```

## License

MIT
