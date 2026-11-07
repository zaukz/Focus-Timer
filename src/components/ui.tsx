import type { CSSProperties, ReactNode } from 'react';

export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

export type IconName =
  | 'play'
  | 'pause'
  | 'reset'
  | 'skip'
  | 'close'
  | 'scenes'
  | 'stats'
  | 'settings'
  | 'check'
  | 'chevron'
  | 'bell'
  | 'minus'
  | 'plus'
  | 'arrow';

const ICONS: Record<IconName, ReactNode> = {
  play: (
    <path
      d="M8.6 5.7 18.4 12 8.6 18.3z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  ),
  pause: (
    <>
      <rect x="8" y="5.6" width="3" height="12.8" rx="1.1" fill="currentColor" stroke="none" />
      <rect x="13" y="5.6" width="3" height="12.8" rx="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  reset: (
    <>
      <path d="M4.6 12a7.4 7.4 0 1 0 2.3-5.4" />
      <path d="M4.3 4.8v4.4h4.4" />
    </>
  ),
  skip: (
    <>
      <path d="M6.2 6.4 13.8 12l-7.6 5.6z" fill="currentColor" stroke="none" />
      <path d="M17.4 6.2v11.6" />
    </>
  ),
  close: <path d="m6.4 6.4 11.2 11.2M17.6 6.4 6.4 17.6" />,
  scenes: (
    <>
      <rect x="3.2" y="4.6" width="17.6" height="14.8" rx="2.6" />
      <circle cx="8.6" cy="9.4" r="1.5" />
      <path d="m4 17.2 4.6-4.3 3.3 3 3.1-2.6 4.8 4.1" />
    </>
  ),
  stats: (
    <>
      <path d="M6 19.2v-6.4" />
      <path d="M12 19.2V5.8" />
      <path d="M18 19.2v-9.4" />
    </>
  ),
  settings: (
    <>
      <path d="M4 7.4h9M17.2 7.4h2.8M4 16.6h4M12 16.6h8" />
      <circle cx="15.1" cy="7.4" r="2.1" />
      <circle cx="9.7" cy="16.6" r="2.1" />
    </>
  ),
  check: <path d="m5 12.6 4.4 4.4L19 7.2" />,
  chevron: <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />,
  bell: (
    <>
      <path d="M6.8 9.8a5.2 5.2 0 0 1 10.4 0c0 4 1.3 5.2 1.3 5.2H5.5s1.3-1.2 1.3-5.2Z" />
      <path d="M10.2 18a2 2 0 0 0 3.6 0" />
    </>
  ),
  minus: <path d="M6 12h12" />,
  plus: <path d="M12 6v12M6 12h12" />,
  arrow: <path d="M5 12h13M13.2 6.4 18.8 12l-5.6 5.6" />,
};

export function Icon({
  name,
  size = 18,
  className,
  strokeWidth = 1.6,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name]}
    </svg>
  );
}

export function IconButton({
  icon,
  label,
  onClick,
  active = false,
  disabled = false,
  size = 42,
  iconSize,
  className,
}: {
  icon: IconName;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  size?: number;
  iconSize?: number;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      style={{ width: size, height: size }}
      className={cx(
        'grid shrink-0 place-items-center rounded-full border text-mist transition duration-300 ease-soft',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/60',
        'disabled:cursor-not-allowed disabled:opacity-25',
        active
          ? 'border-accent/35 bg-accent/12 text-cream'
          : 'border-white/[0.08] bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.07] hover:text-cream',
        className,
      )}
    >
      <Icon name={icon} size={iconSize ?? Math.round(size * 0.42)} />
    </button>
  );
}

export function NavButton({
  icon,
  label,
  onClick,
  active,
}: {
  icon: IconName;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cx(
        'group flex items-center gap-2 rounded-full px-2.5 py-2 text-[12px] tracking-[0.02em] transition duration-300 ease-soft sm:px-3',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/50',
        active ? 'text-cream' : 'text-mist/70 hover:text-cream',
      )}
    >
      <Icon name={icon} size={16} className="opacity-80 transition group-hover:opacity-100" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(
        'relative h-[22px] w-[38px] shrink-0 rounded-full border transition-colors duration-300 ease-soft',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/60',
        'disabled:cursor-not-allowed disabled:opacity-40',
        checked ? 'border-accent/40 bg-accent/70' : 'border-white/10 bg-white/[0.07]',
      )}
    >
      <span
        className={cx(
          'absolute top-[3px] h-[14px] w-[14px] rounded-full transition-transform duration-300 ease-soft',
          checked ? 'translate-x-[19px] bg-[#14100c]' : 'translate-x-[3px] bg-cream/75',
        )}
      />
    </button>
  );
}

export function Range({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
  ariaLabel,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
  ariaLabel?: string;
}) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <label className="block select-none">
      <span className="mb-2.5 flex items-baseline justify-between text-[10px] uppercase tracking-[0.2em] text-mist/70">
        <span>{label}</span>
        <span className="tabular text-[11px] tracking-[0.08em] text-mist/50">{display}</span>
      </span>
      <input
        type="range"
        className="focus-range"
        style={{ '--fill': `${fill}%` } as CSSProperties}
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={ariaLabel ?? label}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  const set = (next: number) => onChange(Math.min(max, Math.max(min, next)));
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3.5 py-2.5">
      <div className="min-w-0">
        <div className="truncate text-[12.5px] text-cream/80">{label}</div>
        <div className="text-[10px] uppercase tracking-[0.16em] text-mist/40">{unit}</div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => set(value - step)}
          className="grid h-6 w-6 place-items-center rounded-md text-mist/60 transition hover:bg-white/[0.07] hover:text-cream"
        >
          <Icon name="minus" size={12} />
        </button>
        <span className="w-7 text-center text-[14px] tabular text-cream/90">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => set(value + step)}
          className="grid h-6 w-6 place-items-center rounded-md text-mist/60 transition hover:bg-white/[0.07] hover:text-cream"
        >
          <Icon name="plus" size={12} />
        </button>
      </div>
    </div>
  );
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        'mb-3 text-[9.5px] font-medium uppercase tracking-[0.28em] text-mist/45',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Divider() {
  return <div className="h-px w-full bg-white/[0.055]" />;
}

export function SettingRow({
  label,
  description,
  children,
  disabled,
}: {
  label: string;
  description?: string;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className={cx('flex items-center justify-between gap-5 py-3.5', disabled && 'opacity-45')}>
      <div className="min-w-0">
        <div className="text-[13px] text-cream/85">{label}</div>
        {description ? (
          <div className="mt-1 text-[11px] leading-relaxed text-mist/50">{description}</div>
        ) : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
