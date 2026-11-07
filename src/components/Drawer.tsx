import { useEffect, useRef, type ReactNode } from 'react';
import type { TabId } from '../types';
import { IconButton, cx } from './ui';

export const DRAWER_TABS: { id: TabId; label: string }[] = [
  { id: 'scenes', label: 'Scenes' },
  { id: 'stats', label: 'Stats' },
  { id: 'settings', label: 'Settings' },
];

export function Drawer({
  open,
  tab,
  onTab,
  onClose,
  children,
}: {
  open: boolean;
  tab: TabId;
  onTab: (tab: TabId) => void;
  onClose: () => void;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLElement>(null);

  // Keep the off-screen panel out of the tab order while it is closed.
  useEffect(() => {
    if (panelRef.current) panelRef.current.inert = !open;
  }, [open]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cx(
          'fixed inset-0 z-30 bg-black/45 backdrop-blur-[2px] transition-opacity duration-500',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Focus controls"
        aria-hidden={!open}
        className={cx(
          'fixed right-0 top-0 z-40 flex h-full w-full max-w-[432px] flex-col border-l border-white/[0.07] bg-[#090a0d]/85 shadow-[-30px_0_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-transform duration-[520ms] ease-soft',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-6 pt-5">
          <div className="font-serif text-[20px] leading-none text-cream/85">
            focus<span className="text-accent">.</span>
          </div>
          <IconButton icon="close" label="Close panel (Esc)" onClick={onClose} size={34} iconSize={14} />
        </div>

        <div
          role="tablist"
          aria-label="Focus panels"
          className="no-scrollbar mt-6 flex gap-1 overflow-x-auto border-b border-white/[0.06] px-5"
        >
          {DRAWER_TABS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onTab(item.id)}
                className={cx(
                  'relative shrink-0 px-3 pb-3 pt-1 text-[11.5px] tracking-[0.03em] transition-colors duration-300',
                  active ? 'text-cream' : 'text-mist/50 hover:text-cream/75',
                )}
              >
                {item.label}
                <span
                  className={cx(
                    'absolute inset-x-2 -bottom-px h-px bg-accent transition-opacity duration-300',
                    active ? 'opacity-80' : 'opacity-0',
                  )}
                />
              </button>
            );
          })}
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-6 pb-12 pt-7">
          {children}
        </div>
      </aside>
    </>
  );
}
