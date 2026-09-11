import React from 'react';
import { ScreenType, UserRole } from '../types';
import {
  LucideIcon,
  BookOpen,
  Brain,
  Headphones,
  Wind,
  Target,
  Sparkles,
  Code2,
  BrainCircuit,
  Cpu,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentScreen: ScreenType;
  userRole?: UserRole;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate: (screen: ScreenType) => void;
  onOpenLoginModal: () => void;
}

interface NavItem {
  id: ScreenType;
  label: string;
  Icon: LucideIcon;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  isCollapsed = false,
  onToggleCollapse,
  onNavigate,
  onOpenLoginModal,
}) => {
  const coreNavItems: NavItem[] = [
    { id: 'learning', label: 'Learning & Code 💻', Icon: Code2 },
    { id: 'roadmap', label: 'Road to Gen AI 🤖', Icon: BrainCircuit },
    { id: 'sem7', label: 'Sem 7 📚', Icon: BookOpen },
  ];

  const neuroNavItems: NavItem[] = [
    { id: 'dmn', label: 'DMN Story 🧠', Icon: Brain },
    { id: 'woop', label: 'WOOP Anchors 🎯', Icon: Target },
    { id: 'breathing', label: 'Physiological Sigh 🫁', Icon: Wind },
    { id: 'sounds', label: '40Hz Focus Audio 🎧', Icon: Headphones },
  ];

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="mb-4">
      <div className={`mb-2 transition-all ${isCollapsed ? 'px-0 text-center' : 'px-5'}`}>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
          {isCollapsed ? '•' : title}
        </span>
      </div>
      {items.map((item) => {
        const isActive = currentScreen === item.id;
        const Icon = item.Icon;
        return (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            onClick={() => onNavigate(item.id)}
            title={isCollapsed ? item.label : undefined}
            className={`flex items-center mb-1.5 text-left transition-all duration-200 w-full cursor-pointer group relative ${
              isCollapsed
                ? 'justify-center px-0 py-2.5 rounded-xl mx-auto w-10'
                : 'px-4 py-2.5 rounded-xl mx-2 w-[calc(100%-16px)]'
            } ${
              isActive
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/40 font-bold shadow-md shadow-emerald-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/70 border border-transparent'
            }`}
          >
            <Icon
              className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                isCollapsed
                  ? isActive ? 'text-emerald-400' : 'text-slate-400'
                  : isActive ? 'text-emerald-400 mr-3' : 'text-slate-400 mr-3'
              }`}
            />
            {!isCollapsed && (
              <span className="text-[12px] tracking-wide font-bold truncate">
                {item.label}
              </span>
            )}
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#121820] text-emerald-200 text-xs font-mono font-bold rounded-xl shadow-2xl border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <nav
      id="desktop-sidebar"
      className={`hidden md:flex flex-col h-full py-4.5 bg-[#0b0f14] border-r border-slate-800/90 fixed left-0 top-0 transition-all duration-300 z-40 ${
        isCollapsed ? 'w-16 items-center' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className={`mb-3 flex items-center justify-between w-full ${isCollapsed ? 'px-2 flex-col gap-2' : 'px-5'}`}>
        {!isCollapsed ? (
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-black text-white tracking-tight leading-tight">
                FocusFlow
              </h1>
              <span className="text-[10px] font-mono font-black bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 px-2 py-0.5 rounded-full shadow-sm">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Algorithms &amp; Focus Engine
            </p>
          </div>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-lg shadow-emerald-500/25">
            ⚡
          </div>
        )}

        {/* Arrow Toggle Button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse to Full Website'}
            className="p-1.5 rounded-xl bg-[#141b24] border border-slate-700/80 hover:border-emerald-500/60 text-slate-400 hover:text-emerald-300 transition-all shadow-md cursor-pointer flex items-center justify-center shrink-0 hover:scale-105"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5 text-slate-300" />
            )}
          </button>
        )}
      </div>

      {/* User Profile / Switcher Pill */}
      <div className={`mb-4 w-full ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <div
          onClick={onOpenLoginModal}
          title={isCollapsed ? 'kunal11 (Kunal)' : undefined}
          className={`rounded-2xl border shadow-md flex items-center cursor-pointer transition-all bg-[#121820] border-slate-800 hover:border-slate-700 ${
            isCollapsed ? 'p-2 justify-center' : 'p-2.5 justify-between'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-base">
              👨‍💻
            </span>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate font-mono">
                  kunal11
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  Google Synced
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Items grouped cleanly */}
      <div className={`flex flex-col w-full flex-1 overflow-y-auto ${isCollapsed ? 'items-center px-0' : 'pr-0'}`}>
        {renderNavGroup('Study & Tasks', coreNavItems)}
        {renderNavGroup('Neuro Protocols', neuroNavItems)}
      </div>
    </nav>
  );
};
