import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sz = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center pt-10 px-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={'bg-dark-800 border border-dark-600 rounded-xl shadow-2xl w-full ' + sz[size]} style={{ animation: 'slideUp 0.3s ease-out' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-600">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-dark-700 rounded-full text-gray-400"><X size={20} /></button>
        </div>
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto text-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
}
