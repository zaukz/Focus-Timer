import { ACCENTS, LIMITS } from '../lib/constants';
import { formatCountdown, formatDurationShort } from '../lib/time';
import type { Phase, TimerStatus } from '../types';
import { Ring } from './Ring';
import { Icon, cx } from './ui';

function Control({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: 'reset' | 'skip';
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={cx(
        'grid h-11 w-11 place-items-center rounded-full border border-white/[0.07] text-mist/75 transition duration-300 ease-soft',
        'hover:border-white/15 hover:bg-white/[0.05] hover:text-cream',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/60',
        'disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent',
      )}
    >
      <Icon name={icon} size={16} />
    </button>
  );
}

export function TimerStage({
  phase,
  status,
  remainingMs,
  progress,
  cycle,
  interval,
  showSeconds,
  durationSeconds,
  canAdjustLength,
  onToggle,
  onReset,
  onSkip,
  onAdjustLength,
}: {
  phase: Phase;
  status: TimerStatus;
  remainingMs: number;
  progress: number;
  cycle: number;
  interval: number;
  showSeconds: boolean;
  durationSeconds: number;
  canAdjustLength: boolean;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
  onAdjustLength: (direction: -1 | 1) => void;
}) {
  const accent = ACCENTS[phase];
  const isRunning = status === 'running';
  const hasHours = remainingMs >= 3600000;
  const durationLabel = formatDurationShort(durationSeconds);
  const stateWord =
    status === 'paused' ? 'Paused' : isRunning ? (phase === 'focus' ? 'Stay with it' : 'Breathe') : 'Ready';
  const canReset = status !== 'idle' || remainingMs < durationSeconds * 1000 - 500;
  const displayCycle = phase === 'long' ? interval : cycle;
  const roundText =
    phase === 'focus'
      ? `Round ${cycle + 1} of ${interval}`
      : phase === 'long'
        ? `${interval} rounds complete`
        : `After round ${cycle}`;

  return (
    <section className="flex w-full flex-col items-center animate-riseIn pb-2">
      <div className="mb-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-4 text-[9.5px] uppercase tracking-[0.32em] text-mist/55">
        <span className="flex items-center gap-2.5">
          <span
            className="h-[5px] w-[5px] rounded-full bg-accent"
            style={{ boxShadow: '0 0 14px 3px rgb(var(--accent) / 0.45)' }}
          />
          <span className="text-cream/85">{accent.label}</span>
        </span>
        <span className="text-mist/25">·</span>
        <span>{roundText}</span>
      </div>

      <Ring progress={progress}>
        <div className="flex flex-col items-center">
          <div className="flex items-start text-cream">
            <span
              className={cx(
                'font-extralight leading-none tracking-[-0.05em] tabular',
                hasHours
                  ? 'text-[clamp(2.35rem,8.2vmin,4.3rem)]'
                  : 'text-[clamp(3.1rem,11.4vmin,5.5rem)]',
              )}
            >
              {formatCountdown(remainingMs, showSeconds)}
            </span>
            {!showSeconds && !hasHours ? (
              <span className="mt-[0.55em] ml-2 text-[0.26em] uppercase tracking-[0.22em] text-mist/60">
                min
              </span>
            ) : null}
          </div>
          <div className="mt-5 flex items-center gap-2.5 text-[9px] uppercase tracking-[0.3em] text-mist/55">
            <span
              className={cx(
                'h-1 w-1 rounded-full bg-accent/70 transition-opacity duration-500',
                isRunning && 'animate-breathe',
              )}
            />
            <span>{stateWord}</span>
          </div>

          <div
            className={cx(
              'mt-4 flex items-center gap-0.5 rounded-full border border-white/[0.07] bg-black/20 px-1 py-0.5 transition-opacity duration-300',
              !canAdjustLength && 'opacity-45',
            )}
            title={
              canAdjustLength
                ? 'Change this session length'
                : 'Reset this session to change its length'
            }
          >
            <button
              type="button"
              aria-label={`Shorten session length (${durationLabel})`}
              disabled={!canAdjustLength || durationSeconds <= LIMITS[phase][0]}
              onClick={() => onAdjustLength(-1)}
              className="grid h-6 w-6 place-items-center rounded-full text-mist/50 transition hover:bg-white/[0.06] hover:text-cream disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Icon name="minus" size={10} />
            </button>
            <span className="min-w-[4rem] px-1 text-center text-[9px] uppercase tracking-[0.2em] text-mist/55 tabular">
              {durationLabel}
            </span>
            <button
              type="button"
              aria-label={`Lengthen session length (${durationLabel})`}
              disabled={!canAdjustLength || durationSeconds >= LIMITS[phase][1]}
              onClick={() => onAdjustLength(1)}
              className="grid h-6 w-6 place-items-center rounded-full text-mist/50 transition hover:bg-white/[0.06] hover:text-cream disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Icon name="plus" size={10} />
            </button>
          </div>
        </div>
      </Ring>

      <div className="mt-8 flex items-center gap-6">
        <Control icon="reset" label="Reset session (R)" onClick={onReset} disabled={!canReset} />
        <button
          type="button"
          onClick={onToggle}
          aria-label={isRunning ? 'Pause session' : status === 'paused' ? 'Resume session' : 'Start session'}
          title={isRunning ? 'Pause · Space' : 'Start · Space'}
          className="group relative grid h-[68px] w-[68px] place-items-center rounded-full bg-cream text-[#0c0d10] transition duration-500 ease-soft hover:scale-[1.035] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          style={{ boxShadow: '0 18px 45px -18px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.7)' }}
        >
          <span
            aria-hidden
            className="absolute -inset-2 rounded-full opacity-50 blur-2xl transition-opacity duration-500 group-hover:opacity-80"
            style={{ background: 'radial-gradient(circle, rgb(var(--accent) / 0.45), transparent 70%)' }}
          />
          <Icon
            name={isRunning ? 'pause' : 'play'}
            size={23}
            className={cx('relative', !isRunning && 'translate-x-[2px]')}
          />
        </button>
        <Control icon="skip" label="Skip to next session (S)" onClick={onSkip} />
      </div>

      <div className="mt-7 flex flex-col items-center gap-2.5">
        <div className="flex items-center gap-1.5" aria-label={`Round ${Math.min(cycle + 1, interval)} of ${interval}`}>
          {Array.from({ length: interval }).map((_, index) => {
            const done = index < displayCycle;
            const current = phase !== 'long' && index === cycle;
            return (
              <span
                key={index}
                className={cx(
                  'h-[5px] rounded-full transition-all duration-700 ease-soft',
                  done
                    ? 'w-5 bg-accent/75'
                    : current
                      ? 'w-5 bg-accent/30'
                      : 'w-[5px] bg-white/15',
                )}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
