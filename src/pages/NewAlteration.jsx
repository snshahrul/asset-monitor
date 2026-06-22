import { useNavigate } from 'react-router-dom';
import AlterationForm from '../features/alteration/AlterationForm';
export default function NewAlteration() { const n = useNavigate(); return <AlterationForm isOpen={true} onClose={() => n('/')} />; }
