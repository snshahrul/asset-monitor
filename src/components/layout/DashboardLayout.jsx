import { Outlet, useNavigate } from 'react-router-dom';
import { Plus, FileText, Wrench, PenTool, Download, RotateCcw, LayoutDashboard } from 'lucide-react';
import { useAssetStore } from '../../store/useAssetStore';
import Button from '../ui/Button';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const assets = useAssetStore(s => s.assets);

  return (
    <div className="min-h-screen bg-dark-900 text-gray-200">
      <header className="bg-dark-800 border-b border-dark-600 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-primary-900 font-bold text-lg">
            <LayoutDashboard size={24} /> Asset Monitor
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="accent" icon={Plus} onClick={() => navigate('/equipment/new')}>Add Equipment</Button>
            <Button variant="primary" icon={FileText} onClick={() => navigate('/inspection/new')} disabled={!assets.length}>Inspection</Button>
            <Button variant="success" icon={Wrench} onClick={() => navigate('/repair/new')} disabled={!assets.length}>Repair</Button>
            <Button variant="outline" icon={PenTool} onClick={() => navigate('/alteration/new')} disabled={!assets.length}>Alteration</Button>
            <Button variant="outline" icon={Download} onClick={() => {}}>Export</Button>
            <Button variant="danger" icon={RotateCcw} onClick={() => { localStorage.clear(); window.location.reload(); }}>Reset</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
