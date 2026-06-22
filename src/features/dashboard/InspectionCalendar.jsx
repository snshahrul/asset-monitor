import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function InspectionCalendar({ assets }) {
  const [cd, setCd] = useState(new Date());
  const y = cd.getFullYear(); const m = cd.getMonth();
  const fd = new Date(y, m, 1).getDay();
  const dim = new Date(y, m + 1, 0).getDate();
  const mn = cd.toLocaleString('default', { month: 'long', year: 'numeric' });
  const today = new Date();

  const inspDays = {};
  (assets || []).forEach(a => {
    if (!a.lastInspection) return;
    const d = new Date(a.lastInspection);
    if (d.getMonth() === m && d.getFullYear() === y) {
      const key = d.getDate();
      if (!inspDays[key]) inspDays[key] = [];
      inspDays[key].push(a.status || 'running');
    }
  });

  const statusColor = (status) => {
    if (status === 'critical') return 'bg-red-500';
    if (status === 'warning') return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="card overflow-hidden">
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 px-4 py-2.5 flex items-center justify-between">
        <span className="text-xs font-bold text-white">Calendar</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setCd(new Date(y, m - 1, 1))} className="hover:bg-white/10 rounded p-0.5"><ChevronLeft size={13} className="text-white/80" /></button>
          <span className="text-xs font-semibold text-white w-28 text-center">{mn}</span>
          <button onClick={() => setCd(new Date(y, m + 1, 1))} className="hover:bg-white/10 rounded p-0.5"><ChevronRight size={13} className="text-white/80" /></button>
        </div>
      </div>
      <div className="p-3">
        <div className="grid grid-cols-7 gap-px">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} className="text-center text-2xs text-primary-900 font-bold py-1">{d}</div>
          ))}
          {Array.from({ length: fd }).map((_, i) => <div key={'e'+i} className="h-7 rounded" />)}
          {Array.from({ length: dim }).map((_, i) => {
            const day = i + 1;
            const isT = today.getDate() === day && today.getMonth() === m && today.getFullYear() === y;
            const hasInsp = inspDays[day];
            return (
              <div key={day} className={'h-7 rounded text-2xs flex flex-col items-center justify-center relative ' + (isT ? 'bg-primary-800 text-white font-bold' : 'bg-dark-700/30 text-gray-400')}>
                <span>{day}</span>
                {hasInsp && (
                  <div className="flex gap-0.5 absolute bottom-1">
                    {hasInsp.slice(0, 3).map((s, si) => (
                      <span key={si} className={'w-1 h-1 rounded-full ' + statusColor(s)} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 mt-3 pt-2 border-t border-dark-600 text-2xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Running</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Warning</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical</span>
          <span className="flex items-center gap-1 ml-auto"><span className="w-2 h-2 rounded-full bg-primary-800" /> Today</span>
        </div>
      </div>
    </div>
  );
}
