// FIX: Implemented a particle effect component to resolve placeholder errors.
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, BufferGeometry } from 'three';

const DataStream = () => {
  const pointsRef = useRef<Points>(null!);

  const particles = useMemo(() => {
    const p = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 50;
      p[i * 3 + 1] = Math.random() * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return p;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      const positions = (pointsRef.current.geometry as BufferGeometry).attributes.position;
      for (let i = 0; i < positions.count; i++) {
        let y = positions.getY(i);
        y -= 0.5 * delta;
        if (y < 0) {
          y = 20;
        }
        positions.setY(i, y);
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#00aaff" transparent opacity={0.7} />
    </points>
  );
};

export default DataStream;
