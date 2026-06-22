import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAssetStore } from '../store/useAssetStore';
import Badge from '../components/ui/Badge';
import ThicknessChart from '../features/trend/ThicknessChart';
import DocumentUpload from '../features/documents/DocumentUpload';
import { FileText } from 'lucide-react';
import { generateInspectionPDF, generateRepairPDF, generateAlterationPDF, downloadPDF } from '../utils/pdfGenerator';
import RiskAssessment from '../features/risk/RiskAssessment';

export default function EquipmentDetail() {
  const { id } = useParams();
  const assetId = id ? parseInt(id) : useAssetStore(s => s.selectedAssetId);
  const asset = useAssetStore(s => s.assets.find(a => a.id === assetId));
  const folder = useAssetStore(s => s.equipmentFolders[assetId] || { inspections: [], repairs: [], alterations: [], thicknessHistory: [], documents: [] });
  const [activeTab, setActiveTab] = useState('inspections');

  if (!asset) return <div className="text-center py-16 text-gray-500">Equipment not found</div>;

  const remaining = asset.corrosionRate > 0 ? ((asset.currentThick - asset.minRequired) / asset.corrosionRate).toFixed(1) : 'N/A';
  const ratio = Math.min(100, Math.max(0, (asset.currentThick / asset.nominal) * 100));
  const statusVariant = asset.status === 'critical' ? 'critical' : asset.status === 'warning' ? 'warning' : 'success';

  const handleInspectionPDF = (insp) => {
    const { html, reportNumber } = generateInspectionPDF(asset, insp);
    downloadPDF(html, reportNumber);
  };

  const handleRepairPDF = (repair) => {
    const { html, reportNumber } = generateRepairPDF(asset, repair);
    downloadPDF(html, reportNumber);
  };

  const handleAlterationPDF = (alteration) => {
    const { html, reportNumber } = generateAlterationPDF(asset, alteration);
    downloadPDF(html, reportNumber);
  };

  const tabs = [
    { key: 'inspections', label: 'Inspections', count: folder.inspections.length },
    { key: 'repairs', label: 'Repairs', count: folder.repairs.length },
    { key: 'alterations', label: 'Alterations', count: folder.alterations.length },
    { key: 'risk', label: 'Risk Assessment', count: null },
    { key: 'trend', label: 'Trend', count: null },
    { key: 'documents', label: 'Documents', count: (folder.documents || []).length },
  ];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-dark-800 to-dark-700 px-5 py-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white">{asset.name}</h2>
            <Badge variant={statusVariant} size="xs">{asset.status.toUpperCase()}</Badge>
          </div>
          <p className="text-2xs text-gray-500 mt-1">{asset.type} | {asset.location || 'No location'} | Code: {asset.designCode || 'N/A'}</p>
        </div>
        {/* Gauges */}
        <div className="grid grid-cols-4 divide-x divide-dark-600">
          <div className="p-3 text-center">
            <div className="text-xs font-bold text-primary-900">{asset.sensors.temperature.toFixed(1)}°C</div>
            <div className="text-2xs text-gray-500">Temperature</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-xs font-bold text-primary-900">{asset.sensors.pressure.toFixed(2)} bar</div>
            <div className="text-2xs text-gray-500">Pressure</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-xs font-bold text-primary-900">{asset.currentThick.toFixed(2)} mm</div>
            <div className="text-2xs text-gray-500">Avg Thickness</div>
          </div>
          <div className="p-3 text-center">
            <div className={'text-xs font-bold ' + (parseFloat(remaining) < 5 ? 'text-red-400' : 'text-primary-900')}>{remaining} yr</div>
            <div className="text-2xs text-gray-500">Remaining Life</div>
          </div>
        </div>
        {/* Thickness Bar */}
        <div className="px-5 pb-3">
          <div className="flex justify-between text-2xs mb-1">
            <span className="text-gray-500">Wall Remaining: {ratio.toFixed(0)}%</span>
            <span className="text-gray-600">Nom: {asset.nominal}mm | T-Min: {asset.minRequired}mm | Curr: {asset.currentThick.toFixed(2)}mm</span>
          </div>
          <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: ratio + '%', background: ratio < 30 ? '#ef4444' : ratio < 60 ? '#f59e0b' : '#10b981' }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-dark-600 gap-0">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={'px-4 py-2 text-xs font-semibold transition-colors relative ' + (activeTab === t.key ? 'text-primary-900' : 'text-gray-500 hover:text-gray-300')}>
            {t.label}{t.count !== null ? ` (${t.count})` : ''}
            {activeTab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-800 rounded-full" />}
          </button>
        ))}
      </div>

      {/* ===== INSPECTIONS TAB ===== */}
      {activeTab === 'inspections' && (
        folder.inspections.length === 0 ? (
          <p className="text-gray-500 text-xs py-8 text-center">No inspection records yet</p>
        ) : (
          <div className="space-y-2">
            {folder.inspections.sort((a, b) => new Date(b.date) - new Date(a.date)).map(insp => (
              <div key={insp.id} className="card px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-200">{insp.date}</span>
                      <Badge variant={insp.condition === 'Critical' ? 'critical' : insp.condition === 'Poor' ? 'warning' : 'success'} size="xs">{insp.condition || 'N/A'}</Badge>
                      <span className="text-2xs text-gray-500">{insp.type || 'Inspection'}</span>
                    </div>
                    <div className="text-2xs text-gray-500 mt-0.5">Inspector: {insp.inspector || 'N/A'} | NDT: {insp.ndtMethod || 'N/A'}</div>
                  </div>
                </div>

                {insp.gridData?.rows?.length > 0 && (
                  <div className="bg-dark-700/30 rounded px-3 py-2 mt-2">
                    <span className="text-2xs text-gray-400 font-semibold">CML Grid ({insp.gridData.rows.length} pts): </span>
                    <span className="text-2xs text-gray-500">
                      Min: <span className="text-red-400 font-semibold">{Math.min(...insp.gridData.rows.map(r => r.measured)).toFixed(2)}mm</span> |
                      Avg: <span className="text-primary-900 font-semibold">{(insp.gridData.rows.reduce((s, r) => s + r.measured, 0) / insp.gridData.rows.length).toFixed(2)}mm</span>
                    </span>
                    {insp.gridData.rows.some(r => r.measured <= (asset.minRequired || 0)) && (
                      <span className="ml-2 text-2xs bg-red-900/60 text-red-300 px-1.5 py-0.5 rounded-full font-semibold">BELOW T-MIN</span>
                    )}
                  </div>
                )}

                <div className="text-2xs text-gray-500 mt-2"><span className="text-gray-400">Findings:</span> {insp.findings || 'None'}</div>
                <div className="text-2xs text-gray-500"><span className="text-gray-400">Recs:</span> {insp.recommendations || 'None'}</div>

                <div className="grid grid-cols-4 gap-2 mt-2">
                  {[
                    { label: 'Avg.', value: insp.avgThickness?.toFixed(2) || '—', unit: 'mm', cls: 'text-primary-900' },
                    { label: 'Min', value: insp.minThickness?.toFixed(2) || '—', unit: 'mm', cls: 'text-red-400' },
                    { label: 'Rem. Life', value: insp.remainingLife || '—', unit: '', cls: 'text-primary-900' },
                    { label: 'Next Insp.', value: insp.nextInspectionDate || '—', unit: '', cls: 'text-gray-200' },
                  ].map((f, i) => (
                    <div key={i} className="bg-dark-700/30 rounded px-2 py-1 text-center">
                      <div className="text-2xs text-gray-500">{f.label}</div>
                      <div className={'text-xs font-bold ' + f.cls}>{f.value} {f.unit}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-2 pt-2 border-t border-dark-600">
                  <button onClick={() => handleInspectionPDF(insp)} className="text-primary-900 hover:text-primary-700 text-2xs flex items-center gap-1 font-semibold transition-colors">
                    <FileText size={12} /> PDF Report
                  </button>
                  <button onClick={() => { if (confirm('Delete this inspection?')) { const store = useAssetStore.getState(); store.deleteRecord(assetId, 'inspections', insp.id); window.location.reload(); } }} className="text-red-500 hover:text-red-400 text-2xs ml-auto">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ===== REPAIRS TAB ===== */}
      {activeTab === 'repairs' && (
        folder.repairs.length === 0 ? (
          <p className="text-gray-500 text-xs py-8 text-center">No repair records yet</p>
        ) : (
          <div className="space-y-2">
            {folder.repairs.sort((a, b) => new Date(b.date) - new Date(a.date)).map(r => (
              <div key={r.id} className="card px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-200">{r.date}</span>
                      <span className="text-2xs text-gray-500">{r.type}</span>
                    </div>
                    <div className="text-2xs text-gray-500 mt-0.5">Technician: {r.technician || 'N/A'} | WPS: {r.wps || 'N/A'}</div>
                  </div>
                </div>
                <div className="text-2xs text-gray-500 mt-2 space-y-0.5">
                  <div><span className="text-gray-400">Location:</span> {r.location || 'N/A'} | <span className="text-gray-400">Method:</span> {r.method || 'N/A'}</div>
                  <div><span className="text-gray-400">Scope:</span> {r.scope || 'N/A'}</div>
                  <div><span className="text-gray-400">NDT After:</span> {r.ndt || 'None'} — {r.ndtResult || 'N/A'}{r.thicknessAfter ? ` | Thickness: ${r.thicknessAfter}mm` : ''}</div>
                  <div><span className="text-gray-400">Sign-off:</span> {r.signoff || 'N/A'}</div>
                </div>
                <div className="flex gap-2 mt-2 pt-2 border-t border-dark-600">
                  <button onClick={() => handleRepairPDF(r)} className="text-primary-900 hover:text-primary-700 text-2xs flex items-center gap-1 font-semibold transition-colors">
                    <FileText size={12} /> PDF Report
                  </button>
                  <button onClick={() => { if (confirm('Delete this repair record?')) { const store = useAssetStore.getState(); store.deleteRecord(assetId, 'repairs', r.id); window.location.reload(); } }} className="text-red-500 hover:text-red-400 text-2xs ml-auto">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ===== ALTERATIONS TAB ===== */}
      {activeTab === 'alterations' && (
        folder.alterations.length === 0 ? (
          <p className="text-gray-500 text-xs py-8 text-center">No alteration records yet</p>
        ) : (
          <div className="space-y-2">
            {folder.alterations.sort((a, b) => new Date(b.date) - new Date(a.date)).map(alt => (
              <div key={alt.id} className="card px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-200">{alt.date}</span>
                      <span className="text-2xs text-gray-500">{alt.type}</span>
                    </div>
                    <div className="text-2xs text-gray-500 mt-0.5">Engineer: {alt.engineer || 'N/A'} | Code: {alt.code || 'N/A'}</div>
                  </div>
                </div>
                <div className="text-2xs text-gray-500 mt-2 space-y-0.5">
                  <div><span className="text-gray-400">Drawing:</span> {alt.drawing || 'N/A'}</div>
                  <div><span className="text-gray-400">Description:</span> {alt.description || 'N/A'}</div>
                  <div><span className="text-gray-400">Impact:</span> {alt.impact || 'N/A'} | <span className="text-gray-400">Hydro:</span> {alt.hydro || 'N/A'}</div>
                  <div><span className="text-gray-400">NDT:</span> {alt.ndt || 'N/A'} ({alt.ndtResult || 'N/A'}) | <span className="text-gray-400">AI:</span> {alt.ai || 'N/A'} | <span className="text-gray-400">Reg:</span> {alt.regulatory || 'N/A'}</div>
                </div>
                <div className="flex gap-2 mt-2 pt-2 border-t border-dark-600">
                  <button onClick={() => handleAlterationPDF(alt)} className="text-primary-900 hover:text-primary-700 text-2xs flex items-center gap-1 font-semibold transition-colors">
                    <FileText size={12} /> PDF Report
                  </button>
                  <button onClick={() => { if (confirm('Delete this alteration record?')) { const store = useAssetStore.getState(); store.deleteRecord(assetId, 'alterations', alt.id); window.location.reload(); } }} className="text-red-500 hover:text-red-400 text-2xs ml-auto">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ===== RISK ASSESSMENT TAB ===== */}
      {activeTab === 'risk' && (
        <RiskAssessment assetId={asset.id} />
      )}

      {/* ===== TREND TAB ===== */}
      {activeTab === 'trend' && (
        <div className="card p-4">
          <ThicknessChart asset={asset} thicknessHistory={folder.thicknessHistory || []} />
        </div>
      )}

      {/* ===== DOCUMENTS TAB ===== */}
      {activeTab === 'documents' && (
        <DocumentUpload assetId={asset.id} />
      )}
    </div>
  );
}
