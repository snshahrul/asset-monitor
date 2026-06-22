import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function InspectionCalendar({ assets }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, quarter, year

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Get all upcoming inspection dates
  const inspectionDates = [];
  assets.forEach(asset => {
    const folder = JSON.parse(localStorage.getItem('asset-monitor-storage'))?.state?.equipmentFolders?.[asset.id];
    const lastInsp = folder?.inspections?.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    if (lastInsp?.nextInspectionDate) {
      inspectionDates.push({
        name: asset.name,
        date: new Date(lastInsp.nextInspectionDate),
        status: asset.status
      });
    }
    // Also check for API 510 calculated next inspection
    if (asset.lastInspection) {
      const lastDate = new Date(asset.lastInspection);
      const nextDate = new Date(lastDate.getTime() + 365 * 24 * 60 * 60 * 1000); // Default 1 year
      const exists = inspectionDates.find(d => d.name === asset.name);
      if (!exists) {
        inspectionDates.push({ name: asset.name, date: nextDate, status: asset.status });
      }
    }
  });

  const getInspectionsForDay = (day) => {
    return inspectionDates.filter(insp => 
      insp.date.getDate() === day && 
      insp.date.getMonth() === month && 
      insp.date.getFullYear() === year
    );
  };

  const isToday = (day) => {
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const isOverdue = (inspDate) => inspDate < today;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-white text-sm">📅 Inspection Due Calendar</h4>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-dark-600 rounded"><ChevronLeft size={16} className="text-gray-400" /></button>
          <span className="text-white font-bold text-sm">{monthName}</span>
          <button onClick={nextMonth} className="p-1 hover:bg-dark-600 rounded"><ChevronRight size={16} className="text-gray-400" /></button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-xs font-bold text-gray-500 py-1">{d}</div>
        ))}
        
        {/* Empty cells before first day */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={'empty-' + i} className="h-16 bg-dark-800/50 rounded" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayInspections = getInspectionsForDay(day);
          const hasInspection = dayInspections.length > 0;
          const hasOverdue = dayInspections.some(insp => isOverdue(insp.date));

          return (
            <div key={day} className={`h-16 rounded p-1 text-xs relative ${isToday(day) ? 'bg-primary-900/30 border border-primary-800' : 'bg-dark-700 hover:bg-dark-600'}`}>
              <span className={`font-bold ${isToday(day) ? 'text-primary-900' : 'text-gray-300'}`}>{day}</span>
              {hasInspection && (
                <div className="mt-1 space-y-0.5">
                  {dayInspections.slice(0, 2).map((insp, j) => (
                    <div key={j} className={`text-xs truncate px-1 py-0.5 rounded ${isOverdue(insp.date) ? 'bg-red-900/50 text-red-300' : 'bg-amber-900/50 text-amber-300'}`} title={insp.name}>
                      {insp.name}
                    </div>
                  ))}
                  {dayInspections.length > 2 && (
                    <div className="text-xs text-gray-500">+{dayInspections.length - 2} more</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-xs text-gray-400">
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-900/50"></span> Due</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-900/50"></span> Overdue</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary-900/30 border border-primary-800"></span> Today</div>
      </div>
    </div>
  );
}