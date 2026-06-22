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

  if (!asset) return <Modal isOpen={isOpen} onClose={onClose} title="No Equipment"><p className="text-gray-400 p-4">Select equipment first.</p></Modal>;

  const save = () => {
    if (!technician.trim()) { alert('Enter technician'); return; }
    addRepair(asset.id, { id: 'rep-' + Date.now(), date, type, technician, scope });
    setSaving(true); setTimeout(() => { setSaving(false); onClose(); }, 300);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Repair Record" subtitle={asset.name}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs text-gray-400 mb-1">Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field text-sm" /></div>
          <div><label className="block text-xs text-gray-400 mb-1">Type</label><select value={type} onChange={e => setType(e.target.value)} className="select-field text-sm"><option>Weld Overlay</option><option>Patch Plate</option><option>Tube Replacement</option><option>Other</option></select></div>
        </div>
        <div><label className="block text-xs text-gray-400 mb-1">Technician</label><input type="text" value={technician} onChange={e => setTechnician(e.target.value)} className="input-field text-sm" /></div>
        <div><label className="block text-xs text-gray-400 mb-1">Scope</label><textarea value={scope} onChange={e => setScope(e.target.value)} rows={2} className="input-field text-sm resize-none" /></div>
        <div className="flex justify-end gap-2 pt-3 border-t border-dark-600"><Button variant="outline" onClick={onClose}>Cancel</Button><Button variant="success" icon={Save} onClick={save} loading={saving}>Save</Button></div>
      </div>
    </Modal>
  );
}
