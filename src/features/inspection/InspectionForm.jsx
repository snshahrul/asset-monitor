import { useState } from 'react';
import { Save } from 'lucide-react';
import CMLGrid from './CMLGrid';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useAssetStore } from '../../store/useAssetStore';
import { useAlertStore } from '../../store/useAlertStore';

export default function InspectionForm({ isOpen, onClose }) {
  const selectedId = useAssetStore(s => s.selectedAssetId);
  const asset = useAssetStore(s => s.assets.find(a => a.id === selectedId));
  const addInspection = useAssetStore(s => s.addInspection);
  const updateAsset = useAssetStore(s => s.updateAsset);
  const addAlert = useAlertStore(s => s.addAlert);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('External');
  const [inspector, setInspector] = useState('');
  const [ndtMethod, setNdtMethod] = useState('UT - Ultrasonic');
  const [equipment, setEquipment] = useState('');
  const [condition, setCondition] = useState('Good');
  const [corrosion, setCorrosion] = useState('None');
  const [findings, setFindings] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [gridData, setGridData] = useState(null);
  const [saving, setSaving] = useState(false);

  if (!asset) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="No Equipment Selected">
        <div className="text-center py-6"><p className="text-sm text-gray-400">Please select equipment from the dashboard first.</p><div className="mt-3"><Button variant="primary" onClick={onClose}>Go to Dashboard</Button></div></div>
      </Modal>
    );
  }

  const handleSave = () => {
    if (!inspector.trim()) { alert('Please enter inspector name'); return; }

    const rows = gridData?.rows || [];
    const measured = rows.map(r => r.measured).filter(v => v > 0);
    const avgThickness = measured.length ? measured.reduce((s, v) => s + v, 0) / measured.length : asset.currentThick;
    const minThickness = measured.length ? Math.min(...measured) : asset.currentThick;
    const minRemaining = minThickness - asset.minRequired;

    const folder = JSON.parse(localStorage.getItem('asset-monitor-storage'))?.state?.equipmentFolders?.[asset.id];
    const lastInsp = folder?.inspections?.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    let corrosionRate = asset.corrosionRate || 0.1;
    if (lastInsp?.avgThickness && lastInsp.date) {
      const daysDiff = (new Date(date) - new Date(lastInsp.date)) / (1000 * 60 * 60 * 24);
      if (daysDiff > 0) {
        const thicknessLoss = lastInsp.avgThickness - avgThickness;
        if (thicknessLoss > 0) corrosionRate = (thicknessLoss / daysDiff) * 365;
      }
    }

    const remainingLifeYears = corrosionRate > 0 ? (minRemaining / corrosionRate) : (minRemaining > 0 ? 100 : 0);
    const remainingLife = remainingLifeYears >= 100 ? '> 100 years' : remainingLifeYears.toFixed(1) + ' years';
    const inspectionInterval = Math.min(5, Math.max(0.5, remainingLifeYears / 2));
    const nextInspectionDate = new Date(Date.now() + inspectionInterval * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const insp = {
      id: 'insp-' + Date.now(), date, type, inspector, ndtMethod, equipment, condition, corrosion, findings, recommendations,
      avgThickness: +avgThickness.toFixed(2), minThickness: +minThickness.toFixed(2),
      remainingLife, remainingLifeYears: +remainingLifeYears.toFixed(1), nextInspectionDate,
      corrosionRate: +corrosionRate.toFixed(3), gridData: gridData || { rows: [] }
    };

    addInspection(asset.id, insp);
    updateAsset(asset.id, { currentThick: insp.avgThickness, lastInspection: date, corrosionRate: insp.corrosionRate });
    addAlert(asset.id, asset.name, 'info', 'Inspection: ' + asset.name + ' — Avg: ' + insp.avgThickness + 'mm');
    setSaving(true);
    setTimeout(() => { setSaving(false); onClose(); }, 300);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Inspection Report" size="xl">
      <div className="space-y-3">
        <div className="bg-dark-700/30 rounded-lg px-3 py-2 flex items-center gap-2 text-xs">
          <span className="text-white font-bold font-mono">{asset.name}</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">{asset.type} | T-Nom: {asset.nominal}mm | T-Min: {asset.minRequired}mm | Current: {asset.currentThick?.toFixed(2)}mm</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div><label className="label mb-1 block">Date *</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" /></div>
          <div><label className="label mb-1 block">Type</label><select value={type} onChange={e => setType(e.target.value)} className="select-field"><option>Internal</option><option>External</option><option>On-Stream</option><option>Shutdown</option></select></div>
          <div><label className="label mb-1 block">Inspector *</label><input type="text" value={inspector} onChange={e => setInspector(e.target.value)} placeholder="Name" className="input-field" /></div>
          <div><label className="label mb-1 block">NDT Method</label><select value={ndtMethod} onChange={e => setNdtMethod(e.target.value)} className="select-field"><option>UT - Ultrasonic</option><option>RT - Radiography</option><option>MT - Magnetic Particle</option><option>PT - Dye Penetrant</option><option>VT - Visual</option></select></div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div><label className="label mb-1 block">Equipment</label><input type="text" value={equipment} onChange={e => setEquipment(e.target.value)} className="input-field" /></div>
          <div><label className="label mb-1 block">Condition</label><select value={condition} onChange={e => setCondition(e.target.value)} className="select-field"><option>Good</option><option>Fair</option><option>Poor</option><option>Critical</option></select></div>
          <div><label className="label mb-1 block">Corrosion</label><select value={corrosion} onChange={e => setCorrosion(e.target.value)} className="select-field"><option>None</option><option>Minor Pitting</option><option>General</option><option>Severe</option></select></div>
        </div>

        {ndtMethod === 'UT - Ultrasonic' && <CMLGrid asset={asset} onDataChange={setGridData} />}
        {ndtMethod !== 'UT - Ultrasonic' && <div className="bg-dark-700/30 rounded-lg p-3 text-center"><p className="text-xs text-gray-500">{ndtMethod} inspection selected. Enter findings below.</p></div>}

        {gridData?.rows?.length > 0 && (
          <div className="grid grid-cols-4 gap-2 bg-dark-700/30 rounded-lg p-3 text-center">
            <div><div className="text-2xs text-gray-500">Avg Thickness</div><div className="text-sm font-bold text-primary-900">{(gridData.rows.filter(r => r.measured > 0).reduce((s, r) => s + r.measured, 0) / gridData.rows.filter(r => r.measured > 0).length).toFixed(2)} mm</div></div>
            <div><div className="text-2xs text-gray-500">Min Thickness</div><div className="text-sm font-bold text-red-400">{Math.min(...gridData.rows.filter(r => r.measured > 0).map(r => r.measured)).toFixed(2)} mm</div></div>
            <div><div className="text-2xs text-gray-500">Above T-Min</div><div className="text-sm font-bold text-green-400">{(Math.min(...gridData.rows.filter(r => r.measured > 0).map(r => r.measured)) - asset.minRequired).toFixed(2)} mm</div></div>
            <div><div className="text-2xs text-gray-500">Est. Rem. Life</div><div className="text-sm font-bold text-amber-400">{asset.corrosionRate > 0 ? ((Math.min(...gridData.rows.filter(r => r.measured > 0).map(r => r.measured)) - asset.minRequired) / asset.corrosionRate).toFixed(1) : 'N/A'} yr</div></div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div><label className="label mb-1 block">Findings</label><textarea value={findings} onChange={e => setFindings(e.target.value)} rows={2} className="input-field resize-none" /></div>
          <div><label className="label mb-1 block">Recommendations</label><textarea value={recommendations} onChange={e => setRecommendations(e.target.value)} rows={2} className="input-field resize-none" /></div>
        </div>

        <div className="flex justify-between pt-3 border-t border-dark-600">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="success" size="sm" icon={Save} onClick={handleSave} loading={saving}>Save Inspection</Button>
        </div>
      </div>
    </Modal>
  );
}
