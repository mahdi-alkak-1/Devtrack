export default function Badge({ tone = 'gray', children, className = '' }) {
  const tones = {
    gray:   'bg-gray-100 text-gray-800',
    blue:   'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green:  'bg-green-100 text-green-800',
    violet: 'bg-violet-100 text-violet-800',
    rose:   'bg-rose-100 text-rose-800',
    amber:  'bg-amber-100 text-amber-800',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
