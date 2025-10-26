
import React, { useState, Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

import { PlayerCopter } from './PlayerCopter';
import { EnemyCore } from './GameModels';
import { GameHUD } from '../ui/GameHUD';

interface AegisProtocolGameProps {
  onExit: () => void;
}

const ENEMY_COUNT = 10;
const GAME_AREA_SIZE = 200;

const ChaseCamera: React.FC<{ targetRef: React.RefObject<THREE.Group> }> = ({ targetRef }) => {
  const cameraOffset = useMemo(() => new THREE.Vector3(0, 8, 15), []);
  const lookAtOffset = useMemo(() => new THREE.Vector3(0, 2, -10), []);

  useFrame((state) => {
    if (!targetRef.current) return;

    const targetObject = targetRef.current;
    
    // Calculate ideal camera position
    const idealPosition = new THREE.Vector3().copy(cameraOffset);
    idealPosition.applyQuaternion(targetObject.quaternion);
    idealPosition.add(targetObject.position);

    // Calculate ideal look-at point
    const idealLookAt = new THREE.Vector3().copy(lookAtOffset);
    idealLookAt.applyQuaternion(targetObject.quaternion);
    idealLookAt.add(targetObject.position);
    
    // Smoothly move camera
    state.camera.position.lerp(idealPosition, 0.1);
    state.camera.lookAt(idealLookAt);
  });

  return null;
};

export const AegisProtocolGame: React.FC<AegisProtocolGameProps> = ({ onExit }) => {
  const playerRef = useRef<THREE.Group>(null);
  const [enemies] = useState(() => 
    Array.from({ length: ENEMY_COUNT }, (_, i) => ({
      id: i,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * GAME_AREA_SIZE,
        Math.random() * 20 + 10,
        (Math.random() - 0.5) * GAME_AREA_SIZE
      ),
    }))
  );

  const playerInitialPosition = useMemo(() => new THREE.Vector3(0, 10, 0), []);

  return (
    <>
      <Canvas shadows camera={{ fov: 75 }}>
        <color attach="background" args={['#020408']} />
        <fog attach="fog" args={['#020408', 50, 250]} />
        
        <ambientLight intensity={0.4} />
        <directionalLight position={[0, 50, 0]} intensity={1.5} castShadow />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Suspense fallback={null}>
            <PlayerCopter ref={playerRef} initialPosition={playerInitialPosition} />
            {enemies.map(enemy => (
                <EnemyCore key={enemy.id} position={enemy.position.toArray()} />
            ))}
        </Suspense>

        <ChaseCamera targetRef={playerRef} />
        
        <mesh rotation-x={-Math.PI / 2} position-y={-10} receiveShadow>
            <planeGeometry args={[500, 500]} />
            <meshStandardMaterial color="#101010" />
        </mesh>

      </Canvas>
      <GameHUD onExit={onExit} />
    </>
  );
};
