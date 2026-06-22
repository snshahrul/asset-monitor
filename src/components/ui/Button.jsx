export default function Button({ children, variant = 'primary', size = 'sm', icon: Icon, loading, disabled, onClick, className = '' }) {
  const v = {
    primary: 'bg-primary-800 text-white hover:bg-primary-700',
    success: 'bg-emerald-600 text-white hover:bg-emerald-500',
    danger: 'bg-red-600 text-white hover:bg-red-500',
    accent: 'bg-amber-500 text-black hover:bg-amber-400',
    outline: 'bg-transparent text-gray-400 border border-dark-500 hover:bg-dark-700 hover:text-gray-200'
  };
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
  };
  return <button disabled={disabled || loading} onClick={onClick} className={'inline-flex items-center gap-1.5 font-semibold rounded-lg transition-all ' + (v[variant] || v.primary) + ' ' + (sizes[size] || sizes.sm) + ' ' + (disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer') + ' ' + className}>{Icon && <Icon size={14} />}{children}</button>;
}
