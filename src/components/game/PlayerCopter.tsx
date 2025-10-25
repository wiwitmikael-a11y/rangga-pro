import React from 'react';
import * as THREE from 'three';

interface PlayerCopterProps {
    initialPosition: THREE.Vector3;
}

// This component has been removed to focus on the free flight portfolio experience.
export const PlayerCopter = React.forwardRef<THREE.Group, PlayerCopterProps>(({ initialPosition }, ref) => {
  // Return a simple group to satisfy the ref and props without any game logic.
  return <group ref={ref} position={initialPosition} />;
});
