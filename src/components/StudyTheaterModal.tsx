import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  StudyTheaterVideo,
  BinauralSoundMode,
  ILecturePhotoNote,
} from '../types';
import {
  subscribeAllPhotoNotes,
} from '../lib/firestoreService';
import {
  parseTimestampToSeconds,
  formatSecondsToTimestamp,
  getCurriculumPlaylistContext,
  PlaylistContext,
} from '../data/curriculumData';
import { StationaryNotebookViewer } from './StationaryNotebookViewer';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Headphones,
  Wind,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  Camera,
  Layers,
  Columns,
  ListVideo,
} from 'lucide-react';
import { neuroAudio } from '../lib/audioSynthesizer';

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
  // Mobile Tab view: 'video' | 'notes' (or split on desktop)
  const [mobileTab, setMobileTab] = useState<'video' | 'notes'>('video');
  const [isDualPane, setIsDualPane] = useState<boolean>(true);
  const [isPlaylistDrawerOpen, setIsPlaylistDrawerOpen] = useState<boolean>(false);

  // Iframe ref for YouTube Player API
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [currentStartSeconds, setCurrentStartSeconds] = useState<number>(video?.startSeconds || 0);
  const [jumpToast, setJumpToast] = useState<string | null>(null);

  // Persistent Timer State
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('focusflow_study_theater_timer');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.secondsLeft === 'number' && parsed.secondsLeft > 0) {
          return parsed.secondsLeft;
        }
      }
    } catch {}
    return 1500;
  });
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Audio Mode
  const [soundMode, setSoundMode] = useState<BinauralSoundMode>('off');

  // Playlist context
  const playlistContext: PlaylistContext | null = useMemo(() => {
    if (!video) return null;
    return getCurriculumPlaylistContext(video.id);
  }, [video?.id]);

  // Photo Notes Subscription
  const [allPhotoNotes, setAllPhotoNotes] = useState<ILecturePhotoNote[]>([]);
  useEffect(() => {
    const unsub = subscribeAllPhotoNotes((loadedNotes) => {
      setAllPhotoNotes(loadedNotes);
    });
    return () => unsub();
  }, []);

  const currentLectureNotesCount = useMemo(() => {
    if (!video?.id) return 0;
    return allPhotoNotes.filter((n) => n.videoId === video.id).length;
  }, [allPhotoNotes, video?.id]);

  // Sync startSeconds on video switch
  useEffect(() => {
    if (video) {
      setCurrentStartSeconds(video.startSeconds || 0);
    }
  }, [video?.id, video?.startSeconds]);

  // Focus Timer Countdown
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 1500));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

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
      {/* 🎬 Stationary Top Workspace Header */}
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

        {/* Center: Previous / Next Lecture Navigator (Hidden on small mobile) */}
        {playlistContext && playlistContext.totalCount > 1 && (
          <div className="hidden sm:flex items-center gap-1 bg-slate-950 border border-slate-800 px-2 py-1 rounded-xl shrink-0">
            <button
              disabled={!playlistContext.prevVideo}
              onClick={() => playlistContext.prevVideo && handleSwitchVideo(playlistContext.prevVideo)}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded transition cursor-pointer"
              title="Previous lesson"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsPlaylistDrawerOpen(!isPlaylistDrawerOpen)}
              className="px-1.5 py-0.5 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 transition cursor-pointer flex items-center gap-1"
              title="Open all lessons in course"
            >
              <ListVideo className="w-3.5 h-3.5" />
              <span>
                {playlistContext.currentIndex + 1}/{playlistContext.totalCount}
              </span>
            </button>
            <button
              disabled={!playlistContext.nextVideo}
              onClick={() => playlistContext.nextVideo && handleSwitchVideo(playlistContext.nextVideo)}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded transition cursor-pointer"
              title="Next lesson"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Right: Actions, Mobile Tabs & Desktop Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Mobile Tab Switcher (Only on small screens) */}
          <div className="flex md:hidden items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setMobileTab('video')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                mobileTab === 'video' ? 'bg-[#006494] text-white' : 'text-slate-400'
              }`}
            >
              Video
            </button>
            <button
              onClick={() => setMobileTab('notes')}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                mobileTab === 'notes' ? 'bg-amber-500 text-white' : 'text-slate-400'
              }`}
            >
              <span>Notes</span>
              {currentLectureNotesCount > 0 && (
                <span className="text-[9px] bg-black/40 px-1 rounded font-mono">
                  {currentLectureNotesCount}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Dual-Pane / Cinema Toggle */}
          <button
            onClick={() => setIsDualPane(!isDualPane)}
            className={`hidden md:flex px-2.5 py-1.5 rounded-xl text-xs font-bold font-mono items-center gap-1.5 transition cursor-pointer shadow-xs ${
              isDualPane
                ? 'bg-amber-400 text-black shadow-md font-black'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
            title="Toggle stationary side-by-side notebook"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{isDualPane ? '📖 Notes Open' : '📖 Open Notes'}</span>
            {currentLectureNotesCount > 0 && (
              <span className="text-[10px] bg-black/40 text-amber-200 px-1 py-0.2 rounded font-mono font-bold">
                {currentLectureNotesCount}
              </span>
            )}
          </button>

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
            className="hidden md:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            title="Close theater (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 🖥️ Main Dual-Pane Stationary Desk Workspace */}
      <main className="flex-1 flex flex-col md:flex-row w-full h-full min-h-0 overflow-hidden relative">
        {/* Left Pane: Full YouTube Player (Clean, zero overlapping floating buttons) */}
        <div
          className={`bg-black flex flex-col justify-center items-center relative overflow-hidden transition-all duration-200 ${
            // On mobile: show/hide based on mobileTab. On desktop: split width
            mobileTab === 'video' ? 'flex flex-1 w-full h-full' : 'hidden md:flex'
          } ${isDualPane ? 'md:w-1/2' : 'md:w-full'}`}
        >
          <iframe
            ref={iframeRef}
            key={videoId}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}${currentStartSeconds > 0 ? `&start=${currentStartSeconds}` : ''}`}
            title={video.title}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          {/* Floating Jump Toast (Clean, auto-hides) */}
          {jumpToast && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/50 text-white text-xs font-mono font-bold shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 flex items-center gap-2 pointer-events-none">
              <span>{jumpToast}</span>
            </div>
          )}
        </div>

        {/* Right Pane: Stationary Open Notebook Viewer */}
        <aside
          className={`h-full border-t md:border-t-0 md:border-l border-slate-800 flex flex-col shrink-0 overflow-hidden bg-[#11161a] transition-all duration-200 ${
            mobileTab === 'notes' ? 'flex flex-1 w-full' : 'hidden md:flex'
          } ${isDualPane ? 'md:w-1/2' : 'hidden'}`}
        >
          <StationaryNotebookViewer
            videoId={video.id}
            videoTitle={video.title}
            className="w-full h-full"
          />
        </aside>

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
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
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
