import React, { useState } from 'react';
import { UserRole } from '../types';
import {
  KeyRound,
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Heart,
  AlertCircle,
  CheckCircle2,
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
  const [username, setUsername] = useState(currentUserRole === 'partner' ? 'parii26' : 'kunal11');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUserRole);

  if (!isOpen) return null;

  const handleQuickSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'kunal') {
      setUsername('kunal11');
      setPassword('kunal11');
    } else {
      setUsername('parii26');
      setPassword('parii26');
    }
    setErrorMessage('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();

    if (cleanUser === 'kunal11') {
      onSelectRole('kunal');
      if (onClose) onClose();
    } else if (cleanUser === 'parii26') {
      onSelectRole('partner');
      if (onClose) onClose();
    } else {
      setErrorMessage('Invalid username. Please use "kunal11" or "parii26".');
    }
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
            Account Login
          </h2>
          <p className="text-sm text-[#545f72] mt-1 font-medium">
            Sign in to access your personal workspace
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Quick Profile Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleQuickSelect('kunal')}
            className={`p-3.5 rounded-2xl border-2 transition-all text-left cursor-pointer flex flex-col justify-between ${
              selectedRole === 'kunal'
                ? 'border-[#43664c] bg-emerald-50/60 ring-2 ring-[#43664c]/20'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">👨‍💻</span>
              {selectedRole === 'kunal' && (
                <CheckCircle2 className="w-4 h-4 text-[#43664c]" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-black text-[#181c1e]">kunal11</h4>
              <p className="text-[10px] text-[#545f72] font-semibold">Kunal's Focus Flow</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickSelect('partner')}
            className={`p-3.5 rounded-2xl border-2 transition-all text-left cursor-pointer flex flex-col justify-between ${
              selectedRole === 'partner'
                ? 'border-pink-500 bg-pink-50/60 ring-2 ring-pink-400/20'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">💖</span>
              {selectedRole === 'partner' && (
                <CheckCircle2 className="w-4 h-4 text-pink-600" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-black text-[#181c1e]">parii26</h4>
              <p className="text-[10px] text-[#545f72] font-semibold">Pari's Partner HQ</p>
            </div>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#181c1e] mb-1.5 uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Enter kunal11 or parii26"
                required
                className="w-full pl-10 pr-4 py-3 bg-[#f1f4f6] rounded-2xl border border-gray-200 text-sm font-semibold focus:bg-white focus:border-[#43664c] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#181c1e] mb-1.5 uppercase tracking-wider">
              Passcode / PIN
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#f1f4f6] rounded-2xl border border-gray-200 text-sm font-semibold focus:bg-white focus:border-[#43664c] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl text-sm font-bold cursor-pointer transition-all"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className={`flex-1 py-3.5 rounded-2xl text-sm font-bold text-white shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] ${
                username.trim().toLowerCase() === 'parii26'
                  ? 'bg-pink-600 hover:bg-pink-700'
                  : 'bg-[#43664c] hover:bg-[#38553f]'
              }`}
            >
              <span>Sign In to {username.trim() || 'Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
