export default function RBIMatrix({ assets }) {
 const getLikelihood = (asset) => {
    const remainingAboveTmin = asset.currentThick - asset.minRequired;
    
    // If already below T-Min, likelihood is extreme
    if (remainingAboveTmin < 0) return 5;
    if (remainingAboveTmin < 1) return 4;
    
    const cr = asset.corrosionRate || 0.1;
    if (cr > 0.3) return 5;
    if (cr > 0.2) return 4;
    if (cr > 0.1) return 3;
    if (cr > 0.05) return 2;
    return 1;
  };

 const getConsequence = (asset) => {
    const remainingAboveTmin = asset.currentThick - asset.minRequired;
    const percentAbove = asset.minRequired > 0 ? (remainingAboveTmin / asset.minRequired) * 100 : 0;
    
    // Consequence based on how close to T-Min + remaining life
    if (remainingAboveTmin < 0) return 5;  // Already below T-Min — EXTREME
    if (remainingAboveTmin < 1) return 5;  // Less than 1mm above — EXTREME
    if (remainingAboveTmin < 2) return 4;  // Less than 2mm above — HIGH
    if (remainingAboveTmin < 5) return 3;  // Less than 5mm above — MEDIUM
    
    const rem = asset.corrosionRate > 0 ? remainingAboveTmin / asset.corrosionRate : 100;
    if (rem < 1) return 5;
    if (rem < 3) return 4;
    if (rem < 5) return 3;
    if (rem < 10) return 2;
    return 1;
  };

  const getRiskLevel = (likelihood, consequence) => {
    const risk = likelihood * consequence;
    if (risk >= 20) return { level: 'Extreme', color: '#7f1d1d', bg: '#ef4444', text: 'text-red-200' };
    if (risk >= 12) return { level: 'High', color: '#7c2d12', bg: '#f97316', text: 'text-orange-200' };
    if (risk >= 6) return { level: 'Medium', color: '#713f12', bg: '#eab308', text: 'text-yellow-200' };
    return { level: 'Low', color: '#14532d', bg: '#22c55e', text: 'text-green-200' };
  };

  const assetRisks = assets.map(a => {
    const l = getLikelihood(a);
    const c = getConsequence(a);
    const risk = getRiskLevel(l, c);
    return { name: a.name, likelihood: l, consequence: c, risk, score: l * c };
  }).sort((a, b) => b.score - a.score);

  const likelihoodLabels = [1, 2, 3, 4, 5];
  const consequenceLabels = [5, 4, 3, 2, 1];

  return (
    <div className="card p-4">
      <h4 className="font-bold text-white text-sm mb-3">🎯 RBI Risk Matrix (API 580/581)</h4>

      {/* 5x5 Matrix */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 text-center mb-1">Likelihood →</div>
        <div className="grid grid-cols-6 gap-0.5">
          <div className="text-xs text-gray-500 text-center flex items-center justify-center">Consequence ↓</div>
          {likelihoodLabels.map(l => (
            <div key={'lh-' + l} className="text-xs text-gray-500 text-center py-1">{l}</div>
          ))}
          {consequenceLabels.map(c => (
            <div key={'row-' + c} className="contents">
              <div className="text-xs text-gray-500 text-center flex items-center justify-center">{c}</div>
              {likelihoodLabels.map(l => {
                const r = getRiskLevel(l, c);
                const count = assetRisks.filter(a => a.likelihood === l && a.consequence === c).length;
                const keyId = 'cell-' + c + '-' + l;
                return (
                  <div key={keyId} className="h-12 rounded flex flex-col items-center justify-center text-xs font-bold" style={{ background: r.bg + '40', border: '1px solid ' + r.bg }}>
                    {count > 0 ? <span className={r.text}>{count}</span> : <span className="text-gray-600">·</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-400 text-center mt-1">Likelihood →</div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs mb-4">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: '#22c55e' }}></span> Low</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: '#eab308' }}></span> Medium</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: '#f97316' }}></span> High</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: '#ef4444' }}></span> Extreme</span>
      </div>

      {/* Asset Risk Ranking */}
      <h4 className="font-bold text-white text-sm mb-2">Asset Risk Ranking</h4>
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {assetRisks.slice(0, 10).map((a, i) => (
          <div key={'risk-' + i} className="flex items-center justify-between bg-dark-700 rounded p-2 text-sm">
            <span className="text-gray-200 font-mono">{a.name}</span>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-gray-400">L:{a.likelihood} C:{a.consequence}</span>
              <span className="px-2 py-0.5 rounded-full font-bold" style={{ background: a.risk.color, color: '#fff' }}>{a.risk.level}</span>
              <span className="text-gray-500">Score: {a.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}