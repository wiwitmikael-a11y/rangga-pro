import React, { Suspense, useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PlayerCopter } from './PlayerCopter';
import { GameHUD } from '../ui/GameHUD';
import { EnemyBattleshipModel, EnemyFighterModel, PlayerMissileModel, LaserBeam, TargetReticule, Explosion, PowerUpModel } from './GameModels';

// --- Types ---
interface BaseEntity {
  id: number;
  active: boolean;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
}
interface AutoBullet extends BaseEntity { velocity: THREE.Vector3; }
interface HomingMissile extends BaseEntity { targetId: number | null; }
interface Fighter extends BaseEntity { health: number; fireCooldown: number; hitTimer: number; }
interface Laser extends BaseEntity { start: THREE.Vector3; end: THREE.Vector3; life: number; }
interface ExplosionEntity extends BaseEntity { scale: number; life: number; }
type PowerUpType = 'shield';
interface PowerUp extends BaseEntity { type: PowerUpType; }

interface AegisProtocolGameProps {
  onExit: () => void;
  playerSpawnPosition: THREE.Vector3;
}

// --- Constants ---
const POOL_SIZES = { fighters: 30, bullets: 50, missiles: 5, explosions: 20, powerUps: 10 };
const CITY_BREACH_Z = 80;
const FIGHTER_SPAWN_INTERVAL = 3;
const BATTLESHIP_LASER_INTERVAL = 5;
const FIGHTER_COLLISION_RADIUS = 3;
const POWERUP_COLLISION_RADIUS = 3;
const PLAYER_COLLISION_RADIUS = 2;
const BULLET_COLLISION_RADIUS = 1;
const MISSILE_COLLISION_RADIUS = 2;
const HOMING_MISSILE_COOLDOWN = 30;
const SHIELD_DURATION = 10;
const POWERUP_DROP_CHANCE = 0.2; // 20% chance
const SPAWN_ALTITUDE = 50; // How high above the start position the player spawns

// --- Game Camera ---
const GameCameraRig: React.FC<{ playerCopterRef: React.RefObject<THREE.Group>, gamePhase: 'spawning' | 'playing' }> = ({ playerCopterRef, gamePhase }) => {
    const { camera } = useThree();
    const cameraState = useMemo(() => ({
        spawnOffset: new THREE.Vector3(0, 15, 25), // Cinematic spawn view
        playOffset: new THREE.Vector3(0, 5, 14), // Standard gameplay view
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
  const [highScore, setHighScore] = useState(0);
  const [cityIntegrity, setCityIntegrity] = useState(100);
  const [currentTargetId, setCurrentTargetId] = useState<number | null>(null);
  const [missileCooldown, setMissileCooldown] = useState(0);
  const [isShieldActive, setShieldActive] = useState(false);
  const [muzzleFlash, setMuzzleFlash] = useState({ active: false, key: 0 });

  // --- Entity Object Pools ---
  const pools = useRef({
      autoBullets: Array.from({ length: POOL_SIZES.bullets }, (_, i): AutoBullet => ({ id: i, active: false, position: new THREE.Vector3(), quaternion: new THREE.Quaternion(), velocity: new THREE.Vector3() })),
      homingMissiles: Array.from({ length: POOL_SIZES.missiles }, (_, i): HomingMissile => ({ id: i, active: false, position: new THREE.Vector3(), quaternion: new THREE.Quaternion(), targetId: null })),
      enemyFighters: Array.from({ length: POOL_SIZES.fighters }, (_, i): Fighter => ({ id: i, active: false, position: new THREE.Vector3(), quaternion: new THREE.Quaternion(), health: 0, fireCooldown: 0, hitTimer: 0 })),
      laserBeams: [] as Laser[], // Lasers are transient, no need to pool
      explosions: Array.from({ length: POOL_SIZES.explosions }, (_, i): ExplosionEntity => ({ id: i, active: false, position: new THREE.Vector3(), quaternion: new THREE.Quaternion(), scale: 1, life: 0 })),
      powerUps: Array.from({ length: POOL_SIZES.powerUps }, (_, i): PowerUp => ({ id: i, active: false, position: new THREE.Vector3(), quaternion: new THREE.Quaternion(), type: 'shield' as PowerUpType })),
  }).current;

  // --- Refs for mutable game state ---
  const timers = useRef({ fighterSpawn: FIGHTER_SPAWN_INTERVAL, battleshipLaser: BATTLESHIP_LASER_INTERVAL, shield: 0 });
  const battleshipState = useRef({
      position: new THREE.Vector3(0, 30, -250),
      isDestroyed: false,
  });
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  const resetGame = useCallback(() => {
    Object.values(pools).forEach(pool => Array.isArray(pool) && pool.forEach(p => p.active = false));
    pools.laserBeams = [];
    
    setGameState('playing');
    setGamePhase('spawning');
    setScore(0);
    setCityIntegrity(100);
    setMissileCooldown(0);
    setShieldActive(false);

    timers.current = { fighterSpawn: FIGHTER_SPAWN_INTERVAL, battleshipLaser: BATTLESHIP_LASER_INTERVAL, shield: 0 };
    
    const corner = Math.floor(Math.random() * 4);
    const x = corner === 0 || corner === 1 ? -100 : 100;
    const z = corner === 0 || corner === 2 ? -250 : -150;
    battleshipState.current.position.set(x, 30, z);
    battleshipState.current.isDestroyed = false;

    if (playerCopterRef.current) {
        // Set initial spawn position high above the starting point
        playerCopterRef.current.position.copy(playerSpawnPosition).add(new THREE.Vector3(0, SPAWN_ALTITUDE, 0));
        playerCopterRef.current.quaternion.identity();
        playerCopterRef.current.visible = true;
    }
  }, [pools, playerSpawnPosition]);
  
  useEffect(() => {
    const storedHighScore = localStorage.getItem('aegisHighScore');
    if (storedHighScore) setHighScore(parseInt(storedHighScore, 10));
    resetGame();
  }, [resetGame]);
  
  const handleExit = () => {
    resetGame();
    onExit();
  };
  
  const spawnFromPool = useCallback(<T extends BaseEntity>(pool: T[], setup: (item: T) => void) => {
    const item = pool.find(i => !i.active);
    if (item) {
        setup(item);
        item.active = true;
    }
  }, []);

  const spawnExplosion = useCallback((position: THREE.Vector3, scale: number) => {
    spawnFromPool(pools.explosions, e => {
        e.position.copy(position);
        e.scale = scale;
        e.life = 0.5;
    });
  }, [pools.explosions, spawnFromPool]);
  
  const destroyFighter = useCallback((fighter: Fighter) => {
    spawnExplosion(fighter.position, 1.5);
    setScore(s => s + 100);
    if (Math.random() < POWERUP_DROP_CHANCE) {
        spawnFromPool(pools.powerUps, p => {
            p.position.copy(fighter.position);
            p.type = 'shield';
        });
    }
    fighter.active = false;
  }, [spawnExplosion, pools.powerUps, spawnFromPool]);

  const fireAutoBullet = useCallback((position: THREE.Vector3, quaternion: THREE.Quaternion) => {
    spawnFromPool(pools.autoBullets, b => {
        b.position.copy(position);
        b.quaternion.copy(quaternion);
        b.velocity.set(0, 0, -100).applyQuaternion(quaternion);
    });
    setMuzzleFlash({ active: true, key: Date.now() });
  }, [pools.autoBullets, spawnFromPool]);

  const fireHomingMissile = useCallback(() => {
    if (missileCooldown <= 0 && currentTargetId !== null && playerCopterRef.current) {
        spawnFromPool(pools.homingMissiles, m => {
            m.position.copy(playerCopterRef.current!.position);
            m.quaternion.copy(playerCopterRef.current!.quaternion);
            m.targetId = currentTargetId;
        });
        setMissileCooldown(HOMING_MISSILE_COOLDOWN);
    }
  }, [missileCooldown, currentTargetId, pools.homingMissiles, spawnFromPool]);

  useFrame((_, delta) => {
    if (gameState !== 'playing') return;

    // --- Spawning Sequence ---
    if (gamePhase === 'spawning') {
        if (playerCopterRef.current) {
            playerCopterRef.current.position.lerp(playerSpawnPosition, delta * 1.5);
            if (playerCopterRef.current.position.distanceTo(playerSpawnPosition) < 0.5) {
                playerCopterRef.current.position.copy(playerSpawnPosition);
                setGamePhase('playing');
            }
        }
        return; // Don't run the rest of the game logic during spawn
    }

    // --- Timers ---
    if (missileCooldown > 0) setMissileCooldown(prev => Math.max(0, prev - delta));
    if (timers.current.shield > 0) {
        timers.current.shield -= delta;
        if (timers.current.shield <= 0) setShieldActive(false);
    }
    timers.current.fighterSpawn -= delta;
    timers.current.battleshipLaser -= delta;

    // --- Update Battleship ---
    if (!battleshipState.current.isDestroyed) {
      battleshipState.current.position.z += delta * 1.5;
      if (battleshipRef.current) battleshipRef.current.position.copy(battleshipState.current.position);
    }

    // --- Battleship Attacks ---
    if (!battleshipState.current.isDestroyed) {
      if (timers.current.fighterSpawn <= 0) {
          timers.current.fighterSpawn = FIGHTER_SPAWN_INTERVAL;
          spawnFromPool(pools.enemyFighters, f => {
              const spawnX = battleshipState.current.position.x + (Math.random() - 0.5) * 40;
              const spawnZ = battleshipState.current.position.z + 20;
              f.position.set(spawnX, 30, spawnZ);
              f.quaternion.identity();
              f.health = 10;
              f.fireCooldown = Math.random() * 2 + 1;
              f.hitTimer = 0;
          });
      }
      if (timers.current.battleshipLaser <= 0 && playerCopterRef.current) {
          timers.current.battleshipLaser = BATTLESHIP_LASER_INTERVAL;
          pools.laserBeams.push({ id: Date.now(), active: true, start: battleshipState.current.position.clone().add(new THREE.Vector3(0, -5, 0)), end: playerCopterRef.current.position.clone(), life: 0.5, position: new THREE.Vector3(), quaternion: new THREE.Quaternion() });
      }
    }

    // --- Targeting Logic ---
    let closestFighterId: number | null = null;
    let minDistance = Infinity;
    if (playerCopterRef.current) {
      pools.enemyFighters.forEach(fighter => {
        if (!fighter.active) return;
        const distance = playerCopterRef.current.position.distanceTo(fighter.position);
        if (distance < minDistance) {
          minDistance = distance;
          closestFighterId = fighter.id;
        }
      });
    }
    setCurrentTargetId(closestFighterId);

    // --- Entity Updates & Collision Detection ---
    
    // Update Fighters & Lasers
    pools.enemyFighters.forEach(f => {
      if (!f.active) return;
      if (f.hitTimer > 0) f.hitTimer -= delta;
      if (playerCopterRef.current) {
        const direction = playerCopterRef.current.position.clone().sub(f.position);
        if (direction.lengthSq() > 0.0001) {
            direction.normalize();
            f.position.add(direction.multiplyScalar(delta * 15));
            
            // ROOT CAUSE FIX: Use a robust `lookAt` method for rotation to avoid mathematical instability.
            const lookAtTarget = f.position.clone().add(direction);
            tempObject.position.copy(f.position);
            tempObject.lookAt(lookAtTarget);
            f.quaternion.slerp(tempObject.quaternion, delta * 2);
        }
      }
    });
    pools.laserBeams = pools.laserBeams.filter(l => (l.life -= delta) > 0);

    // Update Auto Bullets
    pools.autoBullets.forEach(bullet => {
        if (!bullet.active) return;
        bullet.position.add(bullet.velocity.clone().multiplyScalar(delta));
        if (bullet.position.z < -300 || bullet.position.z > 100 || Math.abs(bullet.position.x) > 150) bullet.active = false;
    });

    // Update Homing Missiles
    pools.homingMissiles.forEach(missile => {
      if (!missile.active) return;
      const target = pools.enemyFighters.find(f => f.id === missile.targetId && f.active);
      if (target) {
        const direction = target.position.clone().sub(missile.position);
        if (direction.lengthSq() > 0.0001) {
            direction.normalize();
            missile.position.add(direction.multiplyScalar(delta * 50));
            const lookAtTarget = missile.position.clone().add(direction);
            tempObject.position.copy(missile.position);
            tempObject.lookAt(lookAtTarget);
            missile.quaternion.slerp(tempObject.quaternion, delta * 10);
        }
      } else {
        missile.position.add(new THREE.Vector3(0, 0, -100).applyQuaternion(missile.quaternion).multiplyScalar(delta));
        if (missile.position.z < -300) missile.active = false;
      }
    });

    // Update PowerUps
    pools.powerUps.forEach(p => {
        if (!p.active) return;
        p.position.y -= delta * 3; // Gently fall
        if (p.position.y < -5) p.active = false;
        if (playerCopterRef.current && p.position.distanceTo(playerCopterRef.current.position) < PLAYER_COLLISION_RADIUS + POWERUP_COLLISION_RADIUS) {
            setShieldActive(true);
            timers.current.shield = SHIELD_DURATION;
            p.active = false;
        }
    });

    // Update Explosions
    pools.explosions.forEach(e => {
        if (!e.active) return;
        e.life -= delta;
        if (e.life <= 0) e.active = false;
    });

    // --- Collision Checks ---
    pools.autoBullets.forEach(bullet => {
      if (!bullet.active) return;
      pools.enemyFighters.forEach(fighter => {
        if (!fighter.active) return;
        if (bullet.position.distanceTo(fighter.position) < FIGHTER_COLLISION_RADIUS + BULLET_COLLISION_RADIUS) {
          bullet.active = false;
          fighter.health -= 5;
          fighter.hitTimer = 0.15;
          if (fighter.health <= 0) destroyFighter(fighter);
        }
      });
      if (!battleshipState.current.isDestroyed && bullet.position.distanceTo(battleshipState.current.position) < 20) {
          bullet.active = false;
          battleshipState.current.isDestroyed = true;
          spawnExplosion(battleshipState.current.position, 5);
          setScore(s => s + 5000);
      }
    });
    
    pools.homingMissiles.forEach(missile => {
      if (!missile.active) return;
      const target = pools.enemyFighters.find(f => f.id === missile.targetId && f.active);
      if (target && missile.position.distanceTo(target.position) < FIGHTER_COLLISION_RADIUS + MISSILE_COLLISION_RADIUS) {
          missile.active = false;
          destroyFighter(target);
      }
    });

    // --- Game Over Checks ---
    const end = (result: 'victory' | 'gameOver') => {
        const finalScore = score + (result === 'victory' ? cityIntegrity * 10 : 0);
        setScore(finalScore);
        if (finalScore > highScore) {
            setHighScore(finalScore);
            localStorage.setItem('aegisHighScore', finalScore.toString());
        }
        setGameState(result);
    };

    if (battleshipState.current.isDestroyed && pools.enemyFighters.every(f => !f.active)) {
        end('victory');
    }
    if (!battleshipState.current.isDestroyed && battleshipState.current.position.z > CITY_BREACH_Z) {
        setCityIntegrity(0);
        end('gameOver');
    }
  });

  const activeTarget = pools.enemyFighters.find(f => f.id === currentTargetId && f.active);
  
  return (
    <>
      <Suspense fallback={null}>
        <PlayerCopter 
            ref={playerCopterRef} 
            onFireAutoGun={fireAutoBullet} 
            initialPosition={playerSpawnPosition.clone().add(new THREE.Vector3(0, SPAWN_ALTITUDE, 0))} 
            isShieldActive={isShieldActive} 
            muzzleFlash={muzzleFlash} 
            isControllable={gamePhase === 'playing'}
        />
        <GameCameraRig playerCopterRef={playerCopterRef} gamePhase={gamePhase} />
        
        {gamePhase === 'playing' && !battleshipState.current.isDestroyed && <EnemyBattleshipModel ref={battleshipRef} />}

        {pools.enemyFighters.map(f => f.active && <EnemyFighterModel key={f.id} position={f.position} quaternion={f.quaternion} isHit={f.hitTimer > 0} />)}
        {pools.autoBullets.map(m => m.active && <PlayerMissileModel key={m.id} position={m.position} quaternion={m.quaternion} scale={0.3} />)}
        {pools.homingMissiles.map(m => m.active && <PlayerMissileModel key={m.id} position={m.position} quaternion={m.quaternion} scale={0.8} />)}
        {pools.laserBeams.map(l => <LaserBeam key={l.id} start={l.start} end={l.end} />)}
        {pools.explosions.map(e => e.active && <Explosion key={e.id} position={e.position} scale={e.scale} life={e.life} />)}
        {pools.powerUps.map(p => p.active && <PowerUpModel key={p.id} position={p.position} />)}

        {activeTarget && <TargetReticule position={activeTarget.position} />}

      </Suspense>
      <GameHUD 
        onExit={handleExit} 
        onRestart={resetGame}
        cityIntegrity={cityIntegrity} 
        onFireMissile={fireHomingMissile} 
        missileCooldown={missileCooldown} 
        score={score}
        highScore={highScore}
        gameState={gameState}
        isShieldActive={isShieldActive}
        isVisible={gamePhase === 'playing'}
      />
    </>
  );
};