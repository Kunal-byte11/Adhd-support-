import React, { useState, useEffect, useRef } from 'react';
import { ILecturePhotoNote } from '../types';
import {
  saveLecturePhotoNoteToFirestore,
  deleteLecturePhotoNoteFromFirestore,
  subscribeAllPhotoNotes,
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
  Image as ImageIcon,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  X,
  Settings,
  Check,
  Download,
  AlertCircle,
  Plus,
  Loader2,
  FileImage,
  Sparkles,
} from 'lucide-react';

interface PhotoNotesManagerProps {
  videoId: string;
  videoTitle?: string;
  onClose?: () => void;
  isEmbedded?: boolean;
}

export const PhotoNotesManager: React.FC<PhotoNotesManagerProps> = ({
  videoId,
  videoTitle,
  onClose,
  isEmbedded = false,
}) => {
  const [allNotes, setAllNotes] = useState<ILecturePhotoNote[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState<string>('');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Lightbox Zoom & Rotation State
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);

  // Settings Modal State
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [storageSettings, setStorageSettings] = useState<StorageSettings>(getStorageSettings);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // Subscribe to photo notes in Firestore
  useEffect(() => {
    const unsub = subscribeAllPhotoNotes((notes) => {
      setAllNotes(notes);
    });
    return () => unsub();
  }, []);

  // Filter notes specific to current video/lecture
  const lectureNotes = allNotes
    .filter((n) => n.videoId === videoId)
    .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

  // Reset zoom & rotation when changing active lightbox image
  useEffect(() => {
    setZoomLevel(1);
    setRotationDegrees(0);
  }, [activeLightboxIndex]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeLightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) =>
          prev !== null && prev < lectureNotes.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      } else if (e.key === '+' || e.key === '=') {
        setZoomLevel((z) => Math.min(3.5, z + 0.25));
      } else if (e.key === '-') {
        setZoomLevel((z) => Math.max(0.5, z - 0.25));
      } else if (e.key.toLowerCase() === 'r') {
        setRotationDegrees((r) => (r + 90) % 360);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, lectureNotes.length]);

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
          `Processing photo ${i + 1} of ${fileList.length} (Page ${lectureNotes.length + i + 1})...`
        );

        const pageTitle = `Page ${lectureNotes.length + i + 1}`;
        const newNote = await processAndUploadPhotoNote(file, videoId, pageTitle);
        await saveLecturePhotoNoteToFirestore(newNote);
      }
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

  const handleDeleteNote = async (noteId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('Delete this handwritten note photo?')) {
      if (activeLightboxIndex !== null) {
        setActiveLightboxIndex(null);
      }
      await deleteLecturePhotoNoteFromFirestore(noteId);
    }
  };

  const handleSaveSettings = () => {
    saveStorageSettings(storageSettings);
    setShowSettingsModal(false);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const currentLightboxNote =
    activeLightboxIndex !== null && lectureNotes[activeLightboxIndex]
      ? lectureNotes[activeLightboxIndex]
      : null;

  return (
    <div
      className={`flex flex-col h-full bg-[#f8fafc] text-slate-800 ${
        isEmbedded ? '' : 'rounded-2xl shadow-2xl border border-slate-200 overflow-hidden'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden File and Camera Inputs */}
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

      {/* Header */}
      <div className="px-4 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/60">
            <Camera className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                Handwritten Notes & Diagrams
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300/60">
                {lectureNotes.length} {lectureNotes.length === 1 ? 'Page' : 'Pages'}
              </span>
            </div>
            {videoTitle && (
              <p className="text-[11px] text-slate-500 truncate max-w-xs">{videoTitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            title="Storage Settings (Cloudinary / ImgBB / Local)"
          >
            <Settings className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Upload Zone & Actions Bar */}
      <div className="p-4 bg-white border-b border-slate-200 shrink-0 space-y-3">
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 transition text-center cursor-pointer flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-amber-500 bg-amber-50/70 scale-[0.99]'
              : 'border-slate-200 hover:border-amber-400 bg-slate-50/70 hover:bg-amber-50/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shadow-2xs">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800">
                Drop handwritten note photos here or click to upload
              </p>
              <p className="text-[11px] text-slate-500">
                Supports JPG, PNG, Screenshots (<kbd className="px-1 py-0.5 bg-white border rounded text-[10px] font-mono">Ctrl+V</kbd> to paste)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex-1 py-2 px-3 bg-[#006494] hover:bg-[#004e75] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Photos</span>
          </button>

          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={isUploading}
            className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition disabled:opacity-50 cursor-pointer"
            title="Take photo with phone camera / webcam"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Camera</span>
          </button>
        </div>

        {isUploading && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900 font-medium animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
            <span>{uploadProgressText || 'Compressing and uploading notes...'}</span>
          </div>
        )}
      </div>

      {/* Main Gallery Area */}
      <div className="flex-1 p-4 overflow-y-auto min-h-0 space-y-4">
        {lectureNotes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-200/60 shadow-inner">
              <FileImage className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">No photo notes added yet</p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Snap a photo of your notebook or copy-paste screenshots here to keep your handwritten derivations linked to this lecture.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {lectureNotes.map((note, idx) => (
              <div
                key={note.id}
                onClick={() => setActiveLightboxIndex(idx)}
                className="group relative bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition overflow-hidden cursor-pointer flex flex-col"
              >
                {/* Thumbnail Image Container */}
                <div className="aspect-[4/3] bg-slate-900 overflow-hidden relative flex items-center justify-center">
                  <img
                    src={note.imageUrl}
                    alt={note.title || `Note Page ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  {/* Page Badge */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold rounded-md shadow-xs">
                    Page {idx + 1}
                  </span>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <span className="p-1.5 bg-white/90 text-slate-900 rounded-lg shadow-sm">
                      <ZoomIn className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-2.5 flex items-center justify-between gap-1 text-[11px] bg-white">
                  <span className="font-semibold text-slate-800 truncate" title={note.title}>
                    {note.title || `Page ${idx + 1}`}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    {note.fileSize && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {note.fileSize}
                      </span>
                    )}
                    <button
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                      title="Delete page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Fullscreen Image Viewer */}
      {currentLightboxNote && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col animate-in fade-in duration-150"
          onClick={() => setActiveLightboxIndex(null)}
        >
          {/* Top Control Bar */}
          <div
            className="px-4 py-3 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between text-white shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-lg text-xs font-bold">
                Page {(activeLightboxIndex ?? 0) + 1} of {lectureNotes.length}
              </span>
              <h4 className="text-sm font-semibold truncate max-w-sm">
                {currentLightboxNote.title || `Note Page ${(activeLightboxIndex ?? 0) + 1}`}
              </h4>
            </div>

            {/* Viewer Action Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-300 hover:text-white"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-slate-400 min-w-[3rem] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(3.5, z + 0.25))}
                className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-300 hover:text-white"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-slate-800 mx-1" />
              <button
                onClick={() => setRotationDegrees((r) => (r + 90) % 360)}
                className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-300 hover:text-white"
                title="Rotate 90° (R)"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <a
                href={currentLightboxNote.imageUrl}
                download={`note-page-${(activeLightboxIndex ?? 0) + 1}.jpg`}
                target="_blank"
                rel="noreferrer"
                className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-300 hover:text-white"
                title="Download full-res photo"
              >
                <Download className="w-4 h-4" />
              </a>
              <button
                onClick={(e) => handleDeleteNote(currentLightboxNote.id, e)}
                className="p-2 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 rounded-lg transition"
                title="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-slate-800 mx-1" />
              <button
                onClick={() => setActiveLightboxIndex(null)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
                title="Close Lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Zoomable Image Canvas */}
          <div className="flex-1 relative flex items-center justify-center overflow-auto p-4 select-none">
            {/* Previous Page Button */}
            {activeLightboxIndex !== null && activeLightboxIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLightboxIndex((prev) => (prev !== null ? prev - 1 : null));
                }}
                className="absolute left-6 z-10 p-3 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full border border-slate-700/60 shadow-xl transition"
                title="Previous Page (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next Page Button */}
            {activeLightboxIndex !== null && activeLightboxIndex < lectureNotes.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLightboxIndex((prev) => (prev !== null ? prev + 1 : null));
                }}
                className="absolute right-6 z-10 p-3 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full border border-slate-700/60 shadow-xl transition"
                title="Next Page (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* The Image */}
            <div
              className="transition-transform duration-150 ease-out flex items-center justify-center max-w-full max-h-full"
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotationDegrees}deg)`,
                transformOrigin: 'center center',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentLightboxNote.imageUrl}
                alt="Handwritten Note Page"
                className="max-h-[82vh] max-w-[85vw] object-contain rounded-lg shadow-2xl border border-slate-800/80"
              />
            </div>
          </div>

          {/* Bottom Thumbnails Strip */}
          <div
            className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-center gap-2 overflow-x-auto shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {lectureNotes.map((note, idx) => (
              <button
                key={note.id}
                onClick={() => setActiveLightboxIndex(idx)}
                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                  activeLightboxIndex === idx
                    ? 'border-amber-400 scale-105 shadow-md ring-2 ring-amber-400/30'
                    : 'border-slate-700 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={note.imageUrl} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Settings Modal (ImgBB / Cloudinary / Local) */}
      {showSettingsModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowSettingsModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-5 text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-slate-900">Photo Notes Storage Settings</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                Choose where your handwritten note photos are saved:
              </p>

              {/* Provider Selection */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setStorageSettings((s) => ({ ...s, provider: 'local' }))
                  }
                  className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 ${
                    storageSettings.provider === 'local'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="text-sm">💾</span>
                  <span className="text-xs">Compressed (Default)</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setStorageSettings((s) => ({ ...s, provider: 'imgbb' }))
                  }
                  className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 ${
                    storageSettings.provider === 'imgbb'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="text-sm">☁️</span>
                  <span className="text-xs">Free ImgBB</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setStorageSettings((s) => ({ ...s, provider: 'cloudinary' }))
                  }
                  className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 ${
                    storageSettings.provider === 'cloudinary'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="text-sm">⚡</span>
                  <span className="text-xs">Cloudinary</span>
                </button>
              </div>

              {/* ImgBB Configuration */}
              {storageSettings.provider === 'imgbb' && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                  <label className="block font-bold text-amber-900">
                    ImgBB API Key (Free)
                  </label>
                  <input
                    type="text"
                    value={storageSettings.imgbbApiKey || ''}
                    onChange={(e) =>
                      setStorageSettings((s) => ({ ...s, imgbbApiKey: e.target.value }))
                    }
                    placeholder="Paste your 32-character ImgBB API key..."
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-[11px] text-amber-800">
                    Get a 100% free, unlimited API key in 10 seconds at{' '}
                    <a
                      href="https://api.imgbb.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-bold text-amber-900"
                    >
                      api.imgbb.com
                    </a>
                  </p>
                </div>
              )}

              {/* Cloudinary Configuration */}
              {storageSettings.provider === 'cloudinary' && (
                <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
                  <label className="block font-bold text-indigo-900">Cloudinary Cloud Name</label>
                  <input
                    type="text"
                    value={storageSettings.cloudinaryCloudName || ''}
                    onChange={(e) =>
                      setStorageSettings((s) => ({ ...s, cloudinaryCloudName: e.target.value }))
                    }
                    placeholder="e.g. my-cloud-name"
                    className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden"
                  />
                  <label className="block font-bold text-indigo-900 mt-2">
                    Unsigned Upload Preset
                  </label>
                  <input
                    type="text"
                    value={storageSettings.cloudinaryUploadPreset || ''}
                    onChange={(e) =>
                      setStorageSettings((s) => ({
                        ...s,
                        cloudinaryUploadPreset: e.target.value,
                      }))
                    }
                    placeholder="e.g. adhd_notes_preset"
                    className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden"
                  />
                </div>
              )}

              {storageSettings.provider === 'local' && (
                <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">
                    ✨ Automatic High-Res Compression:
                  </p>
                  <p>
                    Images are compressed directly in your browser (~100-250KB) and saved into Firestore and local cache so they load instantly without hitting storage limits!
                  </p>
                </div>
              )}
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
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Saved Toast */}
      {settingsSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-emerald-900 text-white rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Storage settings saved!</span>
        </div>
      )}
    </div>
  );
};
