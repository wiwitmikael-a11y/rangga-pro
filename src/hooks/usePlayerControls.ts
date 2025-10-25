import { useEffect, useRef } from 'react';

export const usePlayerControls = () => {
    const controls = useRef({
        forward: false,
        backward: false,
        left: false,
        right: false,
        up: false,
        down: false,
    });

    useEffect(() => {
        const keyMap: { [key: string]: keyof typeof controls.current } = {
            KeyW: 'forward',
            KeyS: 'backward',
            KeyA: 'left',
            KeyD: 'right',
            Space: 'up',
            ShiftLeft: 'down',
            ShiftRight: 'down',
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (keyMap[e.code]) {
                controls.current[keyMap[e.code]] = true;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (keyMap[e.code]) {
                controls.current[keyMap[e.code]] = false;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return controls;
};