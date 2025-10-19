import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Stars, MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { PortfolioItem, GenArtParams, ChatMessage } from '../types';
import { PORTFOLIO_ITEMS } from '../constants';

const PortfolioNode: React.FC<{ item: PortfolioItem; onSelectItem: (item: PortfolioItem) => void; }> = ({ item, onSelectItem }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
       meshRef.current.rotation.y += delta * 0.1;
       const pulseSpeed = hovered ? 4 : 2;
       const scalePulse = Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.05 + 1;
       meshRef.current.scale.set(scalePulse, scalePulse, scalePulse);

       const material = meshRef.current.material as THREE.MeshStandardMaterial;
       material.emissiveIntensity = hovered ? 1.5 : Math.sin(state.clock.elapsedTime * pulseSpeed * 0.5) * 0.5 + 0.5;
    }
  });

  return (
    <group position={item.position3D}>
      <mesh
        ref={meshRef}
        onClick={() => onSelectItem(item)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color={item.color} emissive={item.color} roughness={0.1} />
      </mesh>
      <Text position={[0, 1.2, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {item.title}
      </Text>
    </group>
  );
};

const GenerativeArtNode: React.FC<{ item: PortfolioItem; onSelectItem: (item: PortfolioItem) => void; params: GenArtParams; }> = ({ item, onSelectItem, params }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHovered] = useState(false);
  
    useFrame((state, delta) => {
      if (meshRef.current) {
         meshRef.current.rotation.y += delta * 0.1;
         const pulseSpeed = hovered ? 4 : 2;
         const scalePulse = Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.05 + 1;
         meshRef.current.scale.set(scalePulse, scalePulse, scalePulse);
      }
    });
  
    return (
      <group position={item.position3D}>
        <mesh
          ref={meshRef}
          onClick={() => onSelectItem(item)}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[0.7, 128, 128]} />
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

const CuratorEntity: React.FC<{ onClick: () => void; isChatActive: boolean }> = ({ onClick, isChatActive }) => {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        if(groupRef.current) {
            const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.1 + 1;
            groupRef.current.scale.set(pulse, pulse, pulse);
            groupRef.current.rotation.y += 0.005;
        }
    });

    return (
        <group ref={groupRef} onClick={onClick}>
            <mesh>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial 
                    color="#ffffff" 
                    emissive="#00aaff" 
                    emissiveIntensity={isChatActive ? 2 : 1}
                    transparent 
                    opacity={0.3} 
                    roughness={0.2}
                />
            </mesh>
            <mesh scale={[0.5, 0.5, 0.5]}>
                 <sphereGeometry args={[1, 32, 32]} />
                 <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} roughness={0} />
            </mesh>
        </group>
    )
}

const Conversation: React.FC<{ messages: ChatMessage[] }> = ({ messages }) => {
    return (
        <group position={[0, 0.5, 2.5]}>
            {messages.map((msg, index) => (
                 <Text
                    key={msg.id}
                    position={[msg.sender === 'user' ? 0.5 : -0.5, (messages.length - 1 - index) * 0.5, 0]}
                    fontSize={0.2}
                    color={msg.sender === 'user' ? '#87CEFA' : '#FFFFFF'}
                    anchorX={msg.sender === 'user' ? 'left' : 'right'}
                    anchorY="middle"
                    textAlign={msg.sender === 'user' ? 'left' : 'right'}
                    maxWidth={3}
                    lineHeight={1.4}
                >
                    {msg.text}
                </Text>
            ))}
        </group>
    )
}

function CameraRig({ selectedItem }: { selectedItem: PortfolioItem | null }) {
    const targetPosition = useMemo(() => {
        if (selectedItem) {
            const itemPos = new THREE.Vector3(...selectedItem.position3D);
            const camPos = itemPos.clone().normalize().multiplyScalar(itemPos.length() + 4);
            camPos.y = Math.max(camPos.y, 1.5);
            return camPos;
        }
        return new THREE.Vector3(0, 2, 8);
    }, [selectedItem]);

    const lookAtPosition = useMemo(() => {
        return selectedItem ? new THREE.Vector3(...selectedItem.position3D) : new THREE.Vector3(0, 0, 0);
    }, [selectedItem]);

    useFrame((state, delta) => {
        // Smoothly interpolate camera position and look-at target
        state.camera.position.lerp(targetPosition, 0.5 * delta);
        
        // Ensure userData.lookAt exists before using it
        if (!state.camera.userData.lookAt) {
            state.camera.userData.lookAt = lookAtPosition.clone();
        }
        state.camera.userData.lookAt.lerp(lookAtPosition, 0.5 * delta);
        state.camera.lookAt(state.camera.userData.lookAt);
    });

    return null;
}

interface Experience3DProps {
  onSelectItem: (item: PortfolioItem | null) => void;
  selectedItem: PortfolioItem | null;
  genArtParams: GenArtParams;
  messages: ChatMessage[];
  onActivateChat: () => void;
  isChatActive: boolean;
}

export function Experience3D({ onSelectItem, selectedItem, genArtParams, messages, onActivateChat, isChatActive }: Experience3DProps) {
  return (
    <Canvas style={{ position: 'fixed', top: 0, left: 0, zIndex: 1 }} camera={{ position: [0, 2, 8], fov: 75 }}>
      <fog attach="fog" args={['#050505', 10, 30]} />
      <color attach="background" args={['#050505']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 0]} intensity={1.5} color="#00aaff" />
      <pointLight position={[0, 0, 10]} intensity={1.5} color="#ff477e" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <CuratorEntity onClick={onActivateChat} isChatActive={isChatActive}/>

      {isChatActive && <Conversation messages={messages} />}

      {PORTFOLIO_ITEMS.map(item => {
        if (item.id === 'generative-art') {
            return <GenerativeArtNode key={item.id} item={item} onSelectItem={onSelectItem} params={genArtParams} />
        }
        return <PortfolioNode key={item.id} item={item} onSelectItem={onSelectItem} />
      })}
      
       <CameraRig selectedItem={selectedItem} />

       <EffectComposer>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} intensity={1.2} />
       </EffectComposer>
    </Canvas>
  );
};
