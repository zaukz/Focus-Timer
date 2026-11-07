import { Icon, cx } from './ui';

export interface DialogData {
  title: string;
  description: string;
  confirmLabel: string;
  tone?: 'danger';
  action: () => void;
}

export function ConfirmDialog({
  dialog,
  onCancel,
  onConfirm,
}: {
  dialog: DialogData | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!dialog) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-6">
      <div
        className="absolute inset-0 animate-fadeIn bg-black/55 backdrop-blur-md"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        className="relative w-full max-w-[352px] animate-riseIn rounded-2xl border border-white/[0.09] bg-[#0b0c10]/92 p-6 shadow-[0_30px_100px_-30px_rgba(0,0,0,1)] backdrop-blur-2xl"
      >
        <div className="mb-4 flex items-start gap-3">
          <span
            className={cx(
              'mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full',
              dialog.tone === 'danger' ? 'bg-[#c7745c]/15 text-[#e2967d]' : 'bg-accent/12 text-accent',
            )}
          >
            <Icon name={dialog.tone === 'danger' ? 'reset' : 'bell'} size={13} />
          </span>
          <div>
            <h2 id="dialog-title" className="text-[14px] text-cream/90">
              {dialog.title}
            </h2>
            <p id="dialog-description" className="mt-2 text-[11.5px] leading-relaxed text-mist/55">
              {dialog.description}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="rounded-full px-4 py-2 text-[11.5px] text-mist/70 transition hover:bg-white/[0.05] hover:text-cream focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cx(
              'rounded-full px-4 py-2 text-[11.5px] font-medium transition focus-visible:outline-none focus-visible:ring-1',
              dialog.tone === 'danger'
                ? 'bg-[#e08a70] text-[#1a0d08] hover:bg-[#eaa088] focus-visible:ring-[#e08a70]/60'
                : 'bg-cream text-[#0b0c0f] hover:bg-white focus-visible:ring-white/50',
            )}
          >
            {dialog.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
