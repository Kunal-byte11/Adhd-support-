import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Camera,
  Play,
  FileImage,
  Upload,
  Calendar,
  Sparkles,
  Layers,
  ZoomIn,
  Eye,
  Check,
  X,
} from 'lucide-react';
import { ILecturePhotoNote, StudyTheaterVideo } from '../types';
import {
  subscribeAllPhotoNotes,
  deleteLecturePhotoNoteFromFirestore,
} from '../lib/firestoreService';
import {
  getCurriculumVideoById,
  AI_DATA_SCIENCE_COURSES,
  DSA_PROBLEMS_DATA,
} from '../data/curriculumData';
import { AI_PLAYLIST_VIDEOS } from '../data/aiPlaylistVideos';
import { StationaryNotebookViewer } from './StationaryNotebookViewer';

interface LectureNotesVaultScreenProps {
  onWatchVideo?: (video: StudyTheaterVideo) => void;
}

export const LectureNotesVaultScreen: React.FC<LectureNotesVaultScreenProps> = ({
  onWatchVideo,
}) => {
  const [allPhotoNotes, setAllPhotoNotes] = useState<ILecturePhotoNote[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeViewerLectureId, setActiveViewerLectureId] = useState<string | null>(null);
  const [isAddNotesModalOpen, setIsAddNotesModalOpen] = useState<boolean>(false);
  const [selectedLectureForUpload, setSelectedLectureForUpload] = useState<string>('');

  // Subscribe to photo notes from Firestore
  useEffect(() => {
    const unsub = subscribeAllPhotoNotes((notes) => {
      setAllPhotoNotes(notes);
    });
    return () => unsub();
  }, []);

  // Map of all available lectures for quick upload selection
  const allLecturesList = useMemo(() => {
    const list: { id: string; title: string; course: string; youtubeUrl: string }[] = [];

    AI_DATA_SCIENCE_COURSES.forEach((course) => {
      const playlist = AI_PLAYLIST_VIDEOS[course.id];
      if (playlist && playlist.length > 0) {
        playlist.forEach((v) => {
          list.push({
            id: v.id,
            title: v.title,
            course: course.title,
            youtubeUrl: v.youtubeUrl,
          });
        });
      } else if (course.youtubeUrl) {
        list.push({
          id: course.id,
          title: course.title,
          course: course.title,
          youtubeUrl: course.youtubeUrl,
        });
      }
    });

    DSA_PROBLEMS_DATA.forEach((prob) => {
      if (prob.youtubeUrl) {
        list.push({
          id: prob.id,
          title: prob.title,
          course: prob.moduleName || 'DSA',
          youtubeUrl: prob.youtubeUrl,
        });
      }
    });

    return list;
  }, []);

  // Group notes by lecture
  const notesGroupedByLecture = useMemo(() => {
    const groups = new Map<
      string,
      {
        lectureId: string;
        lectureInfo: StudyTheaterVideo | null;
        notes: ILecturePhotoNote[];
      }
    >();

    allPhotoNotes.forEach((note) => {
      const existing = groups.get(note.videoId) || {
        lectureId: note.videoId,
        lectureInfo: getCurriculumVideoById(note.videoId),
        notes: [],
      };
      existing.notes.push(note);
      groups.set(note.videoId, existing);
    });

    // Sort notes inside each group by createdAt
    groups.forEach((g) => {
      g.notes.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    });

    return Array.from(groups.values());
  }, [allPhotoNotes]);

  // Filter groups by search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return notesGroupedByLecture;
    const q = searchQuery.toLowerCase().trim();

    return notesGroupedByLecture.filter((g) => {
      const titleMatch = g.lectureInfo?.title.toLowerCase().includes(q) || g.lectureId.toLowerCase().includes(q);
      const subjectMatch = g.lectureInfo?.subject?.toLowerCase().includes(q);
      const notesMatch = g.notes.some(
        (n) => n.title?.toLowerCase().includes(q) || n.notes?.toLowerCase().includes(q)
      );
      return titleMatch || subjectMatch || notesMatch;
    });
  }, [notesGroupedByLecture, searchQuery]);

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this handwritten note page?')) {
      await deleteLecturePhotoNoteFromFirestore(noteId);
    }
  };

  const handleOpenLectureInTheater = (lectureId: string) => {
    const vid = getCurriculumVideoById(lectureId);
    if (vid && onWatchVideo) {
      onWatchVideo(vid);
    } else {
      setActiveViewerLectureId(lectureId);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#f8fafc] text-slate-900 md:pl-64 flex flex-col pb-24 md:pb-12 selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4 shadow-2xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-700 border border-amber-200/60 shadow-2xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Handwritten Lecture Notes
              </h1>
              <p className="text-xs text-slate-500">
                {allPhotoNotes.length} {allPhotoNotes.length === 1 ? 'page' : 'pages'} uploaded across {notesGroupedByLecture.length} {notesGroupedByLecture.length === 1 ? 'lecture' : 'lectures'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                if (allLecturesList.length > 0 && !selectedLectureForUpload) {
                  setSelectedLectureForUpload(allLecturesList[0].id);
                }
                setIsAddNotesModalOpen(true);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Notes</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6">
        {/* Search Bar if notes exist */}
        {allPhotoNotes.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by lecture title, topic, or page note..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs transition"
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
        )}

        {/* Notes Vault Display */}
        {allPhotoNotes.length === 0 ? (
          /* Empty State: Prompt to upload first note */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs space-y-4 max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-200/60 shadow-inner">
              <Camera className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">No notes uploaded yet</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Snap photos of your handwritten formulas, derivations, or notebook pages. They will be saved to ImgBB and paired directly with their YouTube lectures!
              </p>
            </div>
            <button
              onClick={() => {
                if (allLecturesList.length > 0) {
                  setSelectedLectureForUpload(allLecturesList[0].id);
                }
                setIsAddNotesModalOpen(true);
              }}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-xs font-bold inline-flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Notes for a Lecture</span>
            </button>
          </div>
        ) : filteredGroups.length === 0 ? (
          /* No search match */
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-2">
            <p className="text-sm font-bold text-slate-700">No notes match your search</p>
            <p className="text-xs text-slate-500">Try searching for a different keyword or clear search.</p>
          </div>
        ) : (
          /* Square / Grid Structured Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGroups.map((group) => {
              const lec = group.lectureInfo;
              const youtubeUrl = lec?.youtubeUrl;

              // Derive domain / subject
              const isDsa = group.lectureId.startsWith('dsa-') || lec?.category === 'dsa';
              const domainName = isDsa ? 'DSA' : (lec?.subject || 'AI & ML');

              // Extract lecture number or chapter info
              let lectureNo = '';
              const lecNumMatch = (lec?.title || group.lectureId).match(/(?:Part\s*|Lecture\s*|Lesson\s*|#|Lec\s*|V\s*)(\d+)/i);
              if (lecNumMatch) {
                lectureNo = `Lec ${lecNumMatch[1]}`;
              } else if (isDsa) {
                const parts = group.lectureId.split('-');
                if (parts.length >= 3) {
                  lectureNo = `Ch ${parts[1]}.${parts[2]}`;
                } else {
                  lectureNo = 'DSA Problem';
                }
              } else {
                lectureNo = `${group.notes.length} ${group.notes.length === 1 ? 'Page' : 'Pages'}`;
              }

              const topicTitle = lec?.title || group.lectureId;
              const previewNote = group.notes[0];

              return (
                <div
                  key={group.lectureId}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Top Section: Breadcrumb & Title */}
                  <div className="p-4 sm:p-5 space-y-3">
                    {/* Breadcrumb: DSA -> Lect No. -> Pages */}
                    <div className="flex items-center gap-1.5 flex-wrap text-xs">
                      <span className="px-2 py-0.5 rounded-lg font-bold text-[11px] bg-slate-900 text-white">
                        {domainName}
                      </span>
                      <span className="text-slate-400 font-bold">→</span>
                      <span className="px-2 py-0.5 rounded-lg font-mono font-bold text-[11px] bg-amber-100 text-amber-900 border border-amber-300/80">
                        {lectureNo}
                      </span>
                      <span className="text-slate-400 font-bold">→</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500 bg-slate-100">
                        {group.notes.length} {group.notes.length === 1 ? 'page' : 'pages'}
                      </span>
                    </div>

                    {/* Topic Title */}
                    <div>
                      <h3
                        onClick={() => handleOpenLectureInTheater(group.lectureId)}
                        className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 hover:text-[#006494] cursor-pointer transition"
                        title={topicTitle}
                      >
                        {topicTitle}
                      </h3>
                    </div>
                  </div>

                  {/* Middle Section: Note Image (Square / Aspect Frame) */}
                  <div
                    onClick={() => handleOpenLectureInTheater(group.lectureId)}
                    className="relative aspect-video sm:aspect-square bg-slate-950 overflow-hidden cursor-pointer mx-4 sm:mx-5 rounded-2xl border border-slate-200 shadow-inner group/img"
                  >
                    {previewNote ? (
                      <>
                        <img
                          src={previewNote.imageUrl}
                          alt={previewNote.title || topicTitle}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition duration-300"
                          loading="lazy"
                        />
                        {/* Overlay Gradient & Page Info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 p-3 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono font-bold rounded-md">
                              Page 1 of {group.notes.length}
                            </span>
                            <span className="p-1 bg-black/60 rounded-lg text-white/80 group-hover/img:text-white transition">
                              <ZoomIn className="w-3.5 h-3.5" />
                            </span>
                          </div>

                          {/* Multi-page mini thumbnails strip if > 1 page */}
                          {group.notes.length > 1 && (
                            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                              {group.notes.slice(0, 4).map((n, idx) => (
                                <div
                                  key={n.id}
                                  className="w-7 h-7 rounded-md overflow-hidden border border-white/60 shadow-xs shrink-0 bg-slate-800"
                                >
                                  <img src={n.imageUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                              ))}
                              {group.notes.length > 4 && (
                                <div className="w-7 h-7 rounded-md bg-black/80 text-white text-[9px] font-bold font-mono flex items-center justify-center shrink-0 border border-white/40">
                                  +{group.notes.length - 4}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-1 p-4 text-center">
                        <FileImage className="w-8 h-8 text-slate-600" />
                        <span className="text-xs">No image yet</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Section: Link & Action Buttons */}
                  <div className="p-4 sm:p-5 pt-3 flex items-center justify-between gap-2 border-t border-slate-100 mt-3">
                    {/* YouTube Video Link */}
                    {youtubeUrl ? (
                      <a
                        href={youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition truncate max-w-[130px]"
                        title="Open video link on YouTube"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">Link</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No link</span>
                    )}

                    {/* Single Small Add Page Button + Open Theater */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedLectureForUpload(group.lectureId);
                          setIsAddNotesModalOpen(true);
                        }}
                        className="px-2 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-300/80 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                        title="Upload a new note page"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Page</span>
                      </button>

                      <button
                        onClick={() => handleOpenLectureInTheater(group.lectureId)}
                        className="px-3 py-1.5 bg-[#006494] hover:bg-[#004e75] text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-2xs transition cursor-pointer"
                        title="Watch with stationary notebook"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Upload Modal (Pick Lecture & Upload Notes) */}
      {isAddNotesModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsAddNotesModalOpen(false)}
        >
          <div
            className="bg-[#11161a] rounded-3xl shadow-2xl border border-slate-800 w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold">Upload Handwritten Notes</h3>
              </div>
              <button
                onClick={() => setIsAddNotesModalOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lecture Selector */}
            <div className="p-4 bg-slate-900/60 border-b border-slate-800 space-y-1.5">
              <label className="text-xs font-bold text-slate-400">
                Select Lecture to attach notes:
              </label>
              <select
                value={selectedLectureForUpload}
                onChange={(e) => setSelectedLectureForUpload(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-400"
              >
                {allLecturesList.map((lec) => (
                  <option key={lec.id} value={lec.id}>
                    {lec.course} • {lec.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Embedded Stationary Notebook Viewer / Upload Zone */}
            <div className="flex-1 min-h-0">
              {selectedLectureForUpload && (
                <StationaryNotebookViewer
                  videoId={selectedLectureForUpload}
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Standalone Stationary Viewer Modal */}
      {activeViewerLectureId && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={() => setActiveViewerLectureId(null)}
        >
          <div
            className="bg-[#11161a] rounded-3xl shadow-2xl border border-slate-800 w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 truncate">
                {getCurriculumVideoById(activeViewerLectureId)?.title || activeViewerLectureId}
              </span>
              <button
                onClick={() => setActiveViewerLectureId(null)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <StationaryNotebookViewer
                videoId={activeViewerLectureId}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
