// FIX: Remove the triple-slash directive for @react-three/fiber types.

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { CityDistrict } from '../../types';

interface HolographicInfoPanelProps {
  district: CityDistrict;
  onClose: () => void;
}

const HolographicInfoPanel: React.FC<HolographicInfoPanelProps> = ({ district, onClose }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, [district]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = isVisible ? 1 : 0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
  });

  const panelPosition = useMemo(() => {
    const pos = new THREE.Vector3(...district.position);
    pos.y += 10; // Position it above the district's root
    return pos;
  }, [district.position]);

  return (
    <group ref={groupRef} position={panelPosition} scale={0}>
      <Billboard>
        <mesh>
          <planeGeometry args={[12, 9]} />
          <meshStandardMaterial
            color="#00aaff"
            emissive="#00aaff"
            emissiveIntensity={0.3}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
        <Html
          transform
          occlude="blending"
          distanceFactor={1.5}
          position={[0, 0, 0.1]}
          style={styles.htmlContainer}
        >
          <style>{`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(15px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <div style={styles.contentWrapper}>
            <h2 style={styles.title}>{district.title}</h2>
            <h3 style={styles.subtitle}>{district.description}</h3>
            <p style={styles.placeholder}>
                [Placeholder for professional portfolio content. Gallery, detailed text, or interactive elements will be displayed here.]
            </p>
            <button onClick={onClose} style={styles.closeButton} aria-label="Close Panel">
                &times;
            </button>
          </div>
        </Html>
      </Billboard>
    </group>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    htmlContainer: {
        width: '600px',
        height: '450px',
        pointerEvents: 'none',
    },
    contentWrapper: {
        width: '100%',
        height: '100%',
        background: 'rgba(0, 20, 40, 0.9)',
        color: '#a7d1d0',
        padding: '30px',
        borderRadius: '10px',
        border: '1px solid #00aaff',
        fontFamily: 'var(--font-family)',
        fontSize: '16px',
        lineHeight: '1.6',
        pointerEvents: 'auto',
        position: 'relative',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    title: { 
        color: 'var(--primary-color)', 
        textShadow: '0 0 5px var(--primary-color)', 
        marginTop: '0',
        textAlign: 'center',
        animation: 'fadeInUp 0.5s 0.2s both',
    },
    subtitle: {
        color: '#e0e0e0',
        textAlign: 'center',
        marginTop: '-10px',
        fontSize: '1rem',
        borderBottom: '1px solid rgba(0, 170, 255, 0.3)',
        paddingBottom: '15px',
        marginBottom: '20px',
        animation: 'fadeInUp 0.5s 0.4s both',
    },
    placeholder: {
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#88a7a6',
        animation: 'fadeInUp 0.5s 0.6s both',
    },
    closeButton: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'transparent',
        border: '1px solid #00aaff',
        color: '#00aaff',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '1.2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: 1,
        transition: 'background-color 0.2s, color 0.2s',
    },
};

export default HolographicInfoPanel;