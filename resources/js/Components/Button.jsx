export default function Button({
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-60 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-gradient-to-r from-cyan-400 to-teal-400 text-black hover:from-cyan-300 hover:to-teal-300 focus:ring-cyan-400/40',
    outline:
      'border border-white/20 bg-transparent text-white hover:border-cyan-400/60 hover:text-cyan-200 focus:ring-cyan-400/30',
    ghost:
      'bg-white/5 text-white hover:bg-white/10 focus:ring-white/20',
    danger:
      'bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-400/40',
    subtle:
      'bg-white/10 text-white hover:bg-white/20 focus:ring-white/20',
  }

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      disabled={disabled}
      {...props}
    />
  )
}
