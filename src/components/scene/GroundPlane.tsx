import React from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

export const GroundPlane = () => {
  const texture = useTexture('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/textures/tech_floor_diff_2k.jpg');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(20, 20);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.1, 0]} receiveShadow>
      <planeGeometry args={[500, 500]} />
      <meshStandardMaterial 
        map={texture} 
        color="#333333"
        roughness={0.7}
        metalness={0.2}
      />
    </mesh>
  );
};
