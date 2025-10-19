import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Billboard, Text, Plane, Grid } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CityDistrict, PortfolioSubItem } from '../types';
import { PORTFOLIO_DATA } from '../constants';

// --- PROPS ---
interface Experience3DProps {
  onSelectDistrict: (district: CityDistrict | null) => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
  selectedDistrict: CityDistrict | null;
}

// --- CAMERA ---
const CameraRig: React.FC<{ selectedDistrict: CityDistrict | null }> = ({ selectedDistrict }) => {
  const { camera } = useThree();
  const targetPosition = useMemo(() => new THREE.Vector3(), []);
  const lookAtTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (selectedDistrict) {
      const [x, y, z] = selectedDistrict.position3D;
      targetPosition.set(x, y + 2, z + 8); // Zoom in closer
      lookAtTarget.set(x, y, z);
    } else {
      targetPosition.set(0, 5, 20); // City overview
      lookAtTarget.set(0, 0, 0);
    }
    camera.position.lerp(targetPosition, delta * 2);
    camera.lookAt(
        camera.position.clone().lerp(lookAtTarget, delta * 2).add(new THREE.Vector3(0,0,-5))
    );
    camera.updateProjectionMatrix();
  });

  return null;
};

// --- ATMOSPHERE ---
const FlyingParticles = () => {
  const count = 150;
  // FIX: The ref for an <instancedMesh> should be THREE.InstancedMesh, not THREE.Points.
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.005 + Math.random() / 200;
      const x = (Math.random() - 0.5) * 25;
      const y = (Math.random() - 0.5) * 25;
      const z = (Math.random() - 0.5) * 25;
      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    particles.forEach((particle, i) => {
      let { factor, speed } = particle;
      const t = (particle.time += speed);
      dummy.position.set(
        particle.x + Math.cos(t) * factor,
        particle.y + Math.sin(t) * factor,
        particle.z + Math.sin(t) * factor
      );
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#00aaff" />
    </instancedMesh>
  );
};


// --- INTERACTABLES ---
const DigitalBanner: React.FC<{
  subItem: PortfolioSubItem;
  districtPosition: [number, number, number];
  onSelect: () => void;
}> = ({ subItem, districtPosition, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const pos: [number, number, number] = [
    districtPosition[0] + subItem.position[0],
    districtPosition[1] + subItem.position[1] + 1,
    districtPosition[2] + subItem.position[2],
  ];

  return (
    <group position={pos} onClick={onSelect} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <Plane args={[2.5, 1]} >
        <meshStandardMaterial 
            color={hovered ? '#ffffff' : '#00aaff'} 
            emissive={hovered ? '#ffffff' : '#00aaff'}
            emissiveIntensity={hovered ? 1 : 0.5}
            transparent 
            opacity={0.3} 
        />
      </Plane>
       <Text
          position={[0, 0, 0.01]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.3}
        >
          {subItem.title}
        </Text>
    </group>
  );
};


const DistrictBuilding: React.FC<{
  district: CityDistrict;
  onSelect: () => void;
  isSelected: boolean;
  isFaded: boolean;
}> = ({ district, onSelect, isSelected, isFaded }) => {
    const [hovered, setHovered] = useState(false);
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((_, delta) => {
        groupRef.current.rotation.y += delta * 0.1; // Slow rotation
    });
    
    const buildings = useMemo(() => {
        const arr = [];
        for (let i = 0; i < 5; i++) {
            arr.push({
                position: [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 1, (Math.random() - 0.5) * 2] as [number, number, number],
                height: 1 + Math.random() * 2
            })
        }
        return arr;
    }, []);

    const handleClick = (e: any) => {
        e.stopPropagation();
        onSelect();
    }

  return (
    <group position={district.position3D} visible={!isFaded}>
        <group ref={groupRef}>
            {/* Main tower */}
            <mesh>
                <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
                <meshStandardMaterial color="#111122" roughness={0.2} metalness={0.8} />
            </mesh>
             <mesh position={[0,0.01,0]}>
                <cylinderGeometry args={[0.51, 0.51, 4.01, 8]} />
                <meshStandardMaterial wireframe color={district.color} emissive={district.color} emissiveIntensity={0.5} />
            </mesh>

            {/* Surrounding buildings */}
            {buildings.map((b, i) => (
                 <mesh key={i} position={b.position}>
                    <cylinderGeometry args={[0.2, 0.2, b.height, 6]} />
                    <meshStandardMaterial color="#0a0a14" roughness={0.3} metalness={0.7} />
                </mesh>
            ))}
        </group>

      <Billboard>
        <Text
          position={[0, 3, 0]}
          fontSize={0.4}
          color={hovered || isSelected ? 'white' : '#aaa'}
          onClick={handleClick}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={() => setHovered(false)}
        >
          {district.title}
        </Text>
      </Billboard>
    </group>
  );
};

// --- MAIN COMPONENT ---
const Experience3D: React.FC<Experience3DProps> = ({
  onSelectDistrict,
  onSelectSubItem,
  selectedDistrict,
}) => {
  return (
    <Canvas camera={{ position: [0, 5, 20], fov: 75 }}>
      <color attach="background" args={['#05050c']} />
      <fog attach="fog" args={['#05050c', 15, 40]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 10, 0]} color="#00ffff" intensity={1} distance={50} />
      <pointLight position={[-10, -5, -10]} color="#ff00ff" intensity={1} distance={50} />
      
      <Stars radius={200} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
      <Grid
        position={[0, -2, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={1}
        cellColor={"#00aaff"}
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor={"#00ffff"}
        fadeDistance={50}
        fadeStrength={1}
        infiniteGrid
      />

      <CameraRig selectedDistrict={selectedDistrict} />
      
      <FlyingParticles />
      
      {PORTFOLIO_DATA.map(district => (
        <DistrictBuilding
          key={district.id}
          district={district}
          onSelect={() => onSelectDistrict(district)}
          isSelected={selectedDistrict?.id === district.id}
          isFaded={selectedDistrict !== null && selectedDistrict.id !== district.id}
        />
      ))}
      
      {selectedDistrict && selectedDistrict.subItems.map(subItem => (
        <DigitalBanner
          key={subItem.id}
          subItem={subItem}
          districtPosition={selectedDistrict.position3D}
          onSelect={() => onSelectSubItem(subItem)}
        />
      ))}

      <EffectComposer>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} intensity={1.2} />
      </EffectComposer>
    </Canvas>
  );
};

export default Experience3D;