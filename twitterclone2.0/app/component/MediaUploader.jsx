// components/MediaUploader.js
'use client';
import { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';


export default function MediaUploader({ onUploadComplete, onClose }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');


  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-media', { method: 'POST', body: formData });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Upload failed');
      
      onUploadComplete(data.publicUrl, file);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c1f26] rounded-lg shadow-xl w-full max-w-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Upload Media</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><X /></button>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-800" onClick={() => document.getElementById('file-input')?.click()}>
          <input id="file-input" type="file" className="hidden" onChange={handleFileChange} />
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-full rounded-lg" />
          ) : file ? (
            <p>{file.name}</p>
          ) : (
            <>
              <UploadCloud size={40} className="text-gray-500 mb-2" />
              <p>Click to upload</p>
            </>
          )}
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button onClick={handleUpload} disabled={!file || isUploading} className="w-full mt-4 p-2 bg-blue-600 rounded-lg disabled:bg-gray-500">
          {isUploading ? 'Uploading...' : 'Send'}
        </button>
      </div>
    </div>
  );
}