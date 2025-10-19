import React from 'react';
import * as THREE from 'three';

const PCBFloor = () => {
  const lineMaterial = new THREE.LineBasicMaterial({ color: '#00ffff', toneMapped: false });

  // Create circular paths
  const circles = [18, 16, 12, 10].map(radius => {
    const points = new THREE.Path().absarc(0, 0, radius, 0, Math.PI * 2, false).getPoints(64);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return <lineLoop key={radius} geometry={geometry} material={lineMaterial} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} />;
  });

  // Create radial paths
  const radials = Array.from({ length: 16 }).map((_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const start = new THREE.Vector3(10 * Math.cos(angle), 0, 10 * Math.sin(angle));
    const end = new THREE.Vector3(18 * Math.cos(angle), 0, 18 * Math.sin(angle));
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    return <lineSegments key={i} geometry={geometry} material={lineMaterial} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}/>
  });

  return (
    <group>
      {/* Base platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <cylinderGeometry args={[20, 20, 0.2, 64]} />
        <meshStandardMaterial color="#050810" metalness={0.8} roughness={0.4} />
      </mesh>
      {/* Energy Glow Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, 0]}>
        <circleGeometry args={[18, 64]} />
        <meshBasicMaterial color={'#00ffff'} transparent opacity={0.1} toneMapped={false} />
      </mesh>
      {circles}
      {radials}
    </group>
  );
};

export default PCBFloor;