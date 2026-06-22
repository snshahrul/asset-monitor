export default function Badge({ children, variant = 'neutral' }) {
  const v = {
    success: 'bg-emerald-900 text-emerald-300',
    warning: 'bg-amber-900 text-amber-300',
    danger: 'bg-red-900 text-red-300',
    critical: 'bg-red-700 text-white',
    info: 'bg-blue-900 text-blue-300',
    neutral: 'bg-dark-700 text-gray-300'
  };
  return <span className={'inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ' + (v[variant] || v.neutral)}>{children}</span>;
}
