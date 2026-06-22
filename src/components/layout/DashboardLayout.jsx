import { Outlet, useNavigate } from 'react-router-dom';
import { Plus, FileText, Wrench, PenTool, Download, RotateCcw, LayoutDashboard } from 'lucide-react';
import { useAssetStore } from '../../store/useAssetStore';
import Button from '../ui/Button';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const assets = useAssetStore(s => s.assets);

  return (
    <div className="min-h-screen bg-dark-900 text-gray-200">
      <header className="bg-dark-800/95 border-b border-dark-600 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-primary-900 font-bold text-sm tracking-wide">
            <LayoutDashboard size={20} /> Asset Monitor
          </button>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Button variant="accent" size="xs" icon={Plus} onClick={() => navigate('/equipment/new')}>Add</Button>
            <Button variant="primary" size="xs" icon={FileText} onClick={() => navigate('/inspection/new')} disabled={!assets.length}>Inspect</Button>
            <Button variant="success" size="xs" icon={Wrench} onClick={() => navigate('/repair/new')} disabled={!assets.length}>Repair</Button>
            <Button variant="outline" size="xs" icon={PenTool} onClick={() => navigate('/alteration/new')} disabled={!assets.length}>Alter</Button>
            <Button variant="outline" size="xs" icon={Download} onClick={() => {}}>Export</Button>
            <Button variant="danger" size="xs" icon={RotateCcw} onClick={() => { localStorage.clear(); window.location.reload(); }}>Reset</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
