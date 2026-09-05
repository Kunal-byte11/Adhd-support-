import { BinauralSoundMode } from '../types';

class NeuroAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private currentMode: BinauralSoundMode = 'off';
  private masterGain: GainNode | null = null;
  private volume: number = 0.5;

  // Binaural nodes
  private oscLeft: OscillatorNode | null = null;
  private oscRight: OscillatorNode | null = null;
  private panLeft: StereoPannerNode | null = null;
  private panRight: StereoPannerNode | null = null;

  // Noise nodes
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMode(): BinauralSoundMode {
    return this.currentMode;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public stop() {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);
    }
    setTimeout(() => {
      this.cleanupNodes();
      this.currentMode = 'off';
    }, 120);
  }

  private cleanupNodes() {
    try {
      if (this.oscLeft) {
        this.oscLeft.stop();
        this.oscLeft.disconnect();
        this.oscLeft = null;
      }
      if (this.oscRight) {
        this.oscRight.stop();
        this.oscRight.disconnect();
        this.oscRight = null;
      }
      if (this.panLeft) {
        this.panLeft.disconnect();
        this.panLeft = null;
      }
      if (this.panRight) {
        this.panRight.disconnect();
        this.panRight = null;
      }
      if (this.noiseSource) {
        this.noiseSource.stop();
        this.noiseSource.disconnect();
        this.noiseSource = null;
      }
      if (this.noiseFilter) {
        this.noiseFilter.disconnect();
        this.noiseFilter = null;
      }
      if (this.masterGain) {
        this.masterGain.disconnect();
        this.masterGain = null;
      }
    } catch {
      // Audio nodes already stopped or disposed
    }
  }

  /**
   * 40 Hz Binaural Beat: Left Ear 400 Hz, Right Ear 440 Hz
   * Stimulates Gamma oscillations for dopamine & acetylcholine release
   */
  public playBinaural40Hz() {
    this.initContext();
    if (!this.ctx) return;

    this.cleanupNodes();
    this.currentMode = 'binaural-40hz';

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(this.volume * 0.4, this.ctx.currentTime + 0.5);
    this.masterGain.connect(this.ctx.destination);

    // Left channel: 400 Hz, panned 100% Left (-1)
    this.oscLeft = this.ctx.createOscillator();
    this.oscLeft.type = 'sine';
    this.oscLeft.frequency.setValueAtTime(400, this.ctx.currentTime);

    // Fallback if StereoPannerNode is supported
    if (this.ctx.createStereoPanner) {
      this.panLeft = this.ctx.createStereoPanner();
      this.panLeft.pan.setValueAtTime(-1, this.ctx.currentTime);
      this.oscLeft.connect(this.panLeft);
      this.panLeft.connect(this.masterGain);
    } else {
      this.oscLeft.connect(this.masterGain);
    }

    // Right channel: 440 Hz (400 + 40 Hz difference), panned 100% Right (+1)
    this.oscRight = this.ctx.createOscillator();
    this.oscRight.type = 'sine';
    this.oscRight.frequency.setValueAtTime(440, this.ctx.currentTime);

    if (this.ctx.createStereoPanner) {
      this.panRight = this.ctx.createStereoPanner();
      this.panRight.pan.setValueAtTime(1, this.ctx.currentTime);
      this.oscRight.connect(this.panRight);
      this.panRight.connect(this.masterGain);
    } else {
      this.oscRight.connect(this.masterGain);
    }

    this.oscLeft.start();
    this.oscRight.start();
  }

  /**
   * Brown Noise (Brownian / Red noise): Deep, soothing acoustic mask
   */
  public playBrownNoise() {
    this.initContext();
    if (!this.ctx) return;

    this.cleanupNodes();
    this.currentMode = 'brown-noise';

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(this.volume * 0.35, this.ctx.currentTime + 0.5);
    this.masterGain.connect(this.ctx.destination);

    const bufferSize = 5 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain compensation
    }

    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;

    this.noiseFilter = this.ctx.createBiquadFilter();
    this.noiseFilter.type = 'lowpass';
    this.noiseFilter.frequency.setValueAtTime(450, this.ctx.currentTime);

    this.noiseSource.connect(this.noiseFilter);
    this.noiseFilter.connect(this.masterGain);

    this.noiseSource.start();
  }

  /**
   * Pink Noise: Balanced 1/f noise for calm concentration
   */
  public playPinkNoise() {
    this.initContext();
    if (!this.ctx) return;

    this.cleanupNodes();
    this.currentMode = 'pink-noise';

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(this.volume * 0.3, this.ctx.currentTime + 0.5);
    this.masterGain.connect(this.ctx.destination);

    const bufferSize = 5 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;

    this.noiseSource.connect(this.masterGain);
    this.noiseSource.start();
  }

  public setMode(mode: BinauralSoundMode) {
    if (mode === this.currentMode) return;
    switch (mode) {
      case 'binaural-40hz':
        this.playBinaural40Hz();
        break;
      case 'brown-noise':
        this.playBrownNoise();
        break;
      case 'pink-noise':
        this.playPinkNoise();
        break;
      case 'off':
      default:
        this.stop();
        break;
    }
  }

  /**
   * Generates gentle acoustic frequency ramps for the Physiological Sigh phases
   */
  public playBreathCue(phase: 'inhale1' | 'inhale2' | 'exhale' | 'complete') {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const cueGain = this.ctx.createGain();
      cueGain.connect(this.ctx.destination);

      if (phase === 'inhale1') {
        // Soft rising sine wave: 180Hz -> 280Hz over 3.5s
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 3.4);

        cueGain.gain.setValueAtTime(0.001, now);
        cueGain.gain.linearRampToValueAtTime(this.volume * 0.15, now + 0.5);
        cueGain.gain.linearRampToValueAtTime(this.volume * 0.2, now + 3.2);
        cueGain.gain.linearRampToValueAtTime(0.0001, now + 3.5);

        osc.connect(cueGain);
        osc.start(now);
        osc.stop(now + 3.5);
      } else if (phase === 'inhale2') {
        // Quick energetic chime: 340Hz -> 460Hz over 1.5s
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.exponentialRampToValueAtTime(460, now + 1.4);

        cueGain.gain.setValueAtTime(0.001, now);
        cueGain.gain.linearRampToValueAtTime(this.volume * 0.25, now + 0.2);
        cueGain.gain.linearRampToValueAtTime(0.0001, now + 1.5);

        osc.connect(cueGain);
        osc.start(now);
        osc.stop(now + 1.5);
      } else if (phase === 'exhale') {
        // Soothing descending tone: 260Hz -> 120Hz over 6.0s
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 5.8);

        cueGain.gain.setValueAtTime(0.001, now);
        cueGain.gain.linearRampToValueAtTime(this.volume * 0.18, now + 0.6);
        cueGain.gain.linearRampToValueAtTime(this.volume * 0.08, now + 5.0);
        cueGain.gain.linearRampToValueAtTime(0.0001, now + 6.0);

        osc.connect(cueGain);
        osc.start(now);
        osc.stop(now + 6.0);
      } else if (phase === 'complete') {
        // 3-bell resonant chime chord (C5, E5, G5)
        const freqs = [523.25, 659.25, 783.99];
        freqs.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const chordGain = this.ctx!.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.15);

          chordGain.gain.setValueAtTime(0.001, now + idx * 0.15);
          chordGain.gain.linearRampToValueAtTime(this.volume * 0.12, now + idx * 0.15 + 0.05);
          chordGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 1.8);

          osc.connect(chordGain);
          chordGain.connect(this.ctx!.destination);
          osc.start(now + idx * 0.15);
          osc.stop(now + idx * 0.15 + 2.0);
        });
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  }
}

export const neuroAudio = new NeuroAudioSynthesizer();

