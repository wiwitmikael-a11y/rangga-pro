import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Stars, Plane, Billboard } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CityDistrict, PortfolioSubItem } from '../types';
import { DISTRICTS } from '../constants';

// --- Building Components ---
const buildingMaterial = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0.1,
    roughness: 0.2,
    metalness: 0.8,
});

const DistrictBuilding: React.FC<{ district: CityDistrict; onSelect: () => void; isSelected: boolean; isAnyDistrictSelected: boolean }> = ({ district, onSelect, isSelected, isAnyDistrictSelected }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const buildingHeight = 12;

  useFrame((state, delta) => {
    if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.05;
        const targetScale = isSelected ? 1.2 : (hovered ? 1.1 : 1);
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);
        
        const textElement = groupRef.current.children.find(c => c.name === 'district-title') as THREE.Mesh<any, any>;
        if (textElement) {
          const targetOpacity = isAnyDistrictSelected && !isSelected ? 0.1 : 1;
          textElement.material.opacity += (targetOpacity - textElement.material.opacity) * (delta * 2);
        }
    }
  });

  return (
    <group 
        position={[district.position3D[0], district.position3D[1] - 4, district.position3D[2]]}
        ref={groupRef}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
    >
      <mesh>
          <cylinderGeometry args={[2.05, 2.05, buildingHeight, 6]} />
          <meshStandardMaterial color={district.color} emissive={district.color} emissiveIntensity={isSelected ? 3 : (hovered ? 2 : 1)} toneMapped={false} wireframe />
      </mesh>
      <Text name="district-title" position={[0, buildingHeight + 2, 0]} fontSize={1} color="white" anchorX="center" anchorY="middle" material-transparent={true}>
        {district.title}
      </Text>
    </group>
  );
};


const InfoBanner: React.FC<{ item: PortfolioSubItem; onSelect: () => void; isVisible: boolean; color: string }> = ({ item, onSelect, isVisible, color }) => {
    const groupRef = useRef<THREE.Group>(null!);
    const [hovered, setHovered] = useState(false);
    
    useFrame((state, delta) => {
        if(groupRef.current) {
            const targetScale = isVisible ? (hovered ? 1.1 : 1) : 0;
            groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
        }
    });

    return(
        <group ref={groupRef} position={item.position} onClick={(e) => {e.stopPropagation(); onSelect()}} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
            <Plane args={[4, 1.5]}>
                <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={hovered ? 0.8 : 0.4} transparent opacity={0.8} />
            </Plane>
            <Plane args={[4.1, 1.6]}>
                 <meshStandardMaterial wireframe color={color} emissive={color} emissiveIntensity={1} />
            </Plane>
            <Text position={[0, 0, 0.1]} fontSize={0.3} color="white" anchorX="center" anchorY="middle" maxWidth={3.5}>
                {item.title}
            </Text>
        </group>
    )
}

// --- World and Atmosphere ---
const ProceduralCity = () => {
    const instancedMeshRef = useRef<THREE.InstancedMesh>(null!);
    const count = 200;

    useMemo(() => {
        const tempObject = new THREE.Object3D();
        for (let i = 0; i < count; i++) {
            const x = THREE.MathUtils.randFloatSpread(150);
            const z = THREE.MathUtils.randFloatSpread(150);
            const height = THREE.MathUtils.randFloat(2, 20);
            const width = THREE.MathUtils.randFloat(1, 4);

            tempObject.position.set(x, height / 2 - 4, z);
            tempObject.scale.set(width, height, width);
            tempObject.updateMatrix();
            instancedMeshRef.current?.setMatrixAt(i, tempObject.matrix);
        }
        if (instancedMeshRef.current) {
            instancedMeshRef.current.instanceMatrix.needsUpdate = true;
        }
    }, []);

    return (
        <instancedMesh ref={instancedMeshRef} args={[undefined, undefined, count]}>
            <boxGeometry />
            <meshStandardMaterial color="#111111" roughness={0.5} metalness={0.8} />
        </instancedMesh>
    )
}

const VehicleParticles: React.FC<{ count: number }> = ({ count }) => {
    const pointsRef = useRef<THREE.Points>(null!);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.005 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -15 + Math.random() * 30;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    const particlePositions = useMemo(() => new Float32Array(count * 3), [count]);

    useFrame(state => {
        const { clock } = state;
        for (let i = 0; i < count; i++) {
            const p = particles[i];
            p.t += p.speed;
            const a = Math.cos(p.t) + Math.sin(p.t * 1) / 10;
            const b = Math.sin(p.t) + Math.cos(p.t * 2) / 10;
            
            particlePositions[i * 3] = p.xFactor + Math.cos(a) * p.factor;
            particlePositions[i * 3 + 1] = p.yFactor + b * 10;
            particlePositions[i * 3 + 2] = p.zFactor + Math.sin(a) * p.factor;
        }
        if (pointsRef.current) {
            pointsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry />
            {/* FIX: The 'emissive' property does not exist on PointsMaterial. The glow effect is handled by the Bloom effect. */}
            <pointsMaterial size={0.3} color="#00aaff" sizeAttenuation toneMapped={false} />
        </points>
    );
};

const Cityscape = () => {
    return (
        <group>
            <mesh position={[0, -4.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[100, 64]} />
                <meshStandardMaterial 
                  color="#000000"
                  emissive="#00aaff"
                  emissiveIntensity={0.2}
                />
            </mesh>
            <ProceduralCity />
            <VehicleParticles count={200} />
        </group>
    );
};

// --- Camera & Main Component ---
const OVERVIEW_POSITION = new THREE.Vector3(0, 8, 35);

function CameraRig({ selectedDistrict }: { selectedDistrict: CityDistrict | null }) {
    const targetPosition = useMemo(() => {
        if (selectedDistrict) {
            const districtPos = new THREE.Vector3(...selectedDistrict.position3D);
            const camPos = districtPos.clone();
            camPos.y += 5;
            camPos.z += (Math.abs(camPos.z) > 1 ? Math.sign(camPos.z) : 1) * 12;
            camPos.x += (Math.abs(camPos.x) > 1 ? Math.sign(camPos.x) : 1) * 12;
            return camPos;
        }
        return OVERVIEW_POSITION;
    }, [selectedDistrict]);

    const lookAtPosition = useMemo(() => {
        if (selectedDistrict) {
            return new THREE.Vector3(...selectedDistrict.position3D);
        }
        return new THREE.Vector3(0, 0, 0);
    }, [selectedDistrict]);
    
    useFrame((state, delta) => {
        state.camera.position.lerp(targetPosition, 2 * delta);
        if (!state.camera.userData.lookAt) state.camera.userData.lookAt = lookAtPosition.clone();
        state.camera.userData.lookAt.lerp(lookAtPosition, 2 * delta);
        state.camera.lookAt(state.camera.userData.lookAt);
    });

    return null;
}

interface Experience3DProps {
  onSelectDistrict: (district: CityDistrict | null) => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
  selectedDistrict: CityDistrict | null;
}

export default function Experience3D({ 
    onSelectDistrict,
    onSelectSubItem,
    selectedDistrict
}: Experience3DProps) {

  return (
    <Canvas style={{ position: 'fixed', top: 0, left: 0, zIndex: 1 }} camera={{ position: [0, 5, 40], fov: 60 }}>
      <fog attach="fog" args={['#050505', 25, 100]} />
      <color attach="background" args={['#050505']} />
      <ambientLight intensity={0.1} />
      <Stars radius={200} depth={100} count={3000} factor={6} saturation={0} fade speed={1} />

      <Cityscape />
      
      {DISTRICTS.map(district => (
        <group key={district.id}>
          <DistrictBuilding 
            district={district} 
            onSelect={() => onSelectDistrict(district)} 
            isSelected={selectedDistrict?.id === district.id}
            isAnyDistrictSelected={!!selectedDistrict}
          />
          <group position={district.position3D}>
            {district.subItems.map(item => (
              <InfoBanner
                key={item.id}
                item={item}
                onSelect={() => onSelectSubItem(item)}
                isVisible={selectedDistrict?.id === district.id}
                color={district.color}
              />
            ))}
          </group>
        </group>
      ))}
      
       <CameraRig selectedDistrict={selectedDistrict} />

       <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
       </EffectComposer>
    </Canvas>
  );
};