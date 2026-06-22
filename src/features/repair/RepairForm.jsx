import { useState } from 'react';
import { Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useAssetStore } from '../../store/useAssetStore';
import { useAlertStore } from '../../store/useAlertStore';

const ORIGINAL_CODES = ['ASME Section VIII Div.1', 'BS1113', 'BS2790', 'TRD', 'ASME B31.3', 'ASME Section I', 'Other'];
const REPAIR_CODES = ['ASME PCC-2', 'NBIC', 'ASME Section VIII Div.1', 'API 510', 'API 570', 'Other'];
const NDT_METHODS = ['MPI', 'DPI', 'Radiography', 'UT - Thickness', 'UT - Shear Wave', 'PWHT', 'Hardness', 'PMI', 'Other'];

export default function RepairForm({ isOpen, onClose }) {
  const selectedId = useAssetStore(s => s.selectedAssetId);
  const asset = useAssetStore(s => s.assets.find(a => a.id === selectedId));
  const addRepair = useAssetStore(s => s.addRepair);
  const updateAsset = useAssetStore(s => s.updateAsset);
  const addAlert = useAlertStore(s => s.addAlert);

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [finishDate, setFinishDate] = useState('');
  const [method, setMethod] = useState('Weld Overlay');
  const [personIncharge, setPersonIncharge] = useState('');
  const [welderName, setWelderName] = useState('');
  const [welderId, setWelderId] = useState('');
  const [originalCode, setOriginalCode] = useState('ASME Section VIII Div.1');
  const [repairCode, setRepairCode] = useState('ASME PCC-2');
  const [shellHeadMaterial, setShellHeadMaterial] = useState('');
  const [replacementMaterial, setReplacementMaterial] = useState('');
  const [ndt, setNdt] = useState('MPI');
  const [designPressure, setDesignPressure] = useState('');
  const [designTemp, setDesignTemp] = useState('');
  const [hydrostatic, setHydrostatic] = useState('Yes');
  const [inspectionName, setInspectionName] = useState('');
  const [scope, setScope] = useState('');
  const [saving, setSaving] = useState(false);

  if (!asset) return <Modal isOpen={isOpen} onClose={onClose} title="No Equipment"><p className="text-sm text-gray-400 p-3">Select equipment first.</p></Modal>;

  const save = () => {
    if (!personIncharge.trim()) { alert('Enter person in charge'); return; }
    addRepair(asset.id, {
      id: 'rep-' + Date.now(),
      startDate, finishDate, method, personIncharge, welderName, welderId,
      originalCode, repairCode, shellHeadMaterial, replacementMaterial,
      ndt, designPressure, designTemp, hydrostatic, inspectionName, scope
    });
    setSaving(true); setTimeout(() => { setSaving(false); onClose(); }, 300);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Repair Record" size="lg">
      <div className="space-y-3">
        {/* Row 1: Equipment info */}
        <div className="bg-dark-700/30 rounded-lg px-3 py-2 text-xs">
          <span className="text-white font-bold font-mono">{asset.name}</span>
          <span className="text-gray-500 ml-2">| {asset.type} | {asset.designCode || 'N/A'}</span>
        </div>

        {/* Row 2: Codes */}
        <div className="grid grid-cols-2 gap-2">
          <div><label className="label mb-1 block">Original Construction Code</label>
            <select value={originalCode} onChange={e => setOriginalCode(e.target.value)} className="select-field">
              {ORIGINAL_CODES.map(c => <option key={c}>{c}</option>)}
            </select></div>
          <div><label className="label mb-1 block">Repair Code</label>
            <select value={repairCode} onChange={e => setRepairCode(e.target.value)} className="select-field">
              {REPAIR_CODES.map(c => <option key={c}>{c}</option>)}
            </select></div>
        </div>

        {/* Row 3: Dates */}
        <div className="grid grid-cols-2 gap-2">
          <div><label className="label mb-1 block">Repair Start Date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-field" /></div>
          <div><label className="label mb-1 block">Finish Date</label><input type="date" value={finishDate} onChange={e => setFinishDate(e.target.value)} className="input-field" /></div>
        </div>

        {/* Row 4: Method + Person */}
        <div className="grid grid-cols-2 gap-2">
          <div><label className="label mb-1 block">Method of Repair</label>
            <select value={method} onChange={e => setMethod(e.target.value)} className="select-field">
              <option>Weld Overlay</option><option>Patch Plate</option><option>Tube Replacement</option>
              <option>Grinding / Blending</option><option>Sleeve Reinforcement</option><option>Full Replacement</option><option>Other</option>
            </select></div>
          <div><label className="label mb-1 block">Person Incharge</label><input type="text" value={personIncharge} onChange={e => setPersonIncharge(e.target.value)} placeholder="Name" className="input-field" /></div>
        </div>

        {/* Row 5: Welder */}
        <div className="grid grid-cols-2 gap-2">
          <div><label className="label mb-1 block">Welder Name</label><input type="text" value={welderName} onChange={e => setWelderName(e.target.value)} className="input-field" /></div>
          <div><label className="label mb-1 block">Welder ID</label><input type="text" value={welderId} onChange={e => setWelderId(e.target.value)} className="input-field" /></div>
        </div>

        {/* Row 6: Materials */}
        <div className="grid grid-cols-2 gap-2">
          <div><label className="label mb-1 block">Shell &amp; Head Material</label><input type="text" value={shellHeadMaterial} onChange={e => setShellHeadMaterial(e.target.value)} placeholder="e.g. SA-516 Gr.70" className="input-field" /></div>
          <div><label className="label mb-1 block">Replacement Material</label><input type="text" value={replacementMaterial} onChange={e => setReplacementMaterial(e.target.value)} placeholder="e.g. SA-240 316L" className="input-field" /></div>
        </div>

        {/* Row 7: Design + NDT */}
        <div className="grid grid-cols-3 gap-2">
          <div><label className="label mb-1 block">Design Pressure (bar)</label><input type="number" step="0.1" value={designPressure} onChange={e => setDesignPressure(e.target.value)} className="input-field" /></div>
          <div><label className="label mb-1 block">Design Temperature (°C)</label><input type="number" step="0.1" value={designTemp} onChange={e => setDesignTemp(e.target.value)} className="input-field" /></div>
          <div><label className="label mb-1 block">NDT Method</label>
            <select value={ndt} onChange={e => setNdt(e.target.value)} className="select-field">
              {NDT_METHODS.map(n => <option key={n}>{n}</option>)}
            </select></div>
        </div>

        {/* Row 8: Hydrostatic + Inspection */}
        <div className="grid grid-cols-2 gap-2">
          <div><label className="label mb-1 block">Hydrostatic Test</label>
            <select value={hydrostatic} onChange={e => setHydrostatic(e.target.value)} className="select-field">
              <option>Yes</option><option>No</option>
            </select></div>
          <div><label className="label mb-1 block">Inspection Name</label><input type="text" value={inspectionName} onChange={e => setInspectionName(e.target.value)} className="input-field" /></div>
        </div>

        {/* Row 9: Scope */}
        <div><label className="label mb-1 block">Detail of Repair Scope</label>
          <textarea value={scope} onChange={e => setScope(e.target.value)} rows={3} className="input-field resize-none" placeholder="Describe the repair scope in detail..." /></div>

        <div className="flex justify-end gap-2 pt-3 border-t border-dark-600">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="success" size="sm" icon={Save} onClick={save} loading={saving}>Save Repair Record</Button>
        </div>
      </div>
    </Modal>
  );
}
