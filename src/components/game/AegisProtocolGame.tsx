import React from 'react';
import * as THREE from 'three';
import { PlayerCopter } from './PlayerCopter';
import { EnemyCore } from './GameModels';
// import { GameHUD } from '../ui/GameHUD'; // GameHUD is now rendered by UIController

interface AegisProtocolGameProps {
  onExit: () => void;
  playerSpawnPosition: THREE.Vector3;
}

const enemyPositions: [number, number, number][] = [
    [-80, 15, -80],
    [-40, 20, -90],
    [0, 25, -70],
    [50, 10, -85],
    [70, 18, -60],
    [-90, 22, -50],
];

export const AegisProtocolGame: React.FC<AegisProtocolGameProps> = ({ onExit, playerSpawnPosition }) => {
  return (
    <>
        <fog attach="fog" args={['#050810', 50, 200]} />
        <PlayerCopter initialPosition={playerSpawnPosition} />
        {enemyPositions.map((pos, i) => (
            <EnemyCore key={`enemy-${i}`} position={pos} />
        ))}
        {/* The GameHUD is an HTML overlay, and is now rendered by the root UIController */}
    </>
  );
};