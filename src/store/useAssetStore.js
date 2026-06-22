import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAssetStore = create(
  persist(
    (set, get) => ({
      assets: [],
      selectedAssetId: null,
      assetIdCounter: 100,
      equipmentFolders: {},

      addAsset: (data) => {
        const id = get().assetIdCounter + 1;
        const asset = {
          id, name: data.name, type: data.type, location: data.location || '',
          designCode: data.designCode || 'ASME VIII',
          nominal: parseFloat(data.nominal) || 25,
          minRequired: parseFloat(data.minRequired) || 18,
          currentThick: parseFloat(data.currentThick) || 24,
          corrosionRate: parseFloat(data.corrosionRate) || 0.1,
          status: 'running',
          sensors: { temperature: 150, pressure: 5, vibration: 1 }
        };
        set(s => ({
          assets: [...s.assets, asset],
          assetIdCounter: id,
          equipmentFolders: {
            ...s.equipmentFolders,
            [id]: { inspections: [], repairs: [], alterations: [], thicknessHistory: [] }
          }
        }));
        return asset;
      },

      updateAsset: (id, u) => set(s => ({
        assets: s.assets.map(a => a.id === id ? { ...a, ...u } : a)
      })),

      deleteAsset: (id) => set(s => {
        const { [id]: removed, ...rest } = s.equipmentFolders;
        return {
          assets: s.assets.filter(a => a.id !== id),
          equipmentFolders: rest,
          selectedAssetId: s.selectedAssetId === id ? null : s.selectedAssetId
        };
      }),

      selectAsset: (id) => set({ selectedAssetId: id }),

      addInspection: (aid, insp) => set(s => {
        const f = s.equipmentFolders[aid] || { inspections: [], repairs: [], alterations: [], thicknessHistory: [] };
        return {
          equipmentFolders: {
            ...s.equipmentFolders,
            [aid]: {
              ...f,
              inspections: [...f.inspections, insp],
              thicknessHistory: [...f.thicknessHistory, { date: insp.date, thickness: insp.minThickness || insp.avgThickness }]
            }
          }
        };
      }),

      addRepair: (aid, rep) => set(s => {
        const f = s.equipmentFolders[aid] || { inspections: [], repairs: [], alterations: [], thicknessHistory: [] };
        return { equipmentFolders: { ...s.equipmentFolders, [aid]: { ...f, repairs: [...f.repairs, rep] } } };
      }),

      addAlteration: (aid, alt) => set(s => {
        const f = s.equipmentFolders[aid] || { inspections: [], repairs: [], alterations: [], thicknessHistory: [] };
        return { equipmentFolders: { ...s.equipmentFolders, [aid]: { ...f, alterations: [...f.alterations, alt] } } };
      }),

      addDocument: (aid, doc) => set(s => {
        const f = s.equipmentFolders[aid] || { inspections: [], repairs: [], alterations: [], thicknessHistory: [], documents: [] };
        return { equipmentFolders: { ...s.equipmentFolders, [aid]: { ...f, documents: [...(f.documents || []), doc] } } };
      }),

      deleteDocument: (aid, docId) => set(s => {
        const f = s.equipmentFolders[aid];
        if (!f) return s;
        return { equipmentFolders: { ...s.equipmentFolders, [aid]: { ...f, documents: (f.documents || []).filter(d => d.id !== docId) } } };
      }),

      deleteRecord: (aid, type, rid) => set(s => {
        const f = s.equipmentFolders[aid];
        if (!f) return s;
        return { equipmentFolders: { ...s.equipmentFolders, [aid]: { ...f, [type]: f[type].filter(r => String(r.id) !== String(rid)) } } };
      }),
    }),
    {
      name: 'asset-monitor-storage',
      partialize: (s) => ({ assets: s.assets, assetIdCounter: s.assetIdCounter, equipmentFolders: s.equipmentFolders })
    }
  )
);
