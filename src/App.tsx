import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { AmbientBackdrop } from './components/AmbientBackdrop';
import { ConfirmDialog, type DialogData } from './components/ConfirmDialog';
import { Drawer } from './components/Drawer';
import { ScenesPanel } from './components/ScenesPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { StatsPanel } from './components/StatsPanel';
import { TimerStage } from './components/TimerStage';
import { Toast, type ToastData } from './components/Toast';
import { Icon, NavButton } from './components/ui';
import { useSettings } from './hooks/useSettings';
import { useStats } from './hooks/useStats';
import { useTimer, type CompletionInfo } from './hooks/useTimer';
import { ACCENTS, LIMITS, SCENES } from './lib/constants';
import { playChime, unlockAudio } from './lib/audio';
import {
  notificationPermission,
  requestNotificationPermission,
  showNotification,
} from './lib/notify';
import { clamp, formatCountdown } from './lib/time';
import type { TabId } from './types';

const BASE_TITLE = 'Focus: a calm place to work';

export default function App() {
  const { settings, patch, setDurations, applyPreset, reset: resetSettings } = useSettings();
  const { sessions, addSession, clear: clearStats } = useStats();

  const [tab, setTab] = useState<TabId | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [dialog, setDialog] = useState<DialogData | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(() =>
    notificationPermission(),
  );

  const notify = useCallback((title: string, note?: string) => {
    setToast({ id: Date.now(), title, note });
  }, []);

  const handleComplete = useCallback(
    (info: CompletionInfo) => {
      if (info.phase === 'focus') addSession(info.minutes, info.endedAt);

      const isFocus = info.phase === 'focus';
      const title = isFocus ? 'Focus complete' : 'Break complete';
      const nextLabel = ACCENTS[info.nextPhase].label.toLowerCase();
      const note = isFocus
        ? info.nextPhase === 'long'
          ? `${info.minutes} minutes focused · long break earned`
          : `${info.minutes} minutes focused · ${nextLabel} ${info.autoStarted ? 'started' : 'next'}`
        : info.autoStarted
          ? 'Focus started. Settle in.'
          : 'Back to focus when you are ready';

      notify(title, note);
      if (settings.completionSound) playChime(1);
      if (settings.notifications) showNotification(title, note);
    },
    [addSession, notify, settings.completionSound, settings.notifications],
  );

  const timer = useTimer({
    durations: settings.durations,
    autoStartBreaks: settings.autoStartBreaks,
    autoStartFocus: settings.autoStartFocus,
    ticking: settings.ticking,
    onComplete: handleComplete,
  });

  const accent = ACCENTS[timer.phase];
  const sceneMeta = SCENES.find((scene) => scene.id === settings.scene) ?? SCENES[0];
  const drawerOpen = tab !== null;

  useEffect(() => {
    const next =
      timer.status === 'running'
        ? `${formatCountdown(timer.remainingMs, settings.showSeconds)} · ${accent.label}`
        : timer.status === 'paused'
          ? `Paused · ${formatCountdown(timer.remainingMs, settings.showSeconds)}`
          : BASE_TITLE;
    if (document.title !== next) document.title = next;
  }, [timer.status, timer.remainingMs, timer.phase, settings.showSeconds, accent.label]);

  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  useEffect(() => {
    const refresh = () => setPermission(notificationPermission());
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 6500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    return () => previous?.focus?.();
  }, [dialog]);

  const openTab = useCallback((next: TabId) => {
    setTab((current) => (current === next ? null : next));
  }, []);

  const adjustLength = useCallback(
    (direction: -1 | 1) => {
      if (timer.status !== 'idle') return;
      const phase = timer.phase;
      const step = phase === 'short' ? 60 : 300;
      const [min, max] = LIMITS[phase];
      const next = clamp(settings.durations[phase] + direction * step, min, max);
      if (next === settings.durations[phase]) return;
      if (phase === 'focus') setDurations({ focus: next });
      else if (phase === 'short') setDurations({ short: next });
      else setDurations({ long: next });
    },
    [setDurations, settings.durations, timer.phase, timer.status],
  );

  const requestReset = useCallback(() => {
    if (timer.status === 'idle' && timer.remainingMs >= timer.totalMs - 500) return;
    setDialog({
      title: 'Reset this session?',
      description: `Your progress in this ${
        timer.phase === 'focus' ? 'focus session' : 'break'
      } will be lost.`,
      confirmLabel: 'Reset',
      action: timer.reset,
    });
  }, [timer]);

  const requestClearStats = useCallback(() => {
    setDialog({
      title: 'Reset statistics?',
      description:
        'Every saved focus session will be removed from this browser. Settings and scenes stay as they are.',
      confirmLabel: 'Reset data',
      tone: 'danger',
      action: clearStats,
    });
  }, [clearStats]);

  const requestRestoreDefaults = useCallback(() => {
    setDialog({
      title: 'Restore defaults?',
      description:
        'Timers, scenes and display preferences return to their original values. Your statistics are kept.',
      confirmLabel: 'Restore',
      action: resetSettings,
    });
  }, [resetSettings]);

  const enableNotifications = useCallback(async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === 'granted') {
      patch({ notifications: true });
      const sent = showNotification(
        'Focus notifications are on',
        'This is what a session alert looks like.',
      );
      if (!sent) patch({ notifications: false });
      notify(
        sent ? 'Notifications enabled' : 'Notifications blocked',
        sent
          ? 'A test alert is on its way. If you do not see it, check your system notification settings.'
          : 'Allow notifications for this site in your browser settings.',
      );
    } else {
      patch({ notifications: false });
      notify('Notifications blocked', 'Allow them for this site in your browser settings.');
    }
  }, [notify, patch]);

  const testNotification = useCallback(() => {
    const sent = showNotification(
      'Focus test alert',
      'This is what a session alert looks like.',
    );
    setPermission(notificationPermission());
    if (!sent) patch({ notifications: false });
    notify(
      sent ? 'Test alert sent' : 'Notification not sent',
      sent
        ? 'If you do not see it, check your system notification settings.'
        : 'Allow notifications for this site in your browser settings.',
    );
  }, [notify, patch]);

  const shortcuts = useRef({
    toggle: timer.toggle,
    reset: requestReset,
    skip: timer.skip,
    active: timer.status !== 'idle',
    close: () => {},
  });
  shortcuts.current = {
    toggle: timer.toggle,
    reset: requestReset,
    skip: timer.skip,
    active: timer.status !== 'idle' || timer.remainingMs < timer.totalMs - 500,
    close: () => {
      setTab(null);
      setDialog(null);
    },
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const key = event.key.toLowerCase();

      if (key === 'escape') {
        shortcuts.current.close();
        return;
      }

      if (event.repeat) return;

      // Leave native keyboard behaviour (space activates a focused button,
      // arrows move a slider, typing edits a field) alone.
      if (
        target &&
        (target.isContentEditable ||
          (typeof target.closest === 'function' &&
            target.closest(
              'input, textarea, select, button, a, [role="switch"], [role="tab"], [role="slider"]',
            )))
      ) {
        return;
      }

      if (tab !== null || dialog !== null) return;

      if (key === ' ' || key === 'spacebar' || event.code === 'Space') {
        event.preventDefault();
        unlockAudio();
        shortcuts.current.toggle();
      } else if (key === 'r') {
        event.preventDefault();
        shortcuts.current.reset();
      } else if (key === 's') {
        if (!shortcuts.current.active) return;
        event.preventDefault();
        shortcuts.current.skip();
      } else if (key === '?') {
        event.preventDefault();
        setTab('settings');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [tab, dialog]);

  return (
    <div
      data-theme={settings.theme}
      className="relative flex h-full flex-col overflow-hidden bg-[#06070a]"
      style={
        {
          '--accent': accent.light,
          '--accent-deep': accent.deep,
        } as CSSProperties
      }
    >
      <AmbientBackdrop
        scene={settings.scene}
        brightness={settings.brightness}
        blur={settings.blur}
        overlay={settings.overlay}
        intensity={settings.intensity}
      />

      <header className="relative z-20 flex items-center justify-between gap-2 px-4 pt-4 sm:px-8 sm:pt-7">
        <div className="flex select-none items-baseline gap-2.5 pl-1">
          <span className="font-serif text-[25px] leading-none tracking-[-0.01em] text-cream/90">
            focus<span className="text-accent">.</span>
          </span>
          <span className="hidden text-[8.5px] uppercase tracking-[0.3em] text-mist/30 md:inline">
            a calm place to work
          </span>
        </div>
        <nav className="flex items-center gap-0.5 sm:gap-1" aria-label="Focus sections">
          <NavButton
            icon="scenes"
            label="Scenes"
            active={tab === 'scenes'}
            onClick={() => openTab('scenes')}
          />
          <NavButton
            icon="stats"
            label="Stats"
            active={tab === 'stats'}
            onClick={() => openTab('stats')}
          />
          <NavButton
            icon="settings"
            label="Settings"
            active={tab === 'settings'}
            onClick={() => openTab('settings')}
          />
        </nav>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-y-auto overflow-x-hidden px-4 py-3 sm:px-6">
        <TimerStage
          phase={timer.phase}
          status={timer.status}
          remainingMs={timer.remainingMs}
          progress={timer.progress}
          cycle={timer.cycle}
          interval={timer.interval}
          showSeconds={settings.showSeconds}
          durationSeconds={settings.durations[timer.phase]}
          canAdjustLength={timer.status === 'idle'}
          onAdjustLength={adjustLength}
          onToggle={() => {
            unlockAudio();
            timer.toggle();
          }}
          onReset={requestReset}
          onSkip={timer.skip}
        />
      </main>

      <footer
        className="relative z-20 flex items-center justify-between gap-3 px-4 pt-2 sm:px-8"
        style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
      >
        <button
          type="button"
          onClick={() => openTab('scenes')}
          className="group flex items-center gap-2.5 rounded-full border border-white/[0.07] bg-white/[0.03] py-1.5 pl-1.5 pr-3 backdrop-blur-xl transition duration-300 hover:border-white/[0.16] hover:bg-white/[0.06]"
          aria-label={`Change scene (${sceneMeta.name})`}
        >
          <span
            className="h-6 w-6 rounded-full border border-white/10"
            style={{ background: sceneMeta.preview }}
          />
          <span className="text-[11px] tracking-[0.03em] text-cream/70">{sceneMeta.name}</span>
          <Icon name="chevron" size={11} className="text-mist/35" />
        </button>

        <span className="hidden select-none items-center gap-2 text-[8.5px] uppercase tracking-[0.2em] text-mist/25 lg:flex">
          <span>Space</span>
          <span className="text-mist/15">·</span>
          <span>R reset</span>
          <span className="text-mist/15">·</span>
          <span>S skip</span>
        </span>

      </footer>

      <Drawer open={drawerOpen} tab={tab ?? 'scenes'} onTab={setTab} onClose={() => setTab(null)}>
        {tab === 'scenes' ? <ScenesPanel settings={settings} patch={patch} /> : null}
        {tab === 'stats' ? (
          <StatsPanel
            sessions={sessions}
            clock24h={settings.clock24h}
            onClear={requestClearStats}
          />
        ) : null}
        {tab === 'settings' ? (
          <SettingsPanel
            settings={settings}
            patch={patch}
            setDurations={setDurations}
            applyPreset={applyPreset}
            permission={permission}
            onRequestNotifications={() => {
              void enableNotifications();
            }}
            onTestNotification={testNotification}
            onClearStats={requestClearStats}
            onRestoreDefaults={requestRestoreDefaults}
          />
        ) : null}
      </Drawer>

      <Toast toast={toast} />

      <ConfirmDialog
        dialog={dialog}
        onCancel={() => setDialog(null)}
        onConfirm={() => {
          dialog?.action();
          setDialog(null);
        }}
      />
    </div>
  );
}
