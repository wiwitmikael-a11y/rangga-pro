// FIX: Corrected the reference path for @react-three/fiber types. The '/patch' subpath is obsolete.
/// <reference types="@react-three/fiber" />
import React, { useRef, useEffect, useState } from 'react';
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
    const timer = setTimeout(() => setIsVisible(true), 100); // Short delay for animation in
    return () => clearTimeout(timer);
  }, [item]);


  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const targetScale = isVisible ? 1 : 0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6);

    // Look at camera
    groupRef.current.lookAt(state.camera.position);
  });

  const contentParts = item.content.split('[Link Here]');

  return (
    <group ref={groupRef} position={[item.position[0], item.position[1] + 2, item.position[2] + 5]} scale={0}>
      <mesh>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial
          color="#00aaff"
          emissive="#00aaff"
          emissiveIntensity={0.2}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Html
        transform
        occlude
        distanceFactor={1.5}
        position={[0, 0, 0.1]}
        style={{
            width: '600px',
            height: '480px',
            backgroundColor: 'rgba(0, 20, 40, 0.9)',
            color: '#a7d1d0',
            padding: '25px',
            borderRadius: '10px',
            border: '1px solid #00aaff',
            fontFamily: 'monospace',
            fontSize: '16px',
            lineHeight: '1.6',
            overflowY: 'auto',
            pointerEvents: 'auto',
        }}
      >
        <h2 style={{ color: '#00ffff', textShadow: '0 0 5px #00ffff', marginTop: '0' }}>{item.title}</h2>
        <p>
            {contentParts[0]}
            {contentParts.length > 1 && (
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={styles.linkButton}
              >
                Visit LinkedIn
              </a>
            )}
            {contentParts[1]}
        </p>
        <button onClick={onClose} style={styles.closeButton}>
            &times;
        </button>
      </Html>
    </group>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
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
        marginTop: '15px',
        padding: '8px 12px',
        border: '1px solid #00ffff',
        color: '#00ffff',
        backgroundColor: 'rgba(0, 255, 255, 0.1)',
        textDecoration: 'none',
        borderRadius: '3px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    },
};


export default HolographicProjector;