import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import EquipmentDetail from './pages/EquipmentDetail';
import NewEquipment from './pages/NewEquipment';
import NewInspection from './pages/NewInspection';
import NewRepair from './pages/NewRepair';
import NewAlteration from './pages/NewAlteration';
import EditEquipment from './pages/EditEquipment';

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/equipment/:id" element={<EquipmentDetail />} />
        <Route path="/equipment/new" element={<NewEquipment />} />
        <Route path="/inspection/new" element={<NewInspection />} />
        <Route path="/repair/new" element={<NewRepair />} />
        <Route path="/alteration/new" element={<NewAlteration />} />
        <Route path="/equipment/edit/:id" element={<EditEquipment />} />
      </Route>
    </Routes>
  );
}
