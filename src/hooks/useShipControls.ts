import { useState, useEffect, useCallback } from 'react';
import type { ShipInputState } from '../types';

const keyActionMap: { [key: string]: { action: keyof ShipInputState, value: number } } = {
  KeyW:       { action: 'forward', value: 1 },
  ArrowUp:    { action: 'forward', value: 1 },
  KeyS:       { action: 'forward', value: -1 },
  ArrowDown:  { action: 'forward', value: -1 },
  KeyA:       { action: 'turn',    value: 1 },
  ArrowLeft:  { action: 'turn',    value: 1 },
  KeyD:       { action: 'turn',    value: -1 },
  ArrowRight: { action: 'turn',    value: -1 },
  KeyQ:       { action: 'roll',    value: 1 },
  KeyE:       { action: 'roll',    value: -1 },
  Space:      { action: 'ascend',  value: 1 },
  ShiftLeft:  { action: 'ascend',  value: -1 },
  ControlLeft:{ action: 'ascend',  value: -1 },
};

export const useShipControls = (isActive: boolean) => {
  const [controls, setControls] = useState<ShipInputState>({
    forward: 0,
    turn: 0,
    ascend: 0,
    roll: 0,
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const mapping = keyActionMap[e.code];
    if (mapping) {
      e.preventDefault();
      setControls(prev => ({ ...prev, [mapping.action]: mapping.value }));
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const mapping = keyActionMap[e.code];
    if (mapping) {
      e.preventDefault();
      setControls(prev => ({ ...prev, [mapping.action]: 0 }));
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      // Reset controls when deactivated to prevent sticky inputs
      setControls({ forward: 0, turn: 0, ascend: 0, roll: 0 });
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isActive, handleKeyDown, handleKeyUp]);

  return controls;
};