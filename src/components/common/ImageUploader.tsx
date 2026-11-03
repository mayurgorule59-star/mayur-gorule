import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, RefreshCw, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { validateUploadedImageFile } from '../../utils/engine.js';

interface ImageUploaderProps {
  label: string;
  currentImage: string;
  onImageChange: (imageUrl: string) => void;
  aspectRatio?: 'square' | 'wide';
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  currentImage,
  onImageChange,
  aspectRatio = 'square',
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const processAndCompressImage = (file: File) => {
    setUploadError(null);
    const validation = validateUploadedImageFile({ type: file.type, size: file.size });
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid image file.');
      return;
    }

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDimension = aspectRatio === 'wide' ? 1200 : 800;
        let width = img.width;
        let height = img.height;

        // Simple aspect ratio handling
        if (aspectRatio === 'square') {
          const minDim = Math.min(width, height);
          width = minDim;
          height = minDim;
        }

        if (width > maxDimension || height > maxDimension) {
          const scale = maxDimension / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setUploadError('Failed to process image canvas.');
          setIsProcessing(false);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);

        let dataUrl = canvas.toDataURL('image/webp', 0.85);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }

        onImageChange(dataUrl);
        setIsProcessing(false);

        fetch('/api/upload-food-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: dataUrl, fileName: file.name }),
        }).catch(() => {});
      };
      img.onerror = () => {
        setUploadError('Could not decode the selected image.');
        setIsProcessing(false);
      };
      if (typeof e.target?.result === 'string') img.src = e.target.result;
    };
    reader.onerror = () => {
      setUploadError('Error reading file.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="font-semibold block text-[#542B17] text-xs">{label}</label>
      <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && processAndCompressImage(e.target.files[0])} accept="image/*" className="hidden" />
      
      {currentImage ? (
        <div className="space-y-2">
          <div className={`relative ${aspectRatio === 'wide' ? 'aspect-[21/9]' : 'aspect-square'} w-full rounded-xl overflow-hidden border border-[#E9DFD3] bg-stone-100`}>
            <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-1.5 text-xs bg-white border border-[#542B17]/20 rounded-lg">Replace</button>
            <button onClick={() => onImageChange('')} className="py-1.5 px-3 text-xs bg-red-50 text-red-600 rounded-lg"><Trash2 className="w-3.5 h-3.5"/></button>
          </div>
        </div>
      ) : (
        <div onClick={() => fileInputRef.current?.click()} className="p-6 border-2 border-dashed border-[#E9DFD3] rounded-xl text-center cursor-pointer hover:border-[#B87532]">
          <Upload className="w-6 h-6 text-stone-400 mx-auto mb-2" />
          <span className="text-xs font-semibold text-[#542B17]">Click to Upload</span>
        </div>
      )}
      {uploadError && <div className="text-[10px] text-red-600">{uploadError}</div>}
    </div>
  );
};
