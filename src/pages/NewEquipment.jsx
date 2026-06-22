import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssetStore } from '../store/useAssetStore';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

export default function NewEquipment() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const addAsset = useAssetStore(s => s.addAsset);
  const selectAsset = useAssetStore(s => s.selectAsset);

  const [pmdNo, setPmdNo] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [type, setType] = useState('Pressure Vessel');
  const [designCode, setDesignCode] = useState('ASME VIII Div.1');
  const [location, setLocation] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');
  const [fluidService, setFluidService] = useState('Hydrocarbon');
  const [pwht, setPwht] = useState('Yes');
  const [radiograph, setRadiograph] = useState('Full');

  // Design parameters
  const [designPressure, setDesignPressure] = useState('10');
  const [designTemp, setDesignTemp] = useState('200');
  const [mawp, setMawp] = useState('10');
  const [shellDia, setShellDia] = useState('1500');
  const [shellLen, setShellLen] = useState('4000');
  const [jointEff, setJointEff] = useState('0.85');
  const [allowStress, setAllowStress] = useState('138');
  const [corrAllowance, setCorrAllowance] = useState('3.0');
  const [corrosionRate, setCorrosionRate] = useState('0.10');
  const [nominalThick, setNominalThick] = useState('25');
  const [currentThick, setCurrentThick] = useState('24');

  const [calcTmin, setCalcTmin] = useState('');
  const [calcMAWP, setCalcMAWP] = useState('');

  const calculateTmin = () => {
    const P = parseFloat(designPressure) || 0;
    const R = (parseFloat(shellDia) || 0) / 2;
    const S = parseFloat(allowStress) || 138;
    const E = parseFloat(jointEff) || 0.85;
    const CA = parseFloat(corrAllowance) || 0;
    if (P > 0 && R > 0 && S > 0 && E > 0) {
      const tCirc = (P * R) / (S * E - 0.6 * P);
      const tLong = (P * R) / (2 * S * E + 0.4 * P);
      const tMin = Math.max(tCirc, tLong) + CA;
      setCalcTmin(tMin.toFixed(2));
      calculateMAWP(tMin);
    }
  };

  const calculateMAWP = (tMin) => {
    const t = parseFloat(nominalThick) || 0;
    const R = (parseFloat(shellDia) || 0) / 2;
    const S = parseFloat(allowStress) || 138;
    const E = parseFloat(jointEff) || 0.85;
    const CA = parseFloat(corrAllowance) || 0;
    const tActual = t - CA;
    if (tActual > 0 && R > 0 && S > 0 && E > 0) {
      const mawpCirc = (S * E * tActual) / (R + 0.6 * tActual);
      setCalcMAWP(mawpCirc.toFixed(2));
    }
  };

  const save = () => {
    if (!pmdNo.trim()) { alert('Please enter PMD/PMT No.'); return; }
    if (!serialNo.trim()) { alert('Please enter Equipment Serial No.'); return; }
    const tmin = parseFloat(calcTmin) || parseFloat(prompt('Enter T-Min (mm):', '18')) || 18;
    const a = addAsset({
      name: pmdNo, type, location, designCode, manufacturer, serial: serialNo, yearBuilt,
      nominal: nominalThick, minRequired: tmin, currentThick, corrosionRate, corrAllowance,
      operatingTemp: designTemp, operatingPress: designPressure, mawp: calcMAWP || mawp,
      designPressure, shellDiameter: shellDia, shellLength: shellLen, jointEff, allowStress, fluidService, pwht, radiograph
    });
    selectAsset(a.id);
    setIsOpen(false);
    navigate('/');
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); navigate('/'); }} title="➕ Register New Equipment" size="xl">
      <div className="space-y-4">
        {/* PMD No. + Serial No. + Type */}
        <div className="bg-dark-700/50 rounded-lg p-4 border border-primary-800/30">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-bold text-primary-900 mb-1">PMD/PMT No. *</label>
              <input className="input-field text-base font-mono" placeholder="e.g. SL-PMD-12345" value={pmdNo} onChange={e => setPmdNo(e.target.value.toUpperCase())} />
            </div>
            <div>
              <label className="block text-sm font-bold text-amber-400 mb-1">🔢 Equipment Serial No. *</label>
              <input className="input-field text-base font-mono border-amber-500" placeholder="e.g. BV-2020-001-A" value={serialNo} onChange={e => setSerialNo(e.target.value.toUpperCase())} />
              <p className="text-xs text-gray-500 mt-1">Manufacturer's unique serial number</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Equipment Type *</label>
              <select className="select-field text-sm" value={type} onChange={e => setType(e.target.value)}>
                <option>Boiler</option><option>Pressure Vessel</option><option>Storage Tank</option><option>Heat Exchanger</option><option>Piping</option>
              </select>
            </div>
          </div>
        </div>

        {/* Design Calculation */}
        <h4 className="font-bold text-white text-sm pt-2 border-t border-dark-600">📐 Design Calculation (ASME Section VIII Div.1)</h4>
        <div className="bg-dark-700/30 rounded-lg p-4 border border-dark-600">
          <div className="grid grid-cols-4 gap-3">
            <div><label className="block text-xs font-semibold text-gray-400 mb-1">Design Pressure (bar)</label><input type="number" value={designPressure} onChange={e => setDesignPressure(e.target.value)} className="input-field text-sm" step="0.01" /></div>
            <div><label className="block text-xs font-semibold text-gray-400 mb-1">Design Temp (°C)</label><input type="number" value={designTemp} onChange={e => setDesignTemp(e.target.value)} className="input-field text-sm" /></div>
            <div><label className="block text-xs font-semibold text-gray-400 mb-1">Shell Inner Dia (mm)</label><input type="number" value={shellDia} onChange={e => setShellDia(e.target.value)} className="input-field text-sm" /></div>
            <div><label className="block text-xs font-semibold text-gray-400 mb-1">Shell Length (mm)</label><input type="number" value={shellLen} onChange={e => setShellLen(e.target.value)} className="input-field text-sm" /></div>
            <div><label className="block text-xs font-semibold text-gray-400 mb-1">Joint Efficiency (E)</label><select value={jointEff} onChange={e => setJointEff(e.target.value)} className="select-field text-sm"><option value="1.0">1.0 (Full RT)</option><option value="0.85">0.85 (Spot RT)</option><option value="0.70">0.70 (No RT)</option></select></div>
            <div><label className="block text-xs font-semibold text-gray-400 mb-1">Allow. Stress S (MPa)</label><input type="number" value={allowStress} onChange={e => setAllowStress(e.target.value)} className="input-field text-sm" /></div>
            <div><label className="block text-xs font-semibold text-gray-400 mb-1">Corrosion Allowance (mm)</label><input type="number" value={corrAllowance} onChange={e => setCorrAllowance(e.target.value)} className="input-field text-sm" step="0.1" /></div>
            <div><label className="block text-xs font-semibold text-gray-400 mb-1">Radiography</label><select value={radiograph} onChange={e => setRadiograph(e.target.value)} className="select-field text-sm"><option>Full</option><option>Spot</option><option>None</option></select></div>
          </div>
          <div className="mt-3">
            <Button variant="accent" size="sm" onClick={calculateTmin}>🔢 Calculate T-Min & MAWP</Button>
          </div>
          {calcTmin && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-dark-800 rounded-lg p-3 text-center border border-primary-800">
                <div className="text-xs text-gray-400">Calculated T-Min Required</div>
                <div className="text-2xl font-bold text-primary-900">{calcTmin} mm</div>
                <div className="text-xs text-gray-500 mt-1">t = (P×R)/(S×E−0.6P) + CA</div>
              </div>
              <div className="bg-dark-800 rounded-lg p-3 text-center border border-green-800">
                <div className="text-xs text-gray-400">Calculated MAWP</div>
                <div className="text-2xl font-bold text-green-400">{calcMAWP} bar</div>
                <div className="text-xs text-gray-500 mt-1">MAWP = (S×E×t)/(R+0.6t)</div>
              </div>
            </div>
          )}
        </div>

        {/* Thickness Data */}
        <h4 className="font-bold text-white text-sm pt-2 border-t border-dark-600">📏 Thickness Data</h4>
        <div className="grid grid-cols-4 gap-3">
          <div><label className="block text-xs font-semibold text-gray-400 mb-1">Nominal Thickness (mm) *</label><input type="number" value={nominalThick} onChange={e => setNominalThick(e.target.value)} className="input-field text-sm" step="0.01" /></div>
          <div><label className="block text-xs font-semibold text-gray-400 mb-1">T-Min Required (mm) *</label><input type="number" value={calcTmin} onChange={e => setCalcTmin(e.target.value)} className="input-field text-sm font-bold text-primary-900" step="0.01" /></div>
          <div><label className="block text-xs font-semibold text-gray-400 mb-1">Current Thickness (mm) *</label><input type="number" value={currentThick} onChange={e => setCurrentThick(e.target.value)} className="input-field text-sm" step="0.01" /></div>
          <div><label className="block text-xs font-semibold text-gray-400 mb-1">Corrosion Rate (mm/yr)</label><input type="number" value={corrosionRate} onChange={e => setCorrosionRate(e.target.value)} className="input-field text-sm" step="0.001" /></div>
        </div>

        {/* Equipment Details */}
        <h4 className="font-bold text-white text-sm pt-2 border-t border-dark-600">🏭 Equipment Details</h4>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-xs font-semibold text-gray-400 mb-1">Location / Unit</label><input className="input-field text-sm" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Plant 1, Area B" /></div>
          <div><label className="block text-xs font-semibold text-gray-400 mb-1">Manufacturer</label><input className="input-field text-sm" value={manufacturer} onChange={e => setManufacturer(e.target.value)} placeholder="e.g. PV Fabricators Inc." /></div>
          <div><label className="block text-xs font-semibold text-gray-400 mb-1">Year Built</label><input className="input-field text-sm" type="number" value={yearBuilt} onChange={e => setYearBuilt(e.target.value)} placeholder="e.g. 2020" /></div>
          <div><label className="block text-xs font-semibold text-gray-400 mb-1">Fluid Service</label><select value={fluidService} onChange={e => setFluidService(e.target.value)} className="select-field text-sm"><option>Hydrocarbon</option><option>Steam</option><option>Water</option><option>Chemical</option><option>Lethal</option></select></div>
          <div><label className="block text-xs font-semibold text-gray-400 mb-1">PWHT</label><select value={pwht} onChange={e => setPwht(e.target.value)} className="select-field text-sm"><option>Yes</option><option>No</option></select></div>
        </div>

        <div className="flex justify-between pt-4 border-t border-dark-600">
          <Button variant="outline" onClick={() => { setIsOpen(false); navigate('/'); }}>Cancel</Button>
          <Button variant="success" onClick={save}>✅ Register Equipment</Button>
        </div>
      </div>
    </Modal>
  );
}
