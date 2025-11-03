import React, { createContext, useState, useEffect } from 'react';

// Sound definitions with links to free, high-quality, and reliably hosted assets via JSDelivr
const SFX_BASE_URL = 'https://cdn.jsdelivr.net/gh/K-S-K/Assets@main/SFX/UI/';

const SOUNDS = {
  ambience: 'https://cdn.jsdelivr.net/gh/K-S-K/Assets@main/Music/ambience-cyberpunk-city.mp3',
  flyby: 'https://cdn.jsdelivr.net/gh/K-S-K/Assets@main/SFX/flyby-whoosh.mp3',
  confirm: `${SFX_BASE_URL}Confirm.mp3`,
  panel_open: `${SFX_BASE_URL}panel_open.mp3`,
  panel_close: `${SFX_BASE_URL}panel_close.mp3`,
  gate_open: 'https://cdn.jsdelivr.net/gh/K-S-K/Assets@main/SFX/heavy-gate.mp3',
  district_hover: `${SFX_BASE_URL}Hover%202.mp3`,
  district_hold: 'https://cdn.jsdelivr.net/gh/K-S-K/Assets@main/SFX/scan-loop.mp3',
  pilot_engage: 'https://cdn.jsdelivr.net/gh/K-S-K/Assets@main/SFX/pilot-engage.mp3',
  pilot_disengage: 'https://cdn.jsdelivr.net/gh/K-S-K/Assets@main/SFX/pilot-disengage.mp3',
  engine_hum: 'https://cdn.jsdelivr.net/gh/K-S-K/Assets@main/SFX/engine-loop.mp3',
  laser: 'https://cdn.jsdelivr.net/gh/K-S-K/Assets@main/SFX/laser-shot.mp3',
};

type SoundName = keyof typeof SOUNDS;
interface PlayOptions { volume?: number; rate?: number; }

class AudioManager {
  private audioContext: AudioContext;
  private buffers: Map<SoundName, AudioBuffer> = new Map();
  private activeLoopSources: Map<SoundName, { source: AudioBufferSourceNode; gainNode: GainNode; }> = new Map();
  private isUnlocked = false;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.unlockAudio();
    this.preload();
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

  private async preload() {
    const promises = Object.entries(SOUNDS).map(async ([name, url]) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch sound: ${name}`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.buffers.set(name as SoundName, audioBuffer);
      } catch (error) {
        console.error(`Error preloading sound "${name}":`, error);
      }
    });
    await Promise.all(promises);
  }

  play(name: SoundName, options: PlayOptions = {}) {
    if (!this.isUnlocked || this.audioContext.state === 'suspended') return;
    const buffer = this.buffers.get(name);
    if (!buffer) {
      console.warn(`Sound "${name}" not found or not loaded.`);
      return;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(options.volume ?? 1, this.audioContext.currentTime);
    
    source.playbackRate.value = options.rate ?? 1;

    source.connect(gainNode).connect(this.audioContext.destination);
    source.start();
  }
  
  playLoop(name: SoundName, options: PlayOptions = {}) {
    if (this.activeLoopSources.has(name) || !this.isUnlocked) return;
    if (this.audioContext.state === 'suspended') return;

    const buffer = this.buffers.get(name);
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(options.volume ?? 1, this.audioContext.currentTime + 1.0); // Fade in
    
    source.connect(gainNode).connect(this.audioContext.destination);
    source.start();
    
    this.activeLoopSources.set(name, { source, gainNode });
  }

  stop(name: SoundName) {
    const loop = this.activeLoopSources.get(name);
    if (loop) {
      loop.gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
      loop.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5); // Fade out
      loop.source.stop(this.audioContext.currentTime + 0.5);
      this.activeLoopSources.delete(name);
    }
  }

  // Special function for hold-to-select sound to manage one instance at a time
  playHoldSound(name: SoundName, options: PlayOptions = {}) {
    this.stop(name); // Stop any previous instance
    
    if (!this.isUnlocked || this.audioContext.state === 'suspended') return;
    const buffer = this.buffers.get(name);
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(options.volume ?? 1, this.audioContext.currentTime);

    source.connect(gainNode).connect(this.audioContext.destination);
    source.start();
    
    this.activeLoopSources.set(name, { source, gainNode });
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
    // Instantiate AudioManager only on the client-side after the component has mounted.
    // This prevents errors during server-side rendering or build processes.
    const manager = new AudioManager();
    setAudioManager(manager);
  }, []);

  return (
    <AudioContext.Provider value={audioManager}>
      {children}
    </AudioContext.Provider>
  );
};