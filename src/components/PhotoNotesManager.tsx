import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  BookOpen,
  Eye,
  Sliders,
  Sun,
  Moon,
  Contrast,
  Columns,
  Grid,
  Edit2,
  Save,
  RotateCcw,
  Move,
  Layers,
  FileText,
} from 'lucide-react';

interface PhotoNotesManagerProps {
  videoId: string;
  videoTitle?: string;
  onClose?: () => void;
  isEmbedded?: boolean;
}

type FilterMode = 'normal' | 'dark-invert' | 'high-contrast' | 'scanner-bw' | 'warm-sepia';
type LayoutMode = 'single' | 'double' | 'continuous' | 'grid';

export const PhotoNotesManager: React.FC<PhotoNotesManagerProps> = ({
  videoId,
  videoTitle,
  onClose,
  isEmbedded = false,
}) => {
  const [allNotes, setAllNotes] = useState<ILecturePhotoNote[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState<string>('');
  
  // Lightbox & Reader State
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('single');
  const [filterMode, setFilterMode] = useState<FilterMode>('normal');

  // Zoom & Pan State for Smooth High-Power Inspection
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const startPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Page Title Editing State
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState<string>('');

  // Settings Modal State
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [storageSettings, setStorageSettings] = useState<StorageSettings>(getStorageSettings);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);

  // File Input Refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const viewerContainerRef = useRef<HTMLDivElement | null>(null);

  // Subscribe to photo notes in Firestore
  useEffect(() => {
    const unsub = subscribeAllPhotoNotes((notes) => {
      setAllNotes(notes);
    });
    return () => unsub();
  }, []);

  // Filter notes specific to current video/lecture
  const lectureNotes = useMemo(() => {
    return allNotes
      .filter((n) => n.videoId === videoId)
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  }, [allNotes, videoId]);

  // Reset zoom, rotation & pan when changing active image
  const resetViewerTransform = () => {
    setZoomLevel(1);
    setRotationDegrees(0);
    setPanPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    resetViewerTransform();
  }, [activeLightboxIndex, layoutMode]);

  // Filter CSS Styles for crisp handwriting readability
  const filterStyles = useMemo(() => {
    switch (filterMode) {
      case 'dark-invert':
        return 'invert hue-rotate-180 contrast-125 brightness-90 saturate-150';
      case 'high-contrast':
        return 'contrast-150 brightness-105 saturate-110';
      case 'scanner-bw':
        return 'grayscale contrast-200 brightness-105';
      case 'warm-sepia':
        return 'sepia contrast-110 brightness-95 saturate-125';
      default:
        return '';
    }
  }, [filterMode]);

  // Keyboard navigation for reader
  useEffect(() => {
    if (activeLightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingNoteId) return; // Don't intercept typing

      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        setActiveLightboxIndex((prev) =>
          prev !== null && prev < lectureNotes.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setActiveLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      } else if (e.key === '+' || e.key === '=') {
        setZoomLevel((z) => Math.min(4, Math.round((z + 0.25) * 100) / 100));
      } else if (e.key === '-') {
        setZoomLevel((z) => Math.max(0.4, Math.round((z - 0.25) * 100) / 100));
      } else if (e.key === '0') {
        resetViewerTransform();
      } else if (e.key.toLowerCase() === 'r') {
        setRotationDegrees((r) => (r + 90) % 360);
      } else if (e.key.toLowerCase() === 'i') {
        setFilterMode((f) => (f === 'dark-invert' ? 'normal' : 'dark-invert'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, lectureNotes.length, editingNoteId]);

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (activeLightboxIndex === null) return;
    if (e.ctrlKey || e.metaKey || layoutMode === 'single') {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      setZoomLevel((z) => Math.max(0.4, Math.min(4, Math.round((z + delta) * 100) / 100)));
    }
  };

  // Mouse Pan & Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsPanning(true);
      startPanRef.current = {
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - startPanRef.current.x,
        y: e.clientY - startPanRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

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
    if (window.confirm('Delete this handwritten note page?')) {
      if (activeLightboxIndex !== null) {
        setActiveLightboxIndex((prev) =>
          prev !== null && prev >= lectureNotes.length - 1
            ? Math.max(0, lectureNotes.length - 2)
            : prev
        );
      }
      await deleteLecturePhotoNoteFromFirestore(noteId);
    }
  };

  const handleSavePageTitle = async (note: ILecturePhotoNote) => {
    if (!editingTitleText.trim()) return;
    const updated: ILecturePhotoNote = {
      ...note,
      title: editingTitleText.trim(),
    };
    await saveLecturePhotoNoteToFirestore(updated);
    setEditingNoteId(null);
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

  const nextLightboxNote =
    activeLightboxIndex !== null &&
    layoutMode === 'double' &&
    lectureNotes[activeLightboxIndex + 1]
      ? lectureNotes[activeLightboxIndex + 1]
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
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0 shadow-2xs">
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

        <div className="flex items-center gap-2 shrink-0">
          {lectureNotes.length > 0 && (
            <button
              onClick={() => setActiveLightboxIndex(0)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              title="Open Fullscreen Notebook Reader"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Notes</span>
            </button>
          )}

          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            title="Storage Settings (ImgBB / Cloudinary / Local)"
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

      {/* Upload Zone & Quick Action Bar */}
      <div className="p-3.5 bg-white border-b border-slate-200 shrink-0 space-y-2.5">
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-3.5 transition text-center cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
            isDragging
              ? 'border-amber-500 bg-amber-50/70 scale-[0.99]'
              : 'border-slate-200 hover:border-amber-400 bg-slate-50/70 hover:bg-amber-50/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shadow-2xs">
              <Upload className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800">
                Drop handwritten note photos here or click to upload
              </p>
              <p className="text-[10px] text-slate-500">
                Direct ImgBB Cloud Hosting • High-Res Sharpness • Paste with <kbd className="px-1 py-0.2 bg-white border rounded text-[10px] font-mono">Ctrl+V</kbd>
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
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900 font-medium animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
            <span>{uploadProgressText || 'Uploading to ImgBB cloud CDN...'}</span>
          </div>
        )}
      </div>

      {/* Main Thumbnails Gallery Area */}
      <div className="flex-1 p-3.5 overflow-y-auto min-h-0 space-y-4">
        {lectureNotes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-200/60 shadow-inner">
              <FileImage className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">No handwritten notes uploaded yet</p>
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
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold rounded-md shadow-xs">
                    Page {idx + 1}
                  </span>

                  {/* Hover Quick Action Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <span className="p-1.5 bg-white/95 text-slate-900 rounded-lg shadow-sm font-bold text-xs flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-2.5 flex items-center justify-between gap-1 text-[11px] bg-white border-t border-slate-100">
                  <span className="font-semibold text-slate-800 truncate" title={note.title}>
                    {note.title || `Page ${idx + 1}`}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingNoteId(note.id);
                        setEditingTitleText(note.title || `Page ${idx + 1}`);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition"
                      title="Rename page title"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                      title="Delete page"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 📖 ULTRA-LUXURIOUS FULLSCREEN NOTEBOOK READER & LIGHTBOX VIEWER */}
      {/* ========================================================================= */}
      {currentLightboxNote && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-xl flex flex-col animate-in fade-in duration-150 select-none"
          onClick={() => setActiveLightboxIndex(null)}
        >
          {/* Top Control HUD Bar */}
          <div
            className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/90 flex items-center justify-between text-white shrink-0 gap-3 z-20 flex-wrap"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Page Title & Index Selector */}
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-lg text-xs font-bold font-mono shrink-0">
                Page {(activeLightboxIndex ?? 0) + 1} of {lectureNotes.length}
              </span>

              {/* Editable Page Title */}
              {editingNoteId === currentLightboxNote.id ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={editingTitleText}
                    onChange={(e) => setEditingTitleText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSavePageTitle(currentLightboxNote);
                      if (e.key === 'Escape') setEditingNoteId(null);
                    }}
                    autoFocus
                    className="px-2 py-0.5 bg-slate-800 border border-amber-400 rounded text-xs text-white focus:outline-hidden"
                  />
                  <button
                    onClick={() => handleSavePageTitle(currentLightboxNote)}
                    className="p-1 bg-emerald-600 hover:bg-emerald-500 rounded text-white"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 truncate">
                  <h4 className="text-sm font-semibold truncate text-slate-200">
                    {currentLightboxNote.title || `Note Page ${(activeLightboxIndex ?? 0) + 1}`}
                  </h4>
                  <button
                    onClick={() => {
                      setEditingNoteId(currentLightboxNote.id);
                      setEditingTitleText(currentLightboxNote.title || `Page ${(activeLightboxIndex ?? 0) + 1}`);
                    }}
                    className="p-1 text-slate-500 hover:text-slate-300 rounded"
                    title="Edit topic label for this page"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Center: Reading Filters (Dark Paper / High Contrast / Scanner B&W) */}
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setFilterMode('normal')}
                className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                  filterMode === 'normal'
                    ? 'bg-amber-400 text-black font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Normal colors"
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Normal</span>
              </button>

              <button
                onClick={() => setFilterMode('dark-invert')}
                className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                  filterMode === 'dark-invert'
                    ? 'bg-amber-400 text-black font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="🌙 Invert White Paper to Dark Paper Mode (Gentle on night eyes!)"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Dark Paper</span>
              </button>

              <button
                onClick={() => setFilterMode('high-contrast')}
                className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                  filterMode === 'high-contrast'
                    ? 'bg-amber-400 text-black font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="🎚️ Boost Ink Contrast (Sharpens faint pencil/pen handwriting)"
              >
                <Contrast className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">High Contrast</span>
              </button>

              <button
                onClick={() => setFilterMode('scanner-bw')}
                className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                  filterMode === 'scanner-bw'
                    ? 'bg-amber-400 text-black font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="📄 Clean Document Scanner (B&W)"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Scanner B&W</span>
              </button>
            </div>

            {/* Right: Layout Switcher & Zoom/Pan Tools */}
            <div className="flex items-center gap-1.5">
              {/* Layout Modes */}
              <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setLayoutMode('single')}
                  className={`p-1.5 rounded-md transition ${
                    layoutMode === 'single'
                      ? 'bg-slate-800 text-amber-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Single Page View"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setLayoutMode('double')}
                  className={`p-1.5 rounded-md transition ${
                    layoutMode === 'double'
                      ? 'bg-slate-800 text-amber-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Double Page (Book Mode)"
                >
                  <Columns className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setLayoutMode('continuous')}
                  className={`p-1.5 rounded-md transition ${
                    layoutMode === 'continuous'
                      ? 'bg-slate-800 text-amber-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Continuous Scroll (PDF Style)"
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="w-px h-5 bg-slate-800 mx-0.5" />

              {/* Zoom & Pan Controls */}
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.4, Math.round((z - 0.25) * 100) / 100))}
                className="p-1.5 hover:bg-slate-800 rounded-lg transition text-slate-300 hover:text-white"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={resetViewerTransform}
                className="text-xs font-mono text-slate-300 hover:text-amber-400 min-w-[3rem] text-center px-1 py-0.5 rounded hover:bg-slate-800 transition"
                title="Click to reset zoom & position (0)"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.min(4, Math.round((z + 0.25) * 100) / 100))}
                className="p-1.5 hover:bg-slate-800 rounded-lg transition text-slate-300 hover:text-white"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                onClick={() => setRotationDegrees((r) => (r + 90) % 360)}
                className="p-1.5 hover:bg-slate-800 rounded-lg transition text-slate-300 hover:text-white"
                title="Rotate 90° Clockwise (R)"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <a
                href={currentLightboxNote.imageUrl}
                download={`note-page-${(activeLightboxIndex ?? 0) + 1}.jpg`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 hover:bg-slate-800 rounded-lg transition text-slate-300 hover:text-white"
                title="Download original high-res photo"
              >
                <Download className="w-4 h-4" />
              </a>

              <button
                onClick={(e) => handleDeleteNote(currentLightboxNote.id, e)}
                className="p-1.5 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 rounded-lg transition"
                title="Delete note page"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-800 mx-0.5" />

              <button
                onClick={() => setActiveLightboxIndex(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition cursor-pointer"
                title="Close Lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Inspection Canvas */}
          <div
            ref={viewerContainerRef}
            className={`flex-1 relative flex items-center justify-center overflow-auto p-4 select-none ${
              zoomLevel > 1 ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
            }`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* Previous Page Arrow (Single/Double mode) */}
            {layoutMode !== 'continuous' && activeLightboxIndex !== null && activeLightboxIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLightboxIndex((prev) => (prev !== null ? prev - 1 : null));
                }}
                className="absolute left-6 z-30 p-3.5 bg-slate-900/85 hover:bg-amber-500 hover:text-black text-white rounded-full border border-slate-700/60 shadow-2xl transition duration-150 backdrop-blur-md cursor-pointer"
                title="Previous Page (Left Arrow / PageUp)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next Page Arrow (Single/Double mode) */}
            {layoutMode !== 'continuous' &&
              activeLightboxIndex !== null &&
              activeLightboxIndex < lectureNotes.length - (layoutMode === 'double' ? 2 : 1) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLightboxIndex((prev) =>
                      prev !== null ? prev + (layoutMode === 'double' ? 2 : 1) : null
                    );
                  }}
                  className="absolute right-6 z-30 p-3.5 bg-slate-900/85 hover:bg-amber-500 hover:text-black text-white rounded-full border border-slate-700/60 shadow-2xl transition duration-150 backdrop-blur-md cursor-pointer"
                  title="Next Page (Right Arrow / Space / PageDown)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

            {/* ================= LAYOUT 1: SINGLE PAGE WITH PAN & ZOOM ================= */}
            {layoutMode === 'single' && (
              <div
                className="transition-transform duration-100 ease-out flex items-center justify-center max-w-full max-h-full"
                style={{
                  transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel}) rotate(${rotationDegrees}deg)`,
                  transformOrigin: 'center center',
                }}
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={() => setZoomLevel((z) => (z === 1 ? 2 : 1))}
              >
                <img
                  src={currentLightboxNote.imageUrl}
                  alt={currentLightboxNote.title || 'Handwritten Note Page'}
                  className={`max-h-[82vh] max-w-[85vw] object-contain rounded-xl shadow-2xl border border-slate-800/80 transition duration-200 ${filterStyles}`}
                  draggable={false}
                />
              </div>
            )}

            {/* ================= LAYOUT 2: DOUBLE PAGE BOOK MODE ================= */}
            {layoutMode === 'double' && (
              <div
                className="flex items-center justify-center gap-4 max-w-full max-h-full transition-transform duration-100"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotationDegrees}deg)`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Left Page */}
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-mono text-slate-400 mb-1">
                    Page {(activeLightboxIndex ?? 0) + 1}
                  </span>
                  <img
                    src={currentLightboxNote.imageUrl}
                    alt=""
                    className={`max-h-[78vh] max-w-[42vw] object-contain rounded-l-xl shadow-2xl border border-slate-800/80 ${filterStyles}`}
                    draggable={false}
                  />
                </div>

                {/* Right Page */}
                {nextLightboxNote ? (
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-mono text-slate-400 mb-1">
                      Page {(activeLightboxIndex ?? 0) + 2}
                    </span>
                    <img
                      src={nextLightboxNote.imageUrl}
                      alt=""
                      className={`max-h-[78vh] max-w-[42vw] object-contain rounded-r-xl shadow-2xl border border-slate-800/80 ${filterStyles}`}
                      draggable={false}
                    />
                  </div>
                ) : (
                  <div className="w-[40vw] h-[75vh] flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-r-xl text-slate-600 text-xs">
                    <span>End of notebook pages</span>
                  </div>
                )}
              </div>
            )}

            {/* ================= LAYOUT 3: CONTINUOUS VERTICAL SCROLL ================= */}
            {layoutMode === 'continuous' && (
              <div
                className="flex flex-col items-center gap-8 py-8 w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                {lectureNotes.map((note, idx) => (
                  <div key={note.id} className="flex flex-col items-center w-full">
                    <div className="flex items-center justify-between w-full max-w-3xl px-3 py-1.5 text-xs text-slate-400 font-mono">
                      <span>Page {idx + 1} — {note.title || `Note Page ${idx + 1}`}</span>
                      <span>{note.fileSize}</span>
                    </div>
                    <img
                      src={note.imageUrl}
                      alt={note.title || `Page ${idx + 1}`}
                      className={`max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-slate-800 ${filterStyles}`}
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Filmstrip Thumbnails Strip */}
          <div
            className="px-4 py-2.5 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between gap-3 overflow-x-auto shrink-0 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quick Page Jump Thumbnails */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {lectureNotes.map((note, idx) => (
                <button
                  key={note.id}
                  onClick={() => setActiveLightboxIndex(idx)}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition shrink-0 group ${
                    activeLightboxIndex === idx
                      ? 'border-amber-400 scale-105 shadow-md ring-2 ring-amber-400/40'
                      : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                  title={`Page ${idx + 1}: ${note.title || 'Handwritten note'}`}
                >
                  <img src={note.imageUrl} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 right-0 px-1 bg-black/80 text-white text-[9px] font-mono font-bold rounded-tl">
                    {idx + 1}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Helper Tips */}
            <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400 font-mono shrink-0">
              <span><kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">←</kbd> <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">→</kbd> Turn Pages</span>
              <span><kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">+</kbd> <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">-</kbd> Zoom</span>
              <span><kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">I</kbd> Dark Paper</span>
              <span><kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">R</kbd> Rotate</span>
            </div>
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
                    setStorageSettings((s) => ({ ...s, provider: 'imgbb' }))
                  }
                  className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 ${
                    storageSettings.provider === 'imgbb'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="text-sm">☁️</span>
                  <span className="text-xs">Free ImgBB (Active)</span>
                </button>

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
                  <span className="text-xs">Compressed</span>
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
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-amber-900">
                      ImgBB API Key
                    </label>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                      Configured ✓
                    </span>
                  </div>
                  <input
                    type="text"
                    value={storageSettings.imgbbApiKey || ''}
                    onChange={(e) =>
                      setStorageSettings((s) => ({ ...s, imgbbApiKey: e.target.value }))
                    }
                    placeholder="Paste your ImgBB API key..."
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-[11px] text-amber-800">
                    Your key is active and images are hosted on ImgBB CDN with unlimited storage.
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
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
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
