import { Icon } from './ui';

export interface ToastData {
  id: number;
  title: string;
  note?: string;
}

export function Toast({ toast }: { toast: ToastData | null }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-[74px] z-[60] flex justify-center px-4"
      role="status"
      aria-live="polite"
    >
      {toast ? (
        <div
          key={toast.id}
          className="flex max-w-full animate-riseIn items-center gap-3 rounded-full border border-white/[0.09] bg-[#0b0c11]/80 py-2.5 pl-2.5 pr-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
        >
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
            <Icon name="check" size={12} />
          </span>
          <span className="min-w-0">
            <span className="block text-[13.5px] font-extralight leading-snug tracking-[-0.01em] text-cream/95">
              {toast.title}
            </span>
            {toast.note ? (
              <span className="mt-1 block truncate text-[9px] uppercase tracking-[0.16em] text-mist/45">
                {toast.note}
              </span>
            ) : null}
          </span>
        </div>
      ) : null}
    </div>
  );
}
