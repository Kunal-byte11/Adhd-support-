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
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Initialize Real Audio Node
  useEffect(() => {
    const audioSrc = note?.audioDataUrl || reward?.audioDataUrl;
    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audio.onended = () => {
        setIsPlayingAudio(false);
        setAudioSeconds(0);
      };
      audio.ontimeupdate = () => {
        setAudioSeconds(Math.floor(audio.currentTime));
      };
      setAudioElement(audio);
      return () => {
        audio.pause();
      };
    }
  }, [note?.audioDataUrl, reward?.audioDataUrl]);

  const toggleRealAudio = () => {
    if (!audioElement) return;
    if (isPlayingAudio) {
      audioElement.pause();
      setIsPlayingAudio(false);
    } else {
      audioElement.play().catch((e) => console.log(e));
      setIsPlayingAudio(true);
    }
  };

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
                Message from Partner HQ
              </h3>
              <p className="text-base text-[#181c1e] font-semibold italic mt-1 leading-snug">
                {partnerMessage}
              </p>
            </div>
          </div>

          {/* Attached Photo */}
          {note?.imageUrl && (
            <div className="mb-4 rounded-2xl overflow-hidden border-2 border-pink-300 shadow-md">
              <img
                src={note.imageUrl}
                alt="Attached photo from partner"
                className="w-full max-h-56 object-cover"
              />
            </div>
          )}

          {/* Voice Note Widget with Interactive Waveform */}
          <div className="bg-[#fcf8f8] rounded-2xl p-4 border border-pink-100 flex flex-col gap-3">
            {/* Loving Quote Background (Clean, only her voice note plays) */}
            <div className="text-center py-2 px-1 border-b border-pink-100/50">
              <p className="text-xs italic text-pink-700 font-bold leading-relaxed">
                "Your focus is beautiful. Keep building the future we want together. So proud of you!"
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={note?.audioDataUrl || reward?.audioDataUrl ? toggleRealAudio : () => {
                  if (isPlayingAudio) {
                    setIsPlayingAudio(false);
                  } else {
                    setIsPlayingAudio(true);
                    if (audioSeconds >= 12) setAudioSeconds(0);
                  }
                }}
                className="w-12 h-12 rounded-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-md hover:scale-105"
              >
                {isPlayingAudio ? (
                  <Pause className="w-5 h-5 fill-white text-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-pink-900 truncate">
                  {note?.audioDataUrl || reward?.audioDataUrl ? '🎙️ Real Voice Note Attached' : '🎙️ Congratulations Voice Note'}
                </p>
                <p className="text-[10px] text-pink-600 truncate mt-0.5">
                  {isPlayingAudio ? 'Playing clean voice note...' : 'Tap to play her voice'}
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-pink-700 shrink-0">
                0:{audioSeconds.toString().padStart(2, '0')}
              </span>
            </div>
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
