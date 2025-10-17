export default function Button({ variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-50',
    outline:
      'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus:ring-indigo-500',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 focus:ring-offset-rose-50',
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
