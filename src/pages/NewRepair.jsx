import { useNavigate } from 'react-router-dom';
import RepairForm from '../features/repair/RepairForm';
export default function NewRepair() { const n = useNavigate(); return <RepairForm isOpen={true} onClose={() => n('/')} />; }
