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
  googleUser: any;
  onSignInGoogle: () => Promise<void>;
  onSignOutGoogle: () => Promise<void>;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  currentUserRole,
  onSelectRole,
  onClose,
  isOpen,
  googleUser,
  onSignInGoogle,
  onSignOutGoogle,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUserRole);
  const [authError, setAuthError] = useState('');

  if (!isOpen) return null;

  const handleConfirmLogin = (role: UserRole) => {
    onSelectRole(role);
    if (onClose) onClose();
  };

  const handleGoogleSignIn = async () => {
    try {
      setAuthError('');
      await onSignInGoogle();
    } catch (e: any) {
      setAuthError(e.message || 'Google Auth failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white border border-[#c2c8c0] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#43664c] to-[#006494] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="text-[26px] font-black text-[#181c1e] tracking-tight">
            Secure Google Sign In
          </h2>
          <p className="text-sm text-[#545f72] mt-1 font-medium">
            Authorized access only for Kunal &amp; Pragati
          </p>
        </div>

        {/* Google Authentication Sync Block */}
        <div className="mb-5 border-b border-gray-100 pb-5">
          {googleUser ? (
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 text-sm font-bold border border-emerald-200">
                  🔒
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs font-bold text-emerald-950 truncate">
                    Google Sync Active
                  </p>
                  <p className="text-[10px] text-emerald-700 truncate mt-0.5">
                    {googleUser.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onSignOutGoogle}
                className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="bg-[#fcfcfc] border border-gray-200/90 rounded-2xl p-4 text-center">
              <p className="text-xs text-[#545f72] font-semibold mb-3 leading-relaxed">
                Connect your Google Account to automatically sync DSA progress &amp; notes between your mobile and laptop!
              </p>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-[#181c1e] hover:bg-black text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🔑 Sign In with Google</span>
              </button>
              {authError && (
                <p className="text-[10px] text-rose-600 font-bold mt-2">
                  ⚠️ {authError}
                </p>
              )}
            </div>
          )}
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
