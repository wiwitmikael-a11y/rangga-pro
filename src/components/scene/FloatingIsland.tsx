// FIX: Implemented component to serve as the scene's base platform.
import React from 'react';

const FloatingIsland = () => {
  return (
    <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[30, 35, 4, 32]} />
      <meshStandardMaterial color="#111" metalness={0.9} roughness={0.3} />
    </mesh>
  );
};

export default FloatingIsland;
