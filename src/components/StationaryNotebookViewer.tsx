import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ILecturePhotoNote } from '../types';
import {
  subscribeAllPhotoNotes,
  saveLecturePhotoNoteToFirestore,
  deleteLecturePhotoNoteFromFirestore,
} from '../lib/firestoreService';
import {
  processAndUploadPhotoNote,
  getStorageSettings,
  saveStorageSettings,
  StorageSettings,
} from '../lib/imageUploadService';
import {
  Camera,
  Upload,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sun,
  Moon,
  Contrast,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileImage,
  Download,
  Settings,
  X,
  Check,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface StationaryNotebookViewerProps {
  videoId: string;
  videoTitle?: string;
  className?: string;
}

type FilterMode = 'normal' | 'dark-invert' | 'high-contrast';

export const StationaryNotebookViewer: React.FC<StationaryNotebookViewerProps> = ({
  videoId,
  videoTitle,
  className = '',
}) => {
  const [allNotes, setAllNotes] = useState<ILecturePhotoNote[]>([]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [filterMode, setFilterMode] = useState<FilterMode>('normal');
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgressText, setUploadProgressText] = useState<string>('');

  // Settings Modal
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [storageSettings, setStorageSettings] = useState<StorageSettings>(getStorageSettings);
  const [settingsSavedToast, setSettingsSavedToast] = useState<boolean>(false);

  // File Input Refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const transformComponentRef = useRef<any>(null);

  // Subscribe to photo notes from Firestore
  useEffect(() => {
    const unsub = subscribeAllPhotoNotes((notes) => {
      setAllNotes(notes);
    });
    return () => unsub();
  }, []);

  // Filter notes for this specific lecture
  const lectureNotes = useMemo(() => {
    return allNotes
      .filter((n) => n.videoId === videoId)
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  }, [allNotes, videoId]);

  // Ensure activePageIndex is within bounds
  useEffect(() => {
    if (activePageIndex >= lectureNotes.length && lectureNotes.length > 0) {
      setActivePageIndex(lectureNotes.length - 1);
    }
  }, [lectureNotes.length, activePageIndex]);

  // Reset transform when changing page
  useEffect(() => {
    setRotationDegrees(0);
    if (transformComponentRef.current) {
      transformComponentRef.current.resetTransform();
    }
  }, [activePageIndex, videoId]);

  // Filter CSS Styles for crisp handwriting readability
  const filterStyles = useMemo(() => {
    switch (filterMode) {
      case 'dark-invert':
        return 'invert hue-rotate-180 contrast-125 brightness-90';
      case 'high-contrast':
        return 'contrast-150 brightness-105';
      default:
        return '';
    }
  }, [filterMode]);

  // Keyboard Shortcuts for Reader
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (activePageIndex < lectureNotes.length - 1) {
          setActivePageIndex((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (activePageIndex > 0) {
          setActivePageIndex((prev) => prev - 1);
        }
      } else if (e.key.toLowerCase() === 'i') {
        setFilterMode((f) => (f === 'dark-invert' ? 'normal' : 'dark-invert'));
      } else if (e.key.toLowerCase() === 'r') {
        setRotationDegrees((r) => (r + 90) % 360);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePageIndex, lectureNotes.length]);

  // Clipboard Paste listener (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;
      const imageFiles: File[] = [];

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) imageFiles.push(file);
        }
      }

      if (imageFiles.length > 0) {
        handleUploadFiles(imageFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [videoId, lectureNotes.length]);

  const handleUploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const fileList = Array.from(files);

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        setUploadProgressText(
          `Uploading to ImgBB (${i + 1}/${fileList.length}) — Page ${lectureNotes.length + i + 1}...`
        );

        const pageTitle = `Page ${lectureNotes.length + i + 1}`;
        const newNote = await processAndUploadPhotoNote(file, videoId, pageTitle);
        await saveLecturePhotoNoteToFirestore(newNote);
      }
      // Jump to newly uploaded page
      setActivePageIndex(lectureNotes.length);
    } catch (err: any) {
      console.error('Photo note upload error:', err);
      alert('Upload error: ' + (err?.message || 'Failed to process image'));
    } finally {
      setIsUploading(false);
      setUploadProgressText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  const handleDeletePage = async (noteId: string) => {
    if (window.confirm('Delete this handwritten note page?')) {
      await deleteLecturePhotoNoteFromFirestore(noteId);
      if (activePageIndex > 0) {
        setActivePageIndex((prev) => prev - 1);
      }
    }
  };

  const handleSaveSettings = () => {
    saveStorageSettings(storageSettings);
    setShowSettingsModal(false);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  const currentPage = lectureNotes[activePageIndex];

  return (
    <div className={`flex flex-col h-full bg-[#11161a] text-white select-none relative ${className}`}>
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
      />

      {/* 🧭 Stationary Notebook Header Bar */}
      <div className="px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0 z-10 flex-wrap">
        {/* Left: Page Index & Quick Flipper */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 shrink-0">
            <button
              disabled={activePageIndex <= 0}
              onClick={() => setActivePageIndex((p) => Math.max(0, p - 1))}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded transition cursor-pointer"
              title="Previous Page (←)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-amber-400 px-1">
              {lectureNotes.length > 0 ? `${activePageIndex + 1}/${lectureNotes.length}` : '0/0'}
            </span>
            <button
              disabled={activePageIndex >= lectureNotes.length - 1}
              onClick={() => setActivePageIndex((p) => Math.min(lectureNotes.length - 1, p + 1))}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded transition cursor-pointer"
              title="Next Page (→)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs font-semibold text-slate-300 truncate hidden sm:inline">
            {currentPage?.title || (lectureNotes.length > 0 ? `Page ${activePageIndex + 1}` : 'Notebook')}
          </span>
        </div>

        {/* Center/Right: Enhanced Reading Tools & Page Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {lectureNotes.length > 0 && (
            <>
              {/* Dark Paper Invert Mode Toggle */}
              <button
                onClick={() => setFilterMode((f) => (f === 'dark-invert' ? 'normal' : 'dark-invert'))}
                className={`px-2 py-1 rounded-lg text-xs font-bold font-mono flex items-center gap-1 transition cursor-pointer ${
                  filterMode === 'dark-invert'
                    ? 'bg-amber-400 text-black shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title="🌙 Dark Paper Mode (Inverts white paper to dark - gentle on eyes!) [I]"
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Dark Paper</span>
              </button>

              {/* High Contrast Ink Booster */}
              <button
                onClick={() => setFilterMode((f) => (f === 'high-contrast' ? 'normal' : 'high-contrast'))}
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                  filterMode === 'high-contrast'
                    ? 'bg-amber-400 text-black shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title="🎚️ Boost Ink Contrast (Sharpens pencil/pen handwriting)"
              >
                <Contrast className="w-3.5 h-3.5" />
              </button>

              {/* Rotate 90° */}
              <button
                onClick={() => setRotationDegrees((r) => (r + 90) % 360)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition cursor-pointer"
                title="Rotate 90° Clockwise [R]"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              {/* Download original image */}
              {currentPage && (
                <a
                  href={currentPage.imageUrl}
                  download={`lecture-note-page-${activePageIndex + 1}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition cursor-pointer"
                  title="Download original high-res photo"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              )}

              {/* Delete current page */}
              {currentPage && (
                <button
                  onClick={() => handleDeletePage(currentPage.id)}
                  className="p-1.5 bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-400 rounded-lg transition cursor-pointer"
                  title="Delete this page"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}

          {/* Compact Add Page Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-2 py-1 bg-amber-500/90 hover:bg-amber-500 text-white text-[11px] font-semibold rounded-lg flex items-center gap-1 shadow-xs transition cursor-pointer disabled:opacity-50"
            title="Upload new handwritten note page (or Ctrl+V to paste)"
          >
            <Plus className="w-3 h-3" />
            <span>Add Page</span>
          </button>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            title="Storage Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Uploading Progress Bar */}
      {isUploading && (
        <div className="px-4 py-2 bg-amber-950/80 border-b border-amber-800/80 flex items-center gap-2 text-xs text-amber-200 font-mono animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
          <span>{uploadProgressText || 'Uploading to ImgBB cloud...'}</span>
        </div>
      )}

      {/* 📖 Stationary Reading Canvas Area */}
      <div className="flex-1 min-h-0 relative overflow-hidden bg-slate-950 flex items-center justify-center">
        {lectureNotes.length === 0 ? (
          /* Empty State: Direct Stationary Upload Zone */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-full max-w-sm m-4 border-2 border-dashed border-slate-700 hover:border-amber-400/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 transition cursor-pointer bg-slate-900/40 hover:bg-slate-900/80"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">No notes for this lecture yet</h4>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Upload a photo of your handwritten notebook or paste screenshots (<kbd className="px-1 py-0.2 bg-slate-800 rounded text-[10px] font-mono">Ctrl+V</kbd>) to keep them stationary next to the video.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-3.5 py-1.5 bg-[#006494] hover:bg-[#004e75] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photos</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Camera</span>
              </button>
            </div>
          </div>
        ) : (
          /* High-Performance Smooth Zoom & Pan Stationary Reader */
          <div className="w-full h-full relative flex items-center justify-center p-2 bg-[#0d1117]">
            <TransformWrapper
              ref={transformComponentRef}
              initialScale={1}
              minScale={0.8}
              maxScale={5}
              centerOnInit={true}
              wheel={{ step: 0.15 }}
              doubleClick={{ mode: 'toggle', step: 0.7 }}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  {/* Floating On-Canvas Mini Zoom Controls */}
                  <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-1.5 py-1 rounded-xl border border-slate-700/80 shadow-2xl">
                    <button
                      onClick={() => zoomOut(0.25)}
                      className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => resetTransform()}
                      className="text-[10px] font-mono font-bold text-slate-300 hover:text-amber-400 px-1 py-0.5 rounded transition cursor-pointer"
                      title="Fit to Page / Reset Zoom"
                    >
                      Fit
                    </button>
                    <button
                      onClick={() => zoomIn(0.25)}
                      className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* The Pan-Zoom Image Canvas */}
                  <TransformComponent
                    wrapperClass="!w-full !h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                    contentClass="!w-full !h-full flex items-center justify-center"
                  >
                    <div
                      style={{
                        transform: `rotate(${rotationDegrees}deg)`,
                        transition: 'transform 0.15s ease-out',
                      }}
                      className="w-full h-full flex items-center justify-center p-1"
                    >
                      {currentPage && (
                        <img
                          src={currentPage.imageUrl}
                          alt={currentPage.title || `Note Page ${activePageIndex + 1}`}
                          className={`max-h-full max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl transition duration-150 select-none ${filterStyles}`}
                          draggable={false}
                        />
                      )}
                    </div>
                  </TransformComponent>
                </div>
              )}
            </TransformWrapper>
          </div>
        )}
      </div>

      {/* 🎞️ Stationary Bottom Page Filmstrip */}
      {lectureNotes.length > 0 && (
        <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 z-10">
          {lectureNotes.map((note, idx) => (
            <button
              key={note.id}
              onClick={() => setActivePageIndex(idx)}
              className={`relative w-11 h-11 rounded-lg overflow-hidden border-2 transition shrink-0 group cursor-pointer ${
                activePageIndex === idx
                  ? 'border-amber-400 scale-105 shadow-md ring-2 ring-amber-400/30'
                  : 'border-slate-700 opacity-60 hover:opacity-100'
              }`}
              title={`Page ${idx + 1}: ${note.title || 'Handwritten note'}`}
            >
              <img src={note.imageUrl} alt="" className="w-full h-full object-cover" />
              <span className="absolute bottom-0 right-0 px-1 bg-black/85 text-white text-[9px] font-mono font-bold rounded-tl">
                {idx + 1}
              </span>
            </button>
          ))}

          {/* Quick Add Button in Filmstrip */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-11 h-11 rounded-lg border border-dashed border-amber-500/50 hover:border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 flex items-center justify-center transition shrink-0 cursor-pointer"
            title="Upload another page"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Storage Settings Modal */}
      {showSettingsModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowSettingsModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-slate-900">Photo Notes Storage</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-amber-900">ImgBB API Key (Active)</label>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                  Active ✓
                </span>
              </div>
              <input
                type="text"
                value={storageSettings.imgbbApiKey || ''}
                onChange={(e) =>
                  setStorageSettings((s) => ({ ...s, imgbbApiKey: e.target.value }))
                }
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden"
              />
              <p className="text-[11px] text-amber-800">
                Your notes are uploaded directly to ImgBB CDN with unlimited free storage.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Saved Toast */}
      {settingsSavedToast && (
        <div className="absolute bottom-16 right-4 z-50 px-3.5 py-2 bg-emerald-900 text-white rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Settings saved!</span>
        </div>
      )}
    </div>
  );
};
