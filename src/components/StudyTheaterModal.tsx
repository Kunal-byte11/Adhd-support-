import React, { useState, useEffect, useRef } from 'react';
import { StudyTheaterVideo, BinauralSoundMode, ISessionRecall, ITimestampNote } from '../types';
import { saveRecallLogToFirestore } from '../lib/firestoreService';
import {
  parseTimestampToSeconds,
  formatSecondsToTimestamp,
  parseMarkdownToTimestampNotes,
} from '../data/curriculumData';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Clock,
  CheckCircle2,
  Headphones,
  Wind,
  Brain,
  Maximize2,
  Minimize2,
  PanelRightClose,
  PanelRightOpen,
  ChevronRight,
  Bookmark,
  Sparkles,
  Tag,
  AlertCircle,
  PlayCircle,
  Trash2,
  Plus,
  ListOrdered,
  FileText,
  ChevronUp,
  ChevronDown,
  Edit3,
  Check,
  ClipboardPaste,
  ArrowRight,
} from 'lucide-react';
import { neuroAudio } from '../lib/audioSynthesizer';

interface StudyTheaterModalProps {
  video: StudyTheaterVideo | null;
  onClose: () => void;
  onCompleteTopic?: (id: string) => void;
  isCompleted?: boolean;
}

export const StudyTheaterModal: React.FC<StudyTheaterModalProps> = ({
  video,
  onClose,
  onCompleteTopic,
  isCompleted = false,
}) => {
  // Mode: 'cinema' (100% full screen video with zero distractions) or 'split' (side notes & timer)
  const [viewMode, setViewMode] = useState<'cinema' | 'split'>('cinema');
  const [notesViewTab, setNotesViewTab] = useState<'timeline' | 'markdown' | 'batch'>('timeline');

  // Iframe ref for YouTube Player API postMessage seeking
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [currentStartSeconds, setCurrentStartSeconds] = useState<number>(video?.startSeconds || 0);
  const [jumpToast, setJumpToast] = useState<string | null>(null);

  // Browser Fullscreen API State
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);

  // Timer State (Default 25 min Pomodoro for videos)
  const [secondsLeft, setSecondsLeft] = useState<number>(1500);
  const [totalDuration, setTotalDuration] = useState<number>(1500);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Scratchpad Notes (Persisted per topic)
  const [notes, setNotes] = useState<string>('');
  const [timestampNotes, setTimestampNotes] = useState<ITimestampNote[]>([]);
  const [syncStatus, setSyncStatus] = useState<'saved' | 'saving' | 'synced'>('synced');
  const syncTimeoutRef = useRef<any>(null);

  // Multi-Note Composer Draft State
  const [composerSecs, setComposerSecs] = useState<number>(video?.startSeconds || 0);
  const [composerTimeInput, setComposerTimeInput] = useState<string>(
    formatSecondsToTimestamp(video?.startSeconds || 0)
  );
  const [composerText, setComposerText] = useState<string>('');
  const [composerIsRevisit, setComposerIsRevisit] = useState<boolean>(false);
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'revisit'>('all');

  // Inline Note Editing State
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [editingTimeInput, setEditingTimeInput] = useState<string>('');
  const [editingIsRevisit, setEditingIsRevisit] = useState<boolean>(false);

  // Batch Paste Input State
  const [batchPasteInput, setBatchPasteInput] = useState<string>('');

  // Sound Engine
  const [soundMode, setSoundMode] = useState<BinauralSoundMode>('off');

  // Waking Micro-Rest Pause
  const [isMicroRest, setIsMicroRest] = useState<boolean>(false);
  const [microRestSecs, setMicroRestSecs] = useState<number>(15);

  // Extract YouTube ID
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    return match ? match[1] : null;
  };

  const videoId = video ? getYouTubeId(video.youtubeUrl) : null;

  // Browser Fullscreen sync listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsBrowserFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsBrowserFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsBrowserFullscreen(false);
    }
  };

  // Direct Seek to Timestamp Function (Smooth postMessage seeking without iframe reload)
  const seekToSeconds = (targetSecs: number, label?: string) => {
    const safeSecs = Math.max(0, targetSecs);
    setCurrentStartSeconds(safeSecs);
    setComposerSecs(safeSecs);
    setComposerTimeInput(formatSecondsToTimestamp(safeSecs));

    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [safeSecs, true],
          }),
          '*'
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'playVideo',
            args: [],
          }),
          '*'
        );
      } catch (e) {
        console.warn('postMessage seek note:', e);
      }
    }
    const displayTime = label || formatSecondsToTimestamp(safeSecs);
    setJumpToast(`🎬 Jumped to ${displayTime}`);
    setTimeout(() => setJumpToast(null), 2500);
  };

  // Sync function to write both to localStorage and Active Recall Archive
  const syncNotesToRecall = async (
    rawContent: string,
    tNotes: ITimestampNote[],
    vid: StudyTheaterVideo,
    timeSpentSecs: number
  ) => {
    if (!vid) return;
    try {
      localStorage.setItem(`focusflow_video_notes_${vid.id}`, rawContent);
      localStorage.setItem(`focusflow_timestamp_notes_${vid.id}`, JSON.stringify(tNotes));

      if (rawContent.trim().length > 0 || tNotes.length > 0) {
        const recallRecord: ISessionRecall = {
          id: `video_note_${vid.id}`,
          subject: vid.subject || (vid.category === 'dsa' ? 'DSA Problem' : 'GenAI Curriculum'),
          topicTitle: vid.title,
          recallContent: rawContent.trim(),
          timestampNotes: tNotes,
          durationMinutes: Math.max(1, Math.round(timeSpentSecs / 60)),
          phoneDistanced: true,
          microRestsCompleted: 1,
          createdAt: Date.now(),
        };
        await saveRecallLogToFirestore(recallRecord);
      }
      setSyncStatus('synced');
    } catch (e) {
      console.warn('Error syncing video note:', e);
      setSyncStatus('synced');
    }
  };

  // Build markdown string from structured timestamp notes
  const buildMarkdownFromTimestampNotes = (tNotes: ITimestampNote[]): string => {
    if (tNotes.length === 0) return '';
    return tNotes
      .map((n) => `${n.isRevisit ? '- ⚠️' : '-'} [${n.timestampFormatted}] ${n.note}`)
      .join('\n');
  };

  // Load saved notes for this topic and sync initial startSeconds
  useEffect(() => {
    if (video) {
      let loadedNotes: ITimestampNote[] = [];
      try {
        const savedRaw = localStorage.getItem(`focusflow_video_notes_${video.id}`) || '';
        setNotes(savedRaw);

        const savedTNotes = localStorage.getItem(`focusflow_timestamp_notes_${video.id}`);
        if (savedTNotes) {
          const parsed = JSON.parse(savedTNotes);
          if (Array.isArray(parsed) && parsed.length > 0) {
            loadedNotes = parsed;
            setTimestampNotes(parsed);
          }
        }

        if (loadedNotes.length === 0 && savedRaw.trim()) {
          // Parse legacy markdown lines into timestamp notes
          const generated = parseMarkdownToTimestampNotes(savedRaw);
          if (generated.length > 0) {
            loadedNotes = generated;
            setTimestampNotes(generated);
          }
        }
      } catch {}

      setSecondsLeft(1500);
      setTotalDuration(1500);
      setIsRunning(true);
      setSyncStatus('synced');

      const initialStart = video.startSeconds && video.startSeconds > 0 ? video.startSeconds : 0;
      setCurrentStartSeconds(initialStart);
      setComposerSecs(initialStart);
      setComposerTimeInput(formatSecondsToTimestamp(initialStart));
    }
  }, [video?.id, video?.startSeconds]);

  // Sprint Timer
  useEffect(() => {
    let timer: any = null;
    if (isRunning && !isMicroRest && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, isMicroRest, secondsLeft]);

  // Micro-Rest Timer
  useEffect(() => {
    let microTimer: any = null;
    if (isMicroRest && microRestSecs > 0) {
      microTimer = setInterval(() => {
        setMicroRestSecs((s) => s - 1);
      }, 1000);
    } else if (isMicroRest && microRestSecs === 0) {
      setIsMicroRest(false);
    }
    return () => clearInterval(microTimer);
  }, [isMicroRest, microRestSecs]);

  // Handle Freeform Raw Notes Change (Bi-directional Live Sync with Timeline)
  const handleRawNotesChange = (val: string) => {
    setNotes(val);
    setSyncStatus('saving');

    // Parse structured notes from markdown in real time
    const parsedNotes = parseMarkdownToTimestampNotes(val);
    if (parsedNotes.length > 0) {
      setTimestampNotes(parsedNotes);
    }

    if (video) {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = setTimeout(() => {
        syncNotesToRecall(
          val,
          parsedNotes.length > 0 ? parsedNotes : timestampNotes,
          video,
          totalDuration - secondsLeft
        );
      }, 600);
    }
  };

  // Smart Note Input Handler (Auto-extracts timestamp if typed in text)
  const handleComposerTextInput = (val: string) => {
    // Check if user typed or pasted timestamp like [04:15] or 04:15 or 1:20:30
    const match = val.match(/(?:\[|@|\(|\b)(\d{1,2}:\d{2}(?::\d{2})?)(?:\]|\)|\b)/);
    if (match) {
      const detectedTs = match[1];
      const parsedSecs = parseTimestampToSeconds(detectedTs);
      if (parsedSecs > 0 || detectedTs === '00:00' || detectedTs === '0:00') {
        setComposerSecs(parsedSecs);
        setComposerTimeInput(formatSecondsToTimestamp(parsedSecs));
      }
      if (val.includes('⚠️') || val.toLowerCase().includes('revisit')) {
        setComposerIsRevisit(true);
      }
    }
    setComposerText(val);
  };

  // Manual Timestamp Input Handler
  const handleComposerTimeInputChange = (val: string) => {
    setComposerTimeInput(val);
    const parsed = parseTimestampToSeconds(val);
    setComposerSecs(parsed);
  };

  // Adjust composer timestamp via steppers
  const adjustComposerSeconds = (delta: number) => {
    const updated = Math.max(0, composerSecs + delta);
    setComposerSecs(updated);
    setComposerTimeInput(formatSecondsToTimestamp(updated));
  };

  // Quick Capture: Match sprint session elapsed time or current mark
  const handleCaptureSessionTime = () => {
    const elapsed = Math.max(0, totalDuration - secondsLeft);
    setComposerSecs(elapsed);
    setComposerTimeInput(formatSecondsToTimestamp(elapsed));
    setJumpToast(`⏱️ Timestamp set to session elapsed time (${formatSecondsToTimestamp(elapsed)})`);
    setTimeout(() => setJumpToast(null), 2000);
  };

  // Add a new Structured Timestamped Note
  const handleAddTimestampNote = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!composerText.trim()) return;

    // Clean note text of duplicate timestamp patterns if present
    let cleanNote = composerText
      .replace(/(?:\[|@|\()?\d{1,2}:\d{2}(?::\d{2})?(?:\]|\))?/, '')
      .replace(/⚠️/g, '')
      .replace(/^[\s\-:]+/, '')
      .trim();

    if (!cleanNote) {
      cleanNote = composerText.trim();
    }

    const formatted = formatSecondsToTimestamp(composerSecs);
    const newNote: ITimestampNote = {
      id: 'ts_note_' + Date.now(),
      timestampSeconds: composerSecs,
      timestampFormatted: formatted,
      note: cleanNote,
      isRevisit: composerIsRevisit,
      createdAt: Date.now(),
    };

    const updatedList = [...timestampNotes, newNote].sort(
      (a, b) => a.timestampSeconds - b.timestampSeconds
    );
    setTimestampNotes(updatedList);

    const updatedMarkdown = buildMarkdownFromTimestampNotes(updatedList);
    setNotes(updatedMarkdown);

    // Reset composer input but keep time ready
    setComposerText('');
    setComposerIsRevisit(false);

    if (video) {
      setSyncStatus('saving');
      syncNotesToRecall(updatedMarkdown, updatedList, video, totalDuration - secondsLeft);
    }
  };

  // Delete a timestamped note
  const handleDeleteTimestampNote = (id: string) => {
    const updatedList = timestampNotes.filter((n) => n.id !== id);
    setTimestampNotes(updatedList);

    const updatedMarkdown = buildMarkdownFromTimestampNotes(updatedList);
    setNotes(updatedMarkdown);

    if (video) {
      setSyncStatus('saving');
      syncNotesToRecall(updatedMarkdown, updatedList, video, totalDuration - secondsLeft);
    }
  };

  // Toggle revisit flag on a note
  const handleToggleRevisit = (id: string) => {
    const updatedList = timestampNotes.map((n) =>
      n.id === id ? { ...n, isRevisit: !n.isRevisit } : n
    );
    setTimestampNotes(updatedList);

    const updatedMarkdown = buildMarkdownFromTimestampNotes(updatedList);
    setNotes(updatedMarkdown);

    if (video) {
      setSyncStatus('saving');
      syncNotesToRecall(updatedMarkdown, updatedList, video, totalDuration - secondsLeft);
    }
  };

  // Start Inline Editing a Note
  const handleStartEditNote = (note: ITimestampNote) => {
    setEditingNoteId(note.id);
    setEditingText(note.note);
    setEditingTimeInput(note.timestampFormatted);
    setEditingIsRevisit(note.isRevisit);
  };

  // Save Inline Edit
  const handleSaveEditNote = (id: string) => {
    const updatedSecs = parseTimestampToSeconds(editingTimeInput);
    const updatedList = timestampNotes
      .map((n) => {
        if (n.id === id) {
          return {
            ...n,
            note: editingText.trim() || n.note,
            timestampSeconds: updatedSecs,
            timestampFormatted: formatSecondsToTimestamp(updatedSecs),
            isRevisit: editingIsRevisit,
          };
        }
        return n;
      })
      .sort((a, b) => a.timestampSeconds - b.timestampSeconds);

    setTimestampNotes(updatedList);
    const updatedMarkdown = buildMarkdownFromTimestampNotes(updatedList);
    setNotes(updatedMarkdown);
    setEditingNoteId(null);

    if (video) {
      setSyncStatus('saving');
      syncNotesToRecall(updatedMarkdown, updatedList, video, totalDuration - secondsLeft);
    }
  };

  // Batch Import Multiple Timestamps
  const handleBatchImport = () => {
    if (!batchPasteInput.trim()) return;
    const parsed = parseMarkdownToTimestampNotes(batchPasteInput);
    if (parsed.length === 0) return;

    // Merge with existing, deduplicating by approximate timestamp and note
    const merged = [...timestampNotes, ...parsed].sort(
      (a, b) => a.timestampSeconds - b.timestampSeconds
    );
    setTimestampNotes(merged);

    const updatedMarkdown = buildMarkdownFromTimestampNotes(merged);
    setNotes(updatedMarkdown);
    setBatchPasteInput('');
    setNotesViewTab('timeline');

    if (video) {
      setSyncStatus('saving');
      syncNotesToRecall(updatedMarkdown, merged, video, totalDuration - secondsLeft);
    }
  };

  const handleSoundToggle = (mode: BinauralSoundMode) => {
    if (soundMode === mode) {
      neuroAudio.setMode('off');
      setSoundMode('off');
    } else {
      neuroAudio.setMode(mode);
      setSoundMode(mode);
    }
  };

  const revisitCount = timestampNotes.filter((n) => n.isRevisit).length;
  const filteredTimelineNotes =
    timelineFilter === 'revisit'
      ? timestampNotes.filter((n) => n.isRevisit)
      : timestampNotes;

  if (!video || !videoId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0d0f] flex flex-col w-screen h-screen overflow-hidden font-sans select-none animate-in fade-in duration-150">
      {/* 🎬 Sleek Distraction-Free Header Bar */}
      <header className="bg-[#11161a] text-white px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-slate-800/80 shrink-0 z-20">
        {/* Left: Video Metadata & Completion */}
        <div className="flex items-center gap-3 min-w-0 flex-1 pr-4">
          <span className="px-2 py-1 rounded-md bg-rose-500/20 text-rose-300 text-[11px] font-bold font-mono tracking-wide shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            THEATER
          </span>

          <div className="truncate min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-white truncate">
              {video.title}
            </h1>
            {video.subject && (
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block">
                {video.subject} {video.difficulty ? `• ${video.difficulty}` : ''}
              </span>
            )}
          </div>

          {onCompleteTopic && (
            <button
              onClick={() => onCompleteTopic(video.id)}
              className={`ml-2 px-3 py-1 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 transition cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isCompleted ? 'Done ✓' : 'Mark Done'}</span>
            </button>
          )}
        </div>

        {/* Center/Right: Quick Floating Focus Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Focus Timer Mini-Pill */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 px-2.5 py-1 rounded-xl text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-bold text-slate-100">
              {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:
              {String(secondsLeft % 60).padStart(2, '0')}
            </span>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-1 text-slate-300 hover:text-white rounded transition cursor-pointer"
              title={isRunning ? 'Pause Timer' : 'Resume Timer'}
            >
              {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
            </button>
          </div>

          {/* Quick 40Hz Audio Toggle */}
          <button
            onClick={() => handleSoundToggle('binaural-40hz')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 border transition cursor-pointer ${
              soundMode === 'binaural-40hz'
                ? 'bg-violet-600 text-white border-violet-500 shadow-xs'
                : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:bg-slate-800'
            }`}
            title="40Hz Prefrontal Gamma Oscillations for Deep Attention"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">40Hz</span>
          </button>

          {/* View Mode Toggle (Cinema vs Split Notes) */}
          <button
            onClick={() => setViewMode(viewMode === 'cinema' ? 'split' : 'cinema')}
            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
              viewMode === 'split'
                ? 'bg-[#43664c] text-white border-[#43664c]'
                : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title={viewMode === 'cinema' ? 'Open Notes & Timer Panel' : 'Switch to Full-Screen Cinema'}
          >
            {viewMode === 'cinema' ? (
              <>
                <PanelRightOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Notes ({timestampNotes.length})</span>
              </>
            ) : (
              <>
                <PanelRightClose className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pure Cinema</span>
              </>
            )}
          </button>

          {/* Fullscreen API Toggle */}
          <button
            onClick={toggleBrowserFullscreen}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
            title={isBrowserFullscreen ? 'Exit Browser Fullscreen' : 'Enter Browser Fullscreen'}
          >
            {isBrowserFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Theater */}
          <button
            onClick={() => {
              neuroAudio.setMode('off');
              if (document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
              }
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/10 transition cursor-pointer"
            title="Exit Theater"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 📺 Full Viewport Video Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative min-h-0 bg-black">
        {/* Left / Center: Fullframe YouTube Player with Stable Key */}
        <div className="flex-1 bg-black flex flex-col justify-center items-center relative w-full h-full min-h-0">
          <iframe
            ref={iframeRef}
            key={videoId}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}${currentStartSeconds > 0 ? `&start=${currentStartSeconds}` : ''}`}
            title={video.title}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          {/* Floating Jump Toast Notification */}
          {jumpToast && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-2xl bg-slate-900/90 border border-emerald-500/50 text-white text-xs font-mono font-bold shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-emerald-400" />
              <span>{jumpToast}</span>
            </div>
          )}
        </div>

        {/* Right Panel: Clean Multi-Note Timestamped Workspace */}
        {viewMode === 'split' && (
          <aside className="w-full lg:w-[440px] bg-[#11161a] border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0 p-3.5 sm:p-4 gap-3 text-white overflow-y-auto animate-in slide-in-from-right-4 duration-200">
            {/* Panel Header & View Tabs */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setNotesViewTab('timeline')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition cursor-pointer ${
                    notesViewTab === 'timeline'
                      ? 'bg-[#43664c] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>Timeline ({timestampNotes.length})</span>
                </button>
                <button
                  onClick={() => setNotesViewTab('markdown')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition cursor-pointer ${
                    notesViewTab === 'markdown'
                      ? 'bg-[#006494] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Markdown</span>
                </button>
                <button
                  onClick={() => setNotesViewTab('batch')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition cursor-pointer ${
                    notesViewTab === 'batch'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Paste multiple timestamps at once"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>Batch</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    syncStatus === 'saving'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {syncStatus === 'saving' ? 'Syncing...' : 'Synced ✓'}
                </span>
                <button
                  onClick={() => setViewMode('cinema')}
                  className="p-1 text-slate-400 hover:text-white rounded transition cursor-pointer"
                  title="Hide panel"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Timer & Audio HUD Mini Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold font-mono text-xs">
                  {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:
                  {String(secondsLeft % 60).padStart(2, '0')}
                </div>
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="p-1 text-slate-300 hover:text-white rounded cursor-pointer"
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                </button>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono">
                <button
                  onClick={() => handleSoundToggle('binaural-40hz')}
                  className={`px-2 py-1 rounded-lg font-bold cursor-pointer transition ${
                    soundMode === 'binaural-40hz' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🧠 40Hz
                </button>
                <button
                  onClick={() => handleSoundToggle('brown-noise')}
                  className={`px-2 py-1 rounded-lg font-bold cursor-pointer transition ${
                    soundMode === 'brown-noise' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🌊 Brown
                </button>
                <button
                  onClick={() => {
                    setIsMicroRest(true);
                    setMicroRestSecs(15);
                  }}
                  className="px-2 py-1 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold hover:bg-cyan-900 cursor-pointer"
                  title="Take 15s eyes-closed micro-rest"
                >
                  Rest
                </button>
              </div>
            </div>

            {/* ================= TAB 1: STRUCTURED TIMELINE NOTES ================= */}
            {notesViewTab === 'timeline' && (
              <div className="flex-1 flex flex-col gap-3 min-h-0">
                {/* Multi-Note Composer Card */}
                <form
                  onSubmit={handleAddTimestampNote}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2.5 shrink-0 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-300 font-mono flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      Add Note at:
                    </span>

                    {/* Editable Direct Time Input & Quick Steppers */}
                    <div className="flex items-center gap-1 bg-slate-950 px-1.5 py-1 rounded-xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => adjustComposerSeconds(-60)}
                        className="px-1 text-slate-400 hover:text-white text-[10px] font-mono cursor-pointer"
                        title="-1 Minute"
                      >
                        -1m
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustComposerSeconds(-10)}
                        className="px-1 text-slate-400 hover:text-white text-[10px] font-mono cursor-pointer"
                        title="-10 Seconds"
                      >
                        -10s
                      </button>

                      {/* Directly editable timestamp input */}
                      <input
                        type="text"
                        value={composerTimeInput}
                        onChange={(e) => handleComposerTimeInputChange(e.target.value)}
                        placeholder="00:00"
                        className="w-14 text-center px-1 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold font-mono text-xs border border-emerald-800 focus:outline-none focus:border-emerald-400"
                        title="Type mm:ss or hh:mm:ss directly"
                      />

                      <button
                        type="button"
                        onClick={() => adjustComposerSeconds(10)}
                        className="px-1 text-slate-400 hover:text-white text-[10px] font-mono cursor-pointer"
                        title="+10 Seconds"
                      >
                        +10s
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustComposerSeconds(60)}
                        className="px-1 text-slate-400 hover:text-white text-[10px] font-mono cursor-pointer"
                        title="+1 Minute"
                      >
                        +1m
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustComposerSeconds(300)}
                        className="px-1 text-slate-400 hover:text-white text-[10px] font-mono cursor-pointer"
                        title="+5 Minutes"
                      >
                        +5m
                      </button>
                    </div>
                  </div>

                  {/* Time Presets & Quick Capture */}
                  <div className="flex items-center justify-between gap-1 text-[10px] font-mono text-slate-400 pt-0.5">
                    <button
                      type="button"
                      onClick={handleCaptureSessionTime}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1"
                      title="Set timestamp to elapsed session time"
                    >
                      <Clock className="w-3 h-3 text-rose-400" />
                      <span>Snap Session Time</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setComposerSecs(0);
                        setComposerTimeInput('00:00');
                      }}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      Reset 00:00
                    </button>
                  </div>

                  {/* Note Input with Auto-Timestamp Detection */}
                  <div className="relative">
                    <input
                      type="text"
                      value={composerText}
                      onChange={(e) => handleComposerTextInput(e.target.value)}
                      placeholder="Type concept or formula (e.g. '04:15 Gradient descent')..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                    />
                  </div>

                  {/* Composer Actions */}
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <label className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={composerIsRevisit}
                        onChange={(e) => setComposerIsRevisit(e.target.checked)}
                        className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
                      />
                      <span>⚠️ Mark to Revisit</span>
                    </label>

                    <button
                      type="submit"
                      disabled={!composerText.trim()}
                      className="px-3.5 py-1.5 rounded-xl bg-[#43664c] hover:bg-[#35533c] text-white text-xs font-bold font-mono flex items-center gap-1.5 transition cursor-pointer disabled:opacity-40 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Note</span>
                    </button>
                  </div>
                </form>

                {/* Timeline Notes List */}
                <div className="flex-1 flex flex-col min-h-0 bg-slate-900/70 border border-slate-800 rounded-2xl p-3 overflow-hidden">
                  {/* Filter Pills */}
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setTimelineFilter('all')}
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold transition cursor-pointer ${
                          timelineFilter === 'all'
                            ? 'bg-slate-700 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        All ({timestampNotes.length})
                      </button>
                      <button
                        onClick={() => setTimelineFilter('revisit')}
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold transition cursor-pointer flex items-center gap-1 ${
                          timelineFilter === 'revisit'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'text-slate-400 hover:text-amber-300'
                        }`}
                      >
                        <span>⚠️ Revisit ({revisitCount})</span>
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono">
                      Click timestamp to seek video
                    </span>
                  </div>

                  {/* Notes Scrollable Area */}
                  {filteredTimelineNotes.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs font-mono">
                      <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30 text-emerald-500" />
                      <p>No timestamped notes yet.</p>
                      <p className="text-[10px] text-slate-600 mt-1">
                        Use the composer above or switch to Batch to paste multiple timestamps!
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                      {filteredTimelineNotes.map((n) => {
                        const isEditingThis = editingNoteId === n.id;

                        if (isEditingThis) {
                          return (
                            <div
                              key={n.id}
                              className="p-3 rounded-xl border border-emerald-500/60 bg-slate-950 space-y-2 animate-in fade-in"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-bold text-emerald-400 font-mono">
                                  Edit Note Timestamp:
                                </span>
                                <input
                                  type="text"
                                  value={editingTimeInput}
                                  onChange={(e) => setEditingTimeInput(e.target.value)}
                                  className="w-16 text-center px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-300 text-xs font-mono font-bold focus:outline-none focus:border-emerald-400"
                                />
                              </div>

                              <input
                                type="text"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-400"
                              />

                              <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-1.5 text-[10px] font-mono text-amber-300 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={editingIsRevisit}
                                    onChange={(e) => setEditingIsRevisit(e.target.checked)}
                                    className="w-3 h-3 rounded bg-slate-900 border-slate-700 text-amber-500"
                                  />
                                  <span>⚠️ Revisit</span>
                                </label>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => setEditingNoteId(null)}
                                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono font-bold cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleSaveEditNote(n.id)}
                                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Save</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={n.id}
                            className={`p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2 group ${
                              n.isRevisit
                                ? 'bg-amber-950/30 border-amber-800/60'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start gap-2 flex-1 min-w-0">
                              {/* Clickable Seek Timestamp Button */}
                              <button
                                onClick={() => seekToSeconds(n.timestampSeconds, n.timestampFormatted)}
                                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-rose-600 hover:text-white text-emerald-300 text-xs font-mono font-bold shrink-0 flex items-center gap-1 transition cursor-pointer shadow-2xs"
                                title="Click to jump video to this point"
                              >
                                <PlayCircle className="w-3.5 h-3.5 text-rose-400 group-hover:text-white" />
                                <span>{n.timestampFormatted}</span>
                              </button>

                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-200 font-mono leading-relaxed break-words">
                                  {n.note}
                                </p>
                                {n.isRevisit && (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-mono font-bold mt-1">
                                    <span>⚠️ Flagged to revisit</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100">
                              <button
                                onClick={() => handleStartEditNote(n)}
                                className="p-1 rounded text-slate-500 hover:text-slate-200 transition cursor-pointer"
                                title="Edit note"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleToggleRevisit(n.id)}
                                className={`p-1 rounded transition cursor-pointer text-xs ${
                                  n.isRevisit ? 'text-amber-400 hover:text-slate-400' : 'text-slate-500 hover:text-amber-400'
                                }`}
                                title={n.isRevisit ? 'Remove revisit flag' : 'Flag to revisit'}
                              >
                                ⚠️
                              </button>
                              <button
                                onClick={() => handleDeleteTimestampNote(n.id)}
                                className="p-1 rounded text-slate-500 hover:text-rose-400 transition cursor-pointer"
                                title="Delete note"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= TAB 2: RAW MARKDOWN VIEW ================= */}
            {notesViewTab === 'markdown' && (
              <div className="flex-1 flex flex-col min-h-[220px] bg-slate-900/90 border border-slate-800 rounded-2xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 font-mono">
                    Freeform Active Recall Summary
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Live bi-directional sync</span>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => handleRawNotesChange(e.target.value)}
                  placeholder="Type full summary, formulas, or markdown..."
                  className="w-full flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500 resize-none leading-relaxed min-h-[160px]"
                />
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{notes.length} chars &bull; {notes.trim() ? notes.trim().split(/\s+/).length : 0} words</span>
                  <span className="text-emerald-400">Synced to Archive ✓</span>
                </div>
              </div>
            )}

            {/* ================= TAB 3: BATCH / BULK IMPORT ================= */}
            {notesViewTab === 'batch' && (
              <div className="flex-1 flex flex-col min-h-[220px] bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 font-mono flex items-center gap-1.5">
                    <ClipboardPaste className="w-4 h-4 text-purple-400" />
                    Paste Multiple Timestamps
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Auto-parse lines</span>
                </div>

                <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                  Paste lecture timestamps or video chapters from YouTube description:
                </p>

                <textarea
                  value={batchPasteInput}
                  onChange={(e) => setBatchPasteInput(e.target.value)}
                  placeholder={`00:00 Intro & motivation\n03:45 Gradient descent formula\n12:30 ⚠️ Why learning rate decay matters\n25:00 PyTorch implementation`}
                  rows={6}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {batchPasteInput.split('\n').filter((l) => l.trim()).length} lines detected
                  </span>
                  <button
                    onClick={handleBatchImport}
                    disabled={!batchPasteInput.trim()}
                    className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition"
                  >
                    <span>Import All Notes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </aside>
        )}

        {/* SDAP Waking Micro-Rest Fullscreen Modal during video */}
        {isMicroRest && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-[#11161a] border border-slate-700 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-bold font-mono mb-4">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                NIH ACCELERATED REPLAY
              </div>

              <div className="w-24 h-24 rounded-full bg-cyan-600 text-white flex flex-col items-center justify-center shadow-lg shadow-cyan-900/50 mb-4 animate-pulse">
                <span className="text-3xl font-black font-mono">{microRestSecs}</span>
                <span className="text-[9px] uppercase font-bold tracking-wider font-mono">Sec</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">Rest Your Eyes</h3>
              <p className="text-xs text-slate-400 mb-5">
                Close your eyes and breathe. Brain replay speeds up by 20x.
              </p>

              <button
                onClick={() => setIsMicroRest(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
              >
                Resume Video
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
