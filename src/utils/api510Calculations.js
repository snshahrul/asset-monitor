export function calculateThicknessStats(rows, nominalThickness, minRequired, corrosionRate) {
  const measured = rows.map(r => r.measured).filter(v => typeof v === 'number' && v > 0);

  if (measured.length === 0) {
    return {
      avgThickness: null, minThickness: null, minCML: null,
      minRemaining: null, avgRemaining: null,
      remainingLife: null, remainingLifeYears: null,
      corrosionRateShortTerm: null, corrosionRateLongTerm: null,
      effectiveCorrosionRate: null,
      nextInspectionDate: null, nextInspectionInterval: null,
      overallStatus: 'no-data', requiresRerate: false,
      dataPoints: 0, percentRemaining: null, percentToTmin: null,
      maxAllowablePressure: null
    };
  }

  // Basic statistics
  const avgThickness = measured.reduce((s, v) => s + v, 0) / measured.length;
  const minThickness = Math.min(...measured);
  const maxThickness = Math.max(...measured);
  const minCML = rows.find(r => r.measured === minThickness);

  // Remaining above T-Min (Critical per API 510 §5.6.2)
  const minRemaining = minThickness - minRequired;
  const avgRemaining = avgThickness - minRequired;

  // Corrosion Rate Calculations (API 510 §5.6.1)
  let corrosionRateShortTerm = null;
  const rowsWithPrevious = rows.filter(r => r.previous > 0 && r.measured > 0 && r.previous > r.measured);
  if (rowsWithPrevious.length > 0) {
    const rates = rowsWithPrevious.map(r => r.previous - r.measured);
    corrosionRateShortTerm = rates.reduce((s, v) => s + v, 0) / rates.length;
  }

  let corrosionRateLongTerm = null;
  if (nominalThickness > 0 && avgThickness < nominalThickness) {
    corrosionRateLongTerm = nominalThickness - avgThickness;
  }

  // Use short-term rate if available, otherwise long-term, otherwise provided rate
  const effectiveRate = corrosionRateShortTerm || corrosionRateLongTerm || corrosionRate || 0.1;

  // Remaining Life (API 510 §5.6.2)
  // RL = (t_actual - t_required) / corrosion_rate
  const remainingLifeYears = effectiveRate > 0 ? minRemaining / effectiveRate : (minRemaining > 0 ? Infinity : 0);
  const remainingLife = remainingLifeYears === Infinity ? '> 100 years' : +remainingLifeYears.toFixed(1);

  // Next Inspection Interval (API 510 §6.4.1)
  // Lesser of: 5 years, or half remaining life, or RBI-based interval
  const maxInterval = 5; // years (API 510 §6.4.1.1)
  const halfLife = remainingLifeYears === Infinity ? maxInterval : remainingLifeYears / 2;
  const inspectionInterval = Math.min(maxInterval, Math.max(0.5, halfLife));
  const nextInspectionDate = minRemaining > 0
    ? new Date(Date.now() + inspectionInterval * 365.25 * 24 * 60 * 60 * 1000)
    : new Date(); // Due immediately if below T-min

  // Overall Status Determination
  let overallStatus;
  if (minRemaining < 0) {
    overallStatus = 'below-tmin'; // CRITICAL — Below minimum required thickness
  } else if (minRemaining <= minRequired * 0.10 || (remainingLifeYears !== Infinity && remainingLifeYears < 2)) {
    overallStatus = 'near-tmin'; // WARNING — Approaching T-min or less than 2 years remaining
  } else if (remainingLifeYears !== Infinity && remainingLifeYears < 5) {
    overallStatus = 'monitor'; // CAUTION — Less than 5 years remaining
  } else {
    overallStatus = 'ok'; // Acceptable
  }

  // Re-rate assessment per API 510 §5.6.2
  const requiresRerate = minRemaining < 0;

  // Percent calculations
  const percentRemaining = +((avgThickness / nominalThickness) * 100).toFixed(1);
  const percentToTmin = nominalThickness > minRequired
    ? +(((avgThickness - minRequired) / (nominalThickness - minRequired)) * 100).toFixed(1)
    : 100;

  return {
    avgThickness: +avgThickness.toFixed(2),
    minThickness: +minThickness.toFixed(2),
    minCML: minCML?.cml || null,
    minCMLLocation: minCML?.location || null,
    maxThickness: +maxThickness.toFixed(2),
    thicknessRange: +(maxThickness - minThickness).toFixed(2),
    minRemaining: +minRemaining.toFixed(2),
    avgRemaining: +avgRemaining.toFixed(2),
    remainingLife,
    remainingLifeYears: remainingLifeYears === Infinity ? 100 : +remainingLifeYears.toFixed(1),
    corrosionRateShortTerm: corrosionRateShortTerm ? +corrosionRateShortTerm.toFixed(3) : null,
    corrosionRateLongTerm: corrosionRateLongTerm ? +corrosionRateLongTerm.toFixed(3) : null,
    effectiveCorrosionRate: +effectiveRate.toFixed(3),
    nextInspectionDate,
    nextInspectionInterval: +inspectionInterval.toFixed(1),
    overallStatus,
    requiresRerate,
    dataPoints: measured.length,
    percentRemaining,
    percentToTmin: Math.max(0, percentToTmin),
    maxAllowablePressure: null // Can be calculated if design pressure and dimensions are known
  };
}

export function getCMLStatus(measured, tmin) {
  const remaining = measured - tmin;

  if (measured <= 0) {
    return { status: 'no-data', color: '#6b7280', bg: '#374151', label: 'No Data', icon: '⬜', severity: 0 };
  }

  if (remaining < 0) {
    return { status: 'below-tmin', color: '#ef4444', bg: '#7f1d1d', label: '⚠ BELOW T-MIN', icon: '🔴', severity: 4 };
  }

  if (remaining < 1) {
    return { status: 'critical', color: '#f97316', bg: '#7c2d12', label: '< 1mm Above', icon: '🟠', severity: 3 };
  }

  if (remaining < tmin * 0.10 || remaining < 2) {
    return { status: 'near-tmin', color: '#f59e0b', bg: '#78350f', label: '⚠ Near T-Min', icon: '🟡', severity: 2 };
  }

  if (remaining < tmin * 0.25 || remaining < 5) {
    return { status: 'monitor', color: '#eab308', bg: '#713f12', label: 'Monitor', icon: '🟢', severity: 1 };
  }

  return { status: 'ok', color: '#22c55e', bg: '#14532d', label: '✅ OK', icon: '🟢', severity: 0 };
}

export function createDefaultCMLRows(nominal = 25, previous = 24, tmin = 18) {
  return [
    { cml: 1, location: 'CML-1 — Shell 0° (Top)', orientation: 'Longitudinal', nominal, previous: +(previous).toFixed(2), measured: +(previous - 0.5).toFixed(2), tmin },
    { cml: 2, location: 'CML-2 — Shell 90° (Right)', orientation: 'Longitudinal', nominal, previous: +(previous - 0.2).toFixed(2), measured: +(previous - 0.7).toFixed(2), tmin },
    { cml: 3, location: 'CML-3 — Shell 180° (Bottom)', orientation: 'Circumferential', nominal, previous: +(previous - 0.4).toFixed(2), measured: +(previous - 1.3).toFixed(2), tmin },
    { cml: 4, location: 'CML-4 — Shell 270° (Left)', orientation: 'Circumferential', nominal, previous: +(previous - 0.3).toFixed(2), measured: +(previous - 1.0).toFixed(2), tmin },
  ];
}

export function validateInspectionData(data) {
  const errors = [];

  if (!data.assetId) errors.push('Asset selection is required');
  if (!data.date) errors.push('Inspection date is required');
  if (!data.inspector?.trim()) errors.push('Inspector name is required');

  // Only require thickness data for UT inspections
  if (data.ndtMethod === 'UT - Ultrasonic') {
    if (!data.gridData?.rows?.length) {
      errors.push('At least one CML measurement point is required for UT inspection');
    } else {
      const hasMeasurement = data.gridData.rows.some(r => r.measured > 0);
      if (!hasMeasurement) errors.push('At least one thickness measurement must be greater than zero');
    }
  }

  return { isValid: errors.length === 0, errors };
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function formatDate(date) {
  if (!date) return '—';
  if (typeof date === 'string') return date;
  return date.toISOString().split('T')[0];
}