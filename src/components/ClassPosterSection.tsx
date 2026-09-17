import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Maximize2, 
  ExternalLink, 
  Download, 
  Upload, 
  X, 
  ZoomIn, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RotateCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClassProject } from '../types';
import { useI18n } from '../utils/i18n';
import { getClassPosterFileName, getClassPosterStem } from '../utils/classPoster';

interface ClassPosterSectionProps {
  project: ClassProject;
  onPosterUpdated?: (newUrl: string) => void;
}

export const ClassPosterSection: React.FC<ClassPosterSectionProps> = ({ project, onPosterUpdated }) => {
  const { language } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const posterFileName = getClassPosterFileName(project);
  const stem = getClassPosterStem(project);

  const [imageUrl, setImageUrl] = useState<string>(`/classposter/${stem || '1-A'}.png`);
  const [pdfUrl, setPdfUrl] = useState<string>(`/classposter/${stem || '1-A'}.pdf`);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [candidateIndex, setCandidateIndex] = useState<number>(0);
  const [candidateList, setCandidateList] = useState<string[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    if (!stem) {
      setIsLoading(false);
      return;
    }

    const savedPoster = localStorage.getItem(`custom_poster_${project.id}`);
    if (savedPoster && (savedPoster.startsWith('data:image/') || savedPoster.startsWith('blob:'))) {
      if (isMounted) {
        setImageUrl(savedPoster);
        setPdfUrl(`/classposter/${stem}.pdf`);
        setIsLoading(false);
        setHasError(false);
      }
      return;
    }

    const directImg = `/classposter/${stem}.png`;
    const directPdf = `/classposter/${stem}.pdf`;
    
    setImageUrl(directImg);
    setPdfUrl(directPdf);
    setIsLoading(true);
    setHasError(false);
    setCandidateIndex(0);

    const candidates = [
      directImg,
      `/classposter/${stem}.jpg`,
      `/classposter/${stem}.jpeg`,
      `/classposter/${stem}.webp`,
      `/images/classes/${stem}.png`,
      `/images/classes/${stem}.jpg`
    ];
    setCandidateList(candidates);

    fetch(`/api/check-poster?file=${encodeURIComponent(stem)}.pdf`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.exists && data.imageUrl) {
          const timestamp = Date.now();
          const liveImg = `${data.imageUrl}?t=${timestamp}`;
          const livePdf = data.pdfUrl ? `${data.pdfUrl}?t=${timestamp}` : directPdf;
          setImageUrl(liveImg);
          setPdfUrl(livePdf);
          setCandidateList([liveImg, ...candidates]);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [project.id, stem]);

  if (!posterFileName && !stem) return null;

  const handleFileUpload = async (file: File) => {
    if (!file || !stem) return;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(file.name);

    if (!isPdf && !isImage) {
      setUploadError(language === 'en' ? 'Please upload a PDF or image file.' : 'PDFまたは画像ファイルを選択してください。');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const targetName = isPdf ? `${stem}.pdf` : `${stem}.png`;

          const response = await fetch('/api/upload-poster', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: targetName,
              dataBase64: base64Data,
              folder: 'classposter'
            })
          });

          const result = await response.json();
          if (result.success) {
            const timestamp = Date.now();
            const newImgUrl = result.imageUrl ? `${result.imageUrl}?t=${timestamp}` : (isImage ? base64Data : `/classposter/${stem}.png?t=${timestamp}`);
            const newPdfUrl = result.pdfUrl ? `${result.pdfUrl}?t=${timestamp}` : `/classposter/${stem}.pdf?t=${timestamp}`;

            setImageUrl(newImgUrl);
            setPdfUrl(newPdfUrl);
            setHasError(false);
            setUploadSuccess(true);
            localStorage.setItem(`custom_poster_${project.id}`, newImgUrl);

            if (onPosterUpdated) {
              onPosterUpdated(newImgUrl);
            }
            setTimeout(() => setUploadSuccess(false), 3500);
          } else {
            const fallbackBlob = URL.createObjectURL(file);
            setImageUrl(fallbackBlob);
            setHasError(false);
            setUploadSuccess(true);
            localStorage.setItem(`custom_poster_${project.id}`, base64Data);
            setTimeout(() => setUploadSuccess(false), 3500);
          }
        } catch {
          const fallbackBlob = URL.createObjectURL(file);
          setImageUrl(fallbackBlob);
          setHasError(false);
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 3500);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploading(false);
      setUploadError(language === 'en' ? 'Upload failed.' : 'アップロードに失敗しました。');
    }
  };

  const handleImageError = () => {
    const nextIdx = candidateIndex + 1;
    if (nextIdx < candidateList.length) {
      setCandidateIndex(nextIdx);
      setImageUrl(candidateList[nextIdx]);
    } else {
      setHasError(true);
    }
  };

  const handleReload = () => {
    setHasError(false);
    setCandidateIndex(0);
    setImageUrl(`/classposter/${stem}.png?t=${Date.now()}`);
  };

  return (
    <div className="rounded-xs border border-emerald-200/80 bg-linear-to-b from-emerald-50/50 to-white overflow-hidden shadow-2xs">
      <div className="px-4 py-3 bg-emerald-50/90 border-b border-emerald-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-emerald-800 shrink-0" />
          <span className="font-bold text-xs sm:text-sm text-emerald-950">
            {language === 'en' ? 'Class Poster' : 'クラスポスター'}
          </span>
          <span className="bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 font-mono text-[11px] font-bold px-2 py-0.5 rounded-xs shadow-2xs">
            {posterFileName || `${stem}.pdf`}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf,image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          {pdfUrl && (
            <>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 px-2.5 py-1 rounded-xs bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 transition-colors shadow-2xs"
                title={language === 'en' ? 'Open PDF in new tab' : 'PDFを別タブで開く'}
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">PDF</span>
              </a>

              <a
                href={pdfUrl}
                download={`${project.classNumber}_ポスター.pdf`}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-xs bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 transition-colors shadow-2xs"
                title={language === 'en' ? 'Download PDF' : 'PDF保存'}
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">{language === 'en' ? 'Save' : '保存'}</span>
              </a>
            </>
          )}

          {!hasError && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-xs bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
              title={language === 'en' ? 'Fullscreen' : '全画面拡大'}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'en' ? 'Enlarge' : '拡大'}</span>
            </button>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            aria-label={isCollapsed ? 'Expand poster' : 'Collapse poster'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {uploadSuccess && (
        <div className="mx-3 mt-3 p-2 bg-emerald-100 text-emerald-900 text-xs rounded-xs border border-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{language === 'en' ? 'Poster uploaded successfully!' : 'ポスターが正常に保存・更新されました！'}</span>
        </div>
      )}

      {uploadError && (
        <div className="mx-3 mt-3 p-2 bg-rose-50 text-rose-800 text-xs rounded-xs border border-rose-200 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {!isCollapsed && (
        <div className="p-3 sm:p-4">
          {hasError ? (
            <div className="p-6 text-center rounded-xs border border-slate-200 bg-slate-50 flex flex-col items-center justify-center space-y-3">
              <FileText className="w-10 h-10 text-emerald-700" />
              <div>
                <p className="text-sm font-bold text-slate-800">{project.classNumber} 公式ポスター ({stem}.pdf)</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'en' ? 'PDF file is available.' : 'PDFファイルが登録されています。'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReload}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xs text-xs font-bold transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Retry' : '再読み込み'}</span>
                </button>
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xs text-xs font-bold transition-colors shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Open PDF' : 'PDFを開く'}</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div 
                onClick={() => setIsFullscreen(true)}
                className="relative group cursor-pointer overflow-hidden rounded-xs border border-slate-200/90 bg-slate-900/5 shadow-xs transition-all hover:shadow-md hover:border-emerald-300 flex items-center justify-center min-h-[300px] max-h-[560px]"
              >
                <img
                  src={imageUrl}
                  alt={`${project.classNumber} ポスター`}
                  className="w-full h-auto max-h-[560px] object-contain rounded-xs select-none"
                  onError={handleImageError}
                  loading="eager"
                />

                <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0 px-3.5 py-1.5 bg-slate-900/85 backdrop-blur-xs text-white text-xs font-bold rounded-xs flex items-center gap-1.5 shadow-md">
                    <ZoomIn className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'en' ? 'Click to enlarge' : 'クリックで拡大表示'}</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {isFullscreen && !hasError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-slate-950/95 backdrop-blur-md flex flex-col p-2 sm:p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <div
              className="flex items-center justify-between bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-xs mb-2 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-2 text-white">
                <span className="text-xs sm:text-sm font-bold truncate max-w-[200px] sm:max-w-md">
                  {project.classNumber} 「{project.title}」 {language === 'en' ? 'Poster' : '公式ポスター'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {pdfUrl && (
                  <>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xs flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">PDF</span>
                    </a>

                    <a
                      href={pdfUrl}
                      download={`${project.classNumber}_ポスター.pdf`}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xs flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{language === 'en' ? 'Save' : 'PDF保存'}</span>
                    </a>
                  </>
                )}

                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xs transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              className="flex-1 w-full max-w-5xl mx-auto rounded-xs overflow-auto bg-slate-950 flex items-center justify-center p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imageUrl}
                alt={`${project.classNumber} ポスター拡大`}
                className="max-w-full max-h-[85vh] object-contain rounded-xs shadow-2xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
