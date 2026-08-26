import React, { useState } from 'react';
import { UserRole } from '../types';
import {
  KeyRound,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Heart,
  AlertCircle,
  CheckCircle2,
  Lock,
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
    onSelectRole(role);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white border border-[#c2c8c0] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#43664c] to-[#006494] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="text-[26px] font-black text-[#181c1e] tracking-tight">
            Select Your Account
          </h2>
          <p className="text-sm text-[#545f72] mt-1 font-medium">
            Password-free 1-tap sign in for Kunal &amp; Pari
          </p>
        </div>

        {/* 2 Password-Free Account Login Cards */}
        <div className="space-y-4 mb-6">
          {/* Account 1: kunal11 (Admin) */}
          <div
            onClick={() => handleConfirmLogin('kunal')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 shadow-xs group ${
              selectedRole === 'kunal'
                ? 'border-[#43664c] bg-emerald-50/60 ring-2 ring-[#43664c]/20'
                : 'border-gray-200 bg-white hover:border-[#43664c]/60'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#43664c] text-white flex items-center justify-center text-xl shrink-0 font-bold shadow-xs group-hover:scale-105 transition-transform">
              👨‍💻
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-[#181c1e] flex items-center gap-1.5">
                    <span>kunal11</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  </h3>
                  <p className="text-xs text-[#545f72] font-semibold mt-0.5">
                    Kunal's Deep Work &amp; Focus Flow
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#43664c] group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-[#545f72] mt-2 leading-relaxed">
                230 DSA Lessons, GenAI Roadmap, 10k Steps Movement, &amp; Urge Lockdown.
              </p>
            </div>
          </div>

          {/* Account 2: Partner HQ (Neutral) */}
          <div
            onClick={() => handleConfirmLogin('partner')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 shadow-xs group ${
              selectedRole === 'partner'
                ? 'border-pink-500 bg-pink-50/60 ring-2 ring-pink-400/20'
                : 'border-gray-200 bg-white hover:border-pink-300'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center text-xl shrink-0 font-bold shadow-xs group-hover:scale-105 transition-transform">
              💖
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-[#181c1e] flex items-center gap-1.5">
                    <span>partner_hq</span>
                    <span className="text-[10px] font-bold text-pink-800 bg-pink-100 border border-pink-300 px-2 py-0.5 rounded-full">
                      Partner Portal
                    </span>
                  </h3>
                  <p className="text-xs text-[#545f72] font-semibold mt-0.5">
                    Partner HQ Support Portal
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-pink-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-[#545f72] mt-2 leading-relaxed">
                2-Week Meetup Roadmap, live support nudges, &amp; encouragement wall.
              </p>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl text-xs font-bold cursor-pointer transition-all"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};
