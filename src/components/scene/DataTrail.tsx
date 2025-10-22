import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const DataTrail: React.FC = () => {
  const count = 50;
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const { viewport, mouse } = useThree();
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(),
        scale: 1,
        life: 0,
      });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    
    // Calculate mouse position in 3D space
    const vec = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vec.unproject(state.camera);
    const dir = vec.sub(state.camera.position).normalize();
    const distance = -state.camera.position.z / dir.z;
    const pos = state.camera.position.clone().add(dir.multiplyScalar(distance));

    particles.forEach((particle, i) => {
      if (particle.life <= 0) {
        // Respawn particle
        if (i === 0) { // Leader particle follows the mouse
            particle.position.copy(pos);
            particle.life = 1;
            particle.scale = Math.random() * 0.05 + 0.02;
        }
      } else {
        // Update particle life
        particle.life -= delta * 2;
        if (i > 0) {
            // Follow the particle in front
            const prev = particles[i - 1];
            particle.position.lerp(prev.position, delta * 15);
        }
      }

      dummy.position.copy(particle.position);
      dummy.scale.set(particle.scale * particle.life, particle.scale * particle.life, particle.scale * particle.life);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshStandardMaterial color="#00ffff" emissive="#00ffff" toneMapped={false} transparent opacity={0.5} />
    </instancedMesh>
  );
};

export default DataTrail;