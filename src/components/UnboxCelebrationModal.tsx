import React, { useState, useEffect } from 'react';
import { PartnerReward, PartnerNote } from '../types';
import {
  Gift,
  PartyPopper,
  Play,
  Pause,
  ArrowLeft,
  Heart,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface UnboxCelebrationModalProps {
  reward?: PartnerReward | null;
  note?: PartnerNote | null;
  onClose: () => void;
}

export const UnboxCelebrationModal: React.FC<UnboxCelebrationModalProps> = ({
  reward,
  note,
  onClose,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(0);

  // Audio timer simulation
  useEffect(() => {
    let interval: any = null;
    if (isPlayingAudio && audioSeconds < 12) {
      interval = setInterval(() => {
        setAudioSeconds((prev) => prev + 1);
      }, 1000);
    } else if (audioSeconds >= 12) {
      setIsPlayingAudio(false);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio, audioSeconds]);

  const partnerMessage =
    note?.message ||
    reward?.noteFromPartner ||
    reward?.description ||
    '"You crushed it! Can\'t wait to see you this weekend."';

  return (
    <div
      id="unbox-celebration-overlay"
      className="fixed inset-0 z-50 bg-[#f7fafc]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Floating Confetti Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-bounce"
            style={{
              width: `${(i % 3 + 1) * 6}px`,
              height: `${(i % 3 + 1) * 6}px`,
              backgroundColor:
                i % 4 === 0
                  ? '#8bb192'
                  : i % 4 === 1
                  ? '#c4eccb'
                  : i % 4 === 2
                  ? '#006494'
                  : '#5fafe9',
              left: `${(i * 13) % 96}%`,
              top: `${(i * 19) % 85}%`,
              opacity: 0.7,
              animationDuration: `${2 + (i % 3)}s`,
              animationDelay: `${(i * 0.2)}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center my-auto py-6">
        {/* Glowing Aura & Unbox Icon */}
        <div className="relative w-40 h-40 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#8bb192] rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="relative z-10 bg-white w-28 h-28 rounded-full flex items-center justify-center shadow-lg border border-[#c2c8c0]">
            <Gift className="w-14 h-14 text-[#43664c] stroke-[1.8]" />
          </div>
        </div>

        {/* Title & Momentum Message */}
        <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#181c1e] mb-1">
          Task Complete!
        </h1>
        <p className="text-sm text-[#545f72] max-w-sm mb-6">
          You've maintained your deep momentum. Here's a little something from your girlfriend:
        </p>

        {/* The Reward / Message Card */}
        <div className="w-full bg-white rounded-3xl p-5 sm:p-6 border border-[#c2c8c0] shadow-md mb-6 relative overflow-hidden text-left">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#43664c]"></div>

          <div className="flex items-start gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-pink-100 border border-pink-200 flex items-center justify-center">
              <span className="text-2xl">👩‍❤️‍👨</span>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#545f72] flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                Message from Girlfriend
              </h3>
              <p className="text-base text-[#181c1e] font-semibold italic mt-1 leading-snug">
                {partnerMessage}
              </p>
            </div>
          </div>

          {/* Voice Note Widget with Interactive Simulated Waveform */}
          <div className="bg-[#f1f4f6] rounded-2xl p-3.5 flex items-center gap-3 border border-[#c2c8c0]/50">
            <button
              onClick={() => {
                if (isPlayingAudio) {
                  setIsPlayingAudio(false);
                } else {
                  setIsPlayingAudio(true);
                  if (audioSeconds >= 12) setAudioSeconds(0);
                }
              }}
              className="w-10 h-10 rounded-full bg-[#43664c] text-white flex items-center justify-center shrink-0 hover:bg-[#38553f] transition-all cursor-pointer shadow-xs"
            >
              {isPlayingAudio ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white ml-0.5" />
              )}
            </button>

            {/* Audio Waveform */}
            <div className="flex-1 flex items-center h-8 gap-[3px] opacity-85">
              {[4, 8, 14, 22, 18, 12, 20, 24, 16, 8, 12, 19, 23, 15, 6].map(
                (h, idx) => {
                  const isActive = (audioSeconds / 12) * 15 > idx;
                  return (
                    <div
                      key={idx}
                      className={`flex-1 rounded-full transition-all duration-200 ${
                        isActive ? 'bg-[#43664c]' : 'bg-[#c2c8c0]'
                      }`}
                      style={{
                        height: isPlayingAudio ? `${Math.max(4, (h + (audioSeconds % 3) * 4) % 26)}px` : `${h}px`,
                      }}
                    />
                  );
                }
              )}
            </div>

            <span className="text-xs font-mono font-bold text-[#545f72] shrink-0">
              0:{audioSeconds.toString().padStart(2, '0')} / 0:12
            </span>
          </div>
        </div>

        {/* Primary Call to Action: Return to Flow */}
        <button
          onClick={onClose}
          className="w-full bg-[#43664c] hover:bg-[#38553f] text-white text-base font-bold py-3.5 px-6 rounded-2xl min-h-[56px] shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Flow</span>
        </button>
      </div>
    </div>
  );
};
