/**
 * PDF Report Generator
 * Generates professional inspection/repair/alteration reports
 */

const sharedStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    font-size: 11px;
    color: #1a1a1a;
    line-height: 1.6;
    background: #f0f0f0;
  }
  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 25mm 20mm 20mm;
    margin: 10px auto;
    background: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: relative;
  }

  /* Header Section */
  .report-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 14px;
    margin-bottom: 18px;
    position: relative;
  }
  .report-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, __COLOR__, transparent);
  }
  .logo-area {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 800;
    color: #fff;
    background: __COLOR__;
    letter-spacing: 1px;
  }
  .logo-area img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 8px;
  }
  .header-text {
    flex: 1;
  }
  .header-text .company-name {
    font-size: 18px;
    font-weight: 700;
    color: __COLOR__;
    letter-spacing: 0.5px;
  }
  .header-text .company-tagline {
    font-size: 9px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-top: 1px;
  }
  .header-text .report-title-line {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-top: 4px;
  }
  .header-meta {
    text-align: right;
    flex-shrink: 0;
    font-size: 9px;
    color: #888;
    line-height: 1.8;
  }
  .header-meta strong {
    color: #555;
  }

  /* Equipment Info Table */
  .info-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 18px;
  }
  .info-table td {
    padding: 7px 10px;
    border: 1px solid #e0e0e0;
    font-size: 10px;
    vertical-align: middle;
  }
  .info-table .info-label {
    width: 130px;
    font-size: 8px;
    font-weight: 700;
    color: #fff;
    background: __COLOR__;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: center;
  }
  .info-table .info-value {
    font-weight: 600;
    color: #1a1a1a;
    background: #fff;
  }

  /* Section Titles */
  .section-title {
    font-size: 12px;
    font-weight: 700;
    color: __COLOR__;
    margin: 18px 0 8px;
    padding-bottom: 4px;
    border-bottom: 2px solid __COLOR__;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .section-title .sec-icon {
    font-size: 14px;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
    font-size: 10px;
  }
  thead th {
    background: __COLOR__;
    color: #fff;
    padding: 8px 10px;
    text-align: left;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }
  thead th:first-child { border-radius: 4px 0 0 0; }
  thead th:last-child { border-radius: 0 4px 0 0; }
  tbody td {
    padding: 7px 10px;
    border-bottom: 1px solid #e8e8e8;
    color: #333;
  }
  tbody tr:nth-child(even) td {
    background: #f8f9fa;
  }
  tbody tr:hover td {
    background: #eef2ff;
  }
  tbody tr:last-child td:first-child { border-radius: 0 0 0 4px; }
  tbody tr:last-child td:last-child { border-radius: 0 0 4px 0; }

  /* Detail table (2-column key-value) */
  .detail-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
  .detail-table td {
    padding: 6px 10px;
    border-bottom: 1px solid #e8e8e8;
    font-size: 10px;
  }
  .detail-table td:first-child {
    width: 180px;
    font-weight: 600;
    color: #555;
    background: #f8f9fa;
  }
  .detail-table tr:nth-child(even) td:first-child {
    background: #f0f1f3;
  }

  /* Status badges */
  .status-ok { color: #1b5e20; font-weight: 600; }
  .status-warning { color: #e65100; font-weight: 600; }
  .status-critical { color: #b71c1c; font-weight: 700; background: #ffebee; padding: 1px 6px; border-radius: 3px; display: inline-block; }

  /* Findings box */
  .findings-box {
    background: #f8f9fa;
    padding: 12px 14px;
    border-radius: 6px;
    margin: 8px 0;
    border: 1px solid #e8e8e8;
    font-size: 10px;
    line-height: 1.6;
  }
  .findings-box strong {
    color: __COLOR__;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .findings-box p {
    margin-top: 3px;
    color: #444;
  }

  /* Calculations grid */
  .calc-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin: 10px 0;
  }
  .calc-box {
    background: #f8f9fa;
    padding: 10px;
    border-radius: 6px;
    text-align: center;
    border: 1px solid #e8e8e8;
  }
  .calc-box .calc-label {
    font-size: 8px;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .calc-box .calc-value {
    font-size: 14px;
    font-weight: 700;
    color: __COLOR__;
    margin-top: 3px;
  }

  /* Signature Section */
  .signature-section {
    margin-top: 35px;
    padding-top: 15px;
    border-top: 1px solid #ddd;
  }
  .signature-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .sig-box {
    text-align: center;
  }
  .sig-box .sig-line {
    border-top: 1px solid #555;
    margin-top: 30px;
    margin-bottom: 5px;
  }
  .sig-box .sig-label {
    font-size: 9px;
    color: #888;
  }
  .sig-box .sig-name {
    font-size: 10px;
    font-weight: 600;
    color: #333;
  }

  /* Footer */
  .report-footer {
    margin-top: 25px;
    padding-top: 10px;
    border-top: 1px solid #e0e0e0;
    font-size: 8px;
    color: #aaa;
    text-align: center;
    line-height: 1.8;
  }
  .report-footer strong {
    color: #888;
  }

  /* Print */
  @media print {
    body { background: #fff; }
    .page {
      width: 100%;
      margin: 0;
      padding: 20mm 15mm;
      box-shadow: none;
      min-height: auto;
    }
    .report-header::after { background: __COLOR__; }
    tbody tr:hover td { background: inherit; }
    .page-break { page-break-before: always; }
  }
`;

function buildHeader(companyName, reportTitle, reportNumber, color, initials) {
  return `
    <div class="report-header">
      <div class="logo-area">
        <span>${initials}</span>
      </div>
      <div class="header-text">
        <div class="company-name">${companyName}</div>
        <div class="company-tagline">Asset Integrity Management</div>
        <div class="report-title-line">${reportTitle}</div>
      </div>
      <div class="header-meta">
        <strong>Report #:</strong> ${reportNumber}<br>
        <strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br>
        <strong>Status:</strong> <span style="color:${color};font-weight:600;">Final</span>
      </div>
    </div>`;
}

function buildFooter(companyName, color) {
  return `
    <div class="report-footer">
      <strong>${companyName}</strong> &mdash; Asset Integrity Management<br>
      This report is confidential and intended for authorized personnel only.<br>
      Generated: ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
    </div>`;
}

function buildSignatureRow(signatures) {
  return `
    <div class="signature-section">
      <div class="signature-grid">
        ${signatures.map(s => `
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-name">${s.name || '_________________'}</div>
            <div class="sig-label">${s.label}</div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

function buildEquipmentGrid(asset, color, extraItems = [], prependItems = []) {
  const items = [
    { label: 'Equipment ID', value: asset.name },
    ...prependItems,
    { label: 'Type / Location', value: `${asset.type} | ${asset.location || 'N/A'}` },
    { label: 'Design Code', value: asset.designCode || 'N/A' },
    { label: 'Design Data', value: `Nominal: ${asset.nominal || 'N/A'}mm | T-Min: ${asset.minRequired || 'N/A'}mm` },
    ...extraItems
  ];
  let rows = '';
  for (let i = 0; i < items.length; i += 2) {
    const left = items[i];
    const right = items[i + 1];
    rows += `<tr>
      <td class="info-label">${left.label}</td>
      <td class="info-value">${left.value}</td>
      ${right ? `<td class="info-label">${right.label}</td>
      <td class="info-value">${right.value}</td>` : '<td class="info-label"></td><td class="info-value"></td>'}
    </tr>`;
  }
  return `<table class="info-table"><tbody>${rows}</tbody></table>`;
}

function buildThicknessTable(gridData, color) {
  if (!gridData?.rows?.length) return '<p style="color:#999;font-size:11px;">No CML thickness data recorded.</p>';
  return `
    <table>
      <thead>
        <tr>
          <th>CML#</th>
          <th>Location</th>
          <th>Orientation</th>
          <th style="text-align:right;">Nominal</th>
          <th style="text-align:right;">Previous</th>
          <th style="text-align:right;">Measured</th>
          <th style="text-align:right;">T-Min</th>
          <th style="text-align:right;">Remaining</th>
          <th style="text-align:center;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${gridData.rows.map(r => {
          const rem = r.measured - r.tmin;
          const statusCls = rem < 0 ? 'status-critical' : rem < 2 ? 'status-warning' : 'status-ok';
          const statusText = rem < 0 ? 'BELOW T-MIN' : rem < 2 ? 'NEAR LIMIT' : 'PASS';
          return `
            <tr>
              <td><strong>${r.cml}</strong></td>
              <td>${r.location}</td>
              <td>${r.orientation}</td>
              <td style="text-align:right;">${r.nominal?.toFixed(2)}</td>
              <td style="text-align:right;">${r.previous?.toFixed(2)}</td>
              <td style="text-align:right;"><strong>${r.measured?.toFixed(2)}</strong></td>
              <td style="text-align:right;">${r.tmin?.toFixed(2)}</td>
              <td style="text-align:right;" class="${statusCls}">${rem.toFixed(2)}</td>
              <td style="text-align:center;" class="${statusCls}">${statusText}</td>
            </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

function buildCalcGrid(inspection) {
  if (!inspection.avgThickness && !inspection.minThickness) return '';
  return `
    <div class="section-title"><span class="sec-icon">&#9654;</span> Calculations (API 510 &sect;5.6)</div>
    <div class="calc-grid">
      <div class="calc-box">
        <div class="calc-label">Average Thickness</div>
        <div class="calc-value">${inspection.avgThickness?.toFixed(2) || 'N/A'} <span style="font-size:10px;">mm</span></div>
      </div>
      <div class="calc-box">
        <div class="calc-label">Minimum Thickness</div>
        <div class="calc-value">${inspection.minThickness?.toFixed(2) || 'N/A'} <span style="font-size:10px;">mm</span></div>
      </div>
      <div class="calc-box">
        <div class="calc-label">Remaining Life</div>
        <div class="calc-value">${inspection.remainingLife || 'N/A'}</div>
      </div>
      <div class="calc-box">
        <div class="calc-label">Next Inspection</div>
        <div class="calc-value" style="font-size:11px;">${inspection.nextInspectionDate || 'N/A'}</div>
      </div>
    </div>`;
}

export function generateInspectionPDF(asset, inspection, companyName = 'Asset Integrity Management') {
  const reportNumber = `RPT-${asset.name}-${inspection.date}-${inspection.id?.substr(-4) || '0001'}`;
  const color = '#1a237e';
  const initials = companyName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const css = sharedStyles.replace(/__COLOR__/g, color);

  const extraItems = [
    { label: 'Inspection Date', value: inspection.date },
    { label: 'Inspection Type', value: inspection.type || 'N/A' },
    { label: 'Inspector', value: inspection.inspector || 'N/A' },
    { label: 'NDT Method', value: `${inspection.ndtMethod || 'N/A'} | ${inspection.equipment || ''}` },
    { label: 'Overall Condition', value: inspection.condition || 'N/A' },
    { label: '', value: '' }
  ];

  // Remove empty label/value pairs
  const filteredItems = extraItems.filter(i => i.label !== '' && i.value !== '');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Inspection Report - ${asset.name}</title>
  <style>${css}</style>
</head>
<body>
  <div class="page">
    ${buildHeader(companyName, 'Thickness Inspection Report', reportNumber, color, initials)}
    ${buildEquipmentGrid(asset, color, filteredItems, [
      { label: 'API 510', value: 'Thickness Inspection' }
    ])}

    <div class="section-title"><span class="sec-icon">&#9654;</span> Thickness Measurements (CML Grid)</div>
    ${buildThicknessTable(inspection.gridData, color)}

    ${buildCalcGrid(inspection)}

    <div class="section-title"><span class="sec-icon">&#9654;</span> Findings &amp; Recommendations</div>
    <div class="findings-box">
      <strong>Findings:</strong>
      <p>${inspection.findings || 'None recorded.'}</p>
    </div>
    <div class="findings-box">
      <strong>Recommendations:</strong>
      <p>${inspection.recommendations || 'None recorded.'}</p>
    </div>

    ${buildSignatureRow([
      { label: 'Inspector' },
      { label: 'Reviewed by' },
      { label: 'Date' }
    ])}

    ${buildFooter(companyName, color)}
  </div>
</body>
</html>`;

  return { html, reportNumber };
}

export function generateRepairPDF(asset, repair, companyName = 'Asset Integrity Management') {
  const reportNumber = `RPR-${asset.name}-${repair.startDate || repair.date}-${repair.id?.substr(-4) || '0001'}`;
  const color = '#e65100';
  const initials = companyName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const css = sharedStyles.replace(/__COLOR__/g, color);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Repair Record - ${asset.name}</title>
  <style>${css}</style>
</head>
<body>
  <div class="page">
    ${buildHeader(companyName, 'Repair Record', reportNumber, color, initials)}
    ${buildEquipmentGrid(asset, color, [
      { label: 'Construction Code', value: repair.originalCode || 'N/A' },
      { label: 'Repair Code', value: repair.repairCode || 'N/A' },
      { label: 'Start Date', value: repair.startDate || repair.date || 'N/A' },
      { label: 'Finish Date', value: repair.finishDate || 'N/A' }
    ])}

    <div class="section-title"><span class="sec-icon">&#9654;</span> Repair Details</div>
    <table class="detail-table">
      <tr><td>Method of Repair</td><td>${repair.method || repair.type || 'N/A'}</td></tr>
      <tr><td>Person Incharge</td><td>${repair.personIncharge || repair.technician || 'N/A'}</td></tr>
      <tr><td>Welder Name / ID</td><td>${repair.welderName || 'N/A'} / ${repair.welderId || 'N/A'}</td></tr>
      <tr><td>Shell &amp; Head Material</td><td>${repair.shellHeadMaterial || 'N/A'}</td></tr>
      <tr><td>Replacement Material</td><td>${repair.replacementMaterial || 'N/A'}</td></tr>
      <tr><td>NDT Method</td><td>${repair.ndt || 'N/A'}</td></tr>
      <tr><td>Design Pressure / Temp</td><td>${repair.designPressure || '—'} bar / ${repair.designTemp || '—'}&deg;C</td></tr>
      <tr><td>Hydrostatic Test</td><td>${repair.hydrostatic || 'N/A'} ${repair.hydrostaticPressure ? '(' + repair.hydrostaticPressure + ' bar)' : ''}</td></tr>
      <tr><td>Inspection Name</td><td>${repair.inspectionName || 'N/A'}</td></tr>
      <tr><td>Scope of Work</td><td>${repair.scope || 'N/A'}</td></tr>
    </table>

    ${buildSignatureRow([
      { name: repair.personIncharge || repair.technician, label: 'Person Incharge' },
      { name: repair.inspectionName, label: 'Inspector' },
      { label: 'Date' }
    ])}

    ${buildFooter(companyName, color)}
  </div>
</body>
</html>`;

  return { html, reportNumber };
}

export function generateAlterationPDF(asset, alteration, companyName = 'Asset Integrity Management') {
  const reportNumber = `ALT-${asset.name}-${alteration.startDate || alteration.date}-${alteration.id?.substr(-4) || '0001'}`;
  const color = '#6a1b9a';
  const initials = companyName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const css = sharedStyles.replace(/__COLOR__/g, color);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Alteration Record - ${asset.name}</title>
  <style>${css}</style>
</head>
<body>
  <div class="page">
    ${buildHeader(companyName, 'Alteration Record', reportNumber, color, initials)}
    ${buildEquipmentGrid(asset, color, [
      { label: 'Construction Code', value: alteration.originalCode || 'N/A' },
      { label: 'Alteration Code', value: alteration.alterationCode || 'N/A' },
      { label: 'Start Date', value: alteration.startDate || alteration.date || 'N/A' },
      { label: 'Finish Date', value: alteration.finishDate || 'N/A' }
    ])}

    <div class="section-title"><span class="sec-icon">&#9654;</span> Alteration Details</div>
    <table class="detail-table">
      <tr><td>Type of Alteration</td><td>${alteration.type || 'N/A'}</td></tr>
      <tr><td>Engineer</td><td>${alteration.engineer || 'N/A'}</td></tr>
      <tr><td>Welder Name / ID</td><td>${alteration.welderName || 'N/A'} / ${alteration.welderId || 'N/A'}</td></tr>
      <tr><td>Design Approved No.</td><td>${alteration.designApprovedNo || 'N/A'}</td></tr>
      <tr><td>Date Approval / Approved By</td><td>${alteration.dateApproval || 'N/A'} / ${alteration.approvedBy || 'N/A'}</td></tr>
      <tr><td>Shell &amp; Head Material</td><td>${alteration.shellHeadMaterial || 'N/A'}</td></tr>
      <tr><td>Replacement Material</td><td>${alteration.replacementMaterial || 'N/A'}</td></tr>
      <tr><td>NDT Method</td><td>${alteration.ndt || 'N/A'}</td></tr>
      <tr><td>Design Pressure / Temp</td><td>${alteration.designPressure || '—'} bar / ${alteration.designTemp || '—'}&deg;C</td></tr>
      <tr><td>Hydrostatic Test</td><td>${alteration.hydrostatic || 'N/A'} ${alteration.hydrostaticPressure ? '(' + alteration.hydrostaticPressure + ' bar)' : ''}</td></tr>
      <tr><td>Inspector Name</td><td>${alteration.inspectionName || 'N/A'}</td></tr>
      <tr><td>Scope of Work</td><td>${alteration.scope || 'N/A'}</td></tr>
    </table>

    ${buildSignatureRow([
      { name: alteration.engineer, label: 'Engineer' },
      { name: alteration.approvedBy, label: 'Approved By' },
      { label: 'Date' }
    ])}

    ${buildFooter(companyName, color)}
  </div>
</body>
</html>`;

  return { html, reportNumber };
}

/**
 * Download HTML as PDF (opens in new tab for printing)
 */
export function downloadPDF(html, filename) {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename + '.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 500);
}
