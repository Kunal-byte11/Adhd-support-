import React from 'react';
import { ScreenType, UserRole } from '../types';
import {
  Target,
  Map,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Heart,
  Database,
  Sunrise,
  LucideIcon,
  Users,
  KeyRound,
  Gift,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface SidebarProps {
  currentScreen: ScreenType;
  userRole: UserRole;
  onNavigate: (screen: ScreenType) => void;
  onOpenLoginModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  userRole,
  onNavigate,
  onOpenLoginModal,
}) => {
  const kunalNavItems: { id: ScreenType; label: string; Icon: LucideIcon }[] = [
    { id: 'daily-plan', label: 'Morning Plan 🌅', Icon: Sunrise },
    { id: 'now', label: 'My Flow (Now)', Icon: Target },
    { id: 'roadmap', label: 'Curriculum & Tasks', Icon: Map },
    { id: 'ia1-prep', label: 'IA 1 Prep 📝', Icon: BookOpen },
    { id: 'intake', label: 'Intake & Planning', Icon: Sparkles },
    { id: 'urges', label: 'Urge Lockdown', Icon: ShieldAlert },
    { id: 'recovery', label: 'Recovery Reset', Icon: RefreshCw },
  ];

  const partnerNavItems: { id: ScreenType; label: string; Icon: LucideIcon }[] = [
    { id: 'partner-hq', label: 'Partner HQ 💖', Icon: Heart },
  ];

  const navItems = userRole === 'partner' ? partnerNavItems : kunalNavItems;

  return (
    <nav
      id="desktop-sidebar"
      className="hidden md:flex flex-col h-full py-8 bg-[#f1f4f6] border-r border-[#c2c8c0] w-64 fixed left-0 top-0 transition-all duration-300 z-40"
    >
      {/* Brand Header */}
      <div className="px-6 mb-5">
        <h1 className="text-[28px] font-extrabold text-[#43664c] tracking-tight leading-tight">
          Momentum
        </h1>
        <p className="text-[13px] text-[#545f72] font-medium">
          Steady &amp; Calm &bull; Focus Flow
        </p>
      </div>

      {/* User Profile / Switcher Pill */}
      <div className="px-5 mb-5">
        <div
          className={`p-3 rounded-2xl border shadow-xs flex items-center justify-between ${
            userRole === 'partner'
              ? 'bg-pink-50/80 border-pink-200'
              : 'bg-white border-[#c2c8c0]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl">
              {userRole === 'partner' ? '💖' : '👨‍💻'}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#181c1e] truncate">
                {userRole === 'partner' ? 'partner_hq (Partner)' : 'kunal11 (Kunal)'}
              </p>
              <p className="text-[10px] text-[#545f72] truncate">
                Active Session
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col w-full flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.Icon;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center px-6 py-3 mb-1 text-left transition-colors duration-200 w-full cursor-pointer ${
                isActive
                  ? 'text-[#43664c] border-l-4 border-[#43664c] bg-[#8bb192]/20 font-semibold'
                  : 'text-[#545f72] border-l-4 border-transparent hover:bg-[#e5e9eb]'
              }`}
            >
              <Icon
                className={`mr-3 w-4 h-4 ${
                  isActive ? 'text-[#43664c]' : 'text-[#545f72]'
                }`}
              />
              <span className="text-[13px] tracking-wider uppercase font-semibold">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
