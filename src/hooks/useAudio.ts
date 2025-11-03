import { useContext } from 'react';
import { AudioContext } from '../contexts/AudioContext';

export const useAudio = () => {
  // This hook now safely returns a manager instance at all times.
  // Initially, it's a dummy manager, then it's replaced by the real one
  // once the client-side environment is confirmed.
  const audioManager = useContext(AudioContext);
  return audioManager;
};
