import { useContext } from 'react';
import { AudioContext } from '../contexts/AudioContext';

export const useAudio = () => {
  const audioManager = useContext(AudioContext);
  if (!audioManager) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return audioManager;
};
