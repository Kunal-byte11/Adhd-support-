import React, { useState, useEffect } from 'react';
import { TaskItem, PartnerNote } from '../types';
import {
  Check,
  Play,
  Pause,
  Sparkles,
  Plus,
  StickyNote,
  Clock,
  Send,
  Trash2,
  Minimize2,
} from 'lucide-react';

interface FedoraMinimalWidgetProps {
  tasks: TaskItem[];
  currentTask: TaskItem | null;
  notes: PartnerNote[];
  onCompleteTask: (taskId: string) => void;
  onSelectTask: (task: TaskItem) => void;
  onSendNote: (content: string) => void;
}

export const FedoraMinimalWidget: React.FC<FedoraMinimalWidgetProps> = ({
  tasks,
  currentTask,
  notes,
  onCompleteTask,
  onSelectTask,
  onSendNote,
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'notes'>('tasks');
  const [secondsRemaining, setSecondsRemaining] = useState(10 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');

  // Sync current task timer
  useEffect(() => {
    if (currentTask) {
      setSecondsRemaining((currentTask.estimatedMinutes || 10) * 60);
      setIsRunning(true);
    }
  }, [currentTask?.id]);

  // Pomodoro countdown
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    onSendNote(newNoteContent.trim());
    setNewNoteContent('');
  };

  return (
    <div className="w-full max-w-sm bg-[#181c1e] text-white border-2 border-[#43664c] rounded-3xl p-5 shadow-2xl font-sans relative overflow-hidden">
      {/* Top Header & Tab Switcher */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#43664c] text-emerald-300 flex items-center justify-center text-xs font-bold shadow-xs">
            🐧
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-tight">
              Fedora Focus Widget
            </h2>
            <p className="text-[10px] text-emerald-400 font-mono">Linux Minimal Mode</p>
          </div>
        </div>

        {/* Tab Toggle: Tasks vs Notes */}
        <div className="flex bg-gray-900 border border-gray-800 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-[#43664c] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Tasks ({tasks.filter((t) => !t.isCompleted).length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-[#43664c] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Notes ({notes.length})
          </button>
        </div>
      </div>

      {/* TAB 1: TODAY'S TASKS & POMODORO TIMER */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {/* Active Sprint Timer */}
          <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-300 font-semibold mb-1 line-clamp-1">
              {currentTask ? currentTask.title : "No active task selected"}
            </p>
            <div className="text-4xl font-black font-mono text-emerald-400 my-1">
              {formatTime(secondsRemaining)}
            </div>

            {/* Timer Actions */}
            <div className="flex gap-2 justify-center mt-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="py-2 px-4 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isRunning ? 'Pause' : 'Start'}</span>
              </button>

              <button
                onClick={() => setSecondsRemaining((prev) => prev + 300)}
                className="py-2 px-3 bg-amber-950/80 hover:bg-amber-900 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="Add 5 Minutes"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>+5m</span>
              </button>

              {currentTask && (
                <button
                  onClick={() => onCompleteTask(currentTask.id)}
                  className="py-2 px-3 bg-[#43664c] hover:bg-[#38553f] text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Done</span>
                </button>
              )}
            </div>
          </div>

          {/* Today's Tasks List */}
          <div>
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Today's Sequence
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {tasks.length > 0 ? (
                tasks.map((t) => {
                  const isCurrent = currentTask?.id === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => onSelectTask(t)}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-emerald-950/80 border-emerald-600 text-white font-bold'
                          : t.isCompleted
                          ? 'bg-gray-900/60 border-transparent text-gray-500 line-through'
                          : 'bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700'
                      }`}
                    >
                      <span className="truncate pr-2">{t.title}</span>
                      <span className="text-[10px] font-mono text-gray-400 shrink-0">
                        10m
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-gray-500 italic py-2 text-center">
                  No tasks queued for today.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NOTES WALL */}
      {activeTab === 'notes' && (
        <div className="space-y-3">
          {/* Add Quick Note Form */}
          <form onSubmit={handleAddNote} className="flex gap-2">
            <input
              type="text"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write a quick note..."
              className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="bg-[#43664c] hover:bg-[#38553f] text-white p-2 rounded-xl text-xs font-bold cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Notes List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs space-y-1"
                >
                  <p className="text-gray-200 font-medium leading-snug">
                    {note.content}
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 pt-1">
                    <span>{note.author}</span>
                    <span>{note.timestamp}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic py-4 text-center">
                No notes saved yet. Type a note above!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
