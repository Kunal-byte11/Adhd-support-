import React, { useState } from 'react';
import { UserRole } from '../types';
import {
  User,
  Heart,
  Sparkles,
  Code2,
  Brain,
  ShieldAlert,
  Gift,
  ArrowRight,
  Lock,
  CheckCircle2,
  Eye,
  KeyRound,
} from 'lucide-react';

interface LoginModalProps {
  currentUserRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onClose?: () => void;
  isOpen: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  currentUserRole,
  onSelectRole,
  onClose,
  isOpen,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUserRole);

  if (!isOpen) return null;

  const handleConfirmLogin = (role: UserRole) => {
    setSelectedRole(role);
    onSelectRole(role);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white border border-[#c2c8c0] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#8bb192]/20 text-[#43664c] flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-[24px] font-black text-[#181c1e] tracking-tight">
            Select Your Workspace
          </h2>
          <p className="text-sm text-[#545f72] mt-1">
            Separate personalized portals for Kunal and his Partner
          </p>
        </div>

        {/* 2 Big Account Cards */}
        <div className="space-y-4 mb-6">
          {/* Option 1: Kunal's Profile */}
          <div
            onClick={() => setSelectedRole('kunal')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
              selectedRole === 'kunal'
                ? 'border-[#43664c] bg-emerald-50/40 shadow-xs ring-2 ring-[#43664c]/20'
                : 'border-gray-200 bg-white hover:border-[#43664c]/50'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#43664c] text-white flex items-center justify-center text-xl shrink-0 font-bold shadow-xs">
              👨‍💻
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-[#181c1e]">
                  Kunal's Focus Flow
                </h3>
                {selectedRole === 'kunal' && (
                  <span className="text-xs font-bold text-[#43664c] bg-[#8bb192]/20 px-2.5 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-xs text-[#545f72] mt-1 leading-relaxed">
                DSA Deep Work (Ch 1-10), Generative AI Roadmap, 10k Steps Tracker, Morning AI Planner, &amp; 5-min Urge Pause.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[10px] bg-white border border-emerald-200 text-[#43664c] px-2 py-0.5 rounded-md font-semibold">
                  #AlgorithmMaster
                </span>
                <span className="text-[10px] bg-white border border-blue-200 text-[#006494] px-2 py-0.5 rounded-md font-semibold">
                  #GenAI
                </span>
              </div>
            </div>
          </div>

          {/* Option 2: Girlfriend / Partner Profile */}
          <div
            onClick={() => setSelectedRole('partner')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
              selectedRole === 'partner'
                ? 'border-pink-500 bg-pink-50/40 shadow-xs ring-2 ring-pink-400/20'
                : 'border-gray-200 bg-white hover:border-pink-300'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center text-xl shrink-0 font-bold shadow-xs">
              💖
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-[#181c1e]">
                  Partner HQ (Girlfriend)
                </h3>
                {selectedRole === 'partner' && (
                  <span className="text-xs font-bold text-pink-600 bg-pink-100 px-2.5 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-xs text-[#545f72] mt-1 leading-relaxed">
                Live Focus Status Tracker, Low-friction Gentle Nudges (Breathe, Water, Focus, Proud), Dopamine Vault Rewards, &amp; 7-Day Meetup Roadmap.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[10px] bg-white border border-pink-200 text-pink-700 px-2 py-0.5 rounded-md font-semibold">
                  #PartnerHQ
                </span>
                <span className="text-[10px] bg-white border border-amber-200 text-amber-800 px-2 py-0.5 rounded-md font-semibold">
                  #DopamineVault
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl text-sm font-bold cursor-pointer transition-all"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => handleConfirmLogin(selectedRole)}
            className={`flex-1 py-3.5 rounded-2xl text-sm font-bold text-white shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] ${
              selectedRole === 'partner'
                ? 'bg-pink-600 hover:bg-pink-700'
                : 'bg-[#43664c] hover:bg-[#38553f]'
            }`}
          >
            <span>Login to {selectedRole === 'partner' ? 'Partner HQ' : "Kunal's Flow"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
