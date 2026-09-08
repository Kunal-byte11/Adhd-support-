import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StudyTheaterVideo, BinauralSoundMode, ISessionRecall, ITimestampNote } from '../types';
import { saveRecallLogToFirestore } from '../lib/firestoreService';
import {
  parseTimestampToSeconds,
  formatSecondsToTimestamp,
  parseMarkdownToTimestampNotes,
  getCurriculumPlaylistContext,
  PlaylistContext,
} from '../data/curriculumData';
import { buildChatGptNotesPrompt, openInChatGPT } from '../lib/chatGptExport';
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
  ChevronLeft,
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
  ListVideo,
  SkipForward,
  SkipBack,
  Copy,
  ExternalLink,
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
  // Mode: 'cinema' (100% full screen video with zero distractions) or 'split' (side notes & timer)
  const [viewMode, setViewMode] = useState<'cinema' | 'split'>('cinema');
  const [notesViewTab, setNotesViewTab] = useState<'timeline' | 'markdown' | 'batch' | 'playlist' | 'transcript'>('timeline');
  const [isCinemaPlaylistOpen, setIsCinemaPlaylistOpen] = useState(false);

  // Iframe ref for YouTube Player API postMessage seeking
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [currentStartSeconds, setCurrentStartSeconds] = useState<number>(video?.startSeconds || 0);
  const [jumpToast, setJumpToast] = useState<string | null>(null);

  // Browser Fullscreen API State
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);

  // Persistent Timer State: Preserved continuously across video switches & navigation
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
  const [totalDuration, setTotalDuration] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('focusflow_study_theater_timer');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.totalDuration === 'number' && parsed.totalDuration > 0) {
          return parsed.totalDuration;
        }
      }
    } catch {}
    return 1500;
  });
  const [isRunning, setIsRunning] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('focusflow_study_theater_timer');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.isRunning === 'boolean') {
          return parsed.isRunning;
        }
      }
    } catch {}
    return true;
  });

  // Save timer state whenever it updates
  useEffect(() => {
    try {
      localStorage.setItem(
        'focusflow_study_theater_timer',
        JSON.stringify({ secondsLeft, totalDuration, isRunning })
      );
    } catch {}
  }, [secondsLeft, totalDuration, isRunning]);

  // Derive Playlist / Adjacent Videos context for instant seamless navigation
  const playlistContext: PlaylistContext | null = useMemo(() => {
    if (!video) return null;
    return getCurriculumPlaylistContext(video.id);
  }, [video?.id]);

  // Scratchpad Notes (Persisted per topic)
  const [notes, setNotes] = useState<string>('');
  const [timestampNotes, setTimestampNotes] = useState<ITimestampNote[]>([]);
  const [syncStatus, setSyncStatus] = useState<'saved' | 'saving' | 'synced'>('synced');
  const syncTimeoutRef = useRef<any>(null);

  // ChatGPT Study Notes Prompt State
  const [showChatGptPromptModal, setShowChatGptPromptModal] = useState(false);
  const [chatGptPromptText, setChatGptPromptText] = useState('');
  const [promptCopied, setPromptCopied] = useState(false);
  const [exportModalTab, setExportModalTab] = useState<'transcript' | 'prompt'>('transcript');

  // Live YouTube Video Transcript State
  const [videoTranscript, setVideoTranscript] = useState<string>('');
  const [transcriptLines, setTranscriptLines] = useState<Array<{ offset: number; text: string; timestamp: string }>>([]);
  const [isFetchingTranscript, setIsFetchingTranscript] = useState<boolean>(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const [transcriptSearch, setTranscriptSearch] = useState<string>('');

  const loadVideoTranscript = async () => {
    const cleanVidId = video ? getYouTubeId(video.youtubeUrl) : null;
    if (!cleanVidId) return;

    setIsFetchingTranscript(true);
    setTranscriptError(null);
    try {
      const startSec = video.startSeconds || 0;
      const params = new URLSearchParams({ videoId: cleanVidId });

      let endSec: number | undefined = undefined;
      if (playlistContext?.nextVideo && typeof playlistContext.nextVideo.startSeconds === 'number') {
        endSec = playlistContext.nextVideo.startSeconds;
      } else if (video.duration) {
        endSec = startSec + parseTimestampToSeconds(video.duration);
      }

      if (typeof startSec === 'number' && startSec >= 0 && endSec && endSec > startSec) {
        params.append('startSeconds', String(startSec));
        params.append('endSeconds', String(endSec));
      } else if (startSec > 0) {
        params.append('startSeconds', String(startSec));
        params.append('endSeconds', String(startSec + 1200));
      }

      const res = await fetch(`/api/video/transcript?${params.toString()}`);
      const data = await res.json();
      if (data && data.success) {
        setVideoTranscript(data.rawText || '');
        setTranscriptLines(data.lines || []);
      } else {
        setTranscriptError(data.message || 'No captions found for this video.');
      }
    } catch (e: any) {
      setTranscriptError(e?.message || 'Failed to fetch transcript.');
    } finally {
      setIsFetchingTranscript(false);
    }
  };

  // Automatically switch to transcript view if requested
  useEffect(() => {
    if (video?.openTranscript) {
      setViewMode('split');
      setNotesViewTab('transcript');
    }
  }, [video?.id, video?.openTranscript]);

  // Pre-load transcript automatically when a video is loaded
  useEffect(() => {
    if (video) {
      loadVideoTranscript();
    }
  }, [video?.id, video?.startSeconds]);

  const filteredTranscriptLines = useMemo(() => {
    if (!transcriptSearch.trim()) return transcriptLines;
    const q = transcriptSearch.toLowerCase();
    return transcriptLines.filter((l) => l.text.toLowerCase().includes(q));
  }, [transcriptLines, transcriptSearch]);

  const handleExportToChatGPT = async (customTranscript?: string) => {
    let rawContent = (customTranscript || videoTranscript || '').trim();

    if (!rawContent) {
      setJumpToast('⏳ Fetching video transcript from YouTube...');
      try {
        const cleanVidId = video ? getYouTubeId(video.youtubeUrl) : null;
        if (cleanVidId) {
          const startSec = video.startSeconds || 0;
          const params = new URLSearchParams({ videoId: cleanVidId });
          let endSec: number | undefined = undefined;
          if (playlistContext?.nextVideo && typeof playlistContext.nextVideo.startSeconds === 'number') {
            endSec = playlistContext.nextVideo.startSeconds;
          } else if (video.duration) {
            endSec = startSec + parseTimestampToSeconds(video.duration);
          }

          if (typeof startSec === 'number' && startSec >= 0 && endSec && endSec > startSec) {
            params.append('startSeconds', String(startSec));
            params.append('endSeconds', String(endSec));
          } else if (startSec > 0) {
            params.append('startSeconds', String(startSec));
            params.append('endSeconds', String(startSec + 1200));
          }

          const resp = await fetch(`/api/video/transcript?${params.toString()}`);
          const data = await resp.json();
          if (data && data.success && data.rawText && data.rawText.trim()) {
            rawContent = data.rawText.trim();
            setVideoTranscript(data.rawText);
            setTranscriptLines(data.lines || []);
          }
        }
      } catch (e) {
        console.warn('Transcript fetch fallback:', e);
      }
    }

    // Fallback to notes or description if transcript wasn't found
    if (!rawContent) {
      rawContent = (
        notes ||
        (timestampNotes.length > 0 ? timestampNotes.map((t) => `[${t.timestamp}] ${t.note}`).join('\n') : '') ||
        video?.description ||
        'No captions found for this video. Generate notes based on topic title.'
      ).trim();
    }

    const fullPrompt = buildChatGptNotesPrompt(rawContent, video?.title);
    setChatGptPromptText(fullPrompt);
    setShowChatGptPromptModal(true);
    openInChatGPT(fullPrompt);
    setJumpToast('🚀 Video transcript & ADHD prompt ready! Opening ChatGPT...');
    setTimeout(() => setJumpToast(null), 4000);
  };

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

      // NOTE: Timer is deliberately NOT reset here so your 25-minute Pomodoro focus sprint
      // remains continuous and uninterrupted when moving to the next video or changing lessons!
      setSyncStatus('synced');

      const initialStart = video.startSeconds && video.startSeconds > 0 ? video.startSeconds : 0;
      setCurrentStartSeconds(initialStart);
      setComposerSecs(initialStart);
      setComposerTimeInput(formatSecondsToTimestamp(initialStart));
    }
  }, [video?.id, video?.startSeconds]);

  // Explicit timer reset action (user triggered)
  const handleResetTimer = () => {
    setSecondsLeft(1500);
    setTotalDuration(1500);
    setIsRunning(true);
    try {
      localStorage.setItem(
        'focusflow_study_theater_timer',
        JSON.stringify({ secondsLeft: 1500, totalDuration: 1500, isRunning: true })
      );
    } catch {}
    setJumpToast('⏱️ Focus Timer reset to 25:00');
    setTimeout(() => setJumpToast(null), 2500);
  };

  // Switch to another video seamlessly without leaving the player tab or interrupting the timer
  const handleSwitchVideo = (nextVid: StudyTheaterVideo) => {
    if (!nextVid || nextVid.id === video?.id) return;

    // 1. Flush & sync current video's notes to recall archive
    if (video) {
      const currentMd = buildMarkdownFromTimestampNotes(timestampNotes);
      syncNotesToRecall(notes || currentMd, timestampNotes, video, totalDuration - secondsLeft);
    }

    // 2. Call parent callback to update active video
    if (onSelectVideo) {
      onSelectVideo(nextVid);
    }

    setJumpToast(`🎬 Loaded: ${nextVid.title}`);
    setTimeout(() => setJumpToast(null), 2500);
  };

  // Keyboard navigation shortcuts (Shift+N: Next Video, Shift+P: Previous Video)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.shiftKey && (e.key === 'N' || e.key === 'n')) {
        if (playlistContext?.nextVideo) {
          e.preventDefault();
          handleSwitchVideo(playlistContext.nextVideo);
        }
      } else if (e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        if (playlistContext?.prevVideo) {
          e.preventDefault();
          handleSwitchVideo(playlistContext.prevVideo);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playlistContext, video, notes, timestampNotes, totalDuration, secondsLeft]);

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
      <header className="bg-[#11161a] text-white px-3 sm:px-5 py-2 flex items-center justify-between border-b border-slate-800/80 shrink-0 z-20 gap-2 overflow-x-auto no-scrollbar">
        {/* Left: Video Metadata */}
        <div className="flex items-center gap-2.5 min-w-0 max-w-[200px] sm:max-w-xs md:max-w-sm lg:max-w-md shrink">
          <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-bold font-mono tracking-wide shrink-0 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            THEATER
          </span>

          <div className="truncate min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-white truncate" title={video.title}>
              {video.title}
            </h1>
            {video.subject && (
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block">
                {video.subject} {video.difficulty ? `• ${video.difficulty}` : ''}
              </span>
            )}
          </div>
        </div>

        {/* Center-Left: High Priority Transcript & ChatGPT Action Buttons (Always Visible!) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* 📜 Video Transcript Button */}
          <button
            onClick={() => {
              setViewMode('split');
              setNotesViewTab('transcript');
              if (!videoTranscript && !isFetchingTranscript) {
                loadVideoTranscript();
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs ${
              viewMode === 'split' && notesViewTab === 'transcript'
                ? 'bg-amber-400 text-black shadow-md font-black ring-2 ring-amber-300'
                : 'bg-amber-500/25 text-amber-300 hover:bg-amber-500/40 border border-amber-500/50'
            }`}
            title="Open video transcript with clickable timestamps and ChatGPT notes generator"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>📜 Transcript</span>
            {transcriptLines.length > 0 && (
              <span className="text-[9px] bg-black/40 text-amber-200 px-1 py-0.2 rounded font-mono">
                {transcriptLines.length}
              </span>
            )}
          </button>

          {/* 🚀 ChatGPT Export Button */}
          <button
            onClick={() => handleExportToChatGPT()}
            className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs"
            title="Generate ADHD study notes in ChatGPT from this video's transcript"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">🚀 ChatGPT</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* Mark Done Button */}
          {onCompleteTopic && (
            <button
              onClick={() => {
                onCompleteTopic(video.id);
                setShowChatGptPromptModal(true);
                handleExportToChatGPT();
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
              }`}
              title="Mark lecture completed and open ADHD study notes prompt for ChatGPT"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isCompleted ? 'Done ✓' : 'Mark Done'}</span>
            </button>
          )}
        </div>

        {/* Center: Prev / Next Lesson Navigation (Change video without leaving the tab!) */}
        {playlistContext && playlistContext.totalCount > 1 && (
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 px-1.5 py-1 rounded-xl shrink-0 mx-2">
            <button
              disabled={!playlistContext.prevVideo}
              onClick={() => playlistContext.prevVideo && handleSwitchVideo(playlistContext.prevVideo)}
              className={`px-2 py-1 rounded-lg transition flex items-center gap-1 text-xs font-mono font-bold ${
                playlistContext.prevVideo
                  ? 'text-slate-200 hover:text-white hover:bg-slate-800 cursor-pointer'
                  : 'text-slate-600 opacity-40 cursor-not-allowed'
              }`}
              title={
                playlistContext.prevVideo
                  ? `Previous Lesson (Shift+P): ${playlistContext.prevVideo.title}`
                  : 'First lesson'
              }
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Prev</span>
            </button>

            <button
              onClick={() => {
                if (viewMode === 'cinema') {
                  setIsCinemaPlaylistOpen(!isCinemaPlaylistOpen);
                } else {
                  setNotesViewTab('playlist');
                }
              }}
              className="px-2 py-0.5 text-[11px] font-bold font-mono text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 rounded-md transition cursor-pointer flex items-center gap-1.5"
              title="Click to view full course lessons queue"
            >
              <ListVideo className="w-3 h-3 text-emerald-400" />
              <span>
                {playlistContext.currentIndex + 1} / {playlistContext.totalCount}
              </span>
            </button>

            <button
              disabled={!playlistContext.nextVideo}
              onClick={() => playlistContext.nextVideo && handleSwitchVideo(playlistContext.nextVideo)}
              className={`px-2 py-1 rounded-lg transition flex items-center gap-1 text-xs font-mono font-bold ${
                playlistContext.nextVideo
                  ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 cursor-pointer'
                  : 'text-slate-600 opacity-40 cursor-not-allowed'
              }`}
              title={
                playlistContext.nextVideo
                  ? `Next Lesson (Shift+N): ${playlistContext.nextVideo.title}`
                  : 'Last lesson'
              }
            >
              <span className="hidden md:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Center/Right: Quick Floating Focus Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Focus Timer Mini-Pill with Persistent Time & Reset */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 px-2.5 py-1 rounded-xl text-xs font-mono">
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
            <button
              onClick={handleResetTimer}
              className="p-1 text-slate-400 hover:text-rose-400 rounded transition cursor-pointer"
              title="Reset Timer back to 25:00"
            >
              <RotateCcw className="w-3 h-3" />
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

          {/* Floating Transcript & AI Notes Quick Pills on Video Player (Always Visible) */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              onClick={() => {
                setViewMode('split');
                setNotesViewTab('transcript');
                if (!videoTranscript && !isFetchingTranscript) {
                  loadVideoTranscript();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-400/60 hover:border-amber-300 text-amber-300 text-xs font-bold font-mono shadow-2xl backdrop-blur-md transition cursor-pointer flex items-center gap-1.5 group"
              title="Open full video transcript with clickable timestamps"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>📜 Transcript</span>
              {transcriptLines.length > 0 && (
                <span className="text-[10px] bg-amber-400/20 text-amber-200 px-1 rounded font-mono">
                  {transcriptLines.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleExportToChatGPT()}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/60 hover:border-emerald-400 text-emerald-300 text-xs font-bold font-mono shadow-2xl backdrop-blur-md transition cursor-pointer flex items-center gap-1.5 group"
              title="Generate ADHD study notes in ChatGPT from this video's transcript"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span>🚀 ChatGPT</span>
            </button>
          </div>

          {/* Floating Next Video Quick Bar (bottom-right of player) */}
          {playlistContext?.nextVideo && (
            <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-2">
              <button
                onClick={() => handleSwitchVideo(playlistContext.nextVideo!)}
                className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-400 text-white text-xs font-bold shadow-2xl backdrop-blur-md transition-all duration-200 cursor-pointer flex items-center gap-2.5 group"
                title={`Next Lesson: ${playlistContext.nextVideo.title}`}
              >
                <div className="text-left max-w-[220px] truncate">
                  <span className="text-[10px] text-emerald-400 block font-mono uppercase tracking-wider">
                    Next Lesson ({playlistContext.currentIndex + 2}/{playlistContext.totalCount})
                  </span>
                  <span className="text-xs truncate block font-medium group-hover:text-emerald-200">
                    {playlistContext.nextVideo.title}
                  </span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-emerald-600 group-hover:bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}

          {/* Slide-over Playlist Drawer in Cinema Mode */}
          {viewMode === 'cinema' && isCinemaPlaylistOpen && playlistContext && (
            <div className="absolute top-0 right-0 bottom-0 w-80 sm:w-96 bg-[#11161a]/95 border-l border-slate-800 z-40 flex flex-col p-4 backdrop-blur-xl shadow-2xl animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="min-w-0 flex-1 pr-2">
                  <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">
                    Course Lessons Queue
                  </span>
                  <h3 className="text-xs font-bold text-white truncate">
                    {playlistContext.courseTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCinemaPlaylistOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 py-3 pr-1">
                {playlistContext.videos.map((vid, i) => {
                  const isCurrent = vid.id === video.id;
                  const isVidDone = completedIds ? completedIds.has(vid.id) : false;
                  return (
                    <div
                      key={vid.id}
                      onClick={() => {
                        handleSwitchVideo(vid);
                        setIsCinemaPlaylistOpen(false);
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                        isCurrent
                          ? 'bg-emerald-950/50 border-emerald-500/60 text-white shadow-xs ring-1 ring-emerald-500/30'
                          : 'bg-slate-900/50 hover:bg-slate-800/80 border-slate-800/70 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className="text-[11px] font-mono font-bold text-slate-400 shrink-0 w-6">
                        #{i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-emerald-300 font-bold' : ''}`}>
                          {vid.title}
                        </p>
                        {vid.duration && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {vid.duration}
                          </span>
                        )}
                      </div>
                      {isCurrent ? (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono shrink-0">
                          PLAYING
                        </span>
                      ) : isVidDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Clean Multi-Note Timestamped Workspace */}
        {viewMode === 'split' && (
          <aside className="w-full lg:w-[440px] bg-[#11161a] border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0 p-3.5 sm:p-4 gap-3 text-white overflow-y-auto animate-in slide-in-from-right-4 duration-200">
            {/* Panel Header & View Tabs */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 flex-wrap">
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
                {playlistContext && (
                  <button
                    onClick={() => setNotesViewTab('playlist')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition cursor-pointer ${
                      notesViewTab === 'playlist'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="View all lessons in this course"
                  >
                    <ListVideo className="w-3.5 h-3.5" />
                    <span>Lessons ({playlistContext.totalCount})</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setNotesViewTab('transcript');
                    if (!videoTranscript && !isFetchingTranscript) {
                      loadVideoTranscript();
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition cursor-pointer ${
                    notesViewTab === 'transcript'
                      ? 'bg-amber-400 text-black shadow-xs font-black'
                      : 'text-amber-400/90 hover:text-amber-300'
                  }`}
                  title="View YouTube video transcript with clickable timestamps"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Transcript</span>
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

            {/* ================= TAB 4: LESSONS QUEUE / PLAYLIST ================= */}
            {notesViewTab === 'playlist' && playlistContext && (
              <div className="flex-1 flex flex-col min-h-[220px] bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="min-w-0 flex-1 pr-2">
                    <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider block">
                      Course Lessons
                    </span>
                    <h3 className="text-xs font-bold text-white truncate">
                      {playlistContext.courseTitle}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded-lg shrink-0">
                    {playlistContext.currentIndex + 1} of {playlistContext.totalCount}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[calc(100vh-250px)] pr-1">
                  {playlistContext.videos.map((vid, idx) => {
                    const isCurrent = vid.id === video.id;
                    const isVidDone = completedIds ? completedIds.has(vid.id) : false;
                    return (
                      <div
                        key={vid.id}
                        onClick={() => handleSwitchVideo(vid)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                          isCurrent
                            ? 'bg-emerald-950/50 border-emerald-500/70 text-white shadow-xs ring-1 ring-emerald-500/30'
                            : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {onCompleteTopic ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCompleteTopic(vid.id);
                            }}
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 cursor-pointer ${
                              isVidDone
                                ? 'bg-emerald-600 border-emerald-500 text-white'
                                : 'border-slate-600 hover:border-emerald-500 bg-slate-900'
                            }`}
                            title={isVidDone ? 'Completed' : 'Mark complete'}
                          >
                            {isVidDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>
                        ) : (
                          <span className="text-xs font-mono font-bold text-slate-400 w-5 text-center shrink-0">
                            #{idx + 1}
                          </span>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-emerald-300 font-bold' : ''}`}>
                            {vid.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400 font-mono">
                              Lesson #{idx + 1}
                            </span>
                            {vid.duration && (
                              <span className="text-[10px] text-emerald-400/80 font-mono">
                                {vid.duration}
                              </span>
                            )}
                          </div>
                        </div>

                        {isCurrent ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold font-mono shrink-0 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            PLAYING
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="p-1 text-slate-400 hover:text-emerald-400 transition"
                            title="Play this lesson"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= TAB 5: VIDEO TRANSCRIPT ================= */}
            {notesViewTab === 'transcript' && (
              <div className="flex-1 flex flex-col min-h-[320px] bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
                {/* Header & Quick Action Buttons */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 flex-wrap gap-2">
                  <div className="min-w-0 flex-1 pr-2">
                    <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider block">
                      📜 Video Transcript & Captions
                    </span>
                    <h3 className="text-xs font-bold text-white truncate">
                      {video.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleExportToChatGPT(videoTranscript)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm shadow-emerald-900/40 cursor-pointer"
                      title="Generate ADHD study notes from this transcript in ChatGPT"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Open in ChatGPT</span>
                    </button>

                    <button
                      onClick={() => {
                        if (videoTranscript) {
                          navigator.clipboard.writeText(videoTranscript);
                          setJumpToast('📋 Copied raw transcript!');
                          setTimeout(() => setJumpToast(null), 2500);
                        }
                      }}
                      disabled={!videoTranscript}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition cursor-pointer disabled:opacity-40"
                      title="Copy raw transcript text"
                    >
                      <ClipboardPaste className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>

                    <button
                      onClick={() => loadVideoTranscript()}
                      disabled={isFetchingTranscript}
                      className="p-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer disabled:opacity-40"
                      title="Reload transcript from YouTube"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${isFetchingTranscript ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Search Bar for Transcript */}
                {transcriptLines.length > 0 && (
                  <div className="relative">
                    <input
                      type="text"
                      value={transcriptSearch}
                      onChange={(e) => setTranscriptSearch(e.target.value)}
                      placeholder="🔍 Search transcript words..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
                    />
                    {transcriptSearch && (
                      <button
                        onClick={() => setTranscriptSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}

                {/* Loading State */}
                {isFetchingTranscript && (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                    <RotateCcw className="w-6 h-6 animate-spin text-amber-400" />
                    <p className="text-xs font-mono">Fetching YouTube captions & timestamps...</p>
                  </div>
                )}

                {/* Error State */}
                {!isFetchingTranscript && transcriptError && !videoTranscript && (
                  <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center text-slate-400 gap-3">
                    <AlertCircle className="w-8 h-8 text-amber-500/80" />
                    <div>
                      <p className="text-xs font-bold text-slate-300 mb-1">{transcriptError}</p>
                      <p className="text-[11px] text-slate-500 max-w-xs">
                        This video might not have public captions enabled, or you can paste your own notes in the Timeline/Markdown tab.
                      </p>
                    </div>
                    <button
                      onClick={() => loadVideoTranscript()}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* Transcript Lines List with Clickable Timestamps */}
                {!isFetchingTranscript && transcriptLines.length > 0 && (
                  <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[calc(100vh-340px)] pr-1 text-xs">
                    {filteredTranscriptLines.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => seekToSeconds(item.offset, item.timestamp)}
                        className="p-2 rounded-lg bg-slate-950/50 hover:bg-slate-800/60 border border-slate-800/60 hover:border-amber-500/40 transition cursor-pointer flex items-start gap-2.5 group"
                      >
                        <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-950/40 border border-amber-800/50 px-1.5 py-0.5 rounded shrink-0 group-hover:bg-amber-400 group-hover:text-black transition">
                          {item.timestamp}
                        </span>
                        <p className="text-slate-300 leading-relaxed group-hover:text-white flex-1">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Raw Transcript Fallback if only rawText is present */}
                {!isFetchingTranscript && transcriptLines.length === 0 && videoTranscript && (
                  <div className="flex-1 overflow-y-auto max-h-[calc(100vh-340px)] p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {videoTranscript}
                  </div>
                )}
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

        {/* 🚀 Dedicated ChatGPT & Transcript Export Modal */}
        {showChatGptPromptModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
            <div className="bg-[#11161a] border border-slate-700/80 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/70">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-white truncate">
                      ADHD Study Notes & Video Transcript
                    </h3>
                    <p className="text-xs text-slate-400 truncate">
                      {video.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatGptPromptModal(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Action Top Banner */}
              <div className="p-4 bg-emerald-950/40 border-b border-emerald-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Prompt Ready!</strong> Sliced YouTube transcript + custom ADHD study rules copied to clipboard.
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href="https://chatgpt.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (chatGptPromptText) {
                        navigator.clipboard.writeText(chatGptPromptText);
                      }
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/50 transition cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open ChatGPT (Paste Ctrl+V)</span>
                  </a>
                  <button
                    onClick={() => {
                      if (chatGptPromptText) {
                        navigator.clipboard.writeText(chatGptPromptText);
                        setPromptCopied(true);
                        setTimeout(() => setPromptCopied(false), 2500);
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
                    title="Copy full prompt again"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{promptCopied ? 'Copied ✓' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Modal Body: Tabs between Transcript and ChatGPT Prompt */}
              <div className="flex-1 flex flex-col min-h-0 p-4 space-y-3 overflow-hidden">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-mono">
                  <button
                    onClick={() => setExportModalTab('transcript')}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      exportModalTab === 'transcript'
                        ? 'bg-amber-400 text-black shadow-xs font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Video Transcript ({transcriptLines.length} lines)</span>
                  </button>
                  <button
                    onClick={() => setExportModalTab('prompt')}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      exportModalTab === 'prompt'
                        ? 'bg-emerald-500 text-black shadow-xs font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Full ChatGPT Prompt Preview</span>
                  </button>
                </div>

                {exportModalTab === 'transcript' ? (
                  <div className="flex-1 overflow-y-auto space-y-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs font-mono leading-relaxed">
                    {transcriptLines.length > 0 ? (
                      transcriptLines.map((l, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            seekToSeconds(l.offset, l.timestamp);
                            setShowChatGptPromptModal(false);
                          }}
                          className="flex items-start gap-2.5 hover:bg-slate-900 p-1.5 rounded cursor-pointer group transition"
                          title="Jump video to this timestamp"
                        >
                          <span className="text-amber-400 font-bold shrink-0 bg-amber-950/40 group-hover:bg-amber-400 group-hover:text-black px-1.5 py-0.5 rounded border border-amber-800/40 transition">
                            {l.timestamp}
                          </span>
                          <span className="text-slate-300 group-hover:text-white leading-relaxed">
                            {l.text}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400 p-6 text-center">
                        {isFetchingTranscript ? (
                          <p>⏳ Fetching captions from YouTube...</p>
                        ) : (
                          <p>{videoTranscript || 'No captions found for this video.'}</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed select-text">
                    {chatGptPromptText}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
                <span>💡 Sliced from YouTube and formatted with ADHD study rules.</span>
                <button
                  onClick={() => setShowChatGptPromptModal(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold cursor-pointer transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
