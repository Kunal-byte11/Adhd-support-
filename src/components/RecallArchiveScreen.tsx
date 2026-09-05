import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Trash2,
  Copy,
  Check,
  PlayCircle,
  Sparkles,
  ExternalLink,
  Flame,
  Brain,
  Filter,
} from 'lucide-react';
import { ISessionRecall, StudyTheaterVideo } from '../types';
import {
  subscribeRecallLogs,
  saveRecallLogToFirestore,
  deleteRecallLogFromFirestore,
} from '../lib/firestoreService';
import {
  getCurriculumVideoById,
  parseMarkdownToTimestampNotes,
} from '../data/curriculumData';

interface RecallArchiveScreenProps {
  onWatchVideo?: (video: StudyTheaterVideo) => void;
}

export const RecallArchiveScreen: React.FC<RecallArchiveScreenProps> = ({
  onWatchVideo,
}) => {
  const [recallLogs, setRecallLogs] = useState<ISessionRecall[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [copiedRecallId, setCopiedRecallId] = useState<string | null>(null);

  // Direct Recall Authoring Form State
  const [isCreatingRecall, setIsCreatingRecall] = useState<boolean>(false);
  const [newRecallSubject, setNewRecallSubject] = useState<string>('DSA & Algorithms');
  const [newRecallTitle, setNewRecallTitle] = useState<string>('');
  const [newRecallContent, setNewRecallContent] = useState<string>('');
  const [isSavingDirectRecall, setIsSavingDirectRecall] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribeRecallLogs((logs) => {
      setRecallLogs(logs);
    });
    return () => unsub();
  }, []);

  const handleDeleteRecall = async (id: string) => {
    await deleteRecallLogFromFirestore(id);
  };

  const handleCopyRecall = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecallId(id);
    setTimeout(() => setCopiedRecallId(null), 2000);
  };

  const handleSaveDirectRecall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecallTitle.trim() || !newRecallContent.trim()) return;

    setIsSavingDirectRecall(true);
    try {
      const record: ISessionRecall = {
        id: 'direct_recall_' + Date.now(),
        subject: newRecallSubject,
        topicTitle: newRecallTitle.trim(),
        recallContent: newRecallContent.trim(),
        durationMinutes: 15,
        phoneDistanced: true,
        microRestsCompleted: 1,
        createdAt: Date.now(),
      };
      await saveRecallLogToFirestore(record);
      setNewRecallTitle('');
      setNewRecallContent('');
      setIsCreatingRecall(false);
    } catch (err) {
      console.warn('Error saving direct recall:', err);
    } finally {
      setIsSavingDirectRecall(false);
    }
  };

  const filteredRecalls = recallLogs.filter((log) => {
    const matchesQuery =
      log.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.recallContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (filterSubject === 'all') return true;
    if (filterSubject === 'video') return log.id.startsWith('video_note_');
    if (filterSubject === 'sem7') return log.id.startsWith('recall_') && !log.id.startsWith('direct_');
    if (filterSubject === 'direct') return log.id.startsWith('direct_');
    return log.subject.toLowerCase().includes(filterSubject.toLowerCase());
  });

  const totalWords = recallLogs.reduce((acc, r) => {
    const words = r.recallContent.trim() ? r.recallContent.trim().split(/\s+/).length : 0;
    return acc + words;
  }, 0);

  return (
    <main className="flex-1 md:ml-64 flex flex-col px-4 sm:px-8 md:px-12 py-8 min-h-screen bg-[#f7fafc] pb-28 md:pb-12 max-w-6xl mx-auto w-full font-sans">
      {/* Top Header */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006494] bg-[#5fafe9]/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
              <BookOpen className="w-3.5 h-3.5" />
              Dr. Roediger Testing Effect &amp; Active Recall
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-mono">
              {recallLogs.length} Records Synced
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#181c1e] tracking-tight">
            Active Recall Memory Archive
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#545f72] mt-0.5">
            Testing-effect memory notes synced with Study Theater video timestamps, Sem 7 PYQ bouts, and quick recalls.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => setIsCreatingRecall(!isCreatingRecall)}
            className="px-4 py-2.5 rounded-2xl bg-[#006494] hover:bg-[#004e75] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreatingRecall ? 'Close Writer' : 'Write Recall Note'}</span>
          </button>
        </div>
      </header>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-4 rounded-2xl bg-white border border-[#c2c8c0] shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Total Recall Entries</span>
          <span className="text-xl sm:text-2xl font-black text-[#006494] font-mono">{recallLogs.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#c2c8c0] shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Words Retrieved</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">{totalWords}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#c2c8c0] shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Theater Synced Notes</span>
          <span className="text-xl sm:text-2xl font-black text-rose-600 font-mono">
            {recallLogs.filter((r) => r.id.startsWith('video_note_')).length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#c2c8c0] shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Revisit Flags (⚠️)</span>
          <span className="text-xl sm:text-2xl font-black text-amber-600 font-mono">
            {recallLogs.filter((r) => r.recallContent.includes('⚠️') || r.recallContent.toLowerCase().includes('revisit')).length}
          </span>
        </div>
      </div>

      {/* Direct Recall Creator Form */}
      {isCreatingRecall && (
        <form
          onSubmit={handleSaveDirectRecall}
          className="mb-6 p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#006494]/40 shadow-md space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#006494]" />
              Write Direct Memory Recall (No Looking at Material)
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Testing Effect Protocol</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject / Domain</label>
              <input
                type="text"
                value={newRecallSubject}
                onChange={(e) => setNewRecallSubject(e.target.value)}
                placeholder="e.g. DSA & Algorithms, Generative AI, Cloud..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#006494] focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Topic / Lecture Concept</label>
              <input
                type="text"
                value={newRecallTitle}
                onChange={(e) => setNewRecallTitle(e.target.value)}
                placeholder="e.g. Binary Search Tree Inversion, RAG Architecture..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#006494] focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              What did you learn? (Write formulas, intuition, steps, and edge cases from pure memory)
            </label>
            <textarea
              value={newRecallContent}
              onChange={(e) => setNewRecallContent(e.target.value)}
              placeholder="1. Core Concept...\n2. Mechanism / Steps...\n3. Edge Cases / Common Bugs..."
              rows={5}
              className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#006494] focus:bg-white resize-none leading-relaxed"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingRecall(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSavingDirectRecall || !newRecallTitle.trim() || !newRecallContent.trim()}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
            >
              <Check className="w-4 h-4" />
              {isSavingDirectRecall ? 'Saving...' : 'Save to Archive'}
            </button>
          </div>
        </form>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recall notes, keywords, formulas..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#c2c8c0] text-xs text-slate-800 focus:outline-none focus:border-[#006494] font-medium shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Notes' },
            { id: 'video', label: '🎬 Video Theater' },
            { id: 'sem7', label: '⚡ Sem 7 Sprints' },
            { id: 'direct', label: '📝 Direct Entries' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterSubject(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterSubject === f.id
                  ? 'bg-[#181c1e] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredRecalls.length === 0 ? (
        <div className="py-16 px-6 text-center text-slate-400 bg-white rounded-3xl border border-[#c2c8c0] shadow-xs">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#006494]" />
          <h3 className="text-base font-extrabold text-[#181c1e] mb-1">
            No Active Recall Notes Found
          </h3>
          <p className="text-xs text-[#545f72] mt-1 max-w-sm mx-auto mb-5">
            Type notes inside the In-App YouTube Study Theater or click &quot;Write Recall Note&quot; above to log your first summary.
          </p>
          <button
            onClick={() => setIsCreatingRecall(true)}
            className="px-5 py-2 rounded-xl bg-[#006494] hover:bg-[#004e75] text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            + Write First Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRecalls.map((log) => {
            const isVideoNote = log.id.startsWith('video_note_');
            const isSem7Note = log.id.startsWith('recall_') && !log.id.startsWith('direct_');
            const wordCount = log.recallContent.trim() ? log.recallContent.trim().split(/\s+/).length : 0;
            const videoObj = isVideoNote ? getCurriculumVideoById(log.id) : null;

            // Structured timestamp notes
            const tNotes =
              log.timestampNotes && log.timestampNotes.length > 0
                ? log.timestampNotes
                : parseMarkdownToTimestampNotes(log.recallContent);

            const hasRevisitFlag =
              log.recallContent.includes('⚠️') ||
              log.recallContent.toLowerCase().includes('revisit') ||
              tNotes.some((n) => n.isRevisit);

            return (
              <div
                key={log.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-[#c2c8c0] hover:border-slate-400 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono ${
                          isVideoNote
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : isSem7Note
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {isVideoNote ? '🎬 THEATER NOTE' : isSem7Note ? '⚡ SEM 7 BOUT' : '📝 DIRECT RECALL'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 font-mono">
                        {log.subject}
                      </span>
                      {hasRevisitFlag && (
                        <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-0.5">
                          <span>⚠️</span> Revisit
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyRecall(log.id, log.recallContent)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                        title="Copy to clipboard"
                      >
                        {copiedRecallId === log.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteRecall(log.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Delete recall note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-[#181c1e] mb-3 leading-snug">
                    {log.topicTitle}
                  </h3>

                  {/* If Structured Notes exist, render them cleanly */}
                  {tNotes.length > 0 ? (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1 mb-3">
                      {tNotes.map((n, nIdx) => (
                        <div
                          key={n.id || nIdx}
                          className={`p-2.5 rounded-2xl text-xs font-mono border flex items-start justify-between gap-2 ${
                            n.isRevisit
                              ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                              : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            {videoObj && onWatchVideo ? (
                              <button
                                onClick={() => {
                                  onWatchVideo({ ...videoObj, startSeconds: n.timestampSeconds });
                                }}
                                className="px-2 py-0.5 rounded-lg bg-white hover:bg-rose-600 hover:text-white text-emerald-700 text-[10px] font-mono font-bold shrink-0 flex items-center gap-1 transition cursor-pointer border border-slate-300 shadow-2xs"
                                title="Jump video to this timestamp"
                              >
                                <PlayCircle className="w-3.5 h-3.5 text-rose-500" />
                                <span>{n.timestampFormatted}</span>
                              </button>
                            ) : (
                              <span className="px-2 py-0.5 rounded-lg bg-white text-slate-700 text-[10px] font-mono font-bold shrink-0 border border-slate-200">
                                {n.timestampFormatted}
                              </span>
                            )}
                            <p className="flex-1 min-w-0 text-[11px] leading-relaxed break-words font-sans">
                              {n.note}
                            </p>
                          </div>
                          {n.isRevisit && (
                            <span className="text-[10px] font-bold text-amber-700 shrink-0">
                              ⚠️
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto mb-3">
                      {log.recallContent}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
                  <span>
                    {tNotes.length > 0 ? `${tNotes.length} timestamp notes` : `${wordCount} words`} &bull; {log.durationMinutes > 0 ? `${log.durationMinutes}m focus` : 'Logged'}
                  </span>

                  <div className="flex items-center gap-2">
                    {videoObj && onWatchVideo && (
                      <button
                        onClick={() => {
                          const startSec = tNotes.length > 0 ? tNotes[0].timestampSeconds : 0;
                          onWatchVideo({ ...videoObj, startSeconds: startSec });
                        }}
                        className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition"
                      >
                        <PlayCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Play Video 🎬</span>
                      </button>
                    )}
                    <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};
