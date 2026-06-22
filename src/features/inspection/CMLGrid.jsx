import { useState, useCallback, useEffect } from 'react';
import { Plus, LayoutGrid } from 'lucide-react';
import CMLRow from './CMLRow';
import Button from '../../components/ui/Button';

const TEMPLATES = {
  'Boiler': {
    label: 'Water Tube Boiler',
    sections: [
      { name: 'Top Drum — Shell Body', rows: [
        { location: 'Top Drum Shell — 0° (Top)', orientation: 'Longitudinal' },
        { location: 'Top Drum Shell — 90° (Right)', orientation: 'Longitudinal' },
        { location: 'Top Drum Shell — 180° (Bottom)', orientation: 'Circumferential' },
        { location: 'Top Drum Shell — 270° (Left)', orientation: 'Circumferential' },
      ]},
      { name: 'Top Drum — Dish End A', rows: [
        { location: 'Top Drum DE-A — Center', orientation: 'Radial' },
        { location: 'Top Drum DE-A — Knuckle 0°', orientation: 'Circumferential' },
        { location: 'Top Drum DE-A — Knuckle 180°', orientation: 'Circumferential' },
      ]},
      { name: 'Top Drum — Dish End B', rows: [
        { location: 'Top Drum DE-B — Center', orientation: 'Radial' },
        { location: 'Top Drum DE-B — Knuckle 0°', orientation: 'Circumferential' },
        { location: 'Top Drum DE-B — Knuckle 180°', orientation: 'Circumferential' },
      ]},
      { name: 'Bottom Drum — Shell Body', rows: [
        { location: 'Bottom Drum Shell — 0°', orientation: 'Longitudinal' },
        { location: 'Bottom Drum Shell — 90°', orientation: 'Longitudinal' },
        { location: 'Bottom Drum Shell — 180°', orientation: 'Circumferential' },
        { location: 'Bottom Drum Shell — 270°', orientation: 'Circumferential' },
      ]},
      { name: 'Bottom Drum — Dish End A', rows: [
        { location: 'Bottom Drum DE-A — Center', orientation: 'Radial' },
        { location: 'Bottom Drum DE-A — Knuckle 0°', orientation: 'Circumferential' },
        { location: 'Bottom Drum DE-A — Knuckle 180°', orientation: 'Circumferential' },
      ]},
      { name: 'Bottom Drum — Dish End B', rows: [
        { location: 'Bottom Drum DE-B — Center', orientation: 'Radial' },
        { location: 'Bottom Drum DE-B — Knuckle 0°', orientation: 'Circumferential' },
        { location: 'Bottom Drum DE-B — Knuckle 180°', orientation: 'Circumferential' },
      ]},
    ]
  },
  'Pressure Vessel': {
    label: 'Pressure Vessel',
    sections: [
      { name: 'Shell Section', rows: [
        { location: 'Shell — 0° (Top)', orientation: 'Longitudinal' },
        { location: 'Shell — 90° (Right)', orientation: 'Longitudinal' },
        { location: 'Shell — 180° (Bottom)', orientation: 'Circumferential' },
        { location: 'Shell — 270° (Left)', orientation: 'Circumferential' },
      ]},
      { name: 'Dish End A', rows: [
        { location: 'Dish End A — Center', orientation: 'Radial' },
        { location: 'Dish End A — Knuckle 0°', orientation: 'Circumferential' },
        { location: 'Dish End A — Knuckle 90°', orientation: 'Circumferential' },
        { location: 'Dish End A — Knuckle 180°', orientation: 'Circumferential' },
        { location: 'Dish End A — Knuckle 270°', orientation: 'Circumferential' },
      ]},
      { name: 'Dish End B', rows: [
        { location: 'Dish End B — Center', orientation: 'Radial' },
        { location: 'Dish End B — Knuckle 0°', orientation: 'Circumferential' },
        { location: 'Dish End B — Knuckle 90°', orientation: 'Circumferential' },
        { location: 'Dish End B — Knuckle 180°', orientation: 'Circumferential' },
        { location: 'Dish End B — Knuckle 270°', orientation: 'Circumferential' },
      ]},
    ]
  },
  'Storage Tank': {
    label: 'Storage Tank',
    sections: [
      { name: 'Shell Course 1 (Bottom)', rows: [
        { location: 'Course 1 — 0°', orientation: 'Longitudinal' },
        { location: 'Course 1 — 90°', orientation: 'Longitudinal' },
        { location: 'Course 1 — 180°', orientation: 'Circumferential' },
        { location: 'Course 1 — 270°', orientation: 'Circumferential' },
      ]},
      { name: 'Shell Course 2', rows: [
        { location: 'Course 2 — 0°', orientation: 'Longitudinal' },
        { location: 'Course 2 — 90°', orientation: 'Longitudinal' },
        { location: 'Course 2 — 180°', orientation: 'Circumferential' },
        { location: 'Course 2 — 270°', orientation: 'Circumferential' },
      ]},
      { name: 'Shell Course 3 (Top)', rows: [
        { location: 'Course 3 — 0°', orientation: 'Longitudinal' },
        { location: 'Course 3 — 90°', orientation: 'Longitudinal' },
        { location: 'Course 3 — 180°', orientation: 'Circumferential' },
        { location: 'Course 3 — 270°', orientation: 'Circumferential' },
      ]},
    ]
  },
  'Heat Exchanger': {
    label: 'Heat Exchanger',
    sections: [
      { name: 'Shell Body', rows: [
        { location: 'Shell — 0°', orientation: 'Longitudinal' },
        { location: 'Shell — 90°', orientation: 'Longitudinal' },
        { location: 'Shell — 180°', orientation: 'Circumferential' },
        { location: 'Shell — 270°', orientation: 'Circumferential' },
      ]},
      { name: 'Channel Head A', rows: [
        { location: 'Channel Head A — Center', orientation: 'Radial' },
        { location: 'Channel Head A — Knuckle 0°', orientation: 'Circumferential' },
        { location: 'Channel Head A — Knuckle 180°', orientation: 'Circumferential' },
      ]},
      { name: 'Channel Head B', rows: [
        { location: 'Channel Head B — Center', orientation: 'Radial' },
        { location: 'Channel Head B — Knuckle 0°', orientation: 'Circumferential' },
        { location: 'Channel Head B — Knuckle 180°', orientation: 'Circumferential' },
      ]},
    ]
  },
  'Piping': {
    label: 'Piping System',
    sections: [
      { name: 'Pipe Run', rows: [
        { location: 'Pipe — 0° (Top)', orientation: 'Longitudinal' },
        { location: 'Pipe — 90° (Right)', orientation: 'Circumferential' },
        { location: 'Pipe — 180° (Bottom)', orientation: 'Circumferential' },
        { location: 'Pipe — 270° (Left)', orientation: 'Circumferential' },
      ]},
    ]
  },
};

export default function CMLGrid({ asset, initialRows, onDataChange }) {
  const equipmentType = asset?.type || 'Pressure Vessel';
  const template = TEMPLATES[equipmentType] || TEMPLATES['Pressure Vessel'];

  const [rows, setRows] = useState(() => {
    if (initialRows?.length) return initialRows;
    let cmlNum = 0;
    return template.sections.flatMap(section =>
      section.rows.map(r => {
        cmlNum++;
        return {
          cml: cmlNum,
          location: r.location,
          orientation: r.orientation,
          nominal: asset?.nominal || 25,
          previous: +(asset?.currentThick || 24).toFixed(2),
          measured: +((asset?.currentThick || 24) - 0.2 - Math.random() * 0.5).toFixed(2),
          tmin: asset?.minRequired || 18,
          section: section.name
        };
      })
    );
  });

  const updateRow = useCallback((index, field, value) => {
    setRows(prev => prev.map((row, i) => {
      if (i !== index) return row;
      const parsed = (field === 'location' || field === 'orientation') ? value : (parseFloat(value) || 0);
      return { ...row, [field]: parsed };
    }));
  }, []);

  const addRow = () => {
    const last = rows[rows.length - 1] || {};
    setRows(prev => [...prev, {
      cml: prev.length + 1, location: 'Additional CML-' + (prev.length + 1), orientation: 'Longitudinal',
      nominal: last.nominal || asset?.nominal || 25, previous: last.measured || asset?.currentThick || 24,
      measured: (last.measured || asset?.currentThick || 24) - 0.3, tmin: last.tmin || asset?.minRequired || 18,
      section: 'Additional'
    }]);
  };

  const measured = rows.map(r => r.measured).filter(v => v > 0);
  const avgThick = measured.length ? (measured.reduce((s, v) => s + v, 0) / measured.length).toFixed(2) : '—';
  const minThick = measured.length ? Math.min(...measured).toFixed(2) : '—';
  const minRemaining = measured.length ? (Math.min(...measured) - (asset?.minRequired || 18)).toFixed(2) : '—';

  useEffect(() => {
    if (onDataChange) onDataChange({ rows, avgThickness: parseFloat(avgThick), minThickness: parseFloat(minThick) });
  }, [rows]);

  const sections = {};
  rows.forEach(row => { const sec = row.section || 'General'; if (!sections[sec]) sections[sec] = []; sections[sec].push(row); });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 bg-dark-700/50 rounded-lg p-3">
        <LayoutGrid size={16} className="text-primary-900" />
        <span className="text-white font-bold text-sm">{template.label} — {rows.length} CML points</span>
      </div>

      {Object.entries(sections).map(([sectionName, sectionRows]) => (
        <div key={sectionName} className="border border-dark-600 rounded-lg overflow-hidden">
          <div className="bg-dark-700 px-4 py-2 font-bold text-sm text-primary-900">📏 {sectionName} ({sectionRows.length} points)</div>
          <table className="w-full text-xs">
            <thead className="bg-dark-700/50 text-gray-400">
              <tr><th className="p-1.5 text-center w-10">#</th><th className="p-1.5 text-left">Location</th><th className="p-1.5 w-16">Orient</th><th className="p-1.5 w-16">Nominal</th><th className="p-1.5 w-16">Previous</th><th className="p-1.5 w-16 text-primary-900">Measured</th><th className="p-1.5 w-16 text-red-400">T-Min</th><th className="p-1.5 w-16">Remain</th><th className="p-1.5 w-20">Status</th></tr>
            </thead>
            <tbody>
              {sectionRows.map(r => { const gi = rows.findIndex(row => row.cml === r.cml); return <CMLRow key={r.cml} index={gi} data={r} onChange={(f, v) => updateRow(gi, f, v)} />; })}
            </tbody>
          </table>
        </div>
      ))}

      <div className="flex gap-2"><Button variant="outline" size="xs" icon={Plus} onClick={addRow}>Add CML Point</Button></div>

      <div className="grid grid-cols-4 gap-3 bg-dark-700/50 rounded-lg p-4 text-center">
        <div><div className="text-xs text-gray-400">Total Points</div><div className="text-lg font-bold text-white">{rows.length}</div></div>
        <div><div className="text-xs text-gray-400">Avg Thickness</div><div className="text-lg font-bold text-primary-900">{avgThick} mm</div></div>
        <div><div className="text-xs text-gray-400">Min Thickness</div><div className="text-lg font-bold text-red-400">{minThick} mm</div></div>
        <div><div className="text-xs text-gray-400">Min Above T-Min</div><div className="text-lg font-bold" style={{color: parseFloat(minRemaining) < 0 ? '#ef4444' : '#22c55e'}}>{minRemaining} mm</div></div>
      </div>
    </div>
  );
}
