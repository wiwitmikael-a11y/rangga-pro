import React, { useMemo, useRef } from 'react';
import { CatmullRomLine } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface DataBridgeProps {
  start: [number, number, number];
  end: [number, number, number];
}

export const DataBridge: React.FC<DataBridgeProps> = ({ start, end }) => {
  const lineRef = useRef<any>();

  // This creates a curved path for the bridge to arc gracefully through space
  const points = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    // FIX: The .add() method on a THREE.Vector3 requires a vector argument. Pass `endVec` to correctly calculate the midpoint.
    const midPoint = startVec.clone().add(endVec).multiplyScalar(0.5);
    
    // The height of the arc is proportional to the distance between points
    const distance = startVec.distanceTo(endVec);
    midPoint.y += distance * 0.3; // Make the arc higher for longer bridges

    return [startVec, midPoint, endVec];
  }, [start, end]);

  // Animate the material to create a flowing energy effect
  useFrame((_, delta) => {
    if (lineRef.current) {
      // The `dashOffset` property is part of the THREE.LineDashedMaterial
      // By changing it over time, we create the illusion of movement along the line.
      lineRef.current.material.uniforms.dashOffset.value -= delta * 3;
    }
  });

  return (
    <CatmullRomLine
      ref={lineRef}
      points={points}
      color="#00ffff"
      lineWidth={0.3}
      dashed={true}
      dashScale={5} // The length of each dash
      gapSize={3} // The length of the gap between dashes
      tension={0.5} // Controls the smoothness of the curve
    />
  );
};

export default DataBridge;
