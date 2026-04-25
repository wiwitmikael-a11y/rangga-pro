import React, { createContext, useState, useEffect } from 'react';

type SoundName = 'ambience' | 'flyby' | 'confirm' | 'panel_open' | 'panel_close' | 'gate_open' | 'district_hover' | 'district_hold' | 'pilot_engage' | 'pilot_disengage' | 'engine_hum' | 'laser';
interface PlayOptions { volume?: number; rate?: number; }

class AudioManager {
  private audioContext: AudioContext;
  private activeLoopSources: Map<SoundName, { 
    stop: (time?: number) => void; 
    gainNode: GainNode; 
  }> = new Map();
  private isUnlocked = false;

  // Master volume control to prevent sounds from being too annoying/lebay
  private masterVolume = 0.15; 
  private ambienceVolume = 0.05; // Even lower for ambience/loops

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.unlockAudio();
  }

  private unlockAudio() {
    if (this.isUnlocked) return;
    const unlock = () => {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().then(() => {
          this.isUnlocked = true;
          document.body.removeEventListener('click', unlock);
          document.body.removeEventListener('touchend', unlock);
        });
      } else {
        this.isUnlocked = true;
        document.body.removeEventListener('click', unlock);
        document.body.removeEventListener('touchend', unlock);
      }
    };
    document.body.addEventListener('click', unlock, { once: true });
    document.body.addEventListener('touchend', unlock, { once: true });
  }

  // Helper to create a basic gain node
  private createGain(targetVolume: number, rampTime = 0, initialValue = targetVolume): GainNode {
    const gainNode = this.audioContext.createGain();
    if (rampTime > 0) {
      gainNode.gain.setValueAtTime(initialValue, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(targetVolume, this.audioContext.currentTime + rampTime);
    } else {
      gainNode.gain.setValueAtTime(targetVolume, this.audioContext.currentTime);
    }
    gainNode.connect(this.audioContext.destination);
    return gainNode;
  }

  // Synthetic Sounds
  private synthConfirm(gainNode: GainNode, options: PlayOptions) {
    const osc = this.audioContext.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
    
    osc.connect(gainNode);
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(options.volume ?? 1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
  }

  private synthHover(gainNode: GainNode, options: PlayOptions) {
    const osc = this.audioContext.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.05);

    osc.connect(gainNode);
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.05);

    gainNode.gain.setValueAtTime((options.volume ?? 1) * 0.5, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
  }

  private synthLaser(gainNode: GainNode, options: PlayOptions) {
    const osc = this.audioContext.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);

    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);

    osc.connect(filter).connect(gainNode);
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.3);

    gainNode.gain.setValueAtTime(options.volume ?? 1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
  }

  private synthPanelOpen(gainNode: GainNode, options: PlayOptions) {
    this.createNoiseBurst(gainNode, 0.4, true, options.volume ?? 1);
  }

  private synthPanelClose(gainNode: GainNode, options: PlayOptions) {
    this.createNoiseBurst(gainNode, 0.3, false, options.volume ?? 1);
  }

  private synthGateOpen(gainNode: GainNode, options: PlayOptions) {
    this.createNoiseBurst(gainNode, 0.8, true, (options.volume ?? 1) * 1.5, 'lowpass', 400);
  }

  private createNoiseBurst(gainNode: GainNode, duration: number, sweepUp: boolean, volume: number, filterType: BiquadFilterType = 'bandpass', filterFreq = 1000) {
    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioContext.createBiquadFilter();
    filter.type = filterType;
    if (sweepUp) {
      filter.frequency.setValueAtTime(filterFreq / 2, this.audioContext.currentTime);
      filter.frequency.linearRampToValueAtTime(filterFreq * 2, this.audioContext.currentTime + duration);
    } else {
      filter.frequency.setValueAtTime(filterFreq * 2, this.audioContext.currentTime);
      filter.frequency.linearRampToValueAtTime(filterFreq / 2, this.audioContext.currentTime + duration);
    }

    noise.connect(filter).connect(gainNode);
    noise.start();

    gainNode.gain.setValueAtTime(volume * 0.5, this.audioContext.currentTime);
    if (sweepUp) {
       gainNode.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    } else {
       gainNode.gain.setValueAtTime(0.01, this.audioContext.currentTime);
       gainNode.gain.linearRampToValueAtTime(volume * 0.5, this.audioContext.currentTime + duration * 0.2);
       gainNode.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    }
  }

  private synthPilotEngage(gainNode: GainNode, options: PlayOptions) {
    const osc = this.audioContext.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 1.0);
    
    osc.connect(gainNode);
    osc.start();
    osc.stop(this.audioContext.currentTime + 1.0);

    gainNode.gain.setValueAtTime(0.01, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime((options.volume ?? 1) * 0.6, this.audioContext.currentTime + 0.5);
    gainNode.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0);
  }

  private synthPilotDisengage(gainNode: GainNode, options: PlayOptions) {
    const osc = this.audioContext.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.8);
    
    osc.connect(gainNode);
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.8);

    gainNode.gain.setValueAtTime((options.volume ?? 1) * 0.6, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
  }

  private synthFlyby(gainNode: GainNode, options: PlayOptions) {
    this.createNoiseBurst(gainNode, 2.0, false, options.volume ?? 1, 'lowpass', 800);
  }

  // Loops
  private setupDroneLoop(name: SoundName, baseFreq: number, gainNode: GainNode) {
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.value = baseFreq;
    osc2.frequency.value = baseFreq * 1.01; // slight detune

    const lfo = this.audioContext.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.2; // very slow modulation

    const lfoGain = this.audioContext.createGain();
    lfoGain.gain.value = 5;
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    osc1.connect(gainNode);
    osc2.connect(gainNode);

    osc1.start();
    osc2.start();
    lfo.start();

    this.activeLoopSources.set(name, {
      stop: (time?: number) => {
        osc1.stop(time);
        osc2.stop(time);
        lfo.stop(time);
      },
      gainNode
    });
  }

  play(name: SoundName, options: PlayOptions = {}) {
    if (!this.isUnlocked || this.audioContext.state === 'suspended') return;
    
    const targetVolume = (options.volume ?? 1) * this.masterVolume;
    const gainNode = this.createGain(targetVolume);

    switch (name) {
      case 'confirm': this.synthConfirm(gainNode, options); break;
      case 'district_hover': this.synthHover(gainNode, options); break;
      case 'laser': this.synthLaser(gainNode, options); break;
      case 'panel_open': this.synthPanelOpen(gainNode, options); break;
      case 'panel_close': this.synthPanelClose(gainNode, options); break;
      case 'gate_open': this.synthGateOpen(gainNode, options); break;
      case 'pilot_engage': this.synthPilotEngage(gainNode, options); break;
      case 'pilot_disengage': this.synthPilotDisengage(gainNode, options); break;
      case 'flyby': this.synthFlyby(gainNode, options); break;
      default: break;
    }
  }
  
  playLoop(name: SoundName, options: PlayOptions = {}) {
    if (this.activeLoopSources.has(name) || !this.isUnlocked) return;
    if (this.audioContext.state === 'suspended') return;

    const targetVolume = (options.volume ?? 1) * this.ambienceVolume;
    const gainNode = this.createGain(targetVolume, 2.0, 0);

    if (name === 'ambience') {
       this.setupDroneLoop(name, 50, gainNode);
    } else if (name === 'engine_hum') {
       this.setupDroneLoop(name, 80, gainNode);
    } else if (name === 'district_hold') {
       // rapid pulsing
       const osc = this.audioContext.createOscillator();
       osc.type = 'triangle';
       osc.frequency.value = 150;
       
       const lfo = this.audioContext.createOscillator();
       lfo.type = 'square';
       lfo.frequency.value = 8; // 8 times a second
       const lfoGain = this.audioContext.createGain();
       lfoGain.gain.value = 100;
       lfo.connect(lfoGain);
       lfoGain.connect(osc.frequency);

       osc.connect(gainNode);
       osc.start();
       lfo.start();
       this.activeLoopSources.set(name, {
         stop: (t) => { osc.stop(t); lfo.stop(t); },
         gainNode
       });
    }
  }

  stop(name: SoundName) {
    const loop = this.activeLoopSources.get(name);
    if (loop) {
      loop.gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
      loop.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1.0);
      setTimeout(() => {
        try { loop.stop(); } catch (e) { /* ignore */ }
      }, 1000);
      this.activeLoopSources.delete(name);
    }
  }

  playHoldSound(name: SoundName, options: PlayOptions = {}) {
    this.stop(name);
    
    if (!this.isUnlocked || this.audioContext.state === 'suspended') return;

    const targetVolume = (options.volume ?? 1) * this.masterVolume * 0.5;
    const gainNode = this.createGain(targetVolume, 0.2, 0);

    const osc = this.audioContext.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 300;
    osc.frequency.linearRampToValueAtTime(600, this.audioContext.currentTime + 1.0); // pitch goes up
    
    osc.connect(gainNode);
    osc.start();

    this.activeLoopSources.set(name, {
      stop: (t) => osc.stop(t),
      gainNode
    });
  }
}

// A dummy manager with no-op methods to prevent crashes during SSR or initial render.
const dummyAudioManager = {
  play: () => {},
  playLoop: () => {},
  stop: () => {},
  playHoldSound: () => {},
} as unknown as AudioManager;

export const AudioContext = createContext<AudioManager>(dummyAudioManager);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioManager, setAudioManager] = useState<AudioManager>(dummyAudioManager);

  useEffect(() => {
    const manager = new AudioManager();
    setAudioManager(manager);
  }, []);

  return (
    <AudioContext.Provider value={audioManager}>
       {children}
    </AudioContext.Provider>
  );
};
