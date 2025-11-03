import React, { createContext, useState, useEffect } from 'react';

// Sound definitions with VERIFIED, working links from the reliable Pixabay CDN.
const SOUNDS = {
  ambience: 'https://cdn.pixabay.com/audio/2023/04/23/audio_82b3834313.mp3', // Cyberpunk Downtown Ambience
  flyby: 'https://cdn.pixabay.com/audio/2022/03/15/audio_a716301353.mp3', // Spaceship Passing
  confirm: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c812891823.mp3', // UI Click
  panel_open: 'https://cdn.pixabay.com/audio/2022/11/17/audio_1e0a41054a.mp3', // Whoosh Transition
  panel_close: 'https://cdn.pixabay.com/audio/2022/11/17/audio_82133037ce.mp3', // Reverse Whoosh
  gate_open: 'https://cdn.pixabay.com/audio/2022/06/22/audio_2482329241.mp3', // Heavy Metal Door
  district_hover: 'https://cdn.pixabay.com/audio/2022/01/18/audio_73b229388c.mp3', // UI Blip
  district_hold: 'https://cdn.pixabay.com/audio/2023/09/10/audio_5116335133.mp3', // Scanning Loop
  pilot_engage: 'https://cdn.pixabay.com/audio/2022/08/03/audio_58b346c599.mp3', // Sci-fi Power Up
  pilot_disengage: 'https://cdn.pixabay.com/audio/2022/08/02/audio_1c5c30a84e.mp3', // Sci-fi Power Down
  engine_hum: 'https://cdn.pixabay.com/audio/2022/09/24/audio_b28203f16b.mp3', // Spaceship Engine Loop
  laser: 'https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c142d5.mp3', // Laser Gun Shot
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