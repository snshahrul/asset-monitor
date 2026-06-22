import { useState } from 'react';
import { Bell, CheckCircle, Settings } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function AlertSystem({ assets, alerts }) {
  const [thresholds, setThresholds] = useState({ remainingLife: 2, temperature: 250, pressure: 15 });
  const [showSettings, setShowSettings] = useState(false);
  const [acknowledged, setAcknowledged] = useState({});

  const criticalAlerts = alerts.filter(a => a.level === 'critical');
  const unacknowledged = criticalAlerts.filter(a => !acknowledged[a.id]);

  const acknowledge = (id) => {
    setAcknowledged(prev => ({ ...prev, [id]: true }));
  };

  const simulateEmail = (alert) => {
    console.log('📧 SIMULATED EMAIL:', { to: 'maintenance@plant.com', subject: 'CRITICAL: ' + alert.assetName, body: alert.message });
    return { sent: new Date().toISOString() };
  };

  return (
    <div className="space-y-2">
      {unacknowledged.length > 0 && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-red-400 shrink-0" />
            <div>
              <span className="text-red-300 font-bold text-xs">{unacknowledged.length} Unacknowledged Critical Alert{unacknowledged.length > 1 ? 's' : ''}</span>
              <p className="text-red-400/70 text-2xs mt-0.5">{unacknowledged[0]?.message}</p>
            </div>
          </div>
          <Button variant="danger" size="xs" onClick={() => unacknowledged.forEach(a => { acknowledge(a.id); simulateEmail(a); })}>
            <CheckCircle size={12} /> Ack All
          </Button>
        </div>
      )}

      <div className="card">
        <div className="px-4 py-2.5 border-b border-dark-600 flex items-center justify-between">
          <span className="section-header"><Bell size={14} className="text-primary-900" /> Alert History</span>
          <button onClick={() => setShowSettings(!showSettings)} className="text-2xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors"><Settings size={11} /> Thresholds</button>
        </div>

        {showSettings && (
          <div className="px-4 py-3 bg-dark-700/30 grid grid-cols-3 gap-3 border-b border-dark-600">
            <div>
              <label className="block text-2xs text-gray-500 mb-1 font-semibold">Rem. Life Alert (yr)</label>
              <input type="number" value={thresholds.remainingLife} onChange={e => setThresholds({ ...thresholds, remainingLife: parseFloat(e.target.value) })} className="input-field text-xs" />
            </div>
            <div>
              <label className="block text-2xs text-gray-500 mb-1 font-semibold">Temp Alert (°C)</label>
              <input type="number" value={thresholds.temperature} onChange={e => setThresholds({ ...thresholds, temperature: parseFloat(e.target.value) })} className="input-field text-xs" />
            </div>
            <div>
              <label className="block text-2xs text-gray-500 mb-1 font-semibold">Pressure Alert (bar)</label>
              <input type="number" value={thresholds.pressure} onChange={e => setThresholds({ ...thresholds, pressure: parseFloat(e.target.value) })} className="input-field text-xs" />
            </div>
          </div>
        )}

        <div className="p-3">
          {alerts.length === 0 ? (
            <p className="text-gray-500 text-xs py-3 text-center">No alerts</p>
          ) : (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {alerts.slice(0, 20).map(a => (
                <div key={a.id} className={'flex items-center justify-between px-3 py-1.5 rounded text-xs ' + (a.level === 'critical' ? 'bg-red-900/10 border-l-2 border-red-500' : a.level === 'warning' ? 'bg-amber-900/10 border-l-2 border-amber-500' : 'bg-blue-900/10 border-l-2 border-blue-500')}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-gray-300 truncate">{a.message}</span>
                    <span className="text-gray-600 shrink-0 text-2xs">{a.timestamp}</span>
                  </div>
                  <div className="shrink-0 ml-2">
                    {a.level === 'critical' && !acknowledged[a.id] ? (
                      <button onClick={() => { acknowledge(a.id); simulateEmail(a); }} className="text-green-400 hover:text-green-300 text-2xs font-semibold">Ack</button>
                    ) : acknowledged[a.id] ? (
                      <span className="text-green-500 text-2xs">Ack'd</span>
                    ) : null}
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
