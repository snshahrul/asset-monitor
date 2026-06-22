import { useState } from 'react';
import { Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useAssetStore } from '../../store/useAssetStore';
import { useAlertStore } from '../../store/useAlertStore';

const ORIGINAL_CODES = ['ASME Section VIII Div.1', 'BS1113', 'BS2790', 'TRD', 'ASME B31.3', 'ASME Section I', 'Other'];
const NDT_METHODS = ['MPI', 'DPI', 'Radiography', 'UT - Thickness', 'UT - Shear Wave', 'PWHT', 'Hardness', 'PMI', 'Other'];
const MATERIALS = [
  'SA-516 Gr.70', 'SA-283 Gr.C', 'SA-36', 'EN10025 S275JR',
  'SA-106 Gr.B', 'SA-240 Gr.304', 'SA-240 Gr.316', 'SA-312 TP304',
  'BS3059 Part2 S2 360', 'BS3059 Part2 S2 620', 'ERW 620'
];

export default function AlterationForm({ isOpen, onClose }) {
  const selectedId = useAssetStore(s => s.selectedAssetId);
  const asset = useAssetStore(s => s.assets.find(a => a.id === selectedId));
  const addAlteration = useAssetStore(s => s.addAlteration);
  const addAlert = useAlertStore(s => s.addAlert);

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [finishDate, setFinishDate] = useState('');
  const [type, setType] = useState('');
  const [engineer, setEngineer] = useState('');
  const [welderName, setWelderName] = useState('');
  const [welderId, setWelderId] = useState('');
  const [originalCode, setOriginalCode] = useState('ASME Section VIII Div.1');
  const [alterationCode, setAlterationCode] = useState('ASME Section VIII Div.1');
  const [shellHeadMaterial, setShellHeadMaterial] = useState('');
  const [replacementMaterial, setReplacementMaterial] = useState('');
  const [ndt, setNdt] = useState('MPI');
  const [designPressure, setDesignPressure] = useState('');
  const [designTemp, setDesignTemp] = useState('');
  const [hydrostatic, setHydrostatic] = useState('Yes');
  const [hydrostaticPressure, setHydrostaticPressure] = useState('');
  const [inspectorName, setInspectorName] = useState('');
  const [scope, setScope] = useState('');
  const [designApprovedNo, setDesignApprovedNo] = useState('');
  const [dateApproval, setDateApproval] = useState('');
  const [approvedBy, setApprovedBy] = useState('');
  const [saving, setSaving] = useState(false);

  if (!asset) return <Modal isOpen={isOpen} onClose={onClose} title="No Equipment"><p className="text-sm text-gray-400 p-3">Select equipment first.</p></Modal>;

  const save = () => {
    if (!engineer.trim()) { alert('Enter engineer name'); return; }
    addAlteration(asset.id, {
      id: 'alt-' + Date.now(),
      startDate, finishDate, type, engineer, welderName, welderId,
      originalCode, alterationCode, shellHeadMaterial, replacementMaterial,
      ndt, designPressure, designTemp, hydrostatic, hydrostaticPressure,
      inspectionName: inspectorName, scope,
      designApprovedNo, dateApproval, approvedBy
    });
    addAlert(asset.id, asset.name, 'info', `Alteration: ${asset.name} — ${type}`);
    setSaving(true); setTimeout(() => { setSaving(false); onClose(); }, 300);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Alteration Record" size="lg">
      <div className="space-y-3">
        <div className="bg-dark-700/30 rounded-lg px-3 py-2 text-xs">
          <span className="text-white font-bold font-mono">{asset.name}</span>
          <span className="text-gray-500 ml-2">| {asset.type} | {asset.designCode || 'N/A'}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div><label className="label mb-1 block">Original Construction Code</label>
            <select value={originalCode} onChange={e => setOriginalCode(e.target.value)} className="select-field">
              {ORIGINAL_CODES.map(c => <option key={c}>{c}</option>)}
            </select></div>
          <div><label className="label mb-1 block">Alteration Code</label>
            <select value={alterationCode} onChange={e => setAlterationCode(e.target.value)} className="select-field">
              <option>ASME Section VIII Div.1</option><option>ASME B31.3</option><option>API 510</option><option>API 653</option><option>ASME Section I</option><option>Other</option>
            </select></div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div><label className="label mb-1 block">Start Date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-field" /></div>
          <div><label className="label mb-1 block">Finish Date</label><input type="date" value={finishDate} onChange={e => setFinishDate(e.target.value)} className="input-field" /></div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div><label className="label mb-1 block">Type of Alteration</label>
            <select value={type} onChange={e => setType(e.target.value)} className="select-field">
              <option value="">— Select —</option><option>Nozzle Addition</option><option>Shell Extension</option>
              <option>Support Modification</option><option>Re-rate</option><option>Material Change</option><option>Other</option>
            </select></div>
          <div><label className="label mb-1 block">Engineer</label><input type="text" value={engineer} onChange={e => setEngineer(e.target.value)} placeholder="Name" className="input-field" /></div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div><label className="label mb-1 block">Design Approved No.</label><input type="text" value={designApprovedNo} onChange={e => setDesignApprovedNo(e.target.value)} className="input-field" /></div>
          <div><label className="label mb-1 block">Date Approval</label><input type="date" value={dateApproval} onChange={e => setDateApproval(e.target.value)} className="input-field" /></div>
          <div><label className="label mb-1 block">Approved By</label><input type="text" value={approvedBy} onChange={e => setApprovedBy(e.target.value)} className="input-field" /></div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div><label className="label mb-1 block">Welder Name</label><input type="text" value={welderName} onChange={e => setWelderName(e.target.value)} className="input-field" /></div>
          <div><label className="label mb-1 block">Welder ID</label><input type="text" value={welderId} onChange={e => setWelderId(e.target.value)} className="input-field" /></div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div><label className="label mb-1 block">Shell/Head/Tube/Other Material</label>
            <select value={shellHeadMaterial} onChange={e => setShellHeadMaterial(e.target.value)} className="select-field">
              <option value="">— Select —</option>
              {MATERIALS.map(m => <option key={m}>{m}</option>)}
            </select></div>
          <div><label className="label mb-1 block">Replacement Material</label>
            <select value={replacementMaterial} onChange={e => setReplacementMaterial(e.target.value)} className="select-field">
              <option value="">— Select —</option>
              {MATERIALS.map(m => <option key={m}>{m}</option>)}
            </select></div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div><label className="label mb-1 block">Design Pressure (bar)</label><input type="number" step="0.1" value={designPressure} onChange={e => setDesignPressure(e.target.value)} className="input-field" /></div>
          <div><label className="label mb-1 block">Design Temperature (°C)</label><input type="number" step="0.1" value={designTemp} onChange={e => setDesignTemp(e.target.value)} className="input-field" /></div>
          <div><label className="label mb-1 block">NDT Method</label>
            <select value={ndt} onChange={e => setNdt(e.target.value)} className="select-field">
              {NDT_METHODS.map(n => <option key={n}>{n}</option>)}
            </select></div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div><label className="label mb-1 block">Hydrostatic Test</label>
            <select value={hydrostatic} onChange={e => setHydrostatic(e.target.value)} className="select-field">
              <option>Yes</option><option>No</option>
            </select></div>
          <div><label className="label mb-1 block">Hydrostatic Pressure (bar)</label><input type="number" step="0.1" value={hydrostaticPressure} onChange={e => setHydrostaticPressure(e.target.value)} className="input-field" /></div>
          <div><label className="label mb-1 block">Inspector Name</label><input type="text" value={inspectorName} onChange={e => setInspectorName(e.target.value)} className="input-field" /></div>
        </div>

        <div><label className="label mb-1 block">Detail of Alteration Scope</label>
          <textarea value={scope} onChange={e => setScope(e.target.value)} rows={3} className="input-field resize-none" placeholder="Describe the alteration scope in detail..." /></div>

        <div className="flex justify-end gap-2 pt-3 border-t border-dark-600">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="success" size="sm" icon={Save} onClick={save} loading={saving}>Save Alteration Record</Button>
        </div>
      </div>
    </Modal>
  );
}
