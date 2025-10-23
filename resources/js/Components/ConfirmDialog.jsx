import { useEffect } from 'react'

export default function ConfirmDialog({
  open = false,
  onClose = () => {},
  title = 'Are you sure?',
  message = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'primary'
  onConfirm = () => {},
  busy = false,
}) {
  // Esc to close
  useEffect(() => {
    if (!open) return
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={() => !busy && onClose()}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 grid place-items-center px-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0f1731] shadow-[0_10px_40px_rgba(0,0,0,.5)]">
          {/* Accent bar */}
          <div className={`h-1 w-full ${variant === 'danger' ? 'bg-gradient-to-r from-rose-500 to-orange-400' : 'bg-gradient-to-r from-cyan-400 to-teal-400'}`} />
          <div className="p-5">
            <h3 className="text-base font-semibold text-white">{title}</h3>
            {message ? (
              <p className="mt-2 text-sm text-white/70">{message}</p>
            ) : null}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85 hover:bg-white/10 disabled:opacity-60"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={busy}
                className={`rounded-md px-3 py-2 text-sm font-semibold text-black disabled:opacity-60 ${
                  variant === 'danger'
                    ? 'bg-gradient-to-r from-rose-400 to-orange-300 hover:from-rose-300 hover:to-orange-200'
                    : 'bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300'
                }`}
              >
                {busy ? 'Working…' : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
