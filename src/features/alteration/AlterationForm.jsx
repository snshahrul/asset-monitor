import { useState } from 'react';
import { Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useAssetStore } from '../../store/useAssetStore';

export default function AlterationForm({ isOpen, onClose }) {
  const selectedId = useAssetStore(s => s.selectedAssetId);
  const asset = useAssetStore(s => s.assets.find(a => a.id === selectedId));
  const addAlteration = useAssetStore(s => s.addAlteration);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('Nozzle Addition');
  const [engineer, setEngineer] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  if (!asset) return <Modal isOpen={isOpen} onClose={onClose} title="No Equipment"><p className="text-sm text-gray-400 p-3">Select equipment first.</p></Modal>;

  const save = () => {
    addAlteration(asset.id, { id: 'alt-' + Date.now(), date, type, engineer, description });
    setSaving(true); setTimeout(() => { setSaving(false); onClose(); }, 300);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Alteration Record">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div><label className="label mb-1 block">Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" /></div>
          <div><label className="label mb-1 block">Type</label><select value={type} onChange={e => setType(e.target.value)} className="select-field"><option>Nozzle Addition</option><option>Shell Extension</option><option>Re-rate</option><option>Other</option></select></div>
        </div>
        <div><label className="label mb-1 block">Engineer</label><input type="text" value={engineer} onChange={e => setEngineer(e.target.value)} className="input-field" /></div>
        <div><label className="label mb-1 block">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="input-field resize-none" /></div>
        <div className="flex justify-end gap-2 pt-3 border-t border-dark-600"><Button variant="outline" size="sm" onClick={onClose}>Cancel</Button><Button variant="success" size="sm" icon={Save} onClick={save} loading={saving}>Save</Button></div>
      </div>
    </Modal>
  );
}
