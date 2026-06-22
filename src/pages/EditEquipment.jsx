import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssetStore } from '../store/useAssetStore';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { Save } from 'lucide-react';

export default function EditEquipment() {
  const navigate = useNavigate();
  const selectedId = useAssetStore(s => s.selectedAssetId);
  const asset = useAssetStore(s => s.assets.find(a => a.id === selectedId));
  const updateAsset = useAssetStore(s => s.updateAsset);
  const [isOpen, setIsOpen] = useState(true);

  const [name, setName] = useState('');
  const [type, setType] = useState('Pressure Vessel');
  const [location, setLocation] = useState('');
  const [designCode, setDesignCode] = useState('ASME VIII Div.1');
  const [nominal, setNominal] = useState('');
  const [minReq, setMinReq] = useState('');
  const [current, setCurrent] = useState('');
  const [corrosionRate, setCorrosionRate] = useState('0.10');
  const [manufacturer, setManufacturer] = useState('');
  const [serial, setSerial] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');
  const [mawp, setMawp] = useState('');

  useEffect(() => {
    if (asset) {
      setName(asset.name || '');
      setType(asset.type || 'Pressure Vessel');
      setLocation(asset.location || '');
      setDesignCode(asset.designCode || 'ASME VIII Div.1');
      setNominal(asset.nominal?.toString() || '');
      setMinReq(asset.minRequired?.toString() || '');
      setCurrent(asset.currentThick?.toString() || '');
      setCorrosionRate(asset.corrosionRate?.toString() || '0.10');
      setManufacturer(asset.manufacturer || '');
      setSerial(asset.serial || '');
      setYearBuilt(asset.yearBuilt || '');
      setMawp(asset.mawp || '');
    }
  }, [asset]);

  if (!asset) {
    return (
      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); navigate('/'); }} title="No Equipment Selected">
        <p className="text-gray-400 text-center py-8">Please select equipment from the dashboard first.</p>
        <div className="flex justify-end"><Button variant="outline" onClick={() => { setIsOpen(false); navigate('/'); }}>Close</Button></div>
      </Modal>
    );
  }

  const handleSave = () => {
    if (!name.trim()) { alert('PMD/PMT No. is required'); return; }
    updateAsset(asset.id, {
      name, type, location, designCode,
      nominal: parseFloat(nominal), minRequired: parseFloat(minReq),
      currentThick: parseFloat(current), corrosionRate: parseFloat(corrosionRate) || 0.1,
      manufacturer, serial, yearBuilt, mawp
    });
    setIsOpen(false);
    navigate('/');
  };

  const close = () => { setIsOpen(false); navigate('/'); };

  return (
    <Modal isOpen={isOpen} onClose={close} title="✏️ Edit Equipment" subtitle={asset.name} size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-semibold text-gray-400 mb-1">PMD/PMT No. *</label><input className="input-field text-base font-mono" value={name} onChange={e => setName(e.target.value.toUpperCase())} /></div>
          <div><label className="block text-xs font-semibold text-gray-400 mb-1">Equipment Type</label><select className="select-field text-sm" value={type} onChange={e => setType(e.target.value)}><option>Boiler</option><option>Pressure Vessel</option><option>Storage Tank</option><option>Heat Exchanger</option><option>Piping</option></select></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-semibold text-gray-400 mb-1">Serial Number</label><input className="input-field text-sm font-mono" value={serial} onChange={e => setSerial(e.target.value)} /></div>
          <div><label className="block text-xs font-semibold text-gray-400 mb-1">Manufacturer</label><input className="input-field text-sm" value={manufacturer} onChange={e => setManufacturer(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-xs font-semibold text-gray-400 mb-1">Nominal (mm)</label><input className="input-field text-sm" type="number" value={nominal} onChange={e => setNominal(e.target.value)} step="0.01" /></div>
          <div><label className="block text-xs font-semibold text-gray-400 mb-1">T-Min (mm)</label><input className="input-field text-sm" type="number" value={minReq} onChange={e => setMinReq(e.target.value)} step="0.01" /></div>
          <div><label className="block text-xs font-semibold text-gray-400 mb-1">Current (mm)</label><input className="input-field text-sm" type="number" value={current} onChange={e => setCurrent(e.target.value)} step="0.01" /></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-xs font-semibold text-gray-400 mb-1">Corrosion Rate (mm/yr)</label><input className="input-field text-sm" type="number" value={corrosionRate} onChange={e => setCorrosionRate(e.target.value)} step="0.001" /></div>
          <div><label className="block text-xs font-semibold text-gray-400 mb-1">MAWP (bar)</label><input className="input-field text-sm" type="number" value={mawp} onChange={e => setMawp(e.target.value)} step="0.01" /></div>
          <div><label className="block text-xs font-semibold text-gray-400 mb-1">Location</label><input className="input-field text-sm" value={location} onChange={e => setLocation(e.target.value)} /></div>
        </div>
        <div className="flex justify-between pt-4 border-t border-dark-600">
          <Button variant="outline" onClick={close}>Cancel</Button>
          <Button variant="success" icon={Save} onClick={handleSave}>💾 Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
}