import { useEffect, useRef, useState } from 'react';
import { LIMITS, PRESETS, THEMES } from '../lib/constants';
import { clamp, formatDurationShort } from '../lib/time';
import type { Durations, Settings } from '../types';
import {
  Icon,
  NumberField,
  SectionLabel,
  SettingRow,
  Toggle,
  cx,
} from './ui';

function Kbd({ children }: { children: string }) {
  return (
    <span className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[9.5px] tracking-[0.05em] text-cream/65">
      {children}
    </span>
  );
}

function DataRow({
  title,
  detail,
  onClick,
}: {
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/[0.06] px-3.5 py-3 text-left transition duration-300 hover:border-white/[0.15] hover:bg-white/[0.025]"
    >
      <span>
        <span className="block text-[12px] text-cream/75">{title}</span>
        <span className="mt-0.5 block text-[10px] text-mist/35">{detail}</span>
      </span>
      <Icon name="arrow" size={13} className="shrink-0 text-mist/25" />
    </button>
  );
}

type DurationPart = 'hours' | 'minutes' | 'seconds';

function splitDuration(seconds: number) {
  return {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

function DurationField({
  label,
  seconds,
  min,
  max,
  onChange,
}: {
  label: string;
  seconds: number;
  min: number;
  max: number;
  onChange: (seconds: number) => void;
}) {
  const [parts, setParts] = useState(() => splitDuration(seconds));
  const editing = useRef(false);

  useEffect(() => {
    if (!editing.current) setParts(splitDuration(seconds));
  }, [seconds]);

  const commit = (next: typeof parts) => {
    setParts(next);
    const total = next.hours * 3600 + next.minutes * 60 + next.seconds;
    onChange(clamp(total, min, max));
  };

  const finish = () => {
    editing.current = false;
    const total = clamp(parts.hours * 3600 + parts.minutes * 60 + parts.seconds, min, max);
    onChange(total);
    setParts(splitDuration(total));
  };

  const unit = (part: DurationPart, symbol: string, name: string) => (
    <label key={part} className="flex items-center gap-1">
      <input
        type="number"
        min={0}
        inputMode="numeric"
        value={parts[part]}
        aria-label={`${label} ${name}`}
        onFocus={() => {
          editing.current = true;
        }}
        onBlur={finish}
        onChange={(event) => {
          const value = Math.max(0, Math.floor(Number(event.target.value) || 0));
          commit({ ...parts, [part]: value });
        }}
        className="duration-input h-6 w-8 rounded-md border border-white/[0.07] bg-black/20 text-center text-[12px] tabular text-cream/85 outline-none transition focus:border-accent/40"
      />
      <span className="text-[8px] uppercase tracking-[0.12em] text-mist/35">{symbol}</span>
    </label>
  );

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3.5 py-2.5">
      <div className="min-w-0">
        <div className="truncate text-[12.5px] text-cream/80">{label}</div>
        <div className="text-[9px] uppercase tracking-[0.16em] text-mist/35">
          {formatDurationShort(seconds)}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {unit('hours', 'h', 'hours')}
        {unit('minutes', 'm', 'minutes')}
        {unit('seconds', 's', 'seconds')}
      </div>
    </div>
  );
}

export function SettingsPanel({
  settings,
  patch,
  setDurations,
  applyPreset,
  permission,
  onRequestNotifications,
  onTestNotification,
  onClearStats,
  onRestoreDefaults,
}: {
  settings: Settings;
  patch: (patch: Partial<Settings>) => void;
  setDurations: (patch: Partial<Durations>) => void;
  applyPreset: (id: string) => void;
  permission: NotificationPermission | 'unsupported';
  onRequestNotifications: () => void;
  onTestNotification: () => void;
  onClearStats: () => void;
  onRestoreDefaults: () => void;
}) {
  const notificationsOn = settings.notifications && permission === 'granted';
  const notificationHint =
    permission === 'granted'
      ? 'A quiet alert when a session ends, even in another tab.'
      : permission === 'denied'
        ? 'Blocked in your browser settings. Allow notifications for this site to use them.'
        : permission === 'unsupported'
          ? 'This browser does not support desktop notifications.'
          : 'Your browser will ask for permission once.';

  return (
    <div className="space-y-9">
      <section>
        <SectionLabel>Rhythm</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((preset) => {
            const active = settings.preset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={active}
                onClick={() => applyPreset(preset.id)}
                className={cx(
                  'rounded-xl border px-2.5 py-3 text-left transition duration-300',
                  active
                    ? 'border-accent/35 bg-accent/[0.07]'
                    : 'border-white/[0.06] bg-white/[0.018] hover:border-white/[0.15]',
                )}
              >
                <span
                  className={cx(
                    'block text-[11.5px]',
                    active ? 'text-cream/95' : 'text-cream/70',
                  )}
                >
                  {preset.name}
                </span>
                <span className="mt-1 block text-[9px] leading-snug text-mist/40">
                  {preset.hint}
                </span>
              </button>
            );
          })}
        </div>
        {settings.preset === 'custom' ? (
          <p className="mt-2.5 text-[9px] uppercase tracking-[0.18em] text-accent/55">
            Custom intervals
          </p>
        ) : null}

        <div className="mt-3 space-y-2">
          <DurationField
            label="Focus"
            seconds={settings.durations.focus}
            min={LIMITS.focus[0]}
            max={LIMITS.focus[1]}
            onChange={(focus) => setDurations({ focus })}
          />
          <DurationField
            label="Short break"
            seconds={settings.durations.short}
            min={LIMITS.short[0]}
            max={LIMITS.short[1]}
            onChange={(short) => setDurations({ short })}
          />
          <DurationField
            label="Long break"
            seconds={settings.durations.long}
            min={LIMITS.long[0]}
            max={LIMITS.long[1]}
            onChange={(long) => setDurations({ long })}
          />
          <NumberField
            label="Rounds"
            unit="before long break"
            value={settings.durations.interval}
            min={LIMITS.interval[0]}
            max={LIMITS.interval[1]}
            onChange={(value) => setDurations({ interval: value })}
          />
        </div>
      </section>

      <section>
        <SectionLabel>Flow</SectionLabel>
        <div className="divide-y divide-white/[0.05]">
          <SettingRow
            label="Auto-start breaks"
            description="Begin resting the moment focus ends."
          >
            <Toggle
              label="Auto-start breaks"
              checked={settings.autoStartBreaks}
              onChange={(value) => patch({ autoStartBreaks: value })}
            />
          </SettingRow>
          <SettingRow
            label="Auto-start focus"
            description="Start the next round without a click."
          >
            <Toggle
              label="Auto-start focus"
              checked={settings.autoStartFocus}
              onChange={(value) => patch({ autoStartFocus: value })}
            />
          </SettingRow>
        </div>
      </section>

      <section>
        <SectionLabel>Sound &amp; alerts</SectionLabel>
        <div className="divide-y divide-white/[0.05]">
          <SettingRow label="Ticking" description="A soft tick for every second of focus.">
            <Toggle
              label="Ticking sound"
              checked={settings.ticking}
              onChange={(value) => patch({ ticking: value })}
            />
          </SettingRow>
          <SettingRow label="Completion chime" description="A gentle three-note bell.">
            <Toggle
              label="Completion chime"
              checked={settings.completionSound}
              onChange={(value) => patch({ completionSound: value })}
            />
          </SettingRow>
          <SettingRow
            label="Desktop notifications"
            description={notificationHint}
            disabled={permission === 'unsupported'}
          >
            <div className="flex items-center gap-2.5">
              {notificationsOn ? (
                <button
                  type="button"
                  aria-label="Send a test notification"
                  onClick={onTestNotification}
                  className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-mist/55 transition hover:border-white/20 hover:text-cream/80"
                >
                  Test
                </button>
              ) : null}
              <Toggle
                label="Desktop notifications"
                checked={notificationsOn}
                disabled={permission === 'unsupported'}
                onChange={(value) => {
                  if (value) onRequestNotifications();
                  else patch({ notifications: false });
                }}
              />
            </div>
          </SettingRow>
        </div>
      </section>

      <section>
        <SectionLabel>Display</SectionLabel>
        <div className="divide-y divide-white/[0.05]">
          <SettingRow label="Show seconds" description="Count down in minutes and seconds.">
            <Toggle
              label="Show seconds"
              checked={settings.showSeconds}
              onChange={(value) => patch({ showSeconds: value })}
            />
          </SettingRow>
          <SettingRow label="24-hour time" description="Used for session history.">
            <Toggle
              label="24-hour time"
              checked={settings.clock24h}
              onChange={(value) => patch({ clock24h: value })}
            />
          </SettingRow>
        </div>
      </section>

      <section>
        <SectionLabel>Appearance</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((theme) => {
            const active = settings.theme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                aria-pressed={active}
                onClick={() => patch({ theme: theme.id })}
                className={cx(
                  'rounded-xl border p-1.5 pb-2 transition duration-300',
                  active
                    ? 'border-accent/35'
                    : 'border-white/[0.06] hover:border-white/[0.15]',
                )}
              >
                <span
                  className="block h-9 w-full rounded-lg border border-white/[0.06]"
                  style={{ background: theme.swatch }}
                />
                <span
                  className={cx(
                    'mt-2 block text-[10.5px]',
                    active ? 'text-cream/85' : 'text-mist/50',
                  )}
                >
                  {theme.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <SectionLabel>Shortcuts</SectionLabel>
        <div className="space-y-2.5">
          {[
            ['Space', 'Start or pause'],
            ['R', 'Reset this session'],
            ['S', 'Skip to next session'],
            ['Esc', 'Close this panel'],
          ].map(([key, description]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-[11.5px] text-mist/55">{description}</span>
              <Kbd>{key}</Kbd>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>Local data</SectionLabel>
        <div className="space-y-2">
          <DataRow
            title="Reset statistics"
            detail="Remove every saved focus session"
            onClick={onClearStats}
          />
          <DataRow
            title="Restore defaults"
            detail="Timers, scenes and preferences"
            onClick={onRestoreDefaults}
          />
        </div>
        <p className="mt-4 text-[10.5px] leading-relaxed text-mist/35">
          Focus only stores settings and history in this browser.
        </p>
      </section>
    </div>
  );
}
