// Added a triple-slash directive to include @react-three/fiber types, resolving TypeScript errors with unrecognized JSX elements.
/// <reference types="@react-three/fiber" />

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { PortfolioSubItem } from '../../types';

interface HolographicProjectorProps {
  item: PortfolioSubItem;
  onClose: () => void;
}

const HolographicProjector: React.FC<HolographicProjectorProps> = ({ item, onClose }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Saat item berubah, atur ulang visibilitas untuk memicu animasi masuk kembali
    return () => setIsVisible(false);
  }, [item]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const targetScale = isVisible ? 1 : 0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);

    // Lihat ke arah kamera
    groupRef.current.quaternion.slerp(state.camera.quaternion, delta * 4);
  });
  
  const [contentPart1, linkPart, contentPart2] = useMemo(() => {
      const parts = item.content.split(/(\[Link Here\])/);
      return [parts[0], parts[1], parts[2]];
  }, [item.content]);

  return (
    <group ref={groupRef} position={[item.position[0], item.position[1] + 2, item.position[2] + 5]} scale={0}>
      <mesh>
        <planeGeometry args={[10, 8]} />
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
        <div style={styles.contentWrapper}>
            <h2 style={styles.title}>{item.title}</h2>
            <p style={styles.paragraph}>
                {contentPart1}
                {linkPart && (
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={styles.linkButton}
                  >
                    Visit LinkedIn
                  </a>
                )}
                {contentPart2}
            </p>
            <button onClick={onClose} style={styles.closeButton} aria-label="Close Project">
                &times;
            </button>
        </div>
      </Html>
    </group>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    htmlContainer: {
        width: '600px',
        height: '480px',
        pointerEvents: 'none', // Biarkan scene 3D di-klik
    },
    contentWrapper: {
        width: '100%',
        height: '100%',
        background: 'rgba(0, 20, 40, 0.9)',
        color: '#a7d1d0',
        padding: '25px',
        borderRadius: '10px',
        border: '1px solid #00aaff',
        fontFamily: 'var(--font-family)',
        fontSize: '16px',
        lineHeight: '1.6',
        overflowY: 'auto',
        pointerEvents: 'auto', // Aktifkan pointer event di dalam wrapper
        position: 'relative',
        boxSizing: 'border-box',
    },
    title: { 
        color: 'var(--primary-color)', 
        textShadow: '0 0 5px var(--primary-color)', 
        marginTop: '0' 
    },
    paragraph: {
      whiteSpace: 'pre-wrap',
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
    linkButton: {
        display: 'inline-block',
        margin: '15px 5px',
        padding: '8px 12px',
        border: '1px solid var(--primary-color)',
        color: 'var(--primary-color)',
        backgroundColor: 'rgba(0, 255, 255, 0.1)',
        textDecoration: 'none',
        borderRadius: '3px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    },
};

export default HolographicProjector;