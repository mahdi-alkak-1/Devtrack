// resources/js/Components/HoverCard.jsx
import { useRef, useState } from 'react'

export default function HoverCard({ trigger, children }) {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      ref={ref}
    >
      {trigger}

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-xl border border-white/10 bg-[#0f1731] p-3 text-sm shadow-xl">
          {children}
        </div>
      )}
    </div>
  )
}
