import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PlayerCopter } from './PlayerCopter';
// Note: GameHUD is a DOM element and should be rendered outside the Canvas in a real app.
// It is not rendered here to avoid breaking the R3F render tree.
// import { GameHUD } from '../ui/GameHUD'; 
import { EnemyDrone } from './GameModels';

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

    // Add an effect to listen for the Escape key to exit the game.
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onExit();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onExit]);
    
    // Simple array of enemy positions for the demo
    const enemyPositions: [number, number, number][] = [
        [-50, 15, -40],
        [40, 20, -60],
        [0, 25, -80],
        [60, 10, -20],
    ];

    return (
        <>
            <fog attach="fog" args={['#050810', 50, 250]} />
            <PlayerCopter ref={playerRef} initialPosition={playerSpawnPosition} />
            <GameCamera playerRef={playerRef} />
            
            {/* Render a few static enemies for the test flight */}
            {enemyPositions.map((pos, i) => (
                <EnemyDrone key={i} position={pos} />
            ))}
        </>
    );
};