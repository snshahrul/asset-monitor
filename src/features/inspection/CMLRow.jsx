import { memo } from 'react';

const CMLRow = memo(function CMLRow({ index, data, onChange }) {
  const remaining = data.measured > 0 && data.tmin > 0 ? (data.measured - data.tmin).toFixed(2) : '—';
  const status = data.measured <= 0 ? '—' :
    data.measured <= data.tmin ? '⚠ BELOW' :
    (data.measured - data.tmin) < 2 ? '⚠ Near' : '✅ OK';
  const statusColor = data.measured <= 0 ? '#6b7280' :
    data.measured <= data.tmin ? '#ef4444' :
    (data.measured - data.tmin) < 2 ? '#f59e0b' : '#10b981';

  const inputClass = "w-20 px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-center text-sm text-gray-200 focus:border-primary-800 focus:ring-1 focus:ring-primary-800 outline-none";

  return (
    <tr className="border-b border-dark-600 hover:bg-dark-700/50">
      <td className="p-2 text-center font-bold text-gray-400 text-sm">{data.cml || index + 1}</td>
      <td className="p-1">
        <input type="text" value={data.location || ''} onChange={e => onChange('location', e.target.value)}
          className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-gray-200 focus:border-primary-800 outline-none" placeholder="e.g. Shell 0°" />
      </td>
      <td className="p-1">
        <select value={data.orientation || 'Longitudinal'} onChange={e => onChange('orientation', e.target.value)}
          className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-gray-200">
          <option>Longitudinal</option><option>Circumferential</option>
        </select>
      </td>
      <td className="p-1"><input type="number" value={data.nominal || ''} onChange={e => onChange('nominal', e.target.value)} className={inputClass} step="0.01" /></td>
      <td className="p-1"><input type="number" value={data.previous || ''} onChange={e => onChange('previous', e.target.value)} className={inputClass} step="0.01" /></td>
      <td className="p-1"><input type="number" value={data.measured || ''} onChange={e => onChange('measured', e.target.value)} className={inputClass + ' border-primary-800 font-bold'} step="0.01" /></td>
      <td className="p-1"><input type="number" value={data.tmin || ''} onChange={e => onChange('tmin', e.target.value)} className={inputClass + ' border-red-800 bg-red-900/20'} step="0.01" /></td>
      <td className="p-1 text-center"><span className="text-sm font-bold" style={{ color: statusColor }}>{remaining}</span></td>
      <td className="p-1 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ color: statusColor, background: statusColor + '20' }}>{status}</span></td>
    </tr>
  );
});

export default CMLRow;