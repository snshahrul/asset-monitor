import { useEffect } from 'react';
import { useAssetStore } from '../store/useAssetStore';
import { useAlertStore } from '../store/useAlertStore';

export function useSimulation(interval = 3000) {
  const assets = useAssetStore(s => s.assets);
  const updateAsset = useAssetStore(s => s.updateAsset);
  const addAlert = useAlertStore(s => s.addAlert);

  useEffect(() => {
    const timer = setInterval(() => {
      assets.forEach(a => {
        // ===== LIVE DATA: Temperature & Pressure (from sensors) =====
        const t = Math.max(20, Math.min(350, a.sensors.temperature + (Math.random() - 0.5) * 3));
        const p = Math.max(0, Math.min(30, a.sensors.pressure + (Math.random() - 0.5) * 0.4));

        // ===== THICKNESS: Does NOT change live =====
        // Thickness only updates when an inspection is recorded manually
        // This reflects real-world UT thickness measurements taken
        // every 3, 6, or 12 months during scheduled inspections
        const th = a.currentThick; // Stays the same between inspections

        // Status determination
        let s = 'running';
        if (t > 250 || p > 15) {
          s = 'critical';
          if (a.status !== 'critical') {
            addAlert(a.id, a.name, 'critical', 'CRITICAL: ' + a.name + ' - Temp: ' + t.toFixed(1) + '°C, Pressure: ' + p.toFixed(2) + ' bar');
          }
        } else if (t > 220 || p > 12) {
          s = 'warning';
        }

        // Thickness-based status (based on last inspection data)
        if (th <= a.minRequired) {
          s = 'critical';
        } else if (th <= a.minRequired * 1.10) {
          if (s !== 'critical') s = 'warning';
        }

        updateAsset(a.id, {
          sensors: { temperature: t, pressure: p, vibration: a.sensors.vibration },
          currentThick: th,
          status: s
        });
      });
    }, interval);
    return () => clearInterval(timer);
  }, [assets.length]);
}
