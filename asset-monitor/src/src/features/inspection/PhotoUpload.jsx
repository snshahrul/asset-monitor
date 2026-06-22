import { useState, useRef } from 'react';
import { Camera, Trash2, ZoomIn } from 'lucide-react';

export default function PhotoUpload({ onPhotosChange, existingPhotos = [] }) {
  const [photos, setPhotos] = useState(existingPhotos);
  const [previewIndex, setPreviewIndex] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files.length) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhotos = [...photos, {
          id: 'photo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          name: file.name,
          data: event.target.result,
          caption: '',
          takenAt: new Date().toISOString()
        }];
        setPhotos(newPhotos);
        onPhotosChange?.(newPhotos);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (id) => {
    const newPhotos = photos.filter(p => p.id !== id);
    setPhotos(newPhotos);
    onPhotosChange?.(newPhotos);
  };

  const updateCaption = (id, caption) => {
    const newPhotos = photos.map(p => p.id === id ? { ...p, caption } : p);
    setPhotos(newPhotos);
    onPhotosChange?.(newPhotos);
  };

  return (
    <div className="space-y-3">
      {/* Upload Button */}
      <div className="border-2 border-dashed border-dark-600 rounded-lg p-6 text-center hover:border-primary-800 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}>
        <input ref={fileInputRef} type="file" multiple accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
        <Camera size={32} className="mx-auto text-gray-500 mb-2" />
        <p className="text-gray-400 text-sm font-semibold">Click to add photos</p>
        <p className="text-xs text-gray-500 mt-1">Supports camera or gallery upload</p>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {photos.map(photo => (
            <div key={photo.id} className="relative group">
              <img src={photo.data} alt={photo.caption || 'Inspection photo'} className="w-full h-24 object-cover rounded-lg cursor-pointer" onClick={() => setPreviewIndex(photos.indexOf(photo))} />
              <button onClick={() => removePhoto(photo.id)} className="absolute top-1 right-1 p-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={12} className="text-white" />
              </button>
              <input type="text" value={photo.caption} onChange={e => updateCaption(photo.id, e.target.value)} placeholder="Add caption..." className="w-full mt-1 text-xs bg-dark-700 border border-dark-600 rounded px-1 py-0.5 text-gray-300" />
            </div>
          ))}
        </div>
      )}

      {/* Full Screen Preview */}
      {previewIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setPreviewIndex(null)}>
          <button className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300">&times;</button>
          <img src={photos[previewIndex]?.data} alt="Preview" className="max-w-full max-h-[90vh] rounded-lg" />
          {photos[previewIndex]?.caption && (
            <p className="absolute bottom-4 text-white text-center bg-black/50 px-4 py-2 rounded">{photos[previewIndex].caption}</p>
          )}
        </div>
      )}
    </div>
  );
}