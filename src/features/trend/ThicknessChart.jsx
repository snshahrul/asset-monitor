import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function ThicknessChart({ asset, thicknessHistory = [] }) {
  if (!asset) return null;

  const labels = thicknessHistory.map(h => h.date);
  const today = new Date().toISOString().split('T')[0];
  
  const folder = JSON.parse(localStorage.getItem('asset-monitor-storage'))?.state?.equipmentFolders?.[asset.id];
  const inspections = folder?.inspections || [];
  const shellData = [], dishEndAData = [], dishEndBData = [], avgData = [];

  labels.forEach((date, i) => {
    const insp = inspections.find(inv => inv.date === date);
    if (insp?.gridData?.rows) {
      const shellRows = insp.gridData.rows.filter(r => r.location?.toLowerCase().includes('shell') && !r.location?.toLowerCase().includes('dish') && !r.location?.toLowerCase().includes('head') && !r.location?.toLowerCase().includes('channel'));
      const deARows = insp.gridData.rows.filter(r => r.location?.toLowerCase().includes('dish end a') || r.location?.toLowerCase().includes('de-a') || r.location?.toLowerCase().includes('head a'));
      const deBRows = insp.gridData.rows.filter(r => r.location?.toLowerCase().includes('dish end b') || r.location?.toLowerCase().includes('de-b') || r.location?.toLowerCase().includes('head b'));
      shellData.push(shellRows.length ? shellRows.reduce((s, r) => s + r.measured, 0) / shellRows.length : null);
      dishEndAData.push(deARows.length ? deARows.reduce((s, r) => s + r.measured, 0) / deARows.length : null);
      dishEndBData.push(deBRows.length ? deBRows.reduce((s, r) => s + r.measured, 0) / deBRows.length : null);
      avgData.push(thicknessHistory[i]?.thickness || null);
    } else {
      const t = thicknessHistory[i]?.thickness || null;
      shellData.push(t); dishEndAData.push(null); dishEndBData.push(null); avgData.push(t);
    }
  });

  labels.push(today);
  avgData.push(parseFloat(asset.currentThick?.toFixed(2)) || asset.nominal);
  shellData.push(null); dishEndAData.push(null); dishEndBData.push(null);

  const datasets = [
    { label: 'Nominal ('+asset.nominal+' mm)', data: Array(labels.length).fill(asset.nominal), borderColor: '#10b981', borderDash: [6,4], fill: false, pointRadius: 0, borderWidth: 2 },
    { label: 'T-Min ('+asset.minRequired+' mm)', data: Array(labels.length).fill(asset.minRequired), borderColor: '#ef4444', borderDash: [8,4], fill: false, pointRadius: 0, borderWidth: 2.5 }
  ];

  if (avgData.some(v => v !== null)) datasets.push({ label: 'Avg Thickness', data: avgData, borderColor: '#818cf8', backgroundColor: 'rgba(129,140,248,0.15)', fill: false, tension: 0.3, pointRadius: 5, pointBackgroundColor: '#818cf8', borderWidth: 3 });
  if (shellData.some(v => v !== null)) datasets.push({ label: 'Shell Section', data: shellData, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', fill: false, tension: 0.3, pointRadius: 4, pointBackgroundColor: '#f59e0b', borderWidth: 2, borderDash: [2,2] });
  if (dishEndAData.some(v => v !== null)) datasets.push({ label: 'Dish End A', data: dishEndAData, borderColor: '#06b6d4', backgroundColor: 'rgba(6,182,212,0.1)', fill: false, tension: 0.3, pointRadius: 4, pointBackgroundColor: '#06b6d4', borderWidth: 2, borderDash: [4,3] });
  if (dishEndBData.some(v => v !== null)) datasets.push({ label: 'Dish End B', data: dishEndBData, borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,0.1)', fill: false, tension: 0.3, pointRadius: 4, pointBackgroundColor: '#a855f7', borderWidth: 2, borderDash: [6,3] });

  const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#d1d5db', usePointStyle: true, boxWidth: 10, padding: 15, font: { size: 11 } } }, tooltip: { callbacks: { label: ctx => ctx.raw !== null ? ctx.dataset.label + ': ' + parseFloat(ctx.raw).toFixed(2) + ' mm' : null } } }, scales: { y: { min: Math.max(0, asset.minRequired - 5), max: asset.nominal + 3, ticks: { color: '#9ca3af', callback: v => v.toFixed(1) + ' mm' }, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { ticks: { color: '#9ca3af', maxRotation: 45 }, grid: { display: false } } } };

  const remaining = asset.corrosionRate > 0 ? ((asset.currentThick - asset.minRequired) / asset.corrosionRate).toFixed(1) : 'N/A';

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h3 className="font-bold text-white text-lg mb-2">📈 Thickness Trend Analysis</h3>
        <p className="text-xs text-gray-400 mb-4">Shell, Dish End A, Dish End B vs Nominal & T-Min</p>
        <div style={{ height: '380px' }}><Line data={{ labels, datasets }} options={options} /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Shell', color: '#f59e0b', data: shellData }, { label: 'Dish End A', color: '#06b6d4', data: dishEndAData }, { label: 'Dish End B', color: '#a855f7', data: dishEndBData }].map(s => {
          const last = s.data.filter(v => v !== null).pop();
          return (
            <div key={s.label} className="card p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2"><span className="w-3 h-3 rounded-full" style={{background: s.color}}></span><span className="text-sm font-bold text-gray-300">{s.label}</span></div>
              <div className="text-2xl font-bold" style={{color: s.color}}>{last ? last.toFixed(2) : '—'} <span className="text-sm font-normal text-gray-500">mm</span></div>
              <div className="text-xs text-gray-400 mt-1">{last ? 'Above T-Min: ' + (last - asset.minRequired).toFixed(2) + ' mm' : 'No data'}</div>
            </div>
          );
        })}
      </div>
      <div className="card p-4 text-xs text-gray-400">
        <strong className="text-white">Legend:</strong>
        <span className="ml-2">🟢 Green = Nominal</span><span className="ml-2">🔴 Red = T-Min</span><span className="ml-2">🔵 Blue = Avg</span>
        <span className="ml-2">🟡 Amber = Shell</span><span className="ml-2">🩵 Cyan = DE-A</span><span className="ml-2">🟣 Purple = DE-B</span>
      </div>
    </div>
  );
}
