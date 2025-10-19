import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Vehicle: React.FC<{ initialPosition: [number, number, number], color: string, speed: number, radius: number }> = ({ initialPosition, color, speed, radius }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const angle = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (meshRef.current) {
      angle.current += delta * speed;
      const x = Math.cos(angle.current) * radius;
      const z = Math.sin(angle.current) * radius;
      meshRef.current.position.set(x, initialPosition[1], z);
    }
  });

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

export const FlyingVehicles: React.FC<{ count: number }> = ({ count }) => {
  const vehicles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const radius = 10 + Math.random() * 10;
      const y = Math.random() * 10;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      temp.push({
        position: [x, y, z] as [number, number, number],
        color: ['#ff69b4', '#00aaff', '#39ff14'][Math.floor(Math.random() * 3)],
        speed: 0.1 + Math.random() * 0.2,
        radius: radius,
      });
    }
    return temp;
  }, [count]);

  return (
    <group>
      {vehicles.map((vehicle, i) => (
        <Vehicle 
          key={i} 
          initialPosition={vehicle.position}
          color={vehicle.color}
          speed={vehicle.speed}
          radius={vehicle.radius}
        />
      ))}
    </group>
  );
};
