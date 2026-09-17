import React, { useState, useRef, useId } from 'react';
import { ZoomIn, X, Image as ImageIcon, Upload, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../utils/i18n';

interface PosterImageProps {
  src?: string;
  posterFile?: string;
  posterImage?: string;
  image?: string;
  title?: string;
  alt?: string;
  className?: string;
  allowZoom?: boolean;
  aspectRatio?: 'auto' | 'poster' | 'square' | 'video';
  onPosterUploaded?: (url: string) => void;
}

export const getPosterCandidateUrls = (src?: string, posterFile?: string, posterImage?: string, image?: string, title?: string): string[] => {
  const candidates: string[] = [];
  const add = (url?: string) => {
    if (url && url.trim() && !candidates.includes(url)) {
      candidates.push(url);
    }
  };

  [src, posterImage, image].forEach((u) => {
    if (u && (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:'))) {
      add(u);
    }
  });

  const rawTarget = posterFile || posterImage || image || src || '';
  const fileName = rawTarget.split('/').pop()?.split('\\').pop() || '';
  const withoutExt = fileName.replace(/\.[^/.]+$/, '');

  const baseNames: string[] = [];
  if (fileName) baseNames.push(fileName);
  if (withoutExt && withoutExt !== fileName) {
    baseNames.push(`${withoutExt}.png`);
    baseNames.push(`${withoutExt}.jpg`);
  }
  if (title && title.trim()) {
    baseNames.push(`${title.trim()}.png`);
  }

  const prefixes = [
    '/classposter/',
    '/images/classes/',
    '/images/projects/',
    '/images/alumni/',
    '/images/'
  ];

  for (const name of baseNames) {
    for (const prefix of prefixes) {
      add(`${prefix}${name}`);
    }
  }

  add(posterImage);
  add(image);
  add(src);

  return candidates.slice(0, 8);
};

export const PosterImage: React.FC<PosterImageProps> = ({
  src,
  posterFile,
  posterImage,
  image,
  title,
  alt,
  className = '',
  allowZoom = true,
  onPosterUploaded
}) => {
  const { language } = useI18n();
  const fileInputId = useId();
  const displayAlt = alt || title || 'SGfes 2026';
  const [candidateIndex, setCandidateIndex] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [uploadedSrc, setUploadedSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const candidateUrls = React.useMemo(() => {
    if (uploadedSrc) return [uploadedSrc];
    return getPosterCandidateUrls(src, posterFile, posterImage, image, title);
  }, [src, posterFile, posterImage, image, title, uploadedSrc]);

  const currentUrl = candidateUrls[candidateIndex];

  const handleError = () => {
    if (candidateIndex + 1 < candidateUrls.length) {
      setCandidateIndex(prev => prev + 1);
    } else {
      setHasError(true);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setUploadedSrc(base64);
      setHasError(false);
      setUploadSuccess(true);
      setIsUploading(false);

      if (onPosterUploaded) {
        onPosterUploaded(base64);
      }

      try {
        const targetName = posterFile || file.name || `${title || 'poster'}.jpg`;
        await fetch('/api/upload-poster', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: targetName,
            dataBase64: base64,
            folder: 'schedule'
          })
        });
      } catch {}

      setTimeout(() => setUploadSuccess(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  if (hasError || !currentUrl) {
    return (
      <div 
        id="poster-placeholder-card"
        className={`flex flex-col items-center justify-center bg-slate-50 border border-slate-200 text-slate-500 p-4 rounded-xs select-none relative overflow-hidden transition-all ${className}`}
      >
        <input 
          id={fileInputId}
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
        />
        
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2 shadow-2xs">
          <ImageIcon className="w-5 h-5 text-slate-400" />
        </div>

        <span className="text-xs font-bold text-slate-700 text-center line-clamp-2 px-1 mb-1">
          {title || 'ポスター'}
        </span>

        <span className="text-[10px] text-slate-400 text-center mb-3">
          {posterFile ? `${posterFile}` : (language === 'en' ? 'Official Poster' : '公式ポスター')}
        </span>

        <button
          id={`upload-poster-btn-${title || 'item'}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          disabled={isUploading}
          className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xs shadow-2xs transition-colors cursor-pointer"
        >
          {uploadSuccess ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700">{language === 'en' ? 'Loaded!' : '読込完了'}</span>
            </>
          ) : isUploading ? (
            <span>{language === 'en' ? 'Loading...' : '読込中...'}</span>
          ) : (
            <>
              <Upload className="w-3 h-3 text-slate-500" />
              <span>{language === 'en' ? 'Upload Image' : 'ポスター設定'}</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <>
      <div 
        id="poster-image-container"
        className={`relative group overflow-hidden bg-slate-100 select-none ${className}`}
      >
        <img
          src={currentUrl}
          alt={displayAlt}
          referrerPolicy="no-referrer"
          onError={handleError}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {allowZoom && (
          <button
            id="zoom-poster-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(true);
            }}
            className="absolute bottom-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
            title={language === 'en' ? 'Zoom Poster' : 'ポスターを拡大'}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        )}
      </div>

      {isZoomed && (
        <div
          id="poster-zoom-backdrop"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setIsZoomed(false)}
        >
          <div
            id="poster-zoom-dialog"
            className="relative max-w-lg w-full bg-slate-900 rounded-sm p-3 shadow-2xl overflow-hidden flex flex-col border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 px-1 border-b border-slate-700">
              <span className="text-xs font-bold text-slate-200 truncate">{displayAlt} - {language === 'en' ? 'Official Poster' : '公式ポスター'}</span>
              <button
                id="close-zoom-modal-btn"
                type="button"
                onClick={() => setIsZoomed(false)}
                className="p-1 rounded-sm text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={currentUrl}
                alt={displayAlt}
                className="max-h-[70vh] w-auto object-contain rounded-xs shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
