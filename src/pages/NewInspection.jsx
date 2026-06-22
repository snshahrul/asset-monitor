import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InspectionForm from '../features/inspection/InspectionForm';

export default function NewInspection() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
    navigate('/');
  };

  return <InspectionForm isOpen={isOpen} onClose={handleClose} />;
}