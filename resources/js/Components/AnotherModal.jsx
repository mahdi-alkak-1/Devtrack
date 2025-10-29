// resources/js/Components/Modal.jsx
import { useEffect } from 'react'

export default function AnotherModal({ open, onClose, title, children, footer }) {
  // Close on ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && open) onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-[61] w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-sm text-white/80 hover:bg-white/10"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">{children}</div>

        {/* Footer (optional) */}
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-white/10 px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
