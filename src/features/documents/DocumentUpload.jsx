import { useState, useRef } from 'react';
import { Upload, Download, Trash2 } from 'lucide-react';
import { useAssetStore } from '../../store/useAssetStore';
import Button from '../../components/ui/Button';

export default function DocumentUpload({ assetId }) {
  const folder = useAssetStore(s => s.equipmentFolders[assetId] || { documents: [] });
  const addDocument = useAssetStore(s => s.addDocument);
  const deleteDocument = useAssetStore(s => s.deleteDocument);
  const fileRef = useRef(null);
  const docs = folder.documents || [];

  const upload = (e) => {
    Array.from(e.target.files).forEach(f => {
      const r = new FileReader();
      r.onload = (ev) => addDocument(assetId, { id: 'doc-'+Date.now(), name: f.name, type: f.type, size: f.size, data: ev.target.result, uploadedAt: new Date().toISOString() });
      r.readAsDataURL(f);
    });
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-dark-600 rounded-xl p-8 text-center hover:border-primary-800 cursor-pointer" onClick={() => fileRef.current?.click()}>
        <input ref={fileRef} type="file" multiple onChange={upload} className="hidden" />
        <div className="text-4xl mb-2">📁</div><p className="text-white font-bold">Upload Documents</p><p className="text-gray-400 text-xs mt-1">PDF, Word, Excel, Images</p>
      </div>
      {docs.length === 0 ? <p className="text-gray-500 text-center py-4">No documents</p> : docs.map(d => (
        <div key={d.id} className="card p-3 flex items-center justify-between">
          <span className="text-gray-200 text-sm">{d.name}</span>
          <div className="flex gap-2">
            <button onClick={() => { const a = document.createElement('a'); a.href = d.data; a.download = d.name; a.click(); }} className="text-primary-900"><Download size={14} /></button>
            <button onClick={() => deleteDocument(assetId, d.id)} className="text-red-400"><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
