import React, { Suspense, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PlayerCopter } from './PlayerCopter';
import { GameHUD } from './GameHUD';

interface AegisProtocolGameProps {
  onExit: () => void;
}

// Dedicated camera rig for the game mode.
const GameCameraRig: React.FC<{ playerCopterRef: React.RefObject<THREE.Group> }> = ({ playerCopterRef }) => {
    const { camera } = useThree();

    const cameraState = useMemo(() => ({
        idealOffset: new THREE.Vector3(0, 4, 12), // Behind and slightly above
        idealLookAt: new THREE.Vector3(0, 1, -10), // Look slightly ahead of the ship
        currentPosition: new THREE.Vector3(),
        currentLookAt: new THREE.Vector3(),
    }), []);
    
    useFrame((_, delta) => {
        if (!playerCopterRef.current) return;

        const player = playerCopterRef.current;
        const lerpFactor = delta * 5; // A smooth but responsive follow speed

        // Calculate the ideal camera position based on the player's rotation and position
        const idealPos = cameraState.idealOffset.clone().applyQuaternion(player.quaternion).add(player.position);
        
        // Calculate the ideal look-at point in front of the player
        const idealLook = cameraState.idealLookAt.clone().applyQuaternion(player.quaternion).add(player.position);

        // Smoothly interpolate the camera's current position and look-at towards the ideal points
        cameraState.currentPosition.lerp(idealPos, lerpFactor);
        cameraState.currentLookAt.lerp(idealLook, lerpFactor);

        camera.position.copy(cameraState.currentPosition);
        camera.lookAt(cameraState.currentLookAt);
    });

    return null;
}

const EnemyBattleship: React.FC = () => {
    const ref = useRef<THREE.Mesh>(null!);
    
    useFrame((_, delta) => {
        if(ref.current) {
            ref.current.position.z -= delta * 2; // Slowly move towards the city
        }
    });

    return (
        <mesh ref={ref} position={[0, 30, -200]}>
            <boxGeometry args={[40, 10, 80]} />
            <meshStandardMaterial color="red" emissive="darkred" roughness={0.2} metalness={0.8} />
        </mesh>
    );
};

export const AegisProtocolGame: React.FC<AegisProtocolGameProps> = ({ onExit }) => {
  const playerCopterRef = useRef<THREE.Group>(null!);
  
  return (
    <>
        <Suspense fallback={null}>
            <PlayerCopter ref={playerCopterRef} />
            <GameCameraRig playerCopterRef={playerCopterRef} />
            <EnemyBattleship />
        </Suspense>
        <GameHUD onExit={onExit} />
    </>
  );
};