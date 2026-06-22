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
    <div className="card">
      <div className="px-4 py-2.5 border-b border-dark-600 flex items-center justify-between">
        <span className="section-header">Calendar</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setCd(new Date(y, m - 1, 1))} className="btn-icon"><ChevronLeft size={13} className="text-gray-500" /></button>
          <span className="text-xs font-semibold text-gray-300 w-28 text-center">{mn}</span>
          <button onClick={() => setCd(new Date(y, m + 1, 1))} className="btn-icon"><ChevronRight size={13} className="text-gray-500" /></button>
        </div>
      </div>
      <div className="p-3">
        <div className="grid grid-cols-7 gap-px">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} className="text-center text-2xs text-gray-600 py-1 font-semibold">{d}</div>
          ))}
          {Array.from({ length: fd }).map((_, i) => <div key={'e'+i} className="h-7 rounded" />)}
          {Array.from({ length: dim }).map((_, i) => {
            const day = i + 1;
            const isT = today.getDate() === day && today.getMonth() === m && today.getFullYear() === y;
            return (
              <div key={day} className={'h-7 rounded text-2xs flex items-center justify-center ' + (isT ? 'bg-primary-800 text-white font-bold' : 'bg-dark-700/50 text-gray-400')}>
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
