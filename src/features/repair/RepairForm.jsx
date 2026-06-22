import { useState } from 'react';
import { Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useAssetStore } from '../../store/useAssetStore';
import { useAlertStore } from '../../store/useAlertStore';

export default function RepairForm({ isOpen, onClose }) {
  const selectedId = useAssetStore(s => s.selectedAssetId);
  const asset = useAssetStore(s => s.assets.find(a => a.id === selectedId));
  const addRepair = useAssetStore(s => s.addRepair);
  const updateAsset = useAssetStore(s => s.updateAsset);
  const addAlert = useAlertStore(s => s.addAlert);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('Weld Overlay');
  const [technician, setTechnician] = useState('');
  const [scope, setScope] = useState('');
  const [saving, setSaving] = useState(false);

  if (!asset) return <Modal isOpen={isOpen} onClose={onClose} title="No Equipment"><p className="text-sm text-gray-400 p-3">Select equipment first.</p></Modal>;

  const save = () => {
    if (!technician.trim()) { alert('Enter technician'); return; }
    addRepair(asset.id, { id: 'rep-' + Date.now(), date, type, technician, scope });
    setSaving(true); setTimeout(() => { setSaving(false); onClose(); }, 300);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Repair Record">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div><label className="label mb-1 block">Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" /></div>
          <div><label className="label mb-1 block">Type</label><select value={type} onChange={e => setType(e.target.value)} className="select-field"><option>Weld Overlay</option><option>Patch Plate</option><option>Tube Replacement</option><option>Other</option></select></div>
        </div>
        <div><label className="label mb-1 block">Technician</label><input type="text" value={technician} onChange={e => setTechnician(e.target.value)} className="input-field" /></div>
        <div><label className="label mb-1 block">Scope</label><textarea value={scope} onChange={e => setScope(e.target.value)} rows={2} className="input-field resize-none" /></div>
        <div className="flex justify-end gap-2 pt-3 border-t border-dark-600"><Button variant="outline" size="sm" onClick={onClose}>Cancel</Button><Button variant="success" size="sm" icon={Save} onClick={save} loading={saving}>Save</Button></div>
      </div>
    </Modal>
  );
}
