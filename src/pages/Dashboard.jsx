import { useAssetStore } from '../store/useAssetStore';
import { useAlertStore } from '../store/useAlertStore';
import EquipmentDetail from './EquipmentDetail';
import AnalyticsCharts from '../features/dashboard/AnalyticsCharts';
import InspectionCalendar from '../features/dashboard/InspectionCalendar';
import AlertSystem from '../features/dashboard/AlertSystem';
import RBIMatrix from '../features/dashboard/RBIMatrix';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Pencil } from 'lucide-react';

export default function Dashboard() {
  const assets = useAssetStore(s => s.assets);
  const selectedId = useAssetStore(s => s.selectedAssetId);
  const selectAsset = useAssetStore(s => s.selectAsset);
  const alerts = useAlertStore(s => s.alerts);
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Assets', value: assets.length, color: 'text-white', border: 'border-primary-800' },
    { label: 'Warnings', value: assets.filter(a => a.status === 'warning').length, color: 'text-amber-400', border: 'border-amber-500' },
    { label: 'Critical', value: assets.filter(a => a.status === 'critical').length, color: 'text-red-400', border: 'border-red-500' },
    { label: 'Alerts', value: alerts.filter(a => a.level === 'critical').length, color: 'text-red-400', border: 'border-red-500' },
  ];

  return (
    <div className="space-y-3">
      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className={'card px-4 py-3 border-l-[3px] ' + s.border}>
            <div className={'stat-value ' + s.color}>{s.value}</div>
            <div className="label mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Alert System */}
      <AlertSystem assets={assets} alerts={alerts} />

      {/* Analytics Row */}
      <AnalyticsCharts assets={assets} />

      {/* Calendar + RBI Matrix */}
      <div className="grid grid-cols-2 gap-3">
        <InspectionCalendar assets={assets} />
        <RBIMatrix assets={assets} />
      </div>

      {/* Equipment List + Detail */}
      <div className="flex gap-3 items-start">
        <div className="w-72 flex-shrink-0">
          <div className="card">
            <div className="px-4 py-2.5 border-b border-dark-600 flex items-center gap-2">
              <span className="section-header">Equipment List</span>
              <span className="text-2xs text-gray-500 bg-dark-600 px-1.5 py-0.5 rounded-full">{assets.length}</span>
            </div>
            {!assets.length ? (
              <div className="text-center py-10 text-gray-500">
                <div className="text-2xl mb-2">📦</div>
                <p className="text-sm">No equipment yet</p>
              </div>
            ) : (
              <div className="divide-y divide-dark-600">
                {assets.map(a => (
                  <div key={a.id}
                    onClick={() => selectAsset(a.id)}
                    className={'px-4 py-2.5 transition-colors cursor-pointer group ' + (selectedId === a.id ? 'bg-dark-700 border-l-2 border-primary-800' : 'hover:bg-dark-700/50 border-l-2 border-transparent')}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-mono font-semibold text-gray-200 truncate">{a.name}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={e => { e.stopPropagation(); navigate(`/equipment/edit/${a.id}`); }} className="btn-icon text-gray-500 hover:text-primary-900" title="Edit equipment">
                          <Pencil size={13} />
                        </button>
                        <span className={'text-2xs font-semibold px-1.5 py-0.5 rounded-full ' + (a.status === 'critical' ? 'bg-red-900/60 text-red-300' : a.status === 'warning' ? 'bg-amber-900/60 text-amber-300' : 'bg-emerald-900/60 text-emerald-300')}>{a.status}</span>
                      </div>
                    </div>
                    <div className="text-2xs text-gray-500 mt-0.5 flex items-center gap-2">
                      <span>{a.type}</span>
                      <span>|</span>
                      <span>{a.location || 'No location'}</span>
                      <span>|</span>
                      <span className={a.currentThick <= a.minRequired ? 'text-red-400' : 'text-gray-400'}>{a.currentThick?.toFixed(2)}mm</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {selectedId ? <EquipmentDetail /> : (
            <div className="card flex flex-col items-center justify-center py-16 text-gray-500">
              <LayoutDashboard size={40} className="text-dark-500 mb-3" />
              <p className="text-sm font-semibold">Select equipment from the list</p>
              <p className="text-2xs text-gray-600 mt-1">Click on any equipment to view its details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
