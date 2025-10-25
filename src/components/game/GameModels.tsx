
import React, { useMemo, useRef, useEffect } from 'react';
import { useGLTF, Cylinder, Torus, Billboard, /* Points, */ Octahedron } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BASE_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/';

// --- Model-based Components ---

export const PlayerMissileModel = React.forwardRef<THREE.Group, { [key: string]: any }>((props, ref) => {
  const { scene } = useGLTF(BASE_URL + 'player_missile.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return <primitive ref={ref} object={clonedScene} {...props} />;
});

export const EnemyBattleshipModel = React.forwardRef<THREE.Group, { [key: string]: any }>((props, ref) => {
  const { scene } = useGLTF(BASE_URL + 'enemy_battleship.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return <primitive ref={ref} object={clonedScene} scale={0.1} {...props} />;
});

interface EnemyFighterProps {
  isHit: boolean;
  [key: string]: any;
}

export const EnemyFighterModel = React.forwardRef<THREE.Group, EnemyFighterProps>(({ isHit, ...props }, ref) => {
  const { scene } = useGLTF(BASE_URL + 'enemy_fighter.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const hitFlashMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 'white', emissive: 'white', emissiveIntensity: 5 }), []);

  useEffect(() => {
    clonedScene.traverse(child => {
      if (child instanceof THREE.Mesh) {
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material;
        }
        child.material = isHit ? hitFlashMaterial : child.userData.originalMaterial;
      }
    });
  }, [isHit, clonedScene, hitFlashMaterial]);

  return <primitive ref={ref} object={clonedScene} scale={0.8} {...props} />;
});


// --- Procedural VFX Components ---

export const MuzzleFlash: React.FC = () => {
    const ref = useRef<THREE.Mesh>(null!);
    useEffect(() => {
        const scale = Math.random() * 0.5 + 0.8;
        if (ref.current) {
            ref.current.rotation.z = Math.random() * Math.PI * 2;
            ref.current.scale.set(scale, scale, scale);
        }
    }, []);
    return (
        <mesh ref={ref} position={[0, 0, -2]} >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial color="yellow" toneMapped={false} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
        </mesh>
    );
};

export const ShieldEffect: React.FC = () => {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame(({ clock }) => {
        if (ref.current) {
            const material = ref.current.material as THREE.ShaderMaterial;
            material.uniforms.time.value = clock.getElapsedTime();
        }
    });

    const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                float flicker = sin(time * 10.0 + length(gl_FragCoord.xy) * 0.01) * 0.5 + 0.5;
                gl_FragColor = vec4(vec3(0.5, 0.7, 1.0) * intensity * flicker, intensity * 0.8);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
    }), []);

    return (
        <mesh ref={ref} scale={35}>
            <icosahedronGeometry args={[1, 3]} />
            <primitive object={shaderMaterial} />
        </mesh>
    );
};

export const PowerUpModel: React.FC<{ position: THREE.Vector3 }> = ({ position }) => {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame((_, delta) => {
        if (ref.current) ref.current.rotation.y += delta;
    });
    return (
        <Octahedron ref={ref} position={position} args={[1.5, 0]}>
            <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={3} toneMapped={false} />
        </Octahedron>
    );
};

interface ExplosionProps {
    position: THREE.Vector3;
    scale: number;
    life: number; // Normalized life [0..1] -> changed from [1..0] for clarity
}

// OPTIMIZED EXPLOSION COMPONENT
export const Explosion: React.FC<ExplosionProps> = ({ position, scale, life }) => {
    const pointsRef = useRef<THREE.Points>(null!);
    const NUM_PARTICLES = 50;

    // Store initial random velocities once
    const velocities = useMemo(() => {
        const vels = new Float32Array(NUM_PARTICLES * 3);
        for (let i = 0; i < NUM_PARTICLES; i++) {
            const vec = new THREE.Vector3(
                (Math.random() - 0.5),
                (Math.random() - 0.5),
                (Math.random() - 0.5)
            );
            // Safeguard against zero-vector causing NaN on normalization
            if (vec.lengthSq() === 0) {
                vec.set(1, 0, 0);
            }
            vec.normalize().multiplyScalar(Math.random() * 20);
            vels.set([vec.x, vec.y, vec.z], i * 3);
        }
        return vels;
    }, []);

    const particlePositions = useMemo(() => new Float32Array(NUM_PARTICLES * 3), []);

    useFrame(() => {
        if (!pointsRef.current) return;
        const progress = 1 - life; // progress goes from 0 to 1 as life goes from 1 to 0
        for (let i = 0; i < NUM_PARTICLES; i++) {
            const i3 = i * 3;
            particlePositions[i3] = velocities[i3] * progress;
            particlePositions[i3 + 1] = velocities[i3 + 1] * progress;
            particlePositions[i3 + 2] = velocities[i3 + 2] * progress;
        }
        // Very important: tell Three.js to update the geometry
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        // Also update material properties that change over time
        (pointsRef.current.material as THREE.PointsMaterial).size = 0.5 * life;
        (pointsRef.current.material as THREE.PointsMaterial).opacity = life;
    });

    return (
        <points ref={pointsRef} position={position} scale={scale}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={NUM_PARTICLES}
                    array={particlePositions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                color="orange"
                transparent
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
            />
        </points>
    );
};

interface LaserBeamProps {
    start: THREE.Vector3;
    end: THREE.Vector3;
}

export const LaserBeam: React.FC<LaserBeamProps> = ({ start, end }) => {
    const laserProps = useMemo(() => {
        const direction = end.clone().sub(start);
        const height = direction.length();
        
        // Safeguard against zero-length direction vector to prevent renderer crash
        if (direction.lengthSq() < 0.0001) {
            return { valid: false, position: new THREE.Vector3(), quaternion: new THREE.Quaternion(), height: 0 };
        }

        const position = start.clone().add(direction.clone().multiplyScalar(0.5));
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
        return { valid: true, position, quaternion, height };
    }, [start, end]);

    if (!laserProps.valid) {
        return null; // Don't render anything if start and end points are the same
    }

    return (
        <Cylinder args={[0.3, 0.3, laserProps.height, 8]} position={laserProps.position} quaternion={laserProps.quaternion}>
            <meshStandardMaterial color="red" emissive="red" emissiveIntensity={10} toneMapped={false} />
        </Cylinder>
    );
};

interface TargetReticuleProps {
    position: THREE.Vector3;
}

export const TargetReticule: React.FC<TargetReticuleProps> = ({ position }) => {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.z += delta * 2;
        }
    });

    return (
        <group position={position}>
            <Billboard>
                <Torus ref={ref} args={[4, 0.15, 2, 12]}>
                    <meshStandardMaterial color="red" emissive="red" emissiveIntensity={5} toneMapped={false} />
                </Torus>
            </Billboard>
        </group>
    );
};


// Preload all models for a smoother experience
useGLTF.preload(BASE_URL + 'player_missile.glb');
useGLTF.preload(BASE_URL + 'enemy_battleship.glb');
useGLTF.preload(BASE_URL + 'enemy_fighter.glb');
