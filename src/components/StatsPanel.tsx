import { useMemo } from 'react';
import { computeStats, recentSessions } from '../lib/stats';
import { formatClockTime, formatDayLabel, humanMinutes, plural } from '../lib/time';
import type { SessionRecord } from '../types';
import { SectionLabel, cx } from './ui';

export function StatsPanel({
  sessions,
  clock24h,
  onClear,
}: {
  sessions: SessionRecord[];
  clock24h: boolean;
  onClear: () => void;
}) {
  const stats = useMemo(() => computeStats(sessions), [sessions]);
  const recent = useMemo(() => recentSessions(sessions, 6), [sessions]);
  const maxMinutes = Math.max(60, ...stats.days.map((day) => day.minutes));

  const tiles = [
    { label: 'Total focus', value: humanMinutes(stats.totalMinutes) },
    { label: 'Sessions', value: String(stats.totalSessions) },
    { label: 'Today', value: humanMinutes(stats.todayMinutes) },
  ];

  return (
    <div className="space-y-9">
      <section className="animate-fadeIn">
        <div className="grid grid-cols-3 divide-x divide-white/[0.07] border-y border-white/[0.07] py-5">
          {tiles.map((tile) => (
            <div key={tile.label} className="px-2 text-center first:pl-0 last:pr-0">
              <div className="text-[19px] font-light leading-none tabular text-cream/90">
                {tile.value}
              </div>
              <div className="mt-2 text-[8px] uppercase tracking-[0.18em] text-mist/40">
                {tile.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 pt-6">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[30px] font-light leading-none tabular text-cream/90">
                {stats.streak}
              </span>
              <span className="text-[11px] text-mist/50">{plural(stats.streak, 'day')}</span>
            </div>
            <div className="mt-2 text-[8px] uppercase tracking-[0.2em] text-mist/40">
              Current streak
            </div>
          </div>
          <div className="flex items-center gap-2 pb-1">
            {stats.days.map((day) => (
              <span
                key={day.key}
                title={`${day.label} · ${humanMinutes(day.minutes)}`}
                className={cx(
                  'h-1.5 w-1.5 rounded-full transition-colors duration-500',
                  day.minutes > 0 ? 'bg-accent/80' : 'bg-white/[0.12]',
                  day.isToday && 'ring-1 ring-accent/30 ring-offset-2 ring-offset-[#0b0c10]',
                )}
              />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <SectionLabel className="mb-0">Last 7 days</SectionLabel>
          <span className="text-[9.5px] tabular tracking-[0.05em] text-mist/40">
            {humanMinutes(stats.weekMinutes)} · {stats.weekSessions}{' '}
            {plural(stats.weekSessions, 'session')}
          </span>
        </div>
        <div className="flex h-[124px] items-end gap-2">
          {stats.days.map((day) => {
            const height = day.minutes > 0 ? Math.max(4, (day.minutes / maxMinutes) * 100) : 2;
            return (
              <div key={day.key} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div className="relative flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-[3px] transition-all duration-700 ease-soft"
                    style={{
                      height: `${height}%`,
                      background:
                        day.minutes > 0
                          ? day.isToday
                            ? 'linear-gradient(to top, rgb(var(--accent) / 0.32), rgb(var(--accent) / 0.95))'
                            : 'linear-gradient(to top, rgb(var(--accent) / 0.12), rgb(var(--accent) / 0.55))'
                          : 'rgba(255,255,255,0.07)',
                    }}
                    title={`${day.label} · ${humanMinutes(day.minutes)}`}
                  />
                </div>
                <span
                  className={cx(
                    'text-[8.5px] uppercase tracking-[0.1em]',
                    day.isToday ? 'text-accent/90' : 'text-mist/35',
                  )}
                >
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <SectionLabel>Recent sessions</SectionLabel>
        {recent.length === 0 ? (
          <p className="text-[11.5px] leading-relaxed text-mist/40">
            Nothing yet. Finish a focus round and it will appear here.
          </p>
        ) : (
          <div>
            {recent.map(({ record }) => (
              <div
                key={record.id}
                className="flex items-center justify-between gap-3 border-b border-white/[0.045] py-2.5 last:border-0"
              >
                <span className="text-[11.5px] text-mist/55">
                  {formatDayLabel(record.endedAt)}
                  <span className="mx-1.5 text-mist/25">·</span>
                  {formatClockTime(record.endedAt, clock24h)}
                </span>
                <span className="text-[11.5px] tabular text-cream/70">{record.minutes} min</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex items-center justify-between gap-4 border-t border-white/[0.05] pt-4">
        <p className="text-[10px] leading-relaxed text-mist/30">
          Calculated and stored only in this browser.
        </p>
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 text-[9.5px] uppercase tracking-[0.16em] text-mist/30 transition hover:text-mist/70"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
