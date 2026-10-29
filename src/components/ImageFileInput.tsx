import React, { useRef, useState } from 'react';
import { Upload, Trash2, RefreshCw, CheckCircle2, Camera, Cloud, AlertCircle } from 'lucide-react';

// Imgbb API key - set VITE_IMGBB_API_KEY in .env file
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY as string | undefined;

interface ImageFileInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  helperText?: string;
  id?: string;
}

/**
 * Resizes the image to max 1200px and converts to JPEG base64 for upload.
 */
const prepareImageForUpload = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Seçilen dosya geçerli bir görsel değil.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Dosya okunamadı.'));
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        reject(new Error('Dosya içeriği boş.'));
        return;
      }

      // SVG and GIF: return as-is
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        resolve(result);
        return;
      }

      const img = new Image();
      img.onerror = () => resolve(result);
      img.onload = () => {
        try {
          const maxDimension = 1200;
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
          if (!ctx) { resolve(result); return; }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          resolve(optimizedDataUrl);
        } catch {
          resolve(result);
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Uploads a base64 image to Imgbb and returns the permanent CDN URL.
 */
const uploadToImgbb = async (base64DataUrl: string, apiKey: string): Promise<string> => {
  // Strip the "data:image/jpeg;base64," prefix
  const base64 = base64DataUrl.includes(',') ? base64DataUrl.split(',')[1] : base64DataUrl;

  const formData = new FormData();
  formData.append('key', apiKey);
  formData.append('image', base64);

  const response = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Sunucu hatası: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'Görsel yüklenemedi.');
  }

  // Return the permanent display URL
  return data.data.url as string;
};

export const ImageFileInput: React.FC<ImageFileInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  helperText,
  id
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'optimizing' | 'uploading' | 'done' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const processFile = async (file: File) => {
    setErrorMsg('');
    setIsProcessing(true);
    setFileName(file.name);

    try {
      // Step 1: Optimize image client-side
      setUploadStatus('optimizing');
      const base64DataUrl = await prepareImageForUpload(file);

      // Step 2: Upload to Imgbb (if API key is available)
      if (IMGBB_API_KEY) {
        setUploadStatus('uploading');
        const cdnUrl = await uploadToImgbb(base64DataUrl, IMGBB_API_KEY);
        onChange(cdnUrl);
        setUploadStatus('done');
      } else {
        // Fallback: use base64 locally (no API key configured)
        onChange(base64DataUrl);
        setUploadStatus('done');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Görsel yüklenirken bir hata oluştu.';
      setErrorMsg(message);
      setUploadStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setFileName('');
    setUploadStatus('idle');
    setErrorMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getStatusLabel = () => {
    if (uploadStatus === 'optimizing') return 'Görsel optimize ediliyor...';
    if (uploadStatus === 'uploading') return 'Buluta yükleniyor (Imgbb)...';
    return '';
  };

  const isImgbbEnabled = Boolean(IMGBB_API_KEY);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="block font-semibold text-stone-700 text-xs">
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
        {helperText && <span className="text-[11px] text-stone-400">{helperText}</span>}
      </div>

      {/* Imgbb status badge */}
      {isImgbbEnabled ? (
        <div className="flex items-center gap-1 mb-2">
          <Cloud className="w-3 h-3 text-emerald-600" />
          <span className="text-[10px] font-medium text-emerald-700">Kalıcı Bulut Depolama Aktif</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 mb-2">
          <AlertCircle className="w-3 h-3 text-amber-500" />
          <span className="text-[10px] font-medium text-amber-700">API key girilmedi — görsel sadece bu tarayıcıda görünür</span>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        /* Image Preview State */
        <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3 transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-200 shrink-0 border border-stone-300 shadow-sm">
              <img
                src={value}
                alt="Görsel önizleme"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-0.5">
                {isImgbbEnabled ? <Cloud className="w-3.5 h-3.5 shrink-0" /> : <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                <span>{isImgbbEnabled ? 'Kalıcı CDN\'e Yüklendi ✓' : 'Görsel Seçildi ✓'}</span>
              </div>
              <p className="text-[11px] text-stone-600 truncate max-w-xs font-mono">
                {value.startsWith('http') ? value.slice(0, 45) + '...' : (fileName || 'Yüklenen görsel')}
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5">
                {isImgbbEnabled ? 'Tüm cihazlarda ve yayın ortamında görünür' : 'Lokal — yayında görünmeyebilir'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 text-xs font-medium bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              title="Farklı dosya seç"
            >
              <RefreshCw className="w-3 h-3 text-stone-500" />
              <span className="hidden sm:inline">Değiştir</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 text-xs font-medium bg-white hover:bg-rose-50 text-rose-600 border border-stone-200 hover:border-rose-200 rounded-lg flex items-center justify-center shadow-sm transition-colors cursor-pointer"
              title="Görseli Kaldır"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty File Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={`group relative border-2 border-dashed rounded-xl p-5 text-center transition-all ${
            isProcessing
              ? 'border-rose-400 bg-rose-50/60 cursor-wait'
              : isDragging
              ? 'border-rose-600 bg-rose-50/80 scale-[1.005] cursor-copy'
              : 'border-stone-300 hover:border-rose-400 bg-stone-50/50 hover:bg-rose-50/30 cursor-pointer'
          }`}
        >
          {isProcessing ? (
            <div className="py-2 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 text-rose-600 animate-spin" />
              <p className="text-xs font-medium text-stone-700">{getStatusLabel()}</p>
              {uploadStatus === 'uploading' && (
                <p className="text-[10px] text-stone-500">Görsel Imgbb CDN'e yükleniyor, lütfen bekleyin...</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-stone-800 mb-1">
                <span className="text-rose-700 underline decoration-rose-300 underline-offset-2">Dosya Seçin</span> veya buraya sürükleyin
              </p>
              <p className="text-[11px] text-stone-500 flex items-center gap-1.5">
                <Camera className="w-3 h-3 text-stone-400" />
                <span>Cihazınızdan, galerinizden veya bilgisayarınızdan fotoğraf yükleyin</span>
              </p>
              <p className="text-[10px] text-stone-400 mt-1">
                PNG, JPG, JPEG, WEBP — Otomatik optimize edilir
              </p>
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="flex items-start gap-1.5 mt-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
        </div>
      )}
    </div>
  );
};
