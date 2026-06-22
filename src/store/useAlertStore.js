import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAlertStore = create(persist((set) => ({
  alerts: [],
  addAlert: (assetId, assetName, level, message) => { const alert = { id: Date.now(), assetId, assetName, message, level, timestamp: new Date().toLocaleString() }; set(s => ({ alerts: [alert, ...s.alerts].slice(0, 300) })); },
}), { name: 'asset-monitor-alerts' }));
