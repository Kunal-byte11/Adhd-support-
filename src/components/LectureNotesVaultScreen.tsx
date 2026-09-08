import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Trash2,
  Check,
  PlayCircle,
  ExternalLink,
  Camera,
  Filter,
  Layers,
  Sparkles,
  ChevronRight,
  Eye,
  FileImage,
  Upload,
  ArrowUpRight,
  Play,
} from 'lucide-react';
import { ILecturePhotoNote, StudyTheaterVideo } from '../types';
import {
  subscribeAllPhotoNotes,
  deleteLecturePhotoNoteFromFirestore,
} from '../lib/firestoreService';
import {
  AI_DATA_SCIENCE_COURSES,
  DSA_PROBLEMS_DATA,
} from '../data/curriculumData';
import { AI_PLAYLIST_VIDEOS } from '../data/aiPlaylistVideos';
import { PhotoNotesManager } from './PhotoNotesManager';

interface LectureNotesVaultScreenProps {
  onWatchVideo?: (video: StudyTheaterVideo) => void;
}

interface FlattenedLectureItem {
  id: string;
  title: string;
  courseTitle: string;
  category: string;
  youtubeUrl: string;
  startSeconds?: number;
  duration?: string;
  thumbnailUrl?: string;
}

export const LectureNotesVaultScreen: React.FC<LectureNotesVaultScreenProps> = ({
  onWatchVideo,
}) => {
  const [allPhotoNotes, setAllPhotoNotes] = useState<ILecturePhotoNote[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [onlyShowWithNotes, setOnlyShowWithNotes] = useState<boolean>(false);

  // Active Photo Notes Modal
  const [activeLectureModal, setActiveLectureModal] = useState<FlattenedLectureItem | null>(null);

  // Subscribe to photo notes in Firestore
  useEffect(() => {
    const unsub = subscribeAllPhotoNotes((notes) => {
      setAllPhotoNotes(notes);
    });
    return () => unsub();
  }, []);

  // Map of notes grouped by lecture ID
  const notesByLectureId = useMemo(() => {
    const map = new Map<string, ILecturePhotoNote[]>();
    allPhotoNotes.forEach((n) => {
      const list = map.get(n.videoId) || [];
      list.push(n);
      map.set(n.videoId, list);
    });
    return map;
  }, [allPhotoNotes]);

  // Aggregate all lectures from curriculum
  const allLectures: FlattenedLectureItem[] = useMemo(() => {
    const items: FlattenedLectureItem[] = [];

    // 1. AI Courses & Modular Lectures
    AI_DATA_SCIENCE_COURSES.forEach((course) => {
      const playlist = AI_PLAYLIST_VIDEOS[course.id];
      if (playlist && playlist.length > 0) {
        playlist.forEach((vid) => {
          items.push({
            id: vid.id,
            title: vid.title,
            courseTitle: course.title,
            category: course.category,
            youtubeUrl: vid.youtubeUrl,
            startSeconds: vid.startSeconds || 0,
            duration: vid.durationTimestamp,
            thumbnailUrl: vid.thumbnailUrl,
          });
        });
      } else if (course.youtubeUrl) {
        items.push({
          id: course.id,
          title: course.title,
          courseTitle: course.title,
          category: course.category,
          youtubeUrl: course.youtubeUrl,
          duration: course.durationHours,
        });
      }
    });

    // 2. DSA Problems
    DSA_PROBLEMS_DATA.forEach((prob) => {
      if (prob.youtubeUrl) {
        items.push({
          id: prob.id,
          title: prob.title,
          courseTitle: prob.moduleName,
          category: 'DSA & Algorithms',
          youtubeUrl: prob.youtubeUrl,
          duration: prob.durationTimestamp,
        });
      }
    });

    return items;
  }, []);

  // Filtered lectures
  const filteredLectures = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return allLectures.filter((lec) => {
      const lectureNotes = notesByLectureId.get(lec.id) || [];
      const hasNotes = lectureNotes.length > 0;

      if (onlyShowWithNotes && !hasNotes) return false;

      // Filter by course
      if (filterCourse !== 'all') {
        if (filterCourse === 'karpathy' && !lec.id.startsWith('ai-res-11')) return false;
        if (filterCourse === 'stats' && !lec.id.startsWith('ai-res-26')) return false;
        if (filterCourse === 'dsa' && lec.category !== 'DSA & Algorithms') return false;
        if (filterCourse === 'genai' && lec.category !== 'Generative AI' && lec.category !== 'Agentic AI') return false;
      }

      if (!q) return true;

      // Search match
      const matchesTitle = lec.title.toLowerCase().includes(q);
      const matchesCourse = lec.courseTitle.toLowerCase().includes(q);
      const matchesNotesCaption = lectureNotes.some(
        (n) => n.title?.toLowerCase().includes(q) || n.notes?.toLowerCase().includes(q)
      );

      return matchesTitle || matchesCourse || matchesNotesCaption;
    });
  }, [allLectures, searchQuery, filterCourse, onlyShowWithNotes, notesByLectureId]);

  const totalPagesCount = allPhotoNotes.length;
  const lecturesWithNotesCount = notesByLectureId.size;

  return (
    <div className="flex-1 min-h-screen bg-[#f8fafc] text-slate-900 md:pl-64 flex flex-col pb-24 md:pb-12 selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4 shadow-2xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-200/60">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Lecture Notes & Diagrams Vault
                </h1>
                <p className="text-xs text-slate-500">
                  Every lecture paired with its direct video link & handwritten notebook photos
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-1.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
              <span className="text-sm font-black text-amber-900">{totalPagesCount}</span>
              <span className="text-xs font-semibold text-amber-800">Pages Saved</span>
            </div>
            <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
              <span className="text-sm font-black text-emerald-900">{lecturesWithNotesCount}</span>
              <span className="text-xs font-semibold text-emerald-800">Lectures with Notes</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6">
        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lectures, topics, or note captions..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Only With Notes Toggle */}
            <button
              onClick={() => setOnlyShowWithNotes(!onlyShowWithNotes)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
                onlyShowWithNotes
                  ? 'bg-amber-500 text-white shadow-xs font-black'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Has Notes ({lecturesWithNotesCount})</span>
            </button>
          </div>

          {/* Filter Categories Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            {[
              { id: 'all', label: 'All Courses' },
              { id: 'karpathy', label: 'Karpathy GPT (20 Lecs)' },
              { id: 'stats', label: 'Krish Naik Statistics (29 Chapters)' },
              { id: 'genai', label: 'GenAI & Agents' },
              { id: 'dsa', label: 'DSA & Algorithms' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCourse(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  filterCourse === cat.id
                    ? 'bg-[#006494] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lectures List with Photo Notes */}
        <div className="space-y-4">
          {filteredLectures.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-200/60 shadow-inner">
                <FileImage className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No lectures found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {onlyShowWithNotes
                  ? 'No handwritten notes uploaded for this filter yet. Click on any lecture to upload photos of your notebook!'
                  : 'Try adjusting your search keywords or filter category.'}
              </p>
            </div>
          ) : (
            filteredLectures.map((lec) => {
              const notes = notesByLectureId.get(lec.id) || [];
              const hasNotes = notes.length > 0;

              return (
                <div
                  key={lec.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition overflow-hidden p-4 sm:p-5 space-y-4"
                >
                  {/* Lecture Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                          {lec.courseTitle}
                        </span>
                        {lec.duration && (
                          <span className="text-[11px] font-mono text-slate-500">
                            ⏱️ {lec.duration}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            hasNotes
                              ? 'bg-amber-100 text-amber-900 border border-amber-300/80'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          📸 {notes.length} {notes.length === 1 ? 'Page' : 'Pages'}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {lec.title}
                      </h3>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Open Study Theater */}
                      {onWatchVideo && lec.youtubeUrl && (
                        <button
                          onClick={() => {
                            onWatchVideo({
                              id: lec.id,
                              title: lec.title,
                              youtubeUrl: lec.youtubeUrl,
                              subject: lec.category,
                              startSeconds: lec.startSeconds || 0,
                            });
                          }}
                          className="px-3.5 py-2 bg-[#006494] hover:bg-[#004e75] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                          title="Watch in Study Theater"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Watch</span>
                        </button>
                      )}

                      {/* Open Notes Manager / Lightbox */}
                      <button
                        onClick={() => setActiveLectureModal(lec)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                          hasNotes
                            ? 'bg-amber-500 hover:bg-amber-600 text-white'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/70'
                        }`}
                        title="View or upload handwritten notes"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{hasNotes ? 'Read Notes' : '+ Add Notes'}</span>
                      </button>

                      {/* Direct YouTube Link */}
                      {lec.youtubeUrl && (
                        <a
                          href={lec.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition"
                          title="Open on YouTube"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Photo Notes Thumbnails Strip if notes exist */}
                  {hasNotes && (
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                        {notes.map((note, idx) => (
                          <div
                            key={note.id}
                            onClick={() => setActiveLectureModal(lec)}
                            className="group relative w-24 sm:w-28 h-20 sm:h-24 bg-slate-900 rounded-xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition shrink-0 cursor-pointer flex flex-col justify-end"
                          >
                            <img
                              src={note.imageUrl}
                              alt={note.title || `Page ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 p-1.5 flex flex-col justify-between">
                              <span className="text-[9px] font-bold text-white bg-black/70 px-1.5 py-0.2 rounded w-fit">
                                Page {idx + 1}
                              </span>
                              <span className="text-[10px] font-semibold text-white truncate">
                                {note.title || `Page ${idx + 1}`}
                              </span>
                            </div>
                          </div>
                        ))}

                        {/* Add Page Shortcut Button */}
                        <button
                          onClick={() => setActiveLectureModal(lec)}
                          className="w-24 sm:w-28 h-20 sm:h-24 rounded-xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50 text-amber-800 transition flex flex-col items-center justify-center gap-1 shrink-0 cursor-pointer text-xs font-bold"
                        >
                          <Plus className="w-4 h-4 text-amber-700" />
                          <span>Add Page</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Dedicated Photo Notes Modal for Lecture */}
      {activeLectureModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={() => setActiveLectureModal(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <PhotoNotesManager
              videoId={activeLectureModal.id}
              videoTitle={`${activeLectureModal.courseTitle} • ${activeLectureModal.title}`}
              onClose={() => setActiveLectureModal(null)}
              isEmbedded={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};
