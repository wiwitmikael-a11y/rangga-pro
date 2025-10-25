import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PlayerCopter } from './PlayerCopter';

interface AegisProtocolGameProps {
  onExit: () => void;
  playerSpawnPosition: THREE.Vector3;
}

// A more realistic, over-the-shoulder follow camera.
const GameCamera: React.FC<{ playerRef: React.RefObject<THREE.Group> }> = ({ playerRef }) => {
    const { camera } = useThree();
    // An offset positioned on the copter's "back" - higher and closer for an immersive view.
    const cameraOffset = useMemo(() => new THREE.Vector3(0, 2.5, 3.5), []);
    const idealPosition = useMemo(() => new THREE.Vector3(), []);
    const lookAtTarget = useMemo(() => new THREE.Vector3(), []);
    const forwardVector = useMemo(() => new THREE.Vector3(0, 0, -1), []);
    // A slight vertical offset for the look-at point to frame the copter nicely.
    const lookAtVerticalOffset = useMemo(() => new THREE.Vector3(0, 1, 0), []);

    // A temporary object for smooth rotation (slerp)
    const tempCamera = useMemo(() => camera.clone(), [camera]);

    useFrame((_, delta) => {
        if (!playerRef.current) return;
        
        // Calculate the ideal camera position based on the "back/shoulder" offset
        idealPosition.copy(cameraOffset);
        idealPosition.applyQuaternion(playerRef.current.quaternion);
        idealPosition.add(playerRef.current.position);

        // Smoothly interpolate the camera's position.
        camera.position.lerp(idealPosition, delta * 6);
        
        // Calculate a look-at point in front of and slightly above the copter.
        forwardVector.set(0, 0, -1); // Reset base forward vector
        forwardVector.applyQuaternion(playerRef.current.quaternion);
        lookAtTarget.copy(playerRef.current.position)
            .add(forwardVector.multiplyScalar(50))
            .add(lookAtVerticalOffset);
        
        // Smoothly rotate the camera to look at the forward target
        tempCamera.position.copy(camera.position); // Update temp camera's position
        tempCamera.lookAt(lookAtTarget);
        camera.quaternion.slerp(tempCamera.quaternion, delta * 6);
    });

    return null;
};


export const AegisProtocolGame: React.FC<AegisProtocolGameProps> = ({ onExit, playerSpawnPosition }) => {
    const playerRef = useRef<THREE.Group>(null);
    const fogRef = useRef<THREE.Fog>(null);
    const [isEntering, setIsEntering] = useState(true);

    // Add an effect to listen for the Escape key to exit the game.
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onExit();
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        const timer = setTimeout(() => setIsEntering(false), 500); // Start fade-in

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            clearTimeout(timer);
        };
    }, [onExit]);
    
    useFrame((_, delta) => {
        // Smooth fade-in transition by adjusting fog
        if (fogRef.current) {
            const targetNear = isEntering ? 0 : 50;
            const targetFar = isEntering ? 50 : 250;
            fogRef.current.near = THREE.MathUtils.lerp(fogRef.current.near, targetNear, delta * 2);
            fogRef.current.far = THREE.MathUtils.lerp(fogRef.current.far, targetFar, delta * 2);
        }
    });

    return (
        <>
            <fog ref={fogRef} attach="fog" args={['#050810', 0, 50]} />
            <PlayerCopter ref={playerRef} initialPosition={playerSpawnPosition} />
            <GameCamera playerRef={playerRef} />
        </>
    );
};