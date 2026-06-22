import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { AlertTriangle, Clock } from 'lucide-react';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AnalyticsCharts({ assets }) {
  const running = assets.filter(a => a.status === 'running').length;
  const warning = assets.filter(a => a.status === 'warning').length;
  const critical = assets.filter(a => a.status === 'critical').length;

  const statusData = {
    labels: ['Running', 'Warning', 'Critical'],
    datasets: [{ data: [running, warning, critical], backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'], borderWidth: 2 }]
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
  const inspectionData = { labels: months, datasets: [{ label: 'Inspections', data: counts, backgroundColor: '#818cf8', borderRadius: 6 }] };

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

  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#d1d5db', usePointStyle: true, boxWidth: 10, padding: 15, font: { size: 11 } } } } };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <h4 className="font-bold text-white text-sm mb-3">📊 Asset Status Distribution</h4>
          <div style={{ height: '200px' }}><Doughnut data={statusData} options={chartOptions} /></div>
          <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
            <div className="bg-dark-700 rounded p-2"><div className="text-green-400 font-bold text-lg">{running}</div><div className="text-gray-400">Running</div></div>
            <div className="bg-dark-700 rounded p-2"><div className="text-amber-400 font-bold text-lg">{warning}</div><div className="text-gray-400">Warning</div></div>
            <div className="bg-dark-700 rounded p-2"><div className="text-red-400 font-bold text-lg">{critical}</div><div className="text-gray-400">Critical</div></div>
          </div>
        </div>
        <div className="card p-4">
          <h4 className="font-bold text-white text-sm mb-3">📈 Inspections (12 Months)</h4>
          <div style={{ height: '200px' }}>
            <Bar data={inspectionData} options={{ ...chartOptions, scales: { y: { beginAtZero: true, ticks: { color: '#9ca3af', stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { ticks: { color: '#9ca3af' }, grid: { display: false } } } }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2"><Clock size={16} className="text-primary-900" /> Upcoming Inspections (90 Days)</h4>
          {upcoming.length === 0 ? <p className="text-gray-500 text-sm py-6 text-center">No inspections due in next 90 days</p> : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {upcoming.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-dark-700 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.daysLeft <= 7 ? '🔴' : item.daysLeft <= 30 ? '🟡' : '🟢'}</span>
                    <div>
                      <div className="text-white font-bold font-mono text-sm">{item.name}</div>
                      <div className="text-xs text-gray-400">{item.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                  </div>
                  <span className={'text-sm font-bold px-3 py-1 rounded-full ' + (item.daysLeft <= 7 ? 'bg-red-900 text-red-300' : item.daysLeft <= 30 ? 'bg-amber-900 text-amber-300' : 'bg-green-900 text-green-300')}>{item.daysLeft}d</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-4">
          <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2"><AlertTriangle size={16} className="text-red-400" /> Top 5 Critical Assets</h4>
          {criticalAssets.length === 0 ? <p className="text-gray-500 text-sm py-6 text-center">No critical or warning assets</p> : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {criticalAssets.map((a, i) => (
                <div key={i} className="bg-dark-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold font-mono text-sm">{a.name}</span>
                    <span className={'text-xs font-bold px-2 py-0.5 rounded-full ' + (a.status === 'critical' ? 'bg-red-900 text-red-300' : 'bg-amber-900 text-amber-300')}>{a.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-center text-xs">
                    <div className="bg-dark-600 rounded p-1"><div className="text-gray-400">Rem. Life</div><div className="text-red-400 font-bold">{a.remainingLife.toFixed(1)}yr</div></div>
                    <div className="bg-dark-600 rounded p-1"><div className="text-gray-400">Thickness</div><div className="text-white font-bold">{a.thickness?.toFixed(2)}mm</div></div>
                    <div className="bg-dark-600 rounded p-1"><div className="text-gray-400">T-Min</div><div className="text-amber-400 font-bold">{a.tmin}mm</div></div>
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