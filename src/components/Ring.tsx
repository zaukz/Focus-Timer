import { useId, type ReactNode } from 'react';

const SIZE = 440;
const CENTER = SIZE / 2;
const RADIUS = 190;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function Ring({ progress, children }: { progress: number; children: ReactNode }) {
  const uid = useId().replace(/:/g, '');
  const clamped = Math.min(1, Math.max(0, progress));
  const offset = CIRCUMFERENCE * (1 - clamped);
  const angle = clamped * 360;

  return (
    <div
      className="relative aspect-square shrink-0"
      style={{ width: 'min(76vmin, 420px, max(240px, calc(100dvh - 364px)))' }}
    >
      <div
        aria-hidden
        className="absolute inset-[14%] rounded-full opacity-70 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgb(var(--accent) / 0.13), transparent 68%)',
        }}
      />
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="relative h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={`ring-${uid}`} x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgb(var(--accent))" />
            <stop offset="55%" stopColor="rgb(var(--accent))" />
            <stop offset="100%" stopColor="rgb(var(--accent-deep))" />
          </linearGradient>
          <radialGradient id={`halo-${uid}`}>
            <stop offset="0%" stopColor="rgb(var(--accent) / 0.9)" />
            <stop offset="100%" stopColor="rgb(var(--accent) / 0)" />
          </radialGradient>
        </defs>

        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS + 16}
          fill="none"
          stroke="rgba(255,255,255,0.035)"
          strokeWidth="1"
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.075)"
          strokeWidth="2.5"
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={`url(#ring-${uid})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
          style={{
            transition: 'stroke-dashoffset 220ms linear',
            filter: 'drop-shadow(0 0 7px rgb(var(--accent) / 0.35))',
          }}
        />
        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: `${CENTER}px ${CENTER}px`,
            transition: 'transform 220ms linear',
          }}
        >
          <circle cx={CENTER} cy={CENTER - RADIUS} r="11" fill={`url(#halo-${uid})`} opacity="0.8" />
          <circle cx={CENTER} cy={CENTER - RADIUS} r="3" fill="rgb(var(--cream))" />
        </g>

        {Array.from({ length: 60 }).map((_, index) => {
          const long = index % 5 === 0;
          return (
            <line
              key={index}
              x1={CENTER}
              y1={CENTER - RADIUS - 28}
              x2={CENTER}
              y2={CENTER - RADIUS - (long ? 36 : 32)}
              stroke="rgba(255,255,255,0.13)"
              strokeWidth="1"
              transform={`rotate(${index * 6} ${CENTER} ${CENTER})`}
              opacity={long ? 1 : 0.5}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center px-[18%]">{children}</div>
    </div>
  );
}
