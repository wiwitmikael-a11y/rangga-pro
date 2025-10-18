import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Stars, MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { PortfolioItem, GenArtParams } from '@/types';
import { PORTFOLIO_ITEMS } from '@/constants';

interface GenerativeArtNodeProps {
  item: PortfolioItem;
  onSelectItem: (item: PortfolioItem) => void;
  params: GenArtParams;
}

function GenerativeArtNode({ item, onSelectItem, params }: GenerativeArtNodeProps) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHovered] = useState(false);
  
    useFrame((state, delta) => {
      if (meshRef.current) {
         meshRef.current.rotation.y += delta * 0.1;
      }
    });
  
    return (
      <group position={new THREE.Vector3(...item.position3D)}>
        <mesh
          ref={meshRef}
          onClick={() => onSelectItem(item)}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.1 : 1}
        >
          <sphereGeometry args={[0.7, 32, 32]} />
          <MeshDistortMaterial
              key={JSON.stringify(params)}
              color={params.color}
              distort={params.distort}
              speed={params.speed}
              roughness={0.1}
          />
        </mesh>
        <Text position={[0, 1.2, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
          {item.title}
        </Text>
      </group>
    );
};


interface PortfolioNodeProps {
  item: PortfolioItem;
  onSelectItem: (item: PortfolioItem) => void;
}

function PortfolioNode({ item, onSelectItem }: PortfolioNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
       meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group position={new THREE.Vector3(...item.position3D)}>
      <mesh
        ref={meshRef}
        onClick={() => onSelectItem(item)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <sphereGeometry args={[0.7, 32, 32]} />
        <MeshDistortMaterial
            color={hovered ? '#00aaff' : '#ffffff'}
            distort={0.4}
            speed={2}
            roughness={0.1}
        />
      </mesh>
      <Text position={[0, 1.2, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {item.title}
      </Text>
    </group>
  );
};

interface CameraRigProps {
    selectedItem: PortfolioItem | null;
}

function CameraRig({ selectedItem }: CameraRigProps) {
    const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

    const targetPosition = useMemo(() => {
        if (selectedItem) {
            const itemPos = new THREE.Vector3(...selectedItem.position3D);
            const direction = itemPos.clone().negate().normalize();
            const camPos = itemPos.clone().add(direction.multiplyScalar(4));
            camPos.y = Math.max(camPos.y, 1); // Ensure camera doesn't go below a certain height
            return camPos;
        }
        return new THREE.Vector3(0, 2, 18);
    }, [selectedItem]);

    const desiredLookAt = useMemo(() => {
        return selectedItem ? new THREE.Vector3(...selectedItem.position3D) : new THREE.Vector3(0, 0, 0);
    }, [selectedItem]);

    useFrame((state) => {
        state.camera.position.lerp(targetPosition, 0.05);
        currentLookAt.current.lerp(desiredLookAt, 0.05);
        state.camera.lookAt(currentLookAt.current);
    });

    return null;
}

interface Experience3DProps {
  onSelectItem: (item: PortfolioItem | null) => void;
  selectedItem: PortfolioItem | null;
  genArtParams: GenArtParams;
}

export function Experience3D({ onSelectItem, selectedItem, genArtParams }: Experience3DProps) {

  return (
    <Canvas camera={{ position: [0, 2, 18], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {PORTFOLIO_ITEMS.map(item => {
        if (item.id === 'generative-art') {
            return <GenerativeArtNode key={item.id} item={item} onSelectItem={onSelectItem} params={genArtParams} />
        }
        return <PortfolioNode key={item.id} item={item} onSelectItem={onSelectItem} />
      })}
      
       <CameraRig selectedItem={selectedItem} />

       <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} intensity={0.7} />
       </EffectComposer>
    </Canvas>
  );
};