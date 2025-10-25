
import React, { Suspense, useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PlayerCopter } from './PlayerCopter';
import { GameHUD } from '../ui/GameHUD';
import { 
  EnemyBattleshipModel, 
  EnemyFighterModel, 
  // PlayerMissileModel, 
  // LaserBeam, 
  // TargetReticule, 
  // Explosion, 
  // PowerUpModel 
} from './GameModels';

// --- Types (unused types are commented out for cleaner code) ---
// interface BaseEntity { id: number; active: boolean; position: THREE.Vector3; quaternion: THREE.Quaternion; }
// interface AutoBullet extends BaseEntity { velocity: THREE.Vector3; }
// interface HomingMissile extends BaseEntity { targetId: number | null; }
// interface Fighter extends BaseEntity { health: number; fireCooldown: number; hitTimer: number; }
// interface Laser extends BaseEntity { start: THREE.Vector3; end: THREE.Vector3; life: number; }
// interface ExplosionEntity extends BaseEntity { scale: number; life: number; }
// type PowerUpType = 'shield';
// interface PowerUp extends BaseEntity { type: PowerUpType; }

interface AegisProtocolGameProps {
  onExit: () => void;
  playerSpawnPosition: THREE.Vector3;
}

// --- Constants (unused constants are commented out) ---
// const POOL_SIZES = { fighters: 30, bullets: 50, missiles: 5, explosions: 20, powerUps: 10 };
// const CITY_BREACH_Z = 80;
// const FIGHTER_SPAWN_INTERVAL = 3;
// const BATTLESHIP_LASER_INTERVAL = 5;
// const FIGHTER_COLLISION_RADIUS = 3;
// const POWERUP_COLLISION_RADIUS = 3;
// const PLAYER_COLLISION_RADIUS = 2;
// const BULLET_COLLISION_RADIUS = 1;
// const MISSILE_COLLISION_RADIUS = 2;
// const HOMING_MISSILE_COOLDOWN = 30;
// const SHIELD_DURATION = 10;
// const POWERUP_DROP_CHANCE = 0.2;
const SPAWN_ALTITUDE = 50; 

// --- Game Camera ---
const GameCameraRig: React.FC<{ playerCopterRef: React.RefObject<THREE.Group>, gamePhase: 'spawning' | 'playing' }> = ({ playerCopterRef, gamePhase }) => {
    const { camera } = useThree();
    const cameraState = useMemo(() => ({
        spawnOffset: new THREE.Vector3(0, 15, 25),
        playOffset: new THREE.Vector3(0, 5, 14),
        lookAtOffset: new THREE.Vector3(0, 2, -15),
        currentPosition: new THREE.Vector3(),
        currentLookAt: new THREE.Vector3(),
    }), []);
    
    useFrame((_, delta) => {
        if (!playerCopterRef.current) return;
        const player = playerCopterRef.current;
        const lerpFactor = delta * (gamePhase === 'spawning' ? 1.5 : 5);
        const targetOffset = gamePhase === 'spawning' ? cameraState.spawnOffset : cameraState.playOffset;

        const idealPos = targetOffset.clone().applyQuaternion(player.quaternion).add(player.position);
        const idealLook = cameraState.lookAtOffset.clone().applyQuaternion(player.quaternion).add(player.position);
        cameraState.currentPosition.lerp(idealPos, lerpFactor);
        cameraState.currentLookAt.lerp(idealLook, lerpFactor);
        camera.position.copy(cameraState.currentPosition);
        camera.lookAt(cameraState.currentLookAt);
    });
    return null;
}

export const AegisProtocolGame: React.FC<AegisProtocolGameProps> = ({ onExit, playerSpawnPosition }) => {
  const playerCopterRef = useRef<THREE.Group>(null!);
  const battleshipRef = useRef<THREE.Group>(null!);

  const [gameState, setGameState] = useState<'playing' | 'victory' | 'gameOver'>('playing');
  const [gamePhase, setGamePhase] = useState<'spawning' | 'playing'>('spawning');
  const [score, setScore] = useState(0);
  const [highScore, /* setHighScore */] = useState(0);
  const [cityIntegrity, setCityIntegrity] = useState(100);
  // const [, setCurrentTargetId] = useState<number | null>(null); // Unused
  const [missileCooldown, /* setMissileCooldown */] = useState(0);
  const [isShieldActive, /* setShieldActive */] = useState(false);
  const [muzzleFlash, setMuzzleFlash] = useState({ active: false, key: 0 });

  const initialPlayerPos = useMemo(() => playerSpawnPosition.clone().add(new THREE.Vector3(0, SPAWN_ALTITUDE, 0)), [playerSpawnPosition]);

  const battleshipPosition = useMemo(() => {
      const pos = playerSpawnPosition.clone();
      pos.z -= 100; // Position it far in front of the player's spawn area
      pos.y = 20;
      return pos;
  }, [playerSpawnPosition]);
  
  const handleFireAutoGun = useCallback(() => {
    setMuzzleFlash(mf => ({ active: true, key: mf.key + 1 }));
    setTimeout(() => setMuzzleFlash(mf => ({ ...mf, active: false })), 50);
  }, []);

  const handleRestart = useCallback(() => {
    setGameState('playing');
    setCityIntegrity(100);
    setScore(0);
    setGamePhase('spawning');
    setTimeout(() => setGamePhase('playing'), 3000);
  }, []);

  useEffect(() => {
    const spawnTimer = setTimeout(() => {
      setGamePhase('playing');
    }, 3000);
    return () => clearTimeout(spawnTimer);
  }, []);

  // Game logic is disabled for debugging
  useFrame(() => {
    // The entire game loop is temporarily disabled.
  });

  return (
    <Suspense fallback={null}>
      {/* --- Actors --- */}
      <PlayerCopter 
        ref={playerCopterRef} 
        onFireAutoGun={handleFireAutoGun}
        initialPosition={initialPlayerPos}
        isShieldActive={isShieldActive}
        muzzleFlash={muzzleFlash}
        isControllable={gamePhase === 'playing' && gameState === 'playing'}
      />
      
      <EnemyBattleshipModel 
        ref={battleshipRef} 
        position={battleshipPosition} 
      />

      <EnemyFighterModel 
        position={new THREE.Vector3(battleshipPosition.x + 20, battleshipPosition.y, battleshipPosition.z + 30)} 
        isHit={false} 
      />

      {/* --- Systems --- */}
      <GameCameraRig playerCopterRef={playerCopterRef} gamePhase={gamePhase} />
      <GameHUD 
        onExit={onExit}
        onRestart={handleRestart}
        cityIntegrity={cityIntegrity}
        onFireMissile={() => {}}
        missileCooldown={missileCooldown}
        score={score}
        highScore={highScore}
        gameState={gameState}
        isShieldActive={isShieldActive}
        isVisible={gamePhase === 'playing'}
      />
    </Suspense>
  );
};
