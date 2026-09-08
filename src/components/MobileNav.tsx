import React, { useState, useEffect, useRef } from 'react';
import { ScreenType, UserRole } from '../types';
import {
  Map,
  LucideIcon,
  BookOpen,
  Headphones,
  Wind,
  Target,
  Camera,
  Sparkles,
  UserCheck,
  ChevronRight,
  Settings,
  Layers,
} from 'lucide-react';

interface MobileNavProps {
  currentScreen: ScreenType;
  userRole?: UserRole;
  onNavigate: (screen: ScreenType) => void;
  onOpenLoginModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentScreen,
  onNavigate,
  onOpenLoginModal,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Primary Quick Items (Visible directly in dock)
  const quickItems: { id: ScreenType; label: string; Icon: LucideIcon }[] = [
    { id: 'sem7', label: 'Sem 7', Icon: BookOpen },
    { id: 'notes', label: 'Notes 📸', Icon: Camera },
    { id: 'roadmap', label: 'Tasks', Icon: Map },
  ];

  // Expanded Menu Items
  const allItems: {
    id: ScreenType;
    label: string;
    description: string;
    Icon: LucideIcon;
    badge?: string;
    accentBg: string;
    accentText: string;
  }[] = [
    {
      id: 'sem7',
      label: 'Sem 7 Hub',
      description: 'Study syllabus, exams & lectures',
      Icon: BookOpen,
      accentBg: 'bg-emerald-500/10',
      accentText: 'text-emerald-700',
    },
    {
      id: 'notes',
      label: 'Lecture Notes Vault',
      description: 'Handwritten notes with stationary reader',
      Icon: Camera,
      badge: '📸',
      accentBg: 'bg-amber-500/10',
      accentText: 'text-amber-700',
    },
    {
      id: 'roadmap',
      label: 'Tasks & Roadmap',
      description: 'Bite-sized structured execution steps',
      Icon: Map,
      accentBg: 'bg-sky-500/10',
      accentText: 'text-sky-700',
    },
    {
      id: 'woop',
      label: 'WOOP Strategy',
      description: 'Wish, Outcome, Obstacle & If-Then Plan',
      Icon: Target,
      badge: '🎯',
      accentBg: 'bg-rose-500/10',
      accentText: 'text-rose-700',
    },
    {
      id: 'breathing',
      label: 'Physiological Sigh',
      description: '2-breath autonomic nervous reset',
      Icon: Wind,
      badge: '🫁',
      accentBg: 'bg-teal-500/10',
      accentText: 'text-teal-700',
    },
    {
      id: 'sounds',
      label: '40Hz Focus Audio',
      description: 'Binaural gamma wave synthesizer',
      Icon: Headphones,
      badge: '🎧',
      accentBg: 'bg-indigo-500/10',
      accentText: 'text-indigo-700',
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed bottom-3 inset-x-0 z-50 md:hidden flex justify-center items-center px-4 pointer-events-none select-none"
    >
      {/* 🌟 Floating Expanded Animated Navigation Menu List */}
      {isOpen && (
        <div className="absolute bottom-16 right-4 w-72 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/90 p-2.5 space-y-1 animate-in fade-in zoom-in-95 origin-bottom-right duration-200 pointer-events-auto">
          {/* Header */}
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Navigation Hub
              </span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">
              Momentum
            </span>
          </div>

          {/* List Items */}
          <ul className="space-y-1 py-1">
            {allItems.map((item, index) => {
              const isActive = currentScreen === item.id;
              const Icon = item.Icon;

              return (
                <li
                  key={item.id}
                  style={{ animationDelay: `${index * 40}ms` }}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                  className={`mobile-nav-item-animate flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#43664c] text-white shadow-sm font-bold'
                      : 'hover:bg-slate-100/80 text-slate-700 hover:text-slate-900 active:scale-98'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition ${
                        isActive ? 'bg-white/20 text-white' : `${item.accentBg} ${item.accentText}`
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold truncate">{item.label}</span>
                        {item.badge && <span className="text-[10px]">{item.badge}</span>}
                      </div>
                      <p
                        className={`text-[10px] truncate ${
                          isActive ? 'text-emerald-100' : 'text-slate-400'
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-300'
                    }`}
                  />
                </li>
              );
            })}
          </ul>

          {/* Account / Google Sync Option */}
          <div className="pt-1.5 border-t border-slate-100">
            <button
              onClick={() => {
                onOpenLoginModal();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <span>Google Account Sync</span>
              </div>
              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                Sync ✓
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 🧭 The Main Floating Dock Bar */}
      <div className="bg-slate-900/90 backdrop-blur-xl text-white rounded-full p-1.5 shadow-2xl border border-slate-700/80 flex items-center gap-1 pointer-events-auto max-w-sm w-full justify-between">
        {/* Quick Nav Buttons */}
        <div className="flex items-center gap-1 flex-1">
          {quickItems.map((item) => {
            const isActive = currentScreen === item.id;
            const Icon = item.Icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className={`flex-1 py-1.5 px-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#43664c] text-white shadow-xs font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[11px] truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* The Animated Morphing Menu Button (Triple Line to Cross) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu Button"
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer shrink-0 ${
            isOpen
              ? 'bg-rose-500 text-white rotate-90 scale-105'
              : 'bg-[#43664c] hover:bg-[#34523c] text-white mobile-fab-pulse'
          }`}
        >
          <div
            className={`w-3.5 h-3.5 flex flex-col justify-between transition-transform duration-300 ${
              isOpen ? '-rotate-45' : ''
            }`}
          >
            <div
              className={`h-[2px] bg-white rounded-full transition-all duration-300 ${
                isOpen ? 'w-full translate-y-[6px] rotate-90' : 'w-[60%]'
              }`}
            />
            <div
              className={`h-[2px] bg-white rounded-full transition-all duration-300 ${
                isOpen ? 'w-full' : 'w-full'
              }`}
            />
            <div
              className={`h-[2px] bg-white rounded-full transition-all duration-300 self-end ${
                isOpen ? 'w-full -translate-y-[6px] rotate-90' : 'w-[60%]'
              }`}
            />
          </div>
        </button>
      </div>
    </div>
  );
};


