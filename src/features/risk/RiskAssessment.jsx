import { useState } from 'react';
import { Save, Plus, Trash2, FileText, Shield, AlertTriangle, Download } from 'lucide-react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useAssetStore } from '../../store/useAssetStore';

const SEVERITY_LEVELS = [
  { value: 1, label: 'Negligible', desc: 'No injury or damage' },
  { value: 2, label: 'Minor', desc: 'First aid, minor damage' },
  { value: 3, label: 'Moderate', desc: 'Medical treatment, repairable damage' },
  { value: 4, label: 'Major', desc: 'Serious injury, major damage' },
  { value: 5, label: 'Catastrophic', desc: 'Fatality, total loss' }
];

const LIKELIHOOD_LEVELS = [
  { value: 1, label: 'Rare', desc: 'Almost never occurs' },
  { value: 2, label: 'Unlikely', desc: 'Could occur occasionally' },
  { value: 3, label: 'Possible', desc: 'Could occur several times' },
  { value: 4, label: 'Likely', desc: 'Occurs frequently' },
  { value: 5, label: 'Almost Certain', desc: 'Occurs regularly' }
];

const HAZARD_CATEGORIES = [
  'Mechanical', 'Electrical', 'Pressure', 'Thermal', 'Chemical',
  'Working at Height', 'Confined Space', 'Manual Handling',
  'Slip/Trip/Fall', 'Radiation', 'Noise', 'Vibration', 'Other'
];

export default function RiskAssessment({ isOpen, onClose, assetId }) {
  const asset = useAssetStore(s => s.assets.find(a => a.id === assetId));
  const [assessments, setAssessments] = useState([]);
  const [currentAssessment, setCurrentAssessment] = useState({
    id: null,
    date: new Date().toISOString().split('T')[0],
    assessor: '',
    jobDescription: '',
    location: asset?.location || '',
    hazards: []
  });
  const [currentHazard, setCurrentHazard] = useState({
    category: 'Mechanical',
    description: '',
    severity: 3,
    likelihood: 3,
    existingControls: '',
    additionalControls: '',
    responsible: '',
    deadline: ''
  });

  const calculateRisk = (severity, likelihood) => {
    const score = severity * likelihood;
    if (score >= 20) return { level: 'Extreme', color: '#7f1d1d', bg: '#ef4444', text: 'text-white' };
    if (score >= 12) return { level: 'High', color: '#7c2d12', bg: '#f97316', text: 'text-white' };
    if (score >= 6) return { level: 'Medium', color: '#713f12', bg: '#eab308', text: 'text-black' };
    return { level: 'Low', color: '#14532d', bg: '#22c55e', text: 'text-white' };
  };

  const addHazard = () => {
    if (!currentHazard.description.trim()) { alert('Please describe the hazard'); return; }
    const risk = calculateRisk(currentHazard.severity, currentHazard.likelihood);
    setCurrentAssessment(prev => ({
      ...prev,
      hazards: [...prev.hazards, { ...currentHazard, risk, id: Date.now() }]
    }));
    setCurrentHazard({
      category: 'Mechanical', description: '', severity: 3, likelihood: 3,
      existingControls: '', additionalControls: '', responsible: '', deadline: ''
    });
  };

  const removeHazard = (id) => {
    setCurrentAssessment(prev => ({
      ...prev,
      hazards: prev.hazards.filter(h => h.id !== id)
    }));
  };

  const saveAssessment = () => {
    if (!currentAssessment.jobDescription.trim()) { alert('Please enter job description'); return; }
    if (!currentAssessment.assessor.trim()) { alert('Please enter assessor name'); return; }
    if (currentAssessment.hazards.length === 0) { alert('Please add at least one hazard'); return; }

    const risk = calculateOverallRisk(currentAssessment.hazards);
    const newAssessment = {
      ...currentAssessment,
      id: 'ra-' + Date.now(),
      overallRisk: risk,
      createdAt: new Date().toISOString()
    };

    setAssessments(prev => [newAssessment, ...prev]);
    setCurrentAssessment({
      id: null, date: new Date().toISOString().split('T')[0], assessor: '',
      jobDescription: '', location: asset?.location || '', hazards: []
    });
  };

  const calculateOverallRisk = (hazards) => {
    const maxScore = Math.max(...hazards.map(h => h.severity * h.likelihood));
    return calculateRisk(Math.ceil(maxScore / 5), Math.min(5, Math.ceil(maxScore / 5)));
  };

  const downloadPDF = (assessment) => {
    const html = generateRiskAssessmentPDF(assessment, asset);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Shield size={20} className="text-primary-900" /> Risk Assessment
          </h3>
          {asset && <p className="text-gray-400 text-sm mt-1">Equipment: {asset.name} ({asset.type})</p>}
        </div>
      </div>

      {/* New Assessment Form */}
      <div className="card p-6 space-y-4">
        <h4 className="text-white font-bold">New Risk Assessment</h4>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-xs text-gray-400 mb-1">Date</label><input type="date" value={currentAssessment.date} onChange={e => setCurrentAssessment(prev => ({ ...prev, date: e.target.value }))} className="input-field text-sm" /></div>
          <div><label className="block text-xs text-gray-400 mb-1">Assessor Name *</label><input type="text" value={currentAssessment.assessor} onChange={e => setCurrentAssessment(prev => ({ ...prev, assessor: e.target.value }))} className="input-field text-sm" placeholder="Name" /></div>
          <div><label className="block text-xs text-gray-400 mb-1">Location</label><input type="text" value={currentAssessment.location} onChange={e => setCurrentAssessment(prev => ({ ...prev, location: e.target.value }))} className="input-field text-sm" /></div>
        </div>
        <div><label className="block text-xs text-gray-400 mb-1">Job/Task Description *</label><textarea value={currentAssessment.jobDescription} onChange={e => setCurrentAssessment(prev => ({ ...prev, jobDescription: e.target.value }))} rows={2} className="input-field text-sm resize-none" placeholder="Describe the job or task being assessed..." /></div>

        {/* Hazard Entry */}
        <div className="bg-dark-700/50 rounded-lg p-4 space-y-3">
          <h5 className="text-white font-bold text-sm">Add Hazard</h5>
          <div className="grid grid-cols-4 gap-3">
            <div><label className="block text-xs text-gray-400 mb-1">Category</label><select value={currentHazard.category} onChange={e => setCurrentHazard(prev => ({ ...prev, category: e.target.value }))} className="select-field text-sm">{HAZARD_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
            <div><label className="block text-xs text-gray-400 mb-1">Severity (1-5)</label><select value={currentHazard.severity} onChange={e => setCurrentHazard(prev => ({ ...prev, severity: parseInt(e.target.value) }))} className="select-field text-sm">{SEVERITY_LEVELS.map(s => <option key={s.value} value={s.value}>{s.value} - {s.label}</option>)}</select></div>
            <div><label className="block text-xs text-gray-400 mb-1">Likelihood (1-5)</label><select value={currentHazard.likelihood} onChange={e => setCurrentHazard(prev => ({ ...prev, likelihood: parseInt(e.target.value) }))} className="select-field text-sm">{LIKELIHOOD_LEVELS.map(l => <option key={l.value} value={l.value}>{l.value} - {l.label}</option>)}</select></div>
            <div className="flex items-end"><Button variant="accent" size="sm" icon={Plus} onClick={addHazard}>Add Hazard</Button></div>
          </div>
          <div><label className="block text-xs text-gray-400 mb-1">Hazard Description *</label><input type="text" value={currentHazard.description} onChange={e => setCurrentHazard(prev => ({ ...prev, description: e.target.value }))} className="input-field text-sm" placeholder="e.g. High pressure steam release during valve maintenance" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-gray-400 mb-1">Existing Controls</label><textarea value={currentHazard.existingControls} onChange={e => setCurrentHazard(prev => ({ ...prev, existingControls: e.target.value }))} rows={2} className="input-field text-sm resize-none" placeholder="e.g. PPE, permit to work, isolation procedure" /></div>
            <div><label className="block text-xs text-gray-400 mb-1">Additional Controls Required</label><textarea value={currentHazard.additionalControls} onChange={e => setCurrentHazard(prev => ({ ...prev, additionalControls: e.target.value }))} rows={2} className="input-field text-sm resize-none" placeholder="e.g. Double block and bleed, gas monitor" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-gray-400 mb-1">Responsible Person</label><input type="text" value={currentHazard.responsible} onChange={e => setCurrentHazard(prev => ({ ...prev, responsible: e.target.value }))} className="input-field text-sm" /></div>
            <div><label className="block text-xs text-gray-400 mb-1">Deadline</label><input type="date" value={currentHazard.deadline} onChange={e => setCurrentHazard(prev => ({ ...prev, deadline: e.target.value }))} className="input-field text-sm" /></div>
          </div>
        </div>

        {/* Hazard List */}
        {currentAssessment.hazards.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-white font-bold text-sm">Identified Hazards ({currentAssessment.hazards.length})</h5>
            {currentAssessment.hazards.map(h => (
              <div key={h.id} className="bg-dark-700 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded text-xs font-bold" style={{ background: h.risk.bg, color: h.risk.color }}>{h.risk.level}</span>
                  <div>
                    <span className="text-white text-sm">{h.description}</span>
                    <span className="text-gray-400 text-xs ml-2">({h.category} | S:{h.severity} L:{h.likelihood})</span>
                  </div>
                </div>
                <button onClick={() => removeHazard(h.id)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
              </div>
            ))}
            <Button variant="success" size="sm" icon={Save} onClick={saveAssessment}>Save Assessment</Button>
          </div>
        )}
      </div>

      {/* Saved Assessments */}
      {assessments.length > 0 && (
        <div className="card p-6 space-y-3">
          <h4 className="text-white font-bold">Completed Assessments ({assessments.length})</h4>
          {assessments.map(ra => (
            <div key={ra.id} className="bg-dark-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-white font-bold">{ra.jobDescription}</span>
                  <span className="text-gray-400 text-xs ml-3">{ra.date} | Assessor: {ra.assessor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: ra.overallRisk.bg, color: ra.overallRisk.color }}>{ra.overallRisk.level} Risk</span>
                  <button onClick={() => downloadPDF(ra)} className="text-primary-900 hover:text-primary-700"><Download size={16} /></button>
                  <button onClick={() => setAssessments(prev => prev.filter(a => a.id !== ra.id))} className="text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {SEVERITY_LEVELS.map(s => {
                  const count = ra.hazards.filter(h => h.severity === s.value).length;
                  return count > 0 ? <div key={s.value} className="bg-dark-600 rounded p-2 text-center"><div className="text-white font-bold">{count}</div><div className="text-gray-400">{s.label}</div></div> : null;
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function generateRiskAssessmentPDF(assessment, asset) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Risk Assessment - ${asset?.name || 'Equipment'}</title>
<style>body{font-family:Arial,sans-serif;font-size:12px;padding:20px}
h1{color:#1a237e}h2{color:#333;border-bottom:1px solid #ddd}table{width:100%;border-collapse:collapse;margin:10px 0}
th{background:#1a237e;color:#fff;padding:8px;text-align:left}td{padding:8px;border-bottom:1px solid #ddd}
.risk-Extreme{background:#ef4444;color:#fff}.risk-High{background:#f97316;color:#fff}.risk-Medium{background:#eab308}.risk-Low{background:#22c55e;color:#fff}
</style></head><body>
<h1>Risk Assessment Report</h1>
<p><strong>Equipment:</strong> ${asset?.name || 'N/A'} (${asset?.type || 'N/A'})</p>
<p><strong>Job/Task:</strong> ${assessment.jobDescription}</p>
<p><strong>Date:</strong> ${assessment.date} | <strong>Assessor:</strong> ${assessment.assessor} | <strong>Location:</strong> ${assessment.location}</p>
<h2>Identified Hazards (${assessment.hazards.length})</h2>
<table><tr><th>Hazard</th><th>Category</th><th>Severity</th><th>Likelihood</th><th>Risk Level</th><th>Existing Controls</th><th>Additional Controls</th></tr>
${assessment.hazards.map(h => `<tr>
<td>${h.description}</td><td>${h.category}</td><td>${h.severity}</td><td>${h.likelihood}</td>
<td class="risk-${h.risk.level}">${h.risk.level}</td><td>${h.existingControls || '—'}</td><td>${h.additionalControls || '—'}</td>
</tr>`).join('')}</table>
<p><strong>Overall Risk Level:</strong> <span class="risk-${assessment.overallRisk.level}">${assessment.overallRisk.level}</span></p>
<p><em>Generated: ${new Date().toLocaleString()}</em></p></body></html>`;
}