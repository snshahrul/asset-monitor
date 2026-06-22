export default function RBIMatrix({ assets }) {
  const getLikelihood = (asset) => {
    const remainingAboveTmin = asset.currentThick - asset.minRequired;
    
    // Thickness-based likelihood (how close to T-Min)
    if (remainingAboveTmin < 0) return 5;  // Already below T-Min — extreme
    if (remainingAboveTmin < 1) return 4;  // Less than 1mm above — high
    if (remainingAboveTmin < 2) return 3;  // Less than 2mm above — medium
    
    // Corrosion rate-based likelihood
    const cr = asset.corrosionRate || 0.1;
    if (cr > 0.3) return 5;   // Very high corrosion rate
    if (cr > 0.2) return 4;   // High corrosion rate
    if (cr > 0.1) return 3;   // Moderate corrosion rate
    if (cr > 0.05) return 2;  // Low corrosion rate
    return 1;                  // Very low corrosion rate
  };

  const getConsequence = (asset) => {
    const remainingAboveTmin = asset.currentThick - asset.minRequired;
    
    // Consequence based on how close to T-Min (how bad if it fails)
    if (remainingAboveTmin < 0) return 5;   // Already below — catastrophic
    if (remainingAboveTmin < 1) return 5;   // Almost at T-Min — extreme
    if (remainingAboveTmin < 2) return 4;   // Very close — high
    if (remainingAboveTmin < 5) return 3;   // Getting close — medium
    
    // Remaining life-based consequence
    const rem = asset.corrosionRate > 0 ? remainingAboveTmin / asset.corrosionRate : 100;
    if (rem < 2) return 5;    // Less than 2 years — extreme
    if (rem < 5) return 4;    // Less than 5 years — high
    if (rem < 10) return 3;   // Less than 10 years — medium
    if (rem < 20) return 2;   // Less than 20 years — low
    
    // Check fluid service (if lethal, raise consequence)
    if (asset.fluidService === 'Lethal') return Math.max(4, 2);
    
    return 1;                  // Very low consequence
  };

  const getRiskLevel = (likelihood, consequence) => {
    const risk = likelihood * consequence;
    if (risk >= 20) return { level: 'Extreme', color: '#7f1d1d', bg: '#ef4444', text: 'text-red-200' };
    if (risk >= 12) return { level: 'High', color: '#7c2d12', bg: '#f97316', text: 'text-orange-200' };
    if (risk >= 6)  return { level: 'Medium', color: '#713f12', bg: '#eab308', text: 'text-yellow-200' };
    return { level: 'Low', color: '#14532d', bg: '#22c55e', text: 'text-green-200' };
  };

  const assetRisks = assets.map(a => {
    const l = getLikelihood(a);
    const c = getConsequence(a);
    const risk = getRiskLevel(l, c);
    const remainingAbove = a.currentThick - a.minRequired;
    const remLife = a.corrosionRate > 0 ? remainingAbove / a.corrosionRate : 100;
    return { 
      name: a.name, 
      likelihood: l, 
      consequence: c, 
      risk, 
      score: l * c,
      remainingAbove,
      remLife,
      thickness: a.currentThick,
      tmin: a.minRequired,
      corrosionRate: a.corrosionRate,
      status: a.status
    };
  }).sort((a, b) => b.score - a.score);

  const likelihoodLabels = [1, 2, 3, 4, 5];
  const consequenceLabels = [5, 4, 3, 2, 1];

  return (
    <div className="card p-4">
      <h4 className="font-bold text-white text-sm mb-3">🎯 RBI Risk Matrix (API 580/581)</h4>

      {/* 5x5 Matrix */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 text-center mb-1">Likelihood (Corrosion Rate + Proximity to T-Min) →</div>
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
                  <div key={keyId} 
                    className="h-12 rounded flex flex-col items-center justify-center text-xs font-bold" 
                    style={{ background: r.bg + '40', border: '1px solid ' + r.bg }}>
                    {count > 0 ? <span className={r.text}>{count}</span> : <span className="text-gray-600">·</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-400 text-center mt-1">Likelihood (Corrosion Rate + Proximity to T-Min) →</div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs mb-4">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{background:'#22c55e'}}></span> Low (1-5)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{background:'#eab308'}}></span> Medium (6-11)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{background:'#f97316'}}></span> High (12-19)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{background:'#ef4444'}}></span> Extreme (20-25)</span>
      </div>

      {/* Asset Risk Ranking */}
      <h4 className="font-bold text-white text-sm mb-2">📋 Asset Risk Ranking</h4>
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {assetRisks.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">No assets to assess</p>
        ) : (
          assetRisks.map((a, i) => (
            <div key={'risk-' + i} className="flex items-center justify-between bg-dark-700 rounded p-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-200 font-mono text-xs">{a.name}</span>
                <span className={'text-xs px-1.5 py-0.5 rounded-full font-bold ' + (a.status === 'critical' ? 'bg-red-900 text-red-300' : a.status === 'warning' ? 'bg-amber-900 text-amber-300' : 'bg-green-900 text-green-300')}>{a.status}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">Above T-Min: <span className={a.remainingAbove < 2 ? 'text-red-400' : a.remainingAbove < 5 ? 'text-amber-400' : 'text-green-400'}>{a.remainingAbove.toFixed(1)}mm</span></span>
                <span className="text-gray-500">L:{a.likelihood} C:{a.consequence}</span>
                <span className="px-2 py-0.5 rounded-full font-bold text-white" style={{ background: a.risk.bg }}>{a.risk.level}</span>
                <span className="text-gray-500">Score: {a.score}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Risk Summary Stats */}
      {assetRisks.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-3 text-center text-xs">
          <div className="bg-dark-600 rounded p-2">
            <div className="text-red-400 font-bold text-lg">{assetRisks.filter(a => a.risk.level === 'Extreme').length}</div>
            <div className="text-gray-400">Extreme</div>
          </div>
          <div className="bg-dark-600 rounded p-2">
            <div className="text-orange-400 font-bold text-lg">{assetRisks.filter(a => a.risk.level === 'High').length}</div>
            <div className="text-gray-400">High</div>
          </div>
          <div className="bg-dark-600 rounded p-2">
            <div className="text-yellow-400 font-bold text-lg">{assetRisks.filter(a => a.risk.level === 'Medium').length}</div>
            <div className="text-gray-400">Medium</div>
          </div>
          <div className="bg-dark-600 rounded p-2">
            <div className="text-green-400 font-bold text-lg">{assetRisks.filter(a => a.risk.level === 'Low').length}</div>
            <div className="text-gray-400">Low</div>
          </div>
        </div>
      )}
    </div>
  );
}