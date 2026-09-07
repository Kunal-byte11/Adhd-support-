import React from 'react';
import { ScreenType, UserRole } from '../types';
import {
  Map,
  Heart,
  LucideIcon,
  BookOpen,
  Brain,
  Headphones,
  Wind,
  Target,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentScreen: ScreenType;
  userRole: UserRole;
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
  userRole,
  onNavigate,
  onOpenLoginModal,
}) => {
  const coreNavItems: NavItem[] = [
    ...(userRole === 'partner'
      ? [{ id: 'partner-hq' as ScreenType, label: 'Partner HQ 💖', Icon: Heart }]
      : []),
    { id: 'sem7', label: 'Sem 7 📚', Icon: BookOpen },
    { id: 'roadmap', label: 'Curriculum & Tasks', Icon: Map },
  ];

  const neuroNavItems: NavItem[] = [
    { id: 'woop', label: 'WOOP Anchors 🎯', Icon: Target },
    { id: 'recalls', label: 'Active Recalls 📖', Icon: BookOpen },
    { id: 'breathing', label: 'Physiological Sigh 🫁', Icon: Wind },
    { id: 'sounds', label: '40Hz Focus Audio 🎧', Icon: Headphones },
  ];

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="mb-4">
      <div className="px-6 mb-2">
        <span className="text-[11px] font-semibold text-slate-500">
          {title}
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
            className={`flex items-center px-6 py-2.5 mb-1 text-left transition-colors duration-200 w-full cursor-pointer ${
              isActive
                ? 'text-[#43664c] border-l-4 border-[#43664c] bg-[#8bb192]/20 font-bold'
                : 'text-[#545f72] border-l-4 border-transparent hover:bg-[#e5e9eb]'
            }`}
          >
            <Icon
              className={`mr-3 w-4 h-4 shrink-0 ${
                isActive ? 'text-[#43664c]' : 'text-[#545f72]'
              }`}
            />
            <span className="text-[12px] tracking-wide font-bold truncate">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <nav
      id="desktop-sidebar"
      className="hidden md:flex flex-col h-full py-6 bg-[#f1f4f6] border-r border-[#c2c8c0] w-64 fixed left-0 top-0 transition-all duration-300 z-40"
    >
      {/* Brand Header */}
      <div className="px-6 mb-4">
        <h1 className="text-[24px] font-extrabold text-[#43664c] tracking-tight leading-tight">
          Momentum
        </h1>
        <p className="text-[12px] text-[#545f72] font-medium">
          Semester 7 focus &amp; memory hub
        </p>
      </div>

      {/* User Profile / Switcher Pill */}
      <div className="px-5 mb-4">
        <div
          onClick={onOpenLoginModal}
          className={`p-2.5 rounded-2xl border shadow-xs flex items-center justify-between cursor-pointer transition-all hover:shadow-sm ${
            userRole === 'partner'
              ? 'bg-pink-50/80 border-pink-200'
              : 'bg-white border-[#c2c8c0] hover:border-slate-400'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-lg">
              {userRole === 'partner' ? '💖' : '👨‍💻'}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#181c1e] truncate">
                {userRole === 'partner' ? 'partner_hq (Partner)' : 'kunal11 (Kunal)'}
              </p>
              <p className="text-[10px] text-[#545f72] truncate">
                Click to switch
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items grouped cleanly */}
      <div className="flex flex-col w-full flex-1 overflow-y-auto pr-1">
        {renderNavGroup('Study & Tasks', coreNavItems)}
        {renderNavGroup('Neuro Protocols', neuroNavItems)}
      </div>
    </nav>
  );
};
