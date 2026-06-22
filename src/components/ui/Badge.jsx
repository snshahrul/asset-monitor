export default function Badge({ children, variant = 'neutral', size = 'sm' }) {
  const v = {
    success: 'bg-emerald-900/60 text-emerald-300',
    warning: 'bg-amber-900/60 text-amber-300',
    danger: 'bg-red-900/60 text-red-300',
    critical: 'bg-red-800/80 text-red-200',
    info: 'bg-blue-900/60 text-blue-300',
    neutral: 'bg-dark-600/60 text-gray-400',
    primary: 'bg-primary-900/20 text-primary-900'
  };
  const sizes = {
    xs: 'px-1.5 py-0.5 text-2xs',
    sm: 'px-2 py-0.5 text-xs',
  };
  return <span className={'inline-flex font-semibold rounded-full leading-none ' + (v[variant] || v.neutral) + ' ' + (sizes[size] || sizes.sm)}>{children}</span>;
}
