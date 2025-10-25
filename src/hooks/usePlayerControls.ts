import { useState, useEffect, useRef } from 'react';

// Defines the mapping of keyboard keys to game actions.
const keyActionMap: { [key: string]: string } = {
  KeyW: 'forward',
  KeyS: 'backward',
  KeyA: 'left',
  KeyD: 'right',
  Space: 'up',
  ShiftLeft: 'down',
  ShiftRight: 'down',
};

// This custom hook manages player input state.
export const usePlayerControls = () => {
  // A ref to store the current state of all actions, preventing stale closures in event listeners.
  const actions = useRef<{ [key: string]: boolean }>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
  });

  // A state variable that forces a re-render when controls change.
  const [, setLastUpdateTime] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const action = keyActionMap[e.code];
      if (action && !actions.current[action]) {
        actions.current[action] = true;
        setLastUpdateTime(Date.now()); // Trigger re-render
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const action = keyActionMap[e.code];
      if (action && actions.current[action]) {
        actions.current[action] = false;
        setLastUpdateTime(Date.now()); // Trigger re-render
      }
    };
    
    // Attach event listeners when the component mounts.
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Detach event listeners on cleanup to prevent memory leaks.
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Return the current state of actions.
  return actions.current;
};
