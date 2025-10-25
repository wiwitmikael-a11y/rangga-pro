import React, { Suspense, useMemo, useRef, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PlayerCopter } from './PlayerCopter';
import { GameHUD } from '../ui/GameHUD';
import { EnemyBattleshipModel, EnemyFighterModel, PlayerMissileModel, LaserBeam, TargetReticule } from './GameModels';

// --- Types ---
interface Entity {
  id: number;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
}
interface AutoBullet extends Entity {
  velocity: THREE.Vector3;
}
interface HomingMissile extends Entity {
    targetId: number | null;
}
interface Fighter extends Entity {
  health: number;
  fireCooldown: number;
}
interface Laser extends Entity {
    start: THREE.Vector3;
    end: THREE.Vector3;
    life: number;
}

interface AegisProtocolGameProps {
  onExit: () => void;
  playerSpawnPosition: THREE.Vector3;
}


// --- Constants ---
const CITY_BREACH_Z = 80;
const FIGHTER_SPAWN_INTERVAL = 4; // seconds
const BATTLESHIP_LASER_INTERVAL = 6; // seconds
const FIGHTER_COLLISION_RADIUS = 3;
const BULLET_COLLISION_RADIUS = 1;
const MISSILE_COLLISION_RADIUS = 2;
const HOMING_MISSILE_COOLDOWN = 30;

// --- Game Camera ---
const GameCameraRig: React.FC<{ playerCopterRef: React.RefObject<THREE.Group> }> = ({ playerCopterRef }) => {
    const { camera } = useThree();
    const cameraState = useMemo(() => ({
        idealOffset: new THREE.Vector3(0, 5, 14),
        idealLookAt: new THREE.Vector3(0, 2, -15),
        currentPosition: new THREE.Vector3(),
        currentLookAt: new THREE.Vector3(),
    }), []);
    
    useFrame((_, delta) => {
        if (!playerCopterRef.current) return;
        const player = playerCopterRef.current;
        const lerpFactor = delta * 5;
        const idealPos = cameraState.idealOffset.clone().applyQuaternion(player.quaternion).add(player.position);
        const idealLook = cameraState.idealLookAt.clone().applyQuaternion(player.quaternion).add(player.position);
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

  const [cityIntegrity, setCityIntegrity] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [currentTargetId, setCurrentTargetId] = useState<number | null>(null);
  const [missileCooldown, setMissileCooldown] = useState(0);

  // --- Entity States ---
  const [autoBullets, setAutoBullets] = useState<AutoBullet[]>([]);
  const [homingMissiles, setHomingMissiles] = useState<HomingMissile[]>([]);
  const [enemyFighters, setEnemyFighters] = useState<Fighter[]>([]);
  const [laserBeams, setLaserBeams] = useState<Laser[]>([]);
  
  // --- Refs for mutable game state ---
  const idCounters = useRef({ bullet: 0, missile: 0, fighter: 0, laser: 0 });
  const timers = useRef({ fighterSpawn: FIGHTER_SPAWN_INTERVAL, battleshipLaser: BATTLESHIP_LASER_INTERVAL });
  const battleshipPosition = useRef(new THREE.Vector3(0, 30, -250));

  // Initialize battleship at a random corner
  useMemo(() => {
    const corner = Math.floor(Math.random() * 4);
    const x = corner === 0 || corner === 1 ? -100 : 100;
    const z = corner === 0 || corner === 2 ? -250 : -150;
    battleshipPosition.current.set(x, 30, z);
  }, []);

  const spawnAutoBullet = useCallback((position: THREE.Vector3, quaternion: THREE.Quaternion) => {
    setAutoBullets(prev => [...prev, {
      id: idCounters.current.bullet++,
      position: position.clone(),
      quaternion: quaternion.clone(),
      velocity: new THREE.Vector3(0, 0, -100).applyQuaternion(quaternion),
    }]);
  }, []);

  const fireHomingMissile = useCallback(() => {
    if (missileCooldown <= 0 && currentTargetId !== null && playerCopterRef.current) {
        setHomingMissiles(prev => [...prev, {
            id: idCounters.current.missile++,
            position: playerCopterRef.current!.position.clone(),
            quaternion: playerCopterRef.current!.quaternion.clone(),
            targetId: currentTargetId,
        }]);
        setMissileCooldown(HOMING_MISSILE_COOLDOWN);
    }
  }, [missileCooldown, currentTargetId]);


  useFrame((state, delta) => {
    if (gameOver || !playerCopterRef.current) return;

    // --- Timers ---
    if (missileCooldown > 0) setMissileCooldown(prev => Math.max(0, prev - delta));
    timers.current.fighterSpawn -= delta;
    timers.current.battleshipLaser -= delta;

    // --- Update Battleship ---
    battleshipPosition.current.z += delta * 1.5;
    if (battleshipRef.current) battleshipRef.current.position.copy(battleshipPosition.current);

    // --- Battleship Attacks ---
    if (timers.current.fighterSpawn <= 0) {
        timers.current.fighterSpawn = FIGHTER_SPAWN_INTERVAL;
        const spawnX = battleshipPosition.current.x + (Math.random() - 0.5) * 40;
        const spawnZ = battleshipPosition.current.z + 20;
        setEnemyFighters(prev => [...prev, {
            id: idCounters.current.fighter++,
            position: new THREE.Vector3(spawnX, 30, spawnZ),
            quaternion: new THREE.Quaternion(),
            health: 10,
            fireCooldown: Math.random() * 2 + 1,
        }]);
    }
    if (timers.current.battleshipLaser <= 0) {
        timers.current.battleshipLaser = BATTLESHIP_LASER_INTERVAL;
        setLaserBeams(prev => [...prev, {
            id: idCounters.current.laser++,
            start: battleshipPosition.current.clone().add(new THREE.Vector3(0, -5, 0)),
            end: playerCopterRef.current!.position.clone(),
            life: 0.5, // Laser beam lasts for 0.5 seconds
            position: new THREE.Vector3(), // Dummy values, not used
            quaternion: new THREE.Quaternion(),
        }]);
    }

    // --- Targeting Logic ---
    let closestFighter: Fighter | null = null;
    let minDistance = Infinity;
    enemyFighters.forEach(fighter => {
        const distance = playerCopterRef.current.position.distanceTo(fighter.position);
        if (distance < minDistance) {
            minDistance = distance;
            closestFighter = fighter;
        }
    });
    setCurrentTargetId(closestFighter ? closestFighter.id : null);
    
    // --- Entity Updates & Collision Detection ---
    let newBullets = [...autoBullets];
    let newFighters = [...enemyFighters];
    let newHomingMissiles = [...homingMissiles];

    // Update Fighters
    for (let i = newFighters.length - 1; i >= 0; i--) {
        const fighter = newFighters[i];
        const direction = playerCopterRef.current.position.clone().sub(fighter.position).normalize();
        fighter.position.add(direction.multiplyScalar(delta * 15));
        fighter.quaternion.slerp(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), direction), delta * 2);
    }

    // Update Auto Bullets & Check Collisions
    for (let i = newBullets.length - 1; i >= 0; i--) {
        const bullet = newBullets[i];
        bullet.position.add(bullet.velocity.clone().multiplyScalar(delta));
        if (bullet.position.z < -300 || bullet.position.z > 100 || Math.abs(bullet.position.x) > 150) {
            newBullets.splice(i, 1);
            continue;
        }
        for (let j = newFighters.length - 1; j >= 0; j--) {
            if (bullet.position.distanceTo(newFighters[j].position) < FIGHTER_COLLISION_RADIUS + BULLET_COLLISION_RADIUS) {
                newFighters.splice(j, 1);
                newBullets.splice(i, 1);
                break;
            }
        }
    }
    
    // Update Homing Missiles & Check Collisions
    for (let i = newHomingMissiles.length - 1; i >= 0; i--) {
        const missile = newHomingMissiles[i];
        const target = newFighters.find(f => f.id === missile.targetId);

        if (target) {
            const direction = target.position.clone().sub(missile.position).normalize();
            missile.position.add(direction.multiplyScalar(delta * 50)); // Faster than bullets
            const lookAtQuaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,-1), direction);
            missile.quaternion.slerp(lookAtQuaternion, delta * 10);

            if (missile.position.distanceTo(target.position) < FIGHTER_COLLISION_RADIUS + MISSILE_COLLISION_RADIUS) {
                newFighters = newFighters.filter(f => f.id !== target.id);
                newHomingMissiles.splice(i, 1);
            }
        } else {
            // Target lost, fly straight
            missile.position.add(new THREE.Vector3(0, 0, -100).applyQuaternion(missile.quaternion).multiplyScalar(delta));
            if (missile.position.z < -300) newHomingMissiles.splice(i, 1);
        }
    }
    
    // Update Lasers
    setLaserBeams(prev => prev.map(beam => ({...beam, life: beam.life - delta })).filter(beam => beam.life > 0));


    // Update states once after all logic
    setAutoBullets(newBullets);
    setHomingMissiles(newHomingMissiles);
    setEnemyFighters(newFighters);

    // --- Check Game Over ---
    if (battleshipPosition.current.z > CITY_BREACH_Z) {
        setCityIntegrity(0);
        setGameOver(true);
    }
  });

  const targetFighter = enemyFighters.find(f => f.id === currentTargetId);

  return (
    <>
      <Suspense fallback={null}>
        <PlayerCopter ref={playerCopterRef} onFireAutoGun={spawnAutoBullet} initialPosition={playerSpawnPosition} />
        <GameCameraRig playerCopterRef={playerCopterRef} />
        
        <EnemyBattleshipModel ref={battleshipRef} />

        {enemyFighters.map(f => <EnemyFighterModel key={f.id} position={f.position} quaternion={f.quaternion} />)}
        {autoBullets.map(m => <PlayerMissileModel key={m.id} position={m.position} quaternion={m.quaternion} scale={0.3} />)}
        {homingMissiles.map(m => <PlayerMissileModel key={m.id} position={m.position} quaternion={m.quaternion} scale={0.8} />)}
        {laserBeams.map(l => <LaserBeam key={l.id} start={l.start} end={l.end} />)}

        {targetFighter && <TargetReticule position={targetFighter.position} />}

      </Suspense>
      <GameHUD onExit={onExit} cityIntegrity={cityIntegrity} onFireMissile={fireHomingMissile} missileCooldown={missileCooldown} />
    </>
  );
};