

import React from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

export const GroundPlane: React.FC = React.memo(() => {
  const [map, roughnessMap, normalMap] = useTexture([
    'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/textures/wet_asphalt_albedo.jpg',
    'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/textures/wet_asphalt_roughness.jpg',
    'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/textures/wet_asphalt_normal.jpg'
  ]);

  // Konfigurasi texture tiling untuk menutupi bidang besar
  [map, roughnessMap, normalMap].forEach(texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(25, 25);
  });
  
  return (
    // FIX: Correctly type R3F intrinsic elements to resolve TypeScript errors.
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.1, 0]} receiveShadow>
      <planeGeometry args={[500, 500]} />
      <meshStandardMaterial 
        map={map}
        roughnessMap={roughnessMap}
        normalMap={normalMap}
        metalness={0.8} // Metalness tinggi pada genangan air memantulkan cahaya dengan baik
        roughness={0.5} // Roughness dasar untuk aspal
        envMapIntensity={0.5}
      />
    </mesh>
  );
});
