import React, { createContext, useMemo } from 'react';

// Sound definitions with links to free, high-quality CDN assets
const SOUNDS = {
  ambience: 'https://cdn.pixabay.com/audio/2023/04/17/audio_36c6c7395c.mp3', // Cyberpunk city ambience
  flyby: 'https://cdn.freesound.org/previews/541/541924_10246231-lq.mp3', // Sci-fi flyby
  confirm: 'https://cdn.freesound.org/previews/458/458393_6890478-lq.mp3', // UI confirm
  hover: 'https://cdn.freesound.org/previews/352/352652_5498339-lq.mp3', // UI hover blip (unused, replaced by district_hover)
  panel_open: 'https://cdn.freesound.org/previews/413/413495_5121236-lq.mp3', // Holographic open
  panel_close: 'https://cdn.freesound.org/previews/413/413492_5121236-lq.mp3', // Holographic close
  gate_open: 'https://cdn.freesound.org/previews/399/399303_213262-lq.mp3', // Heavy gate/door
  district_hover: 'https://cdn.freesound.org/previews/413/413498_5121236-lq.mp3', // Holographic scan/hum
  district_hold: 'https://cdn.freesound.org/previews/460/460914_2434689-lq.mp3', // Powering up sound
  pilot_engage: 'https://cdn.freesound.org/previews/344/344849_6164219-lq.mp3', // Cockpit engage
  pilot_disengage: 'https://cdn.freesound.org/previews/335/335417_5121236-lq.mp3', // Power down
  engine_hum: 'https://cdn.freesound.org/previews/343/343337_5121236-lq.mp3', // Sci-fi engine hum
  laser: 'https://cdn.freesound.org/previews/336/336889_5121236-lq.mp3' // Sci-fi laser
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

export const AudioContext = createContext<AudioManager | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioManager = useMemo(() => new AudioManager(), []);
  return (
    <AudioContext.Provider value={audioManager}>
      {children}
    </AudioContext.Provider>
  );
};
