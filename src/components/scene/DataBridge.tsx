import React, { useMemo, useRef } from 'react';
import { CatmullRomLine } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface DataBridgeProps {
  start: [number, number, number];
  end: [number, number, number];
  isActive?: boolean;
}

export const DataBridge: React.FC<DataBridgeProps> = ({ start, end, isActive }) => {
  const lineRef = useRef<any>(null!);

  const activeColor = useMemo(() => new THREE.Color('#ffffff'), []);
  const inactiveColor = useMemo(() => new THREE.Color('#00ffff'), []);

  // This creates a curved path for the bridge to arc gracefully through space
  const points = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const midPoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
    
    // The height of the arc is proportional to the distance between points
    const distance = startVec.distanceTo(endVec);
    midPoint.y += distance * 0.3; // Make the arc higher for longer bridges

    return [startVec, midPoint, endVec];
  }, [start, end]);

  // Animate the material to create a flowing energy effect
  useFrame((_, delta) => {
    if (lineRef.current) {
      // FIX: Cast to 'any' to resolve TypeScript error for dashOffset property
      const material = lineRef.current.material as any;
      // Animate the dash offset to create a moving effect
      const speed = isActive ? 12 : 3;
      material.dashOffset -= delta * speed;

      // Animate the color to indicate active state
      const targetColor = isActive ? activeColor : inactiveColor;
      material.color.lerp(targetColor, delta * 4);
    }
  });

  return (
    <CatmullRomLine
      ref={lineRef}
      points={points}
      color="#00ffff" // Initial color
      dashed={true}
      dashScale={5} // The length of each dash
      gapSize={3} // The length of the gap between dashes
      tension={0.5} // Controls the smoothness of the curve
    />
  );
};

export default DataBridge;