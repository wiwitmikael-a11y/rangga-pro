import React from 'react';
import * as THREE from 'three';

const GroundGrid = () => {
  const size = 150;
  const divisions = 30;

  return (
    <group>
      <gridHelper args={[size, divisions, '#ff00ff', '#ff00ff']} position={[0,-0.01,0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#050810" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

export default GroundGrid;
