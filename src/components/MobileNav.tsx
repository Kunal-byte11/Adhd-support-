import React from 'react';
import { ScreenType, UserRole } from '../types';
import {
  Target,
  Map,
  ShieldAlert,
  Sparkles,
  Heart,
  Sunrise,
  KeyRound,
  LucideIcon,
  BookOpen,
} from 'lucide-react';

interface MobileNavProps {
  currentScreen: ScreenType;
  userRole: UserRole;
  onNavigate: (screen: ScreenType) => void;
  onOpenLoginModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentScreen,
  userRole,
  onNavigate,
  onOpenLoginModal,
}) => {
  const kunalNavItems: { id: ScreenType; label: string; Icon: LucideIcon }[] = [
    { id: 'daily-plan', label: 'Plan 🌅', Icon: Sunrise },
    { id: 'now', label: 'Flow 🎯', Icon: Target },
    { id: 'roadmap', label: 'Tasks 🗺️', Icon: Map },
    { id: 'ia1-prep', label: 'IA 1 📝', Icon: BookOpen },
    { id: 'urges', label: 'Urge 🛡️', Icon: ShieldAlert },
  ];

  const partnerNavItems: { id: ScreenType; label: string; Icon: LucideIcon }[] = [
    { id: 'partner-hq', label: 'Partner HQ 💖', Icon: Heart },
  ];

  const navItems = userRole === 'partner' ? partnerNavItems : kunalNavItems;

  return (
    <nav
      id="mobile-bottom-nav"
      className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-1 pb-3 pt-2 md:hidden bg-[#ffffff] rounded-t-2xl border-t border-[#c2c8c0] shadow-md"
    >
      {navItems.map((item) => {
        const isActive = currentScreen === item.id;
        const Icon = item.Icon;
        return (
          <button
            key={item.id}
            id={`mobile-nav-${item.id}`}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center flex-1 transition-transform active:scale-90 py-1 cursor-pointer ${
              isActive
                ? 'text-[#43664c] font-bold'
                : 'text-[#545f72] active:bg-[#ebeef0] rounded-lg'
            }`}
          >
            <Icon className={`mb-0.5 w-5 h-5 ${isActive ? 'text-[#43664c]' : 'text-[#545f72]'}`} />
            <span className="text-[10px] uppercase font-semibold tracking-wider">
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Switch profile shortcut */}
      <button
        onClick={onOpenLoginModal}
        className="flex flex-col items-center justify-center px-2 py-1 text-slate-500 active:scale-90 cursor-pointer"
        title="Switch user"
      >
        <span className="text-base mb-0.5">
          {userRole === 'partner' ? '💖' : '👨‍💻'}
        </span>
        <span className="text-[9px] uppercase font-bold text-slate-400">
          Switch
        </span>
      </button>
    </nav>
  );
};
