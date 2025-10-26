import React, { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import { useFrame, ThreeEvent, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

const MODEL_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/PatrollingCore.glb';
const SCALE = 4; 

const noise3D = createNoise3D();

const tooltipStyles: { [key: string]: React.CSSProperties } = {
  container: {
    transform: 'translate(-50%, -120%)',
    background: 'rgba(5, 8, 16, 0.85)',
    color: '#00ffff',
    padding: '15px 20px',
    borderRadius: '8px',
    border: '1px solid #00ffff',
    fontFamily: "'Exo 2', sans-serif",
    textAlign: 'center',
    width: '250px',
    animation: 'tooltip-fade-in 0.5s ease',
    boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
    pointerEvents: 'auto',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '1rem',
    fontWeight: '700',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  description: {
    margin: '0 0 15px 0',
    fontSize: '0.85rem',
    color: '#afeeee',
    lineHeight: '1.4',
  },
  button: {
    background: 'rgba(0, 255, 255, 0.2)',
    border: '1px solid #00ffff',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '700',
    transition: 'all 0.2s ease',
  },
};

const OracleAccessTooltip: React.FC<{ onAccess: () => void }> = React.memo(({ onAccess }) => {
  return (
    <Html center>
       <style>{`
          @keyframes tooltip-fade-in {
            from { opacity: 0; transform: translate(-50%, -100%); }
            to { opacity: 1; transform: translate(-50%, -120%); }
          }
          .access-button:hover {
            background: rgba(0, 255, 255, 0.4) !important;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.7) !important;
          }
        `}</style>
      <div style={tooltipStyles.container}>
        <h3 style={tooltipStyles.title}>Secure Link Detected</h3>
        <p style={tooltipStyles.description}>
          The Oracle's consciousness is available. Do you wish to establish a direct communication channel?
        </p>
        <button style={tooltipStyles.button} className="access-button" onClick={onAccess}>
          [ CONNECT ]
        </button>
      </div>
    </Html>
  );
});


interface PatrollingCoreProps {
  isPaused?: boolean;
  isSelected: boolean;
  onSelect: () => void;
  isFocused: boolean;
  onAccessChat: () => void;
}

export const PatrollingCore = forwardRef<THREE.Group, PatrollingCoreProps>(({ isPaused, isSelected, onSelect, isFocused, onAccessChat }, ref) => {
  const groupRef = useRef<THREE.Group>(null!);
  useImperativeHandle(ref, () => groupRef.current, []);

  const { scene } = useGLTF(MODEL_URL);
  const { camera, invalidate } = useThree();
  
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const previousPosition = useMemo(() => new THREE.Vector3(), []);
  
  const originalEmissive = useMemo(() => new THREE.Color(0, 0, 0), []);
  const hoverEmissive = useMemo(() => new THREE.Color('#00ffff'), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    invalidate(); // Keep rendering frames for core animation

    if (isSelected) {
      const lookAtTarget = new THREE.Vector3(camera.position.x, groupRef.current.position.y, camera.position.z);
      const tempObject = new THREE.Object3D();
      tempObject.position.copy(groupRef.current.position);
      tempObject.lookAt(lookAtTarget);
      groupRef.current.quaternion.slerp(tempObject.quaternion, 0.05);
      return;
    }
    
    if (isPaused) return;

    const elapsedTime = clock.getElapsedTime();
    const movementSpeed = 0.04;
    const time = elapsedTime * movementSpeed;
    const horizontalRange = 80;
    const verticalRange = 25;
    const baseHeight = 35;

    const x = noise3D(time, 0, 0) * horizontalRange;
    const z = noise3D(0, time, 0) * horizontalRange;
    const heightNoise = (noise3D(0, 0, time) + 1) / 2;
    const y = baseHeight + heightNoise * verticalRange;

    previousPosition.copy(groupRef.current.position);
    groupRef.current.position.lerp(new THREE.Vector3(x, y, z), 0.05);

    if (previousPosition.distanceTo(groupRef.current.position) > 0.01) {
       const lookAtTarget = new THREE.Vector3().copy(groupRef.current.position).add(
         new THREE.Vector3().subVectors(groupRef.current.position, previousPosition).normalize()
       );
       const tempObject = new THREE.Object3D();
       tempObject.position.copy(groupRef.current.position);
       tempObject.lookAt(lookAtTarget);
       groupRef.current.quaternion.slerp(tempObject.quaternion, 0.05);
    }
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    clonedScene.traverse((child: any) => {
      if (child.isMesh && child.material.isMeshStandardMaterial) {
        child.material.emissive.copy(hoverEmissive);
        child.material.emissiveIntensity = 0.5;
      }
    });
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    clonedScene.traverse((child: any) => {
      if (child.isMesh && child.material.isMeshStandardMaterial) {
        child.material.emissive.copy(originalEmissive);
        child.material.emissiveIntensity = 1;
      }
    });
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect();
  }

  return (
    <group ref={groupRef}>
      <primitive 
        object={clonedScene} 
        scale={SCALE}
        position-y={0}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
      {isFocused && <OracleAccessTooltip onAccess={onAccessChat} />}
    </group>
  );
});

useGLTF.preload(MODEL_URL);
