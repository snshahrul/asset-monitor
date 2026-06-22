export default function Button({ children, variant = 'primary', size = 'sm', icon: Icon, loading, disabled, onClick, className = '' }) {
  const v = {
    primary: 'bg-primary-800 text-white hover:bg-primary-700',
    success: 'bg-emerald-600 text-white hover:bg-emerald-500',
    danger: 'bg-red-600 text-white hover:bg-red-500',
    accent: 'bg-amber-500 text-black hover:bg-amber-400',
    outline: 'bg-transparent text-gray-300 border border-gray-500 hover:bg-dark-700'
  };
  return <button disabled={disabled || loading} onClick={onClick} className={'inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ' + (v[variant] || v.primary) + ' ' + (disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer') + ' ' + className}>{Icon && <Icon size={16} />}{children}</button>;
}
