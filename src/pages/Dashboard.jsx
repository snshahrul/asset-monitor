import { useAssetStore } from '../store/useAssetStore';
import { useAlertStore } from '../store/useAlertStore';
import EquipmentDetail from './EquipmentDetail';
import AnalyticsCharts from '../features/dashboard/AnalyticsCharts';
import InspectionCalendar from '../features/dashboard/InspectionCalendar';
import AlertSystem from '../features/dashboard/AlertSystem';
import RBIMatrix from '../features/dashboard/RBIMatrix';

export default function Dashboard() {
  const assets = useAssetStore(s => s.assets);
  const selectedId = useAssetStore(s => s.selectedAssetId);
  const selectAsset = useAssetStore(s => s.selectAsset);
  const alerts = useAlertStore(s => s.alerts);

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-4 text-center border-l-4 border-primary-800"><div className="text-3xl font-bold text-white">{assets.length}</div><div className="text-xs text-gray-400">Total Assets</div></div>
        <div className="card p-4 text-center border-l-4 border-amber-500"><div className="text-3xl font-bold text-amber-400">{assets.filter(a => a.status === 'warning').length}</div><div className="text-xs text-gray-400">Warnings</div></div>
        <div className="card p-4 text-center border-l-4 border-red-500"><div className="text-3xl font-bold text-red-400">{assets.filter(a => a.status === 'critical').length}</div><div className="text-xs text-gray-400">Critical</div></div>
        <div className="card p-4 text-center border-l-4 border-green-500"><div className="text-3xl font-bold text-green-400">{alerts.filter(a => a.level === 'critical').length}</div><div className="text-xs text-gray-400">Active Alerts</div></div>
      </div>

      {/* Alert System */}
      <AlertSystem assets={assets} alerts={alerts} />

      {/* Analytics Row */}
      <AnalyticsCharts assets={assets} />

      {/* Calendar + RBI Matrix */}
      <div className="grid grid-cols-2 gap-4">
        <InspectionCalendar assets={assets} />
        <RBIMatrix assets={assets} />
      </div>

      {/* Equipment List + Detail */}
      <div className="flex gap-6 items-start">
        <div className="w-80 flex-shrink-0">
          <div className="card p-4">
            <h3 className="font-bold text-sm text-gray-300 mb-3">📋 Equipment List</h3>
            {!assets.length ? (
              <div className="text-center py-8 text-gray-500"><div className="text-3xl mb-2">📦</div><p className="text-sm">No equipment yet</p></div>
            ) : (
              <div className="space-y-1">
                {assets.map(a => (
                  <div key={a.id} className={'p-3 rounded-lg transition-all ' + (selectedId === a.id ? 'bg-dark-700 border border-primary-800' : 'hover:bg-dark-700 border border-transparent')}>
                    <div className="flex items-center justify-between">
                      <strong onClick={() => selectAsset(a.id)} className="text-sm text-gray-200 font-mono cursor-pointer hover:text-primary-900">{a.name}</strong>
                      <span className={'text-xs font-semibold px-2 py-0.5 rounded-full ' + (a.status === 'critical' ? 'bg-red-900 text-red-300' : a.status === 'warning' ? 'bg-amber-900 text-amber-300' : 'bg-emerald-900 text-emerald-300')}>{a.status}</span>
                    </div>
                    <div onClick={() => selectAsset(a.id)} className="text-xs text-gray-400 mt-1 cursor-pointer">{a.type} | {a.location || 'No location'} | {a.currentThick?.toFixed(2)} mm</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {selectedId ? <EquipmentDetail /> : (
            <div className="card p-6 text-gray-500 text-center py-20"><div className="text-5xl mb-4">📋</div><p className="text-lg font-semibold">Select equipment from the list</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
