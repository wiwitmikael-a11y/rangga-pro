import { useState, useEffect, useRef } from 'react';

// This custom hook manages the state of on-screen touch controls for the game.
export const useTouchControls = () => {
  const controls = useRef({
    joystick: { x: 0, y: 0 },
    altitude: 'none' as 'up' | 'down' | 'none',
    aim: { x: 0, y: 0 }, // Normalized screen coordinates for aiming
    ionCannon: false,
  });

  // State to trigger re-renders in the component using the hook
  const [, setLastUpdateTime] = useState(0);

  const joystickState = useRef({
    active: false,
    identifier: -1,
    startPos: { x: 0, y: 0 },
    currentPos: { x: 0, y: 0 },
    radius: 50, // The visual radius of the joystick
  }).current;
  
  const altitudeState = useRef({
    upIdentifier: -1,
    downIdentifier: -1,
  }).current;
  
  const aimState = useRef({
    active: false,
    identifier: -1,
    startPos: { x: 0, y: 0 },
  }).current;


  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      for (const touch of Array.from(e.changedTouches)) {
        const target = touch.target as HTMLElement;

        if (target.id === 'joystick-handle' || target.id === 'joystick-base') {
            joystickState.active = true;
            joystickState.identifier = touch.identifier;
            joystickState.startPos = { x: touch.clientX, y: touch.clientY };
            joystickState.currentPos = { x: touch.clientX, y: touch.clientY };
        } else if (target.id === 'altitude-up') {
            altitudeState.upIdentifier = touch.identifier;
            controls.current.altitude = 'up';
        } else if (target.id === 'altitude-down') {
            altitudeState.downIdentifier = touch.identifier;
            controls.current.altitude = 'down';
        } else if (!aimState.active) { // Start aiming if no other control is active
            aimState.active = true;
            aimState.identifier = touch.identifier;
            aimState.startPos = { x: touch.clientX, y: touch.clientY };
        }
      }
      setLastUpdateTime(Date.now());
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      for (const touch of Array.from(e.changedTouches)) {
        if (touch.identifier === joystickState.identifier) {
          const dx = touch.clientX - joystickState.startPos.x;
          const dy = touch.clientY - joystickState.startPos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          let clampedX = dx;
          let clampedY = dy;

          if (dist > joystickState.radius) {
            clampedX = (dx / dist) * joystickState.radius;
            clampedY = (dy / dist) * joystickState.radius;
          }
          
          controls.current.joystick = {
            x: clampedX / joystickState.radius,
            y: -clampedY / joystickState.radius, // Invert Y for typical game coordinates
          };
          joystickState.currentPos = { x: joystickState.startPos.x + clampedX, y: joystickState.startPos.y + clampedY };

        } else if (touch.identifier === aimState.identifier) {
          controls.current.aim = {
            x: (touch.clientX / window.innerWidth) * 2 - 1,
            y: -(touch.clientY / window.innerHeight) * 2 + 1,
          };
        }
      }
       setLastUpdateTime(Date.now());
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      for (const touch of Array.from(e.changedTouches)) {
        if (touch.identifier === joystickState.identifier) {
          joystickState.active = false;
          joystickState.identifier = -1;
          controls.current.joystick = { x: 0, y: 0 };
        } else if (touch.identifier === altitudeState.upIdentifier) {
            altitudeState.upIdentifier = -1;
            if(controls.current.altitude === 'up') controls.current.altitude = 'none';
        } else if (touch.identifier === altitudeState.downIdentifier) {
            altitudeState.downIdentifier = -1;
            if(controls.current.altitude === 'down') controls.current.altitude = 'none';
        } else if (touch.identifier === aimState.identifier) {
            aimState.active = false;
            aimState.identifier = -1;
            // Reset aim vector when touch is released to stop aiming
            controls.current.aim = { x: 0, y: 0 };
        }
      }
      setLastUpdateTime(Date.now());
    };
    
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return controls.current;
};