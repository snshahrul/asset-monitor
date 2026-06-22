import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAssetStore } from '../store/useAssetStore';
import Badge from '../components/ui/Badge';
import ThicknessChart from '../features/trend/ThicknessChart';
import DocumentUpload from '../features/documents/DocumentUpload';
import { FileText } from 'lucide-react';
import { generateInspectionPDF, generateRepairPDF, generateAlterationPDF, downloadPDF } from '../utils/pdfGenerator';

export default function EquipmentDetail() {
  const { id } = useParams();
  const assetId = id ? parseInt(id) : useAssetStore(s => s.selectedAssetId);
  const asset = useAssetStore(s => s.assets.find(a => a.id === assetId));
  const folder = useAssetStore(s => s.equipmentFolders[assetId] || { inspections: [], repairs: [], alterations: [], thicknessHistory: [], documents: [] });
  const [activeTab, setActiveTab] = useState('inspections');

  if (!asset) return <div className="text-center py-20 text-gray-400">Equipment not found</div>;

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

  return (
    <div className="space-y-4 text-left">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark-800 to-dark-700 border border-dark-600 text-white p-6 rounded-xl">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{asset.name}</h2>
          <Badge variant={statusVariant}>{asset.status.toUpperCase()}</Badge>
        </div>
        <p className="text-sm text-gray-400 mt-1">{asset.type} | {asset.location || 'No location'} | Code: {asset.designCode || 'N/A'}</p>
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-4 gap-3">
        <div className="card p-4 text-center"><div className="text-xl font-bold text-primary-900">{asset.sensors.temperature.toFixed(1)}°C</div><div className="text-xs text-gray-400">Temperature</div></div>
        <div className="card p-4 text-center"><div className="text-xl font-bold text-primary-900">{asset.sensors.pressure.toFixed(2)} bar</div><div className="text-xs text-gray-400">Pressure</div></div>
        <div className="card p-4 text-center"><div className="text-xl font-bold text-primary-900">{asset.currentThick.toFixed(2)} mm</div><div className="text-xs text-gray-400">Avg Thickness</div></div>
        <div className="card p-4 text-center"><div className={'text-xl font-bold ' + (parseFloat(remaining) < 5 ? 'text-red-400' : 'text-primary-900')}>{remaining} yr</div><div className="text-xs text-gray-400">Remaining Life</div></div>
      </div>

      {/* Thickness Bar */}
      <div className="card p-4">
        <div className="flex justify-between text-sm mb-1"><span className="text-gray-300">Wall Remaining: {ratio.toFixed(0)}%</span><span className="text-gray-400">Nominal: {asset.nominal}mm | T-Min: {asset.minRequired}mm | Current: {asset.currentThick.toFixed(2)}mm</span></div>
        <div className="h-4 bg-dark-600 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: ratio + '%', background: ratio < 30 ? '#ef4444' : ratio < 60 ? '#f59e0b' : '#10b981' }} /></div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-dark-600 flex-wrap">
        <button onClick={() => setActiveTab('inspections')} className={'px-5 py-3 font-semibold text-sm ' + (activeTab === 'inspections' ? 'text-primary-900 border-b-2 border-primary-800' : 'text-gray-500 hover:text-gray-300')}>📝 Inspections ({folder.inspections.length})</button>
        <button onClick={() => setActiveTab('repairs')} className={'px-5 py-3 font-semibold text-sm ' + (activeTab === 'repairs' ? 'text-primary-900 border-b-2 border-primary-800' : 'text-gray-500 hover:text-gray-300')}>🔧 Repairs ({folder.repairs.length})</button>
        <button onClick={() => setActiveTab('alterations')} className={'px-5 py-3 font-semibold text-sm ' + (activeTab === 'alterations' ? 'text-primary-900 border-b-2 border-primary-800' : 'text-gray-500 hover:text-gray-300')}>📐 Alterations ({folder.alterations.length})</button>
        <button onClick={() => setActiveTab('trend')} className={'px-5 py-3 font-semibold text-sm ' + (activeTab === 'trend' ? 'text-primary-900 border-b-2 border-primary-800' : 'text-gray-500 hover:text-gray-300')}>📈 Trend</button>
        <button onClick={() => setActiveTab('documents')} className={'px-5 py-3 font-semibold text-sm ' + (activeTab === 'documents' ? 'text-primary-900 border-b-2 border-primary-800' : 'text-gray-500 hover:text-gray-300')}>📄 Documents ({(folder.documents || []).length})</button>
      </div>

      {/* ===== INSPECTIONS TAB ===== */}
      {activeTab === 'inspections' && (
        folder.inspections.length === 0 ? (
          <p className="text-gray-500 py-10 text-center">No inspection records yet</p>
        ) : (
          <div className="space-y-3">
            {folder.inspections.sort((a, b) => new Date(b.date) - new Date(a.date)).map(insp => (
              <div key={insp.id} className="card p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <strong className="text-gray-200">📝 {insp.date} — {insp.type || 'Inspection'}</strong>
                    <div className="text-xs text-gray-400 mt-1">Inspector: {insp.inspector || 'N/A'} | NDT: {insp.ndtMethod || 'N/A'} | Equipment: {insp.equipment || 'N/A'}</div>
                  </div>
                  <Badge variant={insp.condition === 'Critical' ? 'critical' : insp.condition === 'Poor' ? 'warning' : 'success'}>{insp.condition || 'N/A'}</Badge>
                </div>

                {/* CML Grid Summary */}
                {insp.gridData?.rows?.length > 0 && (
                  <div className="bg-dark-700/50 rounded-lg p-3 mt-3">
                    <strong className="text-xs text-gray-300">📏 CML Grid ({insp.gridData.rows.length} points):</strong>
                    <span className="text-xs text-gray-400 ml-2">
                      Min: <span className="text-red-400 font-bold">{Math.min(...insp.gridData.rows.map(r => r.measured)).toFixed(2)}mm</span> | 
                      Avg: <span className="text-primary-900 font-bold">{(insp.gridData.rows.reduce((s, r) => s + r.measured, 0) / insp.gridData.rows.length).toFixed(2)}mm</span>
                    </span>
                    {insp.gridData.rows.some(r => r.measured <= (asset.minRequired || 0)) && (
                      <span className="ml-2 px-2 py-0.5 bg-red-900 text-red-300 text-xs rounded-full font-bold">⚠ BELOW T-MIN</span>
                    )}
                  </div>
                )}

                {/* NDT Details for non-UT inspections */}
                {insp.ndtDetails && Object.keys(insp.ndtDetails).length > 0 && (
                  <div className="bg-dark-700/50 rounded-lg p-3 mt-2">
                    <strong className="text-xs text-gray-300">{insp.ndtMethod} Details:</strong>
                    <div className="text-xs text-gray-400 mt-1">
                      {Object.entries(insp.ndtDetails).map(([key, val]) => (
                        <span key={key} className="mr-3">{key}: <span className="text-white">{val}</span></span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-300 mt-2"><strong>Findings:</strong> {insp.findings || 'None'}</div>
                <div className="text-xs text-gray-300"><strong>Recommendations:</strong> {insp.recommendations || 'None'}</div>
                
                {/* Calculated Values */}
                <div className="grid grid-cols-4 gap-2 mt-3 text-center text-xs">
                  <div className="bg-dark-700 rounded p-2"><div className="text-gray-400">Avg</div><div className="text-white font-bold">{insp.avgThickness?.toFixed(2) || '—'} mm</div></div>
                  <div className="bg-dark-700 rounded p-2"><div className="text-gray-400">Min</div><div className="text-red-400 font-bold">{insp.minThickness?.toFixed(2) || '—'} mm</div></div>
                  <div className="bg-dark-700 rounded p-2"><div className="text-gray-400">Rem. Life</div><div className="text-primary-900 font-bold">{insp.remainingLife || '—'}</div></div>
                  <div className="bg-dark-700 rounded p-2"><div className="text-gray-400">Next Insp.</div><div className="text-white font-bold">{insp.nextInspectionDate || '—'}</div></div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-3 pt-2 border-t border-dark-600">
                  <button onClick={() => handleInspectionPDF(insp)} className="text-primary-900 hover:text-primary-700 text-xs flex items-center gap-1 font-semibold">
                    <FileText size={14} /> Download PDF Report
                  </button>
                  <button onClick={() => { if (confirm('Delete this inspection?')) { const store = useAssetStore.getState(); store.deleteRecord(assetId, 'inspections', insp.id); window.location.reload(); } }} className="text-red-400 hover:text-red-300 text-xs">
                    🗑️ Delete
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
          <p className="text-gray-500 py-10 text-center">No repair records yet</p>
        ) : (
          <div className="space-y-3">
            {folder.repairs.sort((a, b) => new Date(b.date) - new Date(a.date)).map(r => (
              <div key={r.id} className="card p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <strong className="text-gray-200">🔧 {r.date} — {r.type}</strong>
                    <div className="text-xs text-gray-400 mt-1">Technician: {r.technician || 'N/A'} | Method: {r.method || 'N/A'} | WPS: {r.wps || 'N/A'}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-300 mt-2"><strong>Location:</strong> {r.location || 'N/A'}</div>
                <div className="text-xs text-gray-300"><strong>Scope:</strong> {r.scope || 'N/A'}</div>
                <div className="text-xs text-gray-300"><strong>NDT After:</strong> {r.ndt || 'None'} — {r.ndtResult || 'N/A'}</div>
                {r.thicknessAfter && <div className="text-xs text-green-400"><strong>Thickness After:</strong> {r.thicknessAfter} mm</div>}
                <div className="text-xs text-gray-300"><strong>Sign-off:</strong> {r.signoff || 'N/A'}</div>

                <div className="flex gap-3 mt-3 pt-2 border-t border-dark-600">
                  <button onClick={() => handleRepairPDF(r)} className="text-primary-900 hover:text-primary-700 text-xs flex items-center gap-1 font-semibold">
                    <FileText size={14} /> Download PDF Report
                  </button>
                  <button onClick={() => { if (confirm('Delete this repair record?')) { const store = useAssetStore.getState(); store.deleteRecord(assetId, 'repairs', r.id); window.location.reload(); } }} className="text-red-400 hover:text-red-300 text-xs">
                    🗑️ Delete
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
          <p className="text-gray-500 py-10 text-center">No alteration records yet</p>
        ) : (
          <div className="space-y-3">
            {folder.alterations.sort((a, b) => new Date(b.date) - new Date(a.date)).map(alt => (
              <div key={alt.id} className="card p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <strong className="text-gray-200">📐 {alt.date} — {alt.type}</strong>
                    <div className="text-xs text-gray-400 mt-1">Engineer: {alt.engineer || 'N/A'} | Code: {alt.code || 'N/A'} | Drawing: {alt.drawing || 'N/A'}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-300 mt-2"><strong>Description:</strong> {alt.description || 'N/A'}</div>
                <div className="text-xs text-gray-300"><strong>Impact:</strong> {alt.impact || 'N/A'}</div>
                <div className="text-xs text-gray-300"><strong>Hydrotest:</strong> {alt.hydro || 'N/A'} | <strong>NDT:</strong> {alt.ndt || 'N/A'} ({alt.ndtResult || 'N/A'})</div>
                <div className="text-xs text-gray-300"><strong>AI Sign-off:</strong> {alt.ai || 'N/A'} | <strong>Regulatory:</strong> {alt.regulatory || 'N/A'}</div>

                <div className="flex gap-3 mt-3 pt-2 border-t border-dark-600">
                  <button onClick={() => handleAlterationPDF(alt)} className="text-primary-900 hover:text-primary-700 text-xs flex items-center gap-1 font-semibold">
                    <FileText size={14} /> Download PDF Report
                  </button>
                  <button onClick={() => { if (confirm('Delete this alteration record?')) { const store = useAssetStore.getState(); store.deleteRecord(assetId, 'alterations', alt.id); window.location.reload(); } }} className="text-red-400 hover:text-red-300 text-xs">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ===== TREND TAB ===== */}
      {activeTab === 'trend' && (
        <ThicknessChart asset={asset} thicknessHistory={folder.thicknessHistory || []} />
      )}

      {/* ===== DOCUMENTS TAB ===== */}
      {activeTab === 'documents' && (
        <DocumentUpload assetId={asset.id} />
      )}
    </div>
  );
}