import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function InspectionCalendar({ assets }) {
  const [cd, setCd] = useState(new Date());
  const y = cd.getFullYear(); const m = cd.getMonth();
  const fd = new Date(y, m, 1).getDay();
  const dim = new Date(y, m + 1, 0).getDate();
  const mn = cd.toLocaleString('default', { month: 'long', year: 'numeric' });
  const today = new Date();

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-white text-sm">📅 Calendar</h4>
        <div className="flex gap-1">
          <button onClick={() => setCd(new Date(y, m - 1, 1))} className="p-1 hover:bg-dark-600 rounded"><ChevronLeft size={14} className="text-gray-400" /></button>
          <span className="text-white text-xs font-bold px-2">{mn}</span>
          <button onClick={() => setCd(new Date(y, m + 1, 1))} className="p-1 hover:bg-dark-600 rounded"><ChevronRight size={14} className="text-gray-400" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="text-center text-xs text-gray-500 py-1">{d}</div>)}
        {Array.from({ length: fd }).map((_, i) => <div key={'e'+i} className="h-8 bg-dark-800/50 rounded" />)}
        {Array.from({ length: dim }).map((_, i) => {
          const day = i + 1;
          const isT = today.getDate() === day && today.getMonth() === m && today.getFullYear() === y;
          return <div key={day} className={'h-8 rounded text-xs flex items-center justify-center ' + (isT ? 'bg-primary-900/30 border border-primary-800 text-white font-bold' : 'bg-dark-700 text-gray-400')}>{day}</div>;
        })}
      </div>
    </div>
  );
}
