import React from 'react';
import { ScreenType, UserRole } from '../types';
import {
  Map,
  LucideIcon,
  BookOpen,
  Headphones,
  Wind,
  Target,
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
  const navItems: { id: ScreenType; label: string; Icon: LucideIcon }[] = [
    { id: 'sem7', label: 'Sem 7', Icon: BookOpen },
    { id: 'roadmap', label: 'Tasks', Icon: Map },
    { id: 'woop', label: 'WOOP', Icon: Target },
    { id: 'recalls', label: 'Recalls', Icon: BookOpen },
    { id: 'breathing', label: 'Sigh', Icon: Wind },
    { id: 'sounds', label: '40Hz', Icon: Headphones },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="fixed bottom-0 left-0 w-full z-50 flex items-center px-2 pb-3 pt-2 md:hidden bg-[#ffffff] rounded-t-2xl border-t border-[#c2c8c0] shadow-lg overflow-x-auto no-scrollbar gap-1"
    >
      {navItems.map((item) => {
        const isActive = currentScreen === item.id;
        const Icon = item.Icon;
        return (
          <button
            key={item.id}
            id={`mobile-nav-${item.id}`}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center min-w-[54px] flex-1 transition-transform active:scale-90 py-1 px-1 cursor-pointer rounded-xl ${
              isActive
                ? 'text-[#43664c] bg-[#8bb192]/15 font-bold'
                : 'text-[#545f72] hover:text-[#181c1e]'
            }`}
          >
            <Icon className={`mb-0.5 w-4 h-4 ${isActive ? 'text-[#43664c]' : 'text-[#545f72]'}`} />
            <span className="text-[10px] tracking-tight font-bold truncate max-w-[56px]">
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Account / Google Sync shortcut */}
      <button
        onClick={onOpenLoginModal}
        className="flex flex-col items-center justify-center px-2 py-1 text-slate-500 active:scale-90 cursor-pointer min-w-[44px]"
        title="Account & Google Sync"
      >
        <span className="text-sm mb-0.5">
          👨‍💻
        </span>
        <span className="text-[9px] font-bold text-slate-400 uppercase">
          Sync
        </span>
      </button>
    </nav>
  );
};

