import React, { Suspense } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { PlayerCopter } from './PlayerCopter';
import { EnemyCore } from './GameModels';
import { GameHUD } from '../ui/GameHUD';

interface AegisProtocolGameProps {
  onExitGame: () => void;
}

const ENEMY_COUNT = 10;
const GAME_AREA_SIZE = 200;

const enemyPositions = Array.from({ length: ENEMY_COUNT }, () => new THREE.Vector3(
    (Math.random() - 0.5) * GAME_AREA_SIZE,
    Math.random() * 20 + 10,
    (Math.random() - 0.5) * GAME_AREA_SIZE
));

export const AegisProtocolGame: React.FC<AegisProtocolGameProps> = ({ onExitGame }) => {
  
  const initialPlayerPosition = new THREE.Vector3(0, 10, 50);

  return (
    <>
      <fog attach="fog" args={['#050810', 50, 200]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 50, 0]} intensity={2} color="#00aaff" />
      <directionalLight 
        position={[50, 50, -50]} 
        intensity={1.5} 
        color="#ff8800" 
        castShadow 
      />
      
      <Suspense fallback={null}>
          <PlayerCopter initialPosition={initialPlayerPosition} />
      </Suspense>

      {enemyPositions.map((pos, i) => (
        <EnemyCore key={i} position={[pos.x, pos.y, pos.z]} />
      ))}

      {/* Simplified controls for this game view - locked to player later */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={20}
        maxDistance={100}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 4}
      />

      <GameHUD onExit={onExitGame} />
    </>
  );
};
