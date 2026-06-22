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
    const email = {
      to: 'maintenance@plant.com',
      subject: 'CRITICAL ALERT: ' + alert.assetName,
      body: 'ALERT: ' + alert.message + '\nTime: ' + alert.timestamp + '\nAction Required: Immediate inspection recommended.',
      sent: new Date().toISOString()
    };
    console.log('📧 SIMULATED EMAIL SENT:', email);
    return email;
  };

  return (
    <div className="space-y-4">
      {unacknowledged.length > 0 && (
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={24} className="text-red-400" />
              <div>
                <h4 className="text-red-300 font-bold">{unacknowledged.length} Unacknowledged Critical Alert{unacknowledged.length > 1 ? 's' : ''}</h4>
                <p className="text-red-400/80 text-sm">{unacknowledged[0]?.message}</p>
              </div>
            </div>
            <Button variant="danger" size="sm" onClick={() => unacknowledged.forEach(a => { acknowledge(a.id); simulateEmail(a); })}>
              <CheckCircle size={14} /> Acknowledge All & Send Email
            </Button>
          </div>
        </div>
      )}

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-white text-sm flex items-center gap-2"><Bell size={16} className="text-primary-900" /> Alert History</h4>
          <button onClick={() => setShowSettings(!showSettings)} className="text-xs text-gray-400 hover:text-white flex items-center gap-1"><Settings size={12} /> Thresholds</button>
        </div>

        {showSettings && (
          <div className="bg-dark-700 rounded-lg p-3 mb-3 grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Rem. Life Alert (years)</label>
              <input type="number" value={thresholds.remainingLife} onChange={e => setThresholds({ ...thresholds, remainingLife: parseFloat(e.target.value) })} className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Temp Alert (°C)</label>
              <input type="number" value={thresholds.temperature} onChange={e => setThresholds({ ...thresholds, temperature: parseFloat(e.target.value) })} className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Pressure Alert (bar)</label>
              <input type="number" value={thresholds.pressure} onChange={e => setThresholds({ ...thresholds, pressure: parseFloat(e.target.value) })} className="input-field text-sm" />
            </div>
          </div>
        )}

        {alerts.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">No alerts</p>
        ) : (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {alerts.slice(0, 20).map(a => (
              <div key={a.id} className={`flex items-center justify-between p-2 rounded text-xs ${a.level === 'critical' ? 'bg-red-900/20 border-l-2 border-red-500' : a.level === 'warning' ? 'bg-amber-900/20 border-l-2 border-amber-500' : 'bg-blue-900/20 border-l-2 border-blue-500'}`}>
                <div>
                  <span className="text-gray-200">{a.message}</span>
                  <span className="text-gray-500 ml-2">{a.timestamp}</span>
                </div>
                {a.level === 'critical' && !acknowledged[a.id] && (
                  <button onClick={() => { acknowledge(a.id); simulateEmail(a); }} className="text-green-400 hover:text-green-300 text-xs font-bold">Acknowledge</button>
                )}
                {acknowledged[a.id] && <span className="text-green-500 text-xs">✅ Ack'd</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}