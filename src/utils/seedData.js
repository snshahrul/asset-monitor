export function seedSampleData() {
  // Check if data already exists
  const existing = localStorage.getItem('asset-monitor-storage');
  if (existing) {
    try {
      const parsed = JSON.parse(existing);
      if (parsed?.state?.assets?.length > 0) {
        console.log('✅ Data already exists — skipping seed');
        return false;
      }
    } catch(e) {}
  }

  // Sample data
  const store = {
    state: {
      assets: [
        {
          id: 101,
          name: 'SL-PMD-12345',
          type: 'Boiler',
          location: 'Plant 1 - Boiler House',
          designCode: 'ASME I',
          nominal: 25,
          minRequired: 18,
          currentThick: 23.1,
          corrosionRate: 0.15,
          corrAllowance: 3.0,
          operatingTemp: 180,
          operatingPress: 8.2,
          mawp: 10,
          manufacturer: 'Babcock & Wilcox',
          serial: 'BW-2020-001',
          yearBuilt: '2020',
          designPressure: 10,
          designTemp: 200,
          shellDiameter: 1500,
          shellLength: 4000,
          jointEff: 0.85,
          allowStress: 138,
          fluidService: 'Steam',
          pwht: 'Yes',
          radiograph: 'Full',
          status: 'warning',
          sensors: { temperature: 182, pressure: 8.3, vibration: 2.1 }
        },
        {
          id: 102,
          name: 'SL-PMD-67890',
          type: 'Pressure Vessel',
          location: 'Main Plant - Area C',
          designCode: 'ASME VIII Div.1',
          nominal: 30,
          minRequired: 20,
          currentThick: 26.3,
          corrosionRate: 0.15,
          corrAllowance: 3.0,
          operatingTemp: 95,
          operatingPress: 12.5,
          mawp: 15,
          manufacturer: 'PV Fabricators Inc.',
          serial: 'PV-2018-042',
          yearBuilt: '2018',
          designPressure: 12.5,
          designTemp: 150,
          shellDiameter: 2000,
          shellLength: 6000,
          jointEff: 0.85,
          allowStress: 138,
          fluidService: 'Hydrocarbon',
          pwht: 'Yes',
          radiograph: 'Spot',
          status: 'running',
          sensors: { temperature: 96, pressure: 12.4, vibration: 0.9 }
        }
      ],
      assetIdCounter: 102,
      equipmentFolders: {
        101: {
          inspections: [
            {
              id: 'insp-101-1', date: '2025-03-10', type: 'External', inspector: 'A. Rahman',
              ndtMethod: 'UT - Ultrasonic', equipment: 'Olympus 38DL Plus', condition: 'Good',
              corrosion: 'None', findings: 'All sections within normal range. Uniform corrosion.',
              recommendations: 'Continue routine monitoring.', avgThickness: 24.8, minThickness: 24.2,
              remainingLife: '45.3 years', remainingLifeYears: 45.3, nextInspectionDate: '2030-03-10',
              corrosionRate: 0.15,
              gridData: { rows: [
                { cml:1, location:'Top Drum Shell — 0°', orientation:'Longitudinal', nominal:25, previous:25.0, measured:25.0, tmin:18, section:'Top Drum Shell' },
                { cml:2, location:'Top Drum Shell — 90°', orientation:'Longitudinal', nominal:25, previous:25.0, measured:24.9, tmin:18, section:'Top Drum Shell' },
                { cml:3, location:'Top Drum DE-A — Knuckle 0°', orientation:'Circumferential', nominal:25, previous:25.0, measured:24.7, tmin:18, section:'Dish End A' },
                { cml:4, location:'Top Drum DE-B — Center', orientation:'Radial', nominal:25, previous:25.0, measured:24.8, tmin:18, section:'Dish End B' },
                { cml:5, location:'Bottom Drum Shell — 0°', orientation:'Longitudinal', nominal:25, previous:25.0, measured:24.9, tmin:18, section:'Shell' },
                { cml:6, location:'Bottom Drum Shell — 180°', orientation:'Circumferential', nominal:25, previous:25.0, measured:24.2, tmin:18, section:'Shell' },
              ]}
            },
            {
              id: 'insp-101-2', date: '2025-07-22', type: 'External', inspector: 'A. Rahman',
              ndtMethod: 'UT - Ultrasonic', equipment: 'Olympus 38DL Plus', condition: 'Good',
              corrosion: 'None', findings: 'Slight thinning at Bottom Drum 180°.', avgThickness: 24.5, minThickness: 24.0,
              remainingLife: '40.0 years', remainingLifeYears: 40.0, nextInspectionDate: '2030-07-22',
              corrosionRate: 0.15,
              gridData: { rows: [
                { cml:1, location:'Top Drum Shell — 0°', orientation:'Longitudinal', nominal:25, previous:25.0, measured:24.9, tmin:18, section:'Top Drum Shell' },
                { cml:2, location:'Top Drum DE-A — Knuckle 0°', orientation:'Circumferential', nominal:25, previous:24.7, measured:24.3, tmin:18, section:'Dish End A' },
                { cml:3, location:'Top Drum DE-B — Center', orientation:'Radial', nominal:25, previous:24.8, measured:24.6, tmin:18, section:'Dish End B' },
                { cml:4, location:'Bottom Drum Shell — 0°', orientation:'Longitudinal', nominal:25, previous:24.9, measured:24.7, tmin:18, section:'Shell' },
                { cml:5, location:'Bottom Drum Shell — 180°', orientation:'Circumferential', nominal:25, previous:24.2, measured:24.0, tmin:18, section:'Shell' },
              ]}
            },
            {
              id: 'insp-101-3', date: '2025-11-15', type: 'External', inspector: 'A. Rahman',
              ndtMethod: 'UT - Ultrasonic', equipment: 'Olympus 38DL Plus', condition: 'Fair',
              corrosion: 'Minor Pitting', findings: 'Bottom Drum 180° continuing to thin.', avgThickness: 24.1, minThickness: 23.5,
              remainingLife: '36.7 years', remainingLifeYears: 36.7, nextInspectionDate: '2030-11-15',
              corrosionRate: 0.15,
              gridData: { rows: [
                { cml:1, location:'Top Drum Shell — 0°', orientation:'Longitudinal', nominal:25, previous:24.9, measured:24.7, tmin:18, section:'Top Drum Shell' },
                { cml:2, location:'Top Drum DE-A — Knuckle 0°', orientation:'Circumferential', nominal:25, previous:24.3, measured:23.8, tmin:18, section:'Dish End A' },
                { cml:3, location:'Top Drum DE-B — Center', orientation:'Radial', nominal:25, previous:24.6, measured:24.3, tmin:18, section:'Dish End B' },
                { cml:4, location:'Bottom Drum Shell — 0°', orientation:'Longitudinal', nominal:25, previous:24.7, measured:24.4, tmin:18, section:'Shell' },
                { cml:5, location:'Bottom Drum Shell — 180°', orientation:'Circumferential', nominal:25, previous:24.0, measured:23.5, tmin:18, section:'Shell' },
              ]}
            },
            {
              id: 'insp-101-4', date: '2026-02-08', type: 'External', inspector: 'S. Kumar',
              ndtMethod: 'UT - Ultrasonic', equipment: 'Olympus 38DL Plus', condition: 'Fair',
              corrosion: 'Minor Pitting', findings: 'Bottom Drum 180° requires close monitoring.', avgThickness: 23.6, minThickness: 22.8,
              remainingLife: '32.0 years', remainingLifeYears: 32.0, nextInspectionDate: '2027-02-08',
              corrosionRate: 0.15,
              gridData: { rows: [
                { cml:1, location:'Top Drum Shell — 0°', orientation:'Longitudinal', nominal:25, previous:24.7, measured:24.5, tmin:18, section:'Top Drum Shell' },
                { cml:2, location:'Top Drum DE-A — Knuckle 0°', orientation:'Circumferential', nominal:25, previous:23.8, measured:23.2, tmin:18, section:'Dish End A' },
                { cml:3, location:'Top Drum DE-B — Center', orientation:'Radial', nominal:25, previous:24.3, measured:24.0, tmin:18, section:'Dish End B' },
                { cml:4, location:'Bottom Drum Shell — 0°', orientation:'Longitudinal', nominal:25, previous:24.4, measured:24.1, tmin:18, section:'Shell' },
                { cml:5, location:'Bottom Drum Shell — 180°', orientation:'Circumferential', nominal:25, previous:23.5, measured:22.8, tmin:18, section:'Shell' },
              ]}
            },
            {
              id: 'insp-101-5', date: '2026-05-20', type: 'External', inspector: 'S. Kumar',
              ndtMethod: 'UT - Ultrasonic', equipment: 'Olympus 38DL Plus', condition: 'Fair',
              corrosion: 'Minor Pitting', findings: 'Bottom Drum 180° at 22.2mm — approaching T-Min warning zone.', avgThickness: 23.1, minThickness: 22.2,
              remainingLife: '28.0 years', remainingLifeYears: 28.0, nextInspectionDate: '2027-05-20',
              corrosionRate: 0.15,
              gridData: { rows: [
                { cml:1, location:'Top Drum Shell — 0°', orientation:'Longitudinal', nominal:25, previous:24.5, measured:24.3, tmin:18, section:'Top Drum Shell' },
                { cml:2, location:'Top Drum Shell — 90°', orientation:'Longitudinal', nominal:25, previous:24.5, measured:24.2, tmin:18, section:'Top Drum Shell' },
                { cml:3, location:'Top Drum DE-A — Knuckle 0°', orientation:'Circumferential', nominal:25, previous:23.2, measured:22.8, tmin:18, section:'Dish End A' },
                { cml:4, location:'Top Drum DE-B — Center', orientation:'Radial', nominal:25, previous:24.0, measured:23.7, tmin:18, section:'Dish End B' },
                { cml:5, location:'Bottom Drum Shell — 0°', orientation:'Longitudinal', nominal:25, previous:24.1, measured:23.8, tmin:18, section:'Shell' },
                { cml:6, location:'Bottom Drum Shell — 180°', orientation:'Circumferential', nominal:25, previous:22.8, measured:22.2, tmin:18, section:'Shell' },
              ]}
            }
          ],
          repairs: [
            { id: 'rep-101-1', startDate: '2026-01-15', finishDate: '2026-01-18', method: 'Weld Overlay', personIncharge: 'R. Ahmad', welderName: 'M. Faiz', welderId: 'WLD-0421', originalCode: 'ASME Section I', repairCode: 'ASME PCC-2', shellHeadMaterial: 'SA-516 Gr.70', replacementMaterial: 'E7018 Electrode', ndt: 'MPI + UT Thickness', designPressure: '10', designTemp: '200', hydrostatic: 'Yes', inspectionName: 'A. Rahman', scope: 'Weld overlay build-up on bottom drum shell at 180° location. 3-pass overlay using E7018 electrodes. Post-weld UT and MPI performed — acceptable.' },
            { id: 'rep-101-2', startDate: '2025-04-20', finishDate: '2025-04-22', method: 'Tube Replacement', personIncharge: 'R. Ahmad', welderName: 'S. Tan', welderId: 'WLD-0387', originalCode: 'BS2790', repairCode: 'NBIC', shellHeadMaterial: 'SA-192', replacementMaterial: 'SA-210 Gr.A1', ndt: 'Radiography + PWHT', designPressure: '8.5', designTemp: '180', hydrostatic: 'Yes', inspectionName: 'A. Rahman', scope: 'Replaced 3 water tubes in Top Drum — Tube Bank 3 due to wall thinning. PWHT performed per WPS. RT confirmed sound welds. Hydrotest passed at 1.3x MAWP.' }
          ],
          alterations: [],
          thicknessHistory: [
            { date: '2025-03-10', thickness: 24.8 }, { date: '2025-07-22', thickness: 24.5 },
            { date: '2025-11-15', thickness: 24.1 }, { date: '2026-02-08', thickness: 23.6 },
            { date: '2026-05-20', thickness: 23.1 }
          ],
          documents: []
        },
        102: {
          inspections: [
            {
              id: 'insp-102-1', date: '2025-06-15', type: 'External', inspector: 'M. Johnson',
              ndtMethod: 'UT - Ultrasonic', equipment: 'Olympus 38DL Plus', condition: 'Good',
              corrosion: 'None', findings: 'All sections in excellent condition.', avgThickness: 29.5, minThickness: 29.2,
              remainingLife: '63.3 years', remainingLifeYears: 63.3, nextInspectionDate: '2030-06-15',
              corrosionRate: 0.15,
              gridData: { rows: [
                { cml:1, location:'Shell — 0°', orientation:'Longitudinal', nominal:30, previous:30.0, measured:29.8, tmin:20, section:'Shell' },
                { cml:2, location:'Shell — 180°', orientation:'Circumferential', nominal:30, previous:30.0, measured:29.5, tmin:20, section:'Shell' },
                { cml:3, location:'Dish End A — Knuckle 0°', orientation:'Circumferential', nominal:30, previous:30.0, measured:29.3, tmin:20, section:'Dish End A' },
                { cml:4, location:'Dish End B — Knuckle 0°', orientation:'Circumferential', nominal:30, previous:30.0, measured:29.2, tmin:20, section:'Dish End B' },
              ]}
            },
            {
              id: 'insp-102-2', date: '2025-09-20', type: 'External', inspector: 'M. Johnson',
              ndtMethod: 'UT - Ultrasonic', equipment: 'Olympus 38DL Plus', condition: 'Good',
              corrosion: 'None', findings: 'Shell 180° showing slight thinning.', avgThickness: 28.8, minThickness: 28.2,
              remainingLife: '54.7 years', remainingLifeYears: 54.7, nextInspectionDate: '2030-09-20',
              corrosionRate: 0.15,
              gridData: { rows: [
                { cml:1, location:'Shell — 0°', orientation:'Longitudinal', nominal:30, previous:29.8, measured:29.5, tmin:20, section:'Shell' },
                { cml:2, location:'Shell — 180°', orientation:'Circumferential', nominal:30, previous:29.5, measured:28.5, tmin:20, section:'Shell' },
                { cml:3, location:'Dish End A — Knuckle 0°', orientation:'Circumferential', nominal:30, previous:29.3, measured:28.8, tmin:20, section:'Dish End A' },
                { cml:4, location:'Dish End B — Knuckle 0°', orientation:'Circumferential', nominal:30, previous:29.2, measured:28.6, tmin:20, section:'Dish End B' },
              ]}
            },
            {
              id: 'insp-102-3', date: '2025-12-10', type: 'External', inspector: 'M. Johnson',
              ndtMethod: 'UT - Ultrasonic', equipment: 'Olympus 38DL Plus', condition: 'Fair',
              corrosion: 'Minor Pitting', findings: 'Shell 180° continuing to thin.', avgThickness: 28.0, minThickness: 27.3,
              remainingLife: '48.7 years', remainingLifeYears: 48.7, nextInspectionDate: '2030-12-10',
              corrosionRate: 0.15,
              gridData: { rows: [
                { cml:1, location:'Shell — 0°', orientation:'Longitudinal', nominal:30, previous:29.5, measured:29.0, tmin:20, section:'Shell' },
                { cml:2, location:'Shell — 180°', orientation:'Circumferential', nominal:30, previous:28.5, measured:27.5, tmin:20, section:'Shell' },
                { cml:3, location:'Dish End A — Knuckle 0°', orientation:'Circumferential', nominal:30, previous:28.8, measured:27.8, tmin:20, section:'Dish End A' },
                { cml:4, location:'Dish End B — Knuckle 0°', orientation:'Circumferential', nominal:30, previous:28.6, measured:28.0, tmin:20, section:'Dish End B' },
              ]}
            },
            {
              id: 'insp-102-4', date: '2026-03-05', type: 'External', inspector: 'M. Johnson',
              ndtMethod: 'UT - Ultrasonic', equipment: 'Olympus 38DL Plus', condition: 'Fair',
              corrosion: 'Minor Pitting', findings: 'Shell 180° at 26.5mm — accelerated corrosion.', avgThickness: 27.2, minThickness: 26.3,
              remainingLife: '42.0 years', remainingLifeYears: 42.0, nextInspectionDate: '2027-03-05',
              corrosionRate: 0.15,
              gridData: { rows: [
                { cml:1, location:'Shell — 0°', orientation:'Longitudinal', nominal:30, previous:29.0, measured:28.5, tmin:20, section:'Shell' },
                { cml:2, location:'Shell — 180°', orientation:'Circumferential', nominal:30, previous:27.5, measured:26.5, tmin:20, section:'Shell' },
                { cml:3, location:'Dish End A — Knuckle 0°', orientation:'Circumferential', nominal:30, previous:27.8, measured:26.8, tmin:20, section:'Dish End A' },
                { cml:4, location:'Dish End B — Knuckle 0°', orientation:'Circumferential', nominal:30, previous:28.0, measured:27.3, tmin:20, section:'Dish End B' },
              ]}
            },
            {
              id: 'insp-102-5', date: '2026-06-01', type: 'External', inspector: 'M. Johnson',
              ndtMethod: 'UT - Ultrasonic', equipment: 'Olympus 38DL Plus', condition: 'Fair',
              corrosion: 'Minor Pitting', findings: 'Shell 180° at 25.5mm — most critical location.', avgThickness: 26.3, minThickness: 25.5,
              remainingLife: '36.7 years', remainingLifeYears: 36.7, nextInspectionDate: '2027-06-01',
              corrosionRate: 0.15,
              gridData: { rows: [
                { cml:1, location:'Shell — 0°', orientation:'Longitudinal', nominal:30, previous:28.5, measured:28.0, tmin:20, section:'Shell' },
                { cml:2, location:'Shell — 180°', orientation:'Circumferential', nominal:30, previous:26.5, measured:25.5, tmin:20, section:'Shell' },
                { cml:3, location:'Dish End A — Knuckle 0°', orientation:'Circumferential', nominal:30, previous:26.8, measured:26.0, tmin:20, section:'Dish End A' },
                { cml:4, location:'Dish End B — Knuckle 0°', orientation:'Circumferential', nominal:30, previous:27.3, measured:26.8, tmin:20, section:'Dish End B' },
              ]}
            }
          ],
          repairs: [
            { id: 'rep-102-1', startDate: '2025-08-10', finishDate: '2025-08-12', method: 'Patch Plate', personIncharge: 'K. Lee', welderName: 'J. Wong', welderId: 'WLD-0512', originalCode: 'ASME Section VIII Div.1', repairCode: 'ASME PCC-2', shellHeadMaterial: 'SA-516 Gr.70', replacementMaterial: 'SS316L 6mm Plate', ndt: 'Radiography + DPI', designPressure: '12.5', designTemp: '150', hydrostatic: 'Yes', inspectionName: 'M. Johnson', scope: 'Installation of 6mm SS316L patch plate over thinned area on Shell — 180°. Butt weld prepared per WPS-PV-018. RT and DPI performed — no defects found. Hydrotest passed.' }
          ],
          alterations: [],
          thicknessHistory: [
            { date: '2025-06-15', thickness: 29.5 }, { date: '2025-09-20', thickness: 28.8 },
            { date: '2025-12-10', thickness: 28.0 }, { date: '2026-03-05', thickness: 27.2 },
            { date: '2026-06-01', thickness: 26.3 }
          ],
          documents: []
        }
      }
    },
    version: 0
  };

  localStorage.setItem('asset-monitor-storage', JSON.stringify(store));
  console.log('✅ Sample data loaded!');
  console.log('   SL-PMD-12345 (Boiler) — 5 inspections, 2 repairs');
  console.log('   SL-PMD-67890 (Pressure Vessel) — 5 inspections, 1 repair');
  return true;
}
