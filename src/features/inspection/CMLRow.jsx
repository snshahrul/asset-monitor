export default function CMLRow({ index, data, onChange }) {
  const rem = data.measured - data.tmin;
  const statusCls = rem < 0 ? 'text-red-400 font-bold' : rem < 2 ? 'text-amber-400 font-bold' : 'text-green-500';
  const statusText = rem < 0 ? 'FAIL' : rem < 2 ? 'WARN' : 'PASS';

  return (
    <tr className="border-b border-dark-600 hover:bg-dark-700/30 transition-colors">
      <td className="p-1 text-center text-gray-400 font-mono">{data.cml}</td>
      <td className="p-1 text-gray-300"><input value={data.location} onChange={e => onChange('location', e.target.value)} className="bg-transparent outline-none w-full text-2xs" /></td>
      <td className="p-1"><select value={data.orientation} onChange={e => onChange('orientation', e.target.value)} className="bg-transparent text-2xs text-gray-300 outline-none w-full"><option>Longitudinal</option><option>Circumferential</option><option>Radial</option></select></td>
      <td className="p-1"><input type="number" step="0.01" value={data.nominal} onChange={e => onChange('nominal', e.target.value)} className="bg-transparent outline-none w-12 text-right text-2xs text-gray-300" /></td>
      <td className="p-1"><input type="number" step="0.01" value={data.previous} onChange={e => onChange('previous', e.target.value)} className="bg-transparent outline-none w-12 text-right text-2xs text-gray-400" /></td>
      <td className="p-1"><input type="number" step="0.01" value={data.measured} onChange={e => onChange('measured', e.target.value)} className="bg-transparent outline-none w-12 text-right text-2xs font-semibold text-primary-900" /></td>
      <td className="p-1"><input type="number" step="0.01" value={data.tmin} onChange={e => onChange('tmin', e.target.value)} className="bg-transparent outline-none w-12 text-right text-2xs text-red-400" /></td>
      <td className={'p-1 text-right text-2xs ' + statusCls}>{rem.toFixed(2)}</td>
      <td className={'p-1 text-center text-2xs ' + statusCls}>{statusText}</td>
    </tr>
  );
}
