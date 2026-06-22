import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Clock, AlertTriangle } from 'lucide-react';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AnalyticsCharts({ assets }) {
  const running = assets.filter(a => a.status === 'running').length;
  const warning = assets.filter(a => a.status === 'warning').length;
  const critical = assets.filter(a => a.status === 'critical').length;

  const statusData = {
    labels: ['Running', 'Warning', 'Critical'],
    datasets: [{ data: [running, warning, critical], backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'], borderWidth: 0, borderRadius: 4 }]
  };

  const months = [];
  const counts = [];
  const allFolders = JSON.parse(localStorage.getItem('asset-monitor-storage'))?.state?.equipmentFolders || {};
  const allInspections = Object.values(allFolders).flatMap(f => f.inspections || []);
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(d.toLocaleString('default', { month: 'short' }));
    counts.push(allInspections.filter(insp => new Date(insp.date).getMonth() === d.getMonth() && new Date(insp.date).getFullYear() === d.getFullYear()).length);
  }
  const inspectionData = { labels: months, datasets: [{ label: 'Inspections', data: counts, backgroundColor: '#818cf8', borderRadius: 4 }] };

  const today = new Date();
  const upcoming = [];
  assets.forEach(a => {
    const insp = allFolders[a.id]?.inspections?.sort((x, y) => new Date(y.date) - new Date(x.date))[0];
    if (insp?.nextInspectionDate) {
      const next = new Date(insp.nextInspectionDate);
      const daysLeft = Math.ceil((next - today) / (1000 * 60 * 60 * 24));
      if (daysLeft >= 0 && daysLeft <= 90) upcoming.push({ name: a.name, date: next, daysLeft });
    }
  });
  upcoming.sort((a, b) => a.daysLeft - b.daysLeft);

  const criticalAssets = assets.filter(a => a.status === 'critical' || a.status === 'warning').map(a => {
    const rem = a.corrosionRate > 0 ? (a.currentThick - a.minRequired) / a.corrosionRate : 100;
    return { name: a.name, status: a.status, remainingLife: rem, thickness: a.currentThick, tmin: a.minRequired };
  }).sort((a, b) => a.remainingLife - b.remainingLife).slice(0, 5);

  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Asset Status */}
      <div className="card">
        <div className="px-4 py-2.5 border-b border-dark-600">
          <span className="section-header">Asset Status Distribution</span>
        </div>
        <div className="p-4">
          <div style={{ height: 140 }}><Doughnut data={statusData} options={chartOptions} /></div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-dark-700/50 rounded-lg p-2 text-center">
              <div className="text-green-400 font-bold text-lg leading-tight">{running}</div>
              <div className="text-2xs text-gray-500">Running</div>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-2 text-center">
              <div className="text-amber-400 font-bold text-lg leading-tight">{warning}</div>
              <div className="text-2xs text-gray-500">Warning</div>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-2 text-center">
              <div className="text-red-400 font-bold text-lg leading-tight">{critical}</div>
              <div className="text-2xs text-gray-500">Critical</div>
            </div>
          </div>
        </div>
      </div>

      {/* Inspections Chart */}
      <div className="card">
        <div className="px-4 py-2.5 border-b border-dark-600">
          <span className="section-header">Inspections (12 Months)</span>
        </div>
        <div className="p-4">
          <div style={{ height: 140 }}>
            <Bar data={inspectionData} options={{ ...chartOptions, scales: { y: { beginAtZero: true, ticks: { color: '#6b7280', stepSize: 1, font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } }, x: { ticks: { color: '#6b7280', font: { size: 9 } }, grid: { display: false } } } }} />
          </div>
        </div>
      </div>

      {/* Upcoming Inspections */}
      <div className="card">
        <div className="px-4 py-2.5 border-b border-dark-600">
          <span className="section-header"><Clock size={14} className="text-primary-900" /> Upcoming (90 Days)</span>
        </div>
        <div className="p-3">
          {upcoming.length === 0 ? (
            <p className="text-gray-500 text-xs py-4 text-center">No inspections due in next 90 days</p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {upcoming.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-dark-700/50 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs">{item.daysLeft <= 7 ? '🔴' : item.daysLeft <= 30 ? '🟡' : '🟢'}</span>
                    <div>
                      <div className="text-xs font-semibold text-gray-200 font-mono">{item.name}</div>
                      <div className="text-2xs text-gray-500">{item.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                  </div>
                  <span className={'text-2xs font-bold px-2 py-0.5 rounded-full ' + (item.daysLeft <= 7 ? 'bg-red-900/60 text-red-300' : item.daysLeft <= 30 ? 'bg-amber-900/60 text-amber-300' : 'bg-emerald-900/60 text-emerald-300')}>{item.daysLeft}d</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Critical Assets */}
      <div className="card">
        <div className="px-4 py-2.5 border-b border-dark-600">
          <span className="section-header"><AlertTriangle size={14} className="text-red-400" /> At-Risk Assets</span>
        </div>
        <div className="p-3">
          {criticalAssets.length === 0 ? (
            <p className="text-gray-500 text-xs py-4 text-center">No critical or warning assets</p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {criticalAssets.map((a, i) => (
                <div key={i} className="bg-dark-700/50 rounded-lg px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-gray-200 font-mono">{a.name}</span>
                    <span className={'text-2xs font-bold px-1.5 py-0.5 rounded-full ' + (a.status === 'critical' ? 'bg-red-900/60 text-red-300' : 'bg-amber-900/60 text-amber-300')}>{a.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                    <div className="bg-dark-600/50 rounded px-2 py-1 text-center">
                      <div className="text-2xs text-gray-500">Life</div>
                      <div className="text-xs font-bold text-red-400">{a.remainingLife.toFixed(1)}yr</div>
                    </div>
                    <div className="bg-dark-600/50 rounded px-2 py-1 text-center">
                      <div className="text-2xs text-gray-500">Thick</div>
                      <div className="text-xs font-bold text-gray-200">{a.thickness?.toFixed(2)}mm</div>
                    </div>
                    <div className="bg-dark-600/50 rounded px-2 py-1 text-center">
                      <div className="text-2xs text-gray-500">T-Min</div>
                      <div className="text-xs font-bold text-amber-400">{a.tmin}mm</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
