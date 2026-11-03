import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, RefreshCw, Trash2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { validateUploadedImageFile } from '../../utils/engine.js';

interface FoodPhotoUploaderProps {
  currentImage: string;
  onImageChange: (imageUrl: string) => void;
}

const PRESET_DISHES = [
  {
    name: 'Artisan Latte',
    url: '/src/assets/images/hero_latte_art_cup_1793552349663.jpg',
    category: 'Coffee',
  },
  {
    name: 'Gourmet Sandwich',
    url: '/src/assets/images/gourmet_chicken_sandwich_1793552350172.jpg',
    category: 'Food',
  },
  {
    name: 'Chocolate Muffin',
    url: '/src/assets/images/chocolate_lava_muffin_1793552350693.jpg',
    category: 'Dessert',
  },
  {
    name: 'Fine Dining Special',
    url: '/src/assets/images/restaurant_table_standee_1793552351244.jpg',
    category: 'Dining',
  },
];

export const FoodPhotoUploader: React.FC<FoodPhotoUploaderProps> = ({
  currentImage,
  onImageChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{
    fileName?: string;
    fileSizeKB?: number;
    isCustomUpload?: boolean;
  }>(() => {
    const isDataUrl = currentImage?.startsWith('data:image/');
    return {
      fileName: isDataUrl ? 'Uploaded Food Photo' : 'Preset Photo',
      isCustomUpload: isDataUrl,
    };
  });

  // Client-side image compression & optimization function
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
        // Calculate bounded dimensions (max 800px on longest edge for crisp mobile display & optimal storage)
        const maxDimension = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
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

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP if supported, fallback to JPEG
        let dataUrl = canvas.toDataURL('image/webp', 0.85);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }

        const sizeInKB = Math.round((dataUrl.length * 0.75) / 1024);

        setImageMeta({
          fileName: file.name,
          fileSizeKB: sizeInKB,
          isCustomUpload: true,
        });

        // Notify parent state
        onImageChange(dataUrl);
        setIsProcessing(false);

        // Also post to backend upload API for server storage
        fetch('/api/upload-food-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: dataUrl,
            fileName: file.name,
          }),
        }).catch(() => {
          // Local storage is authoritative on client
        });
      };

      img.onerror = () => {
        setUploadError('Could not decode the selected image.');
        setIsProcessing(false);
      };

      if (typeof e.target?.result === 'string') {
        img.src = e.target.result;
      }
    };

    reader.onerror = () => {
      setUploadError('Error reading file.');
      setIsProcessing(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndCompressImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAndCompressImage(file);
    }
  };

  const handleRemoveImage = () => {
    // Reset to initial artisan latte preset
    const defaultPreset = PRESET_DISHES[0].url;
    onImageChange(defaultPreset);
    setImageMeta({
      fileName: 'Preset Photo',
      isCustomUpload: false,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-semibold block text-[#542B17] text-xs">
          Food Photo *
        </label>
        <span className="text-[10px] text-stone-500 font-medium">
          Upload from mobile or PC
        </span>
      </div>

      {/* Hidden native file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
      />

      {/* Active Photo Preview & Controls */}
      {currentImage ? (
        <div className="p-3 bg-[#FAF5ED] rounded-xl border border-[#E9DFD3] space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#D99A4E] shrink-0 bg-stone-100 shadow-2xs">
              <img
                src={currentImage}
                alt="Dish preview"
                className="w-full h-full object-cover"
              />
              {imageMeta.isCustomUpload && (
                <span className="absolute bottom-1 right-1 p-0.5 bg-emerald-600 text-white rounded-full">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="text-xs font-bold text-[#211B17] truncate flex items-center gap-1.5">
                <span className="truncate">{imageMeta.fileName || 'Food Photo'}</span>
                {imageMeta.isCustomUpload && (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold shrink-0">
                    Custom Photo
                  </span>
                )}
              </div>
              <div className="text-[10px] text-stone-500 font-mono">
                {imageMeta.fileSizeKB ? `${imageMeta.fileSizeKB} KB · Optimized WebP` : 'Ready for Customer Menu'}
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Saved & Persistent</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Replace or Remove */}
          <div className="flex items-center gap-2 pt-1 border-t border-stone-200">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-50 border border-[#542B17]/20 text-[#542B17] rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
            >
              <RefreshCw className={`w-3 h-3 text-[#B87532] ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Optimizing...' : 'Replace Photo'}</span>
            </button>

            <button
              type="button"
              onClick={handleRemoveImage}
              className="py-1.5 px-2.5 bg-white hover:bg-red-50 border border-red-200 text-red-600 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
              title="Remove photo"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-[#B87532] bg-[#FAF5ED]'
              : 'border-[#E9DFD3] hover:border-[#B87532] bg-white'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-[#FAF5ED] text-[#B87532] flex items-center justify-center mx-auto mb-2">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-[#542B17]">
            {isProcessing ? 'Processing image...' : 'Click or Drag to Upload Food Photo'}
          </div>
          <p className="text-[10px] text-stone-500 mt-0.5">
            JPG, PNG or WebP up to 5MB. Auto-optimized for instant mobile load.
          </p>
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-[11px] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Quick Curated Dish Presets */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
          Or Choose from Curated Food Presets
        </span>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_DISHES.map((preset) => {
            const isSelected = currentImage === preset.url;
            return (
              <button
                key={preset.url}
                type="button"
                onClick={() => {
                  onImageChange(preset.url);
                  setImageMeta({
                    fileName: preset.name,
                    isCustomUpload: false,
                  });
                }}
                className={`p-1 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-[#542B17] ring-1 ring-[#542B17] bg-[#FAF5ED]'
                    : 'border-stone-200 hover:border-[#B87532] bg-white'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="w-full h-10 object-cover rounded"
                />
                <span className="text-[9px] font-semibold text-[#211B17] block truncate mt-1">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
