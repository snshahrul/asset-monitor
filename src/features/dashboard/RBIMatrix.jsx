export default function RBIMatrix({ assets }) {
  const getLikelihood = (asset) => {
    const remainingAboveTmin = asset.currentThick - asset.minRequired;
    if (remainingAboveTmin < 0) return 5;
    if (remainingAboveTmin < 1) return 4;
    if (remainingAboveTmin < 2) return 3;
    const cr = asset.corrosionRate || 0.1;
    if (cr > 0.3) return 5;
    if (cr > 0.2) return 4;
    if (cr > 0.1) return 3;
    if (cr > 0.05) return 2;
    return 1;
  };

  const getConsequence = (asset) => {
    const remainingAboveTmin = asset.currentThick - asset.minRequired;
    if (remainingAboveTmin < 0) return 5;
    if (remainingAboveTmin < 1) return 5;
    if (remainingAboveTmin < 2) return 4;
    if (remainingAboveTmin < 5) return 3;
    const rem = asset.corrosionRate > 0 ? remainingAboveTmin / asset.corrosionRate : 100;
    if (rem < 2) return 5;
    if (rem < 5) return 4;
    if (rem < 10) return 3;
    if (rem < 20) return 2;
    if (asset.fluidService === 'Lethal') return Math.max(4, 2);
    return 1;
  };

  const getRiskLevel = (likelihood, consequence) => {
    const risk = likelihood * consequence;
    if (risk >= 20) return { level: 'Extreme', bg: '#dc2626', text: 'text-red-200' };
    if (risk >= 12) return { level: 'High', bg: '#ea580c', text: 'text-orange-200' };
    if (risk >= 6)  return { level: 'Medium', bg: '#ca8a04', text: 'text-yellow-200' };
    return { level: 'Low', bg: '#16a34a', text: 'text-green-200' };
  };

  const assetRisks = assets.map(a => {
    const l = getLikelihood(a);
    const c = getConsequence(a);
    const risk = getRiskLevel(l, c);
    const remainingAbove = a.currentThick - a.minRequired;
    const remLife = a.corrosionRate > 0 ? remainingAbove / a.corrosionRate : 100;
    return { name: a.name, likelihood: l, consequence: c, risk, score: l * c, remainingAbove, remLife, thickness: a.currentThick, tmin: a.minRequired, corrosionRate: a.corrosionRate, status: a.status };
  }).sort((a, b) => b.score - a.score);

  const likelihoodLabels = [1, 2, 3, 4, 5];
  const consequenceLabels = [5, 4, 3, 2, 1];
  const riskLevels = [
    { level: 'Low', bg: '#16a34a', range: '1-5' },
    { level: 'Medium', bg: '#ca8a04', range: '6-11' },
    { level: 'High', bg: '#ea580c', range: '12-19' },
    { level: 'Extreme', bg: '#dc2626', range: '20-25' },
  ];

  return (
    <div className="card">
      <div className="px-4 py-2.5 border-b border-dark-600">
        <span className="section-header">RBI Risk Matrix (API 580/581)</span>
      </div>
      <div className="p-3 space-y-3">
        {/* 5x5 Matrix */}
        <div>
          <div className="text-2xs text-gray-500 text-center mb-1">Likelihood →</div>
          <div className="grid grid-cols-6 gap-px">
            <div className="text-2xs text-gray-600 text-center flex items-center justify-center font-semibold">Cons ↓</div>
            {likelihoodLabels.map(l => <div key={'lh-'+l} className="text-2xs text-gray-500 text-center py-0.5">{l}</div>)}
            {consequenceLabels.map(c => (
              <div key={'row-'+c} className="contents">
                <div className="text-2xs text-gray-600 text-center flex items-center justify-center font-semibold">{c}</div>
                {likelihoodLabels.map(l => {
                  const r = getRiskLevel(l, c);
                  const count = assetRisks.filter(a => a.likelihood === l && a.consequence === c).length;
                  return (
                    <div key={'cell-'+c+'-'+l} className="h-8 rounded flex items-center justify-center text-xs font-bold" style={{ background: r.bg + '25', border: '1px solid ' + r.bg }}>
                      {count > 0 ? <span className={r.text}>{count}</span> : <span className="text-gray-700">·</span>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="text-2xs text-gray-500 text-center mt-1">Likelihood →</div>
        </div>

        {/* Legend */}
        <div className="flex gap-3 text-2xs">
          {riskLevels.map(r => (
            <span key={r.level} className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded" style={{ background: r.bg }}></span>
              {r.level} ({r.range})
            </span>
          ))}
        </div>

        {/* Asset Risk Ranking */}
        <div>
          <span className="section-header mb-2 block">Asset Risk Ranking</span>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {assetRisks.length === 0 ? (
              <p className="text-gray-500 text-xs py-3 text-center">No assets to assess</p>
            ) : (
              assetRisks.map((a, i) => (
                <div key={'risk-'+i} className="flex items-center justify-between bg-dark-700/50 rounded px-3 py-1.5 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-mono text-gray-200 truncate">{a.name}</span>
                    <span className={'text-2xs font-semibold px-1.5 py-0.5 rounded-full shrink-0 ' + (a.status === 'critical' ? 'bg-red-900/60 text-red-300' : a.status === 'warning' ? 'bg-amber-900/60 text-amber-300' : 'bg-emerald-900/60 text-emerald-300')}>{a.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-2xs shrink-0">
                    <span className="text-gray-500">L:{a.likelihood} C:{a.consequence}</span>
                    <span className="px-1.5 py-0.5 rounded-full font-bold text-white" style={{ background: a.risk.bg }}>{a.risk.level}</span>
                    <span className="text-gray-600">S:{a.score}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Risk Summary */}
        {assetRisks.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {riskLevels.map(r => (
              <div key={r.level} className="bg-dark-700/50 rounded p-2 text-center">
                <div className="font-bold text-sm leading-tight" style={{ color: r.bg }}>{assetRisks.filter(a => a.risk.level === r.level).length}</div>
                <div className="text-2xs text-gray-500">{r.level}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
