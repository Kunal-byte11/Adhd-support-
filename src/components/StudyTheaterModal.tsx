import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  StudyTheaterVideo,
  BinauralSoundMode,
  ILecturePhotoNote,
} from '../types';
import {
  getCurriculumPlaylistContext,
  PlaylistContext,
} from '../data/curriculumData';
import {
  X,
  Play,
  CheckCircle2,
  Headphones,
  ChevronRight,
  ChevronLeft,
  ListVideo,
  Upload,
  Camera,
  BookOpen,
  Loader2,
  Plus,
} from 'lucide-react';
import { neuroAudio } from '../lib/audioSynthesizer';
import { processAndUploadPhotoNote } from '../lib/imageUploadService';
import {
  saveLecturePhotoNoteToFirestore,
  subscribeAllPhotoNotes,
} from '../lib/firestoreService';
import { StationaryNotebookViewer } from './StationaryNotebookViewer';

interface StudyTheaterModalProps {
  video: StudyTheaterVideo | null;
  onClose: () => void;
  onCompleteTopic?: (id: string) => void;
  isCompleted?: boolean;
  onSelectVideo?: (video: StudyTheaterVideo) => void;
  completedIds?: Set<string>;
}

export const StudyTheaterModal: React.FC<StudyTheaterModalProps> = ({
  video,
  onClose,
  onCompleteTopic,
  isCompleted = false,
  onSelectVideo,
  completedIds,
}) => {
  const [isPlaylistDrawerOpen, setIsPlaylistDrawerOpen] = useState<boolean>(false);
  const [isNotesDrawerOpen, setIsNotesDrawerOpen] = useState<boolean>(false);
  const [allNotes, setAllNotes] = useState<ILecturePhotoNote[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgressText, setUploadProgressText] = useState<string>('');

  // Iframe ref for YouTube Player API
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const [currentStartSeconds, setCurrentStartSeconds] = useState<number>(video?.startSeconds || 0);
  const [jumpToast, setJumpToast] = useState<string | null>(null);

  // Audio Mode
  const [soundMode, setSoundMode] = useState<BinauralSoundMode>('off');

  // Subscribe to photo notes from Firestore
  useEffect(() => {
    const unsub = subscribeAllPhotoNotes((notes) => {
      setAllNotes(notes);
    });
    return () => unsub();
  }, []);

  // Filter notes for this video
  const currentLectureNotes = useMemo(() => {
    if (!video) return [];
    return allNotes.filter((n) => n.videoId === video.id);
  }, [allNotes, video?.id]);

  // Playlist context
  const playlistContext: PlaylistContext | null = useMemo(() => {
    if (!video) return null;
    return getCurriculumPlaylistContext(video.id);
  }, [video?.id]);

  // Sync startSeconds on video switch
  useEffect(() => {
    if (video) {
      setCurrentStartSeconds(video.startSeconds || 0);
    }
  }, [video?.id, video?.startSeconds]);

  // Handle uploading files
  const handleUploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0 || !video) return;

    setIsUploading(true);
    const fileList = Array.from(files);

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        setUploadProgressText(
          `Uploading note (${i + 1}/${fileList.length})...`
        );

        const pageTitle = `Page ${currentLectureNotes.length + i + 1}`;
        const newNote = await processAndUploadPhotoNote(file, video.id, pageTitle);
        await saveLecturePhotoNoteToFirestore(newNote);
      }
      setJumpToast('📸 Note uploaded successfully!');
      setTimeout(() => setJumpToast(null), 3500);
    } catch (err: any) {
      console.error('Photo note upload error:', err);
      setJumpToast('⚠️ Upload error: ' + (err?.message || 'Failed to upload'));
      setTimeout(() => setJumpToast(null), 4000);
    } finally {
      setIsUploading(false);
      setUploadProgressText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  // Clipboard Paste (Ctrl+V) listener for quick screenshot pasting
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!video) return;
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const items = e.clipboardData?.items;
      if (!items) return;

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
  }, [video?.id, currentLectureNotes.length]);

  // Keyboard navigation for Next (N) and Prev (P)
  useEffect(() => {
    const handleKeyNav = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'n' || e.key === 'N' || (e.shiftKey && e.key === 'ArrowRight')) {
        if (playlistContext?.nextVideo) {
          handleSwitchVideo(playlistContext.nextVideo);
          setJumpToast(`▶ Jumping to: ${playlistContext.nextVideo.title}`);
          setTimeout(() => setJumpToast(null), 2500);
        }
      } else if (e.key === 'p' || e.key === 'P' || (e.shiftKey && e.key === 'ArrowLeft')) {
        if (playlistContext?.prevVideo) {
          handleSwitchVideo(playlistContext.prevVideo);
          setJumpToast(`◀ Jumping to: ${playlistContext.prevVideo.title}`);
          setTimeout(() => setJumpToast(null), 2500);
        }
      }
    };
    window.addEventListener('keydown', handleKeyNav);
    return () => window.removeEventListener('keydown', handleKeyNav);
  }, [playlistContext?.nextVideo, playlistContext?.prevVideo]);

  const getYouTubeId = (url: string) => {
    if (!url) return '';
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : '';
  };

  const videoId = video ? getYouTubeId(video.youtubeUrl) : null;

  const handleSwitchVideo = (nextVid: StudyTheaterVideo) => {
    if (onSelectVideo) {
      onSelectVideo(nextVid);
    }
  };

  const handleSoundToggle = (mode: BinauralSoundMode) => {
    if (soundMode === mode) {
      neuroAudio.stop();
      setSoundMode('off');
    } else {
      neuroAudio.setMode(mode);
      setSoundMode(mode);
    }
  };

  if (!video || !videoId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0d0f] flex flex-col w-screen h-screen overflow-hidden font-sans select-none animate-in fade-in duration-150">
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

      {/* 🎬 Clean YouTube Theater Workspace Header */}
      <header className="bg-[#11161a] text-white px-3 sm:px-5 py-2 flex items-center justify-between border-b border-slate-800 shrink-0 z-30 gap-2">
        {/* Left: Lecture & Course Title */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer shrink-0 md:hidden"
            title="Back / Close"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[9px] sm:text-[10px] font-bold font-mono tracking-wide shrink-0 hidden xs:inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            THEATER
          </span>

          <div className="truncate min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-white truncate" title={video.title}>
              {video.title}
            </h1>
            {video.subject && (
              <span className="text-[10px] text-slate-400 font-mono hidden md:inline-block">
                {video.subject} {video.difficulty ? `• ${video.difficulty}` : ''}
              </span>
            )}
          </div>
        </div>

        {/* Center: Previous / Next Chapter & Lesson Navigator */}
        {playlistContext && (
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 px-2 py-1 rounded-xl shrink-0 shadow-xs">
            {/* Previous Lesson Button */}
            <button
              disabled={!playlistContext.prevVideo}
              onClick={() => playlistContext.prevVideo && handleSwitchVideo(playlistContext.prevVideo)}
              className="px-2 py-1 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 rounded-lg transition cursor-pointer flex items-center gap-1"
              title={playlistContext.prevVideo ? `Previous: ${playlistContext.prevVideo.title} (Key: P)` : 'No previous lesson'}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px] font-bold">Prev</span>
            </button>

            {/* Current Lesson Badge & Drawer Trigger */}
            <button
              onClick={() => setIsPlaylistDrawerOpen(!isPlaylistDrawerOpen)}
              className="px-2 py-0.5 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded-lg transition cursor-pointer flex items-center gap-1.5"
              title="Click to view all chapters & lessons"
            >
              <ListVideo className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {playlistContext.currentIndex + 1} / {playlistContext.totalCount}
              </span>
            </button>

            {/* Next Chapter / Lesson Button */}
            <button
              disabled={!playlistContext.nextVideo}
              onClick={() => playlistContext.nextVideo && handleSwitchVideo(playlistContext.nextVideo)}
              className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-30 disabled:bg-slate-800 disabled:text-slate-500 rounded-lg transition cursor-pointer flex items-center gap-1 shadow-xs"
              title={playlistContext.nextVideo ? `Next: ${playlistContext.nextVideo.title} (Key: N)` : 'No more lessons'}
            >
              <span className="hidden sm:inline text-[11px]">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Direct Upload Notes Button */}
          <button
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold font-mono bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            title="Upload handwritten photos or paste (Ctrl+V) screenshots for this lecture"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                <span className="hidden sm:inline">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload Notes</span>
              </>
            )}
          </button>

          {/* Quick Camera Snapshot (Mobile/Tablet) */}
          <button
            disabled={isUploading}
            onClick={() => cameraInputRef.current?.click()}
            className="p-1.5 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer disabled:opacity-50"
            title="Take photo with camera"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>

          {/* View Uploaded Notes Drawer Toggle */}
          {currentLectureNotes.length > 0 && (
            <button
              onClick={() => setIsNotesDrawerOpen(!isNotesDrawerOpen)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                isNotesDrawerOpen
                  ? 'bg-amber-400/20 text-amber-300 border-amber-500/50 shadow-xs'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="View uploaded notes for this lecture"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Notes ({currentLectureNotes.length})
              </span>
            </button>
          )}

          {/* 40Hz Focus Audio */}
          <button
            onClick={() => handleSoundToggle('binaural-40hz')}
            className={`p-1.5 rounded-xl text-xs transition cursor-pointer ${
              soundMode === 'binaural-40hz'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
            }`}
            title="40Hz Gamma Focus Audio"
          >
            <Headphones className="w-3.5 h-3.5" />
          </button>

          {/* Mark Done */}
          {onCompleteTopic && (
            <button
              onClick={() => {
                onCompleteTopic(video.id);
                setJumpToast('🎉 Lecture completed!');
                setTimeout(() => setJumpToast(null), 3000);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 transition cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
              title="Mark lecture completed"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isCompleted ? 'Done ✓' : 'Done'}</span>
            </button>
          )}

          {/* Close Modal */}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            title="Close theater (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 🖥️ Full Clean YouTube Workspace */}
      <main className="flex-1 w-full h-full min-h-0 overflow-hidden relative bg-black flex flex-col justify-center items-center">
        <iframe
          ref={iframeRef}
          key={videoId}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}${currentStartSeconds > 0 ? `&start=${currentStartSeconds}` : ''}`}
          title={video.title}
          className="w-full h-full border-0 absolute inset-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />

        {/* Floating Upload Progress / Jump Toast */}
        {(uploadProgressText || jumpToast) && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-xl bg-slate-900/95 border border-amber-500/60 text-white text-xs font-mono font-bold shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 flex items-center gap-2 pointer-events-none">
            {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />}
            <span>{uploadProgressText || jumpToast}</span>
          </div>
        )}

        {/* Up Next Quick Advance Pill */}
        {playlistContext?.nextVideo && (
          <div className="absolute bottom-5 right-5 z-20 hidden md:flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 hover:border-emerald-500/60 p-2 pl-3.5 rounded-2xl shadow-2xl backdrop-blur-md transition-all">
            <div className="text-left max-w-[240px] truncate">
              <span className="text-[9px] font-mono font-bold text-emerald-400 block uppercase tracking-wider">
                Up Next (Press N)
              </span>
              <p className="text-xs text-white font-medium truncate" title={playlistContext.nextVideo.title}>
                {playlistContext.nextVideo.title}
              </p>
            </div>
            <button
              onClick={() => playlistContext.nextVideo && handleSwitchVideo(playlistContext.nextVideo)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center gap-1 cursor-pointer transition shadow-md shrink-0"
              title={`Jump to next: ${playlistContext.nextVideo.title}`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Slide-out Notes Viewer Drawer */}
        {isNotesDrawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex justify-end"
            onClick={() => setIsNotesDrawerOpen(false)}
          >
            <div
              className="w-full sm:w-[500px] md:w-[580px] bg-[#11161a] border-l border-slate-800 h-full flex flex-col text-white shadow-2xl animate-in slide-in-from-right duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                  <h3 className="text-sm font-bold truncate">Lecture Notes</h3>
                  <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-bold shrink-0">
                    {currentLectureNotes.length} {currentLectureNotes.length === 1 ? 'Page' : 'Pages'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-1 cursor-pointer transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Page</span>
                  </button>
                  <button
                    onClick={() => setIsNotesDrawerOpen(false)}
                    className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 min-h-0 w-full h-full">
                <StationaryNotebookViewer
                  videoId={video.id}
                  videoTitle={video.title}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Course Playlist Drawer */}
        {isPlaylistDrawerOpen && playlistContext && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex justify-end"
            onClick={() => setIsPlaylistDrawerOpen(false)}
          >
            <div
              className="w-80 sm:w-96 bg-[#11161a] border-l border-slate-800 h-full p-4 flex flex-col text-white shadow-2xl animate-in slide-in-from-right duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <ListVideo className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold truncate">Course Lectures</h3>
                </div>
                <button
                  onClick={() => setIsPlaylistDrawerOpen(false)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {playlistContext.videos.map((vid, idx) => {
                  const isCurrent = vid.id === video.id;
                  const isDone = completedIds?.has(vid.id);

                  return (
                    <div
                      key={vid.id}
                      onClick={() => {
                        handleSwitchVideo(vid);
                        setIsPlaylistDrawerOpen(false);
                      }}
                      className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-2 cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                          : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-slate-500 block">
                          Lesson {idx + 1}
                        </span>
                        <p className="text-xs font-semibold truncate">{vid.title}</p>
                      </div>
                      {isCurrent ? (
                        <span className="px-1.5 py-0.5 bg-emerald-500 text-black text-[9px] font-bold rounded">
                          Playing
                        </span>
                      ) : isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
