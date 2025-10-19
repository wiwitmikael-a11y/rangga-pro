import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Stars, MeshDistortMaterial, Grid, Billboard, Sparkles } from '@react-three/drei';
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

const CuratorEntity: React.FC<{ onClick: () => void; isChatActive: boolean; isLoading: boolean; isListening: boolean; }> = ({ onClick, isChatActive, isLoading, isListening }) => {
    const groupRef = useRef<THREE.Group>(null!);
    const innerCoreRef = useRef<THREE.Mesh>(null!);

    useFrame((state, delta) => {
        if(groupRef.current && innerCoreRef.current) {
            const pulseSpeed = isLoading ? 5 : 1.5;
            const pulse = Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.1 + 1;
            groupRef.current.scale.set(pulse, pulse, pulse);
            groupRef.current.rotation.y += 0.005;

            // Visual feedback for listening
            const coreMaterial = innerCoreRef.current.material as THREE.MeshStandardMaterial;
            const targetIntensity = isListening ? 2.5 : 1;
            coreMaterial.emissiveIntensity += (targetIntensity - coreMaterial.emissiveIntensity) * (delta * 5);

            // Look towards camera when listening
            const cameraPosition = state.camera.position;
            const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(
                new THREE.Matrix4().lookAt(groupRef.current.position, cameraPosition, groupRef.current.up)
            );
            groupRef.current.quaternion.slerp(targetQuaternion, delta * 2);
        }
    });

    return (
        <group ref={groupRef} onClick={onClick}>
            {isLoading && <Sparkles count={40} scale={2.5} size={6} speed={0.4} color="#00aaff" />}
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
            <mesh ref={innerCoreRef} scale={[0.5, 0.5, 0.5]}>
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
                <Billboard key={msg.id} position={[msg.sender === 'user' ? 1.5 : -1.5, (messages.length - 1 - index) * 0.6, 0]}>
                    <mesh position={[0, 0, -0.01]}>
                        <planeGeometry args={[3.2, 0.5]} />
                        <meshBasicMaterial color="black" transparent opacity={0.3} />
                    </mesh>
                    <Text
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
                </Billboard>
            ))}
        </group>
    )
}

function CameraRig({ selectedItem, isChatActive }: { selectedItem: PortfolioItem | null, isChatActive: boolean }) {
    const viewport = useThree((state) => state.viewport);
    
    const targetPosition = useMemo(() => {
        if (selectedItem) {
            const itemPos = new THREE.Vector3(...selectedItem.position3D);
            const camPos = itemPos.clone().normalize().multiplyScalar(itemPos.length() + 4);
            camPos.y = Math.max(camPos.y, 1.5);
            return camPos;
        }
        // If chat is active, pull back slightly for a better view
        return new THREE.Vector3(0, 2, isChatActive ? 10 : 8);
    }, [selectedItem, isChatActive]);

    const lookAtPosition = useMemo(() => {
        return selectedItem ? new THREE.Vector3(...selectedItem.position3D) : new THREE.Vector3(0, 0, 0);
    }, [selectedItem]);
    
    const mouseLookRef = useRef(new THREE.Vector3());

    useFrame((state, delta) => {
        // Mouse-look effect
        const mouseX = state.pointer.x * (viewport.width / 20);
        const mouseY = state.pointer.y * (viewport.height / 20);
        mouseLookRef.current.lerp(new THREE.Vector3(mouseX, mouseY, 0), delta * 2);

        // Smoothly interpolate camera position and look-at target
        state.camera.position.lerp(targetPosition, 2 * delta);
        
        if (!state.camera.userData.lookAt) {
            state.camera.userData.lookAt = lookAtPosition.clone();
        }
        state.camera.userData.lookAt.lerp(lookAtPosition, 2 * delta);

        const finalLookAt = state.camera.userData.lookAt.clone().add(mouseLookRef.current);
        state.camera.lookAt(finalLookAt);
    });

    return null;
}

const Ground = () => (
    <Grid
        position={[0, -2, 0]}
        args={[100, 100]}
        infiniteGrid
        fadeDistance={50}
        fadeStrength={2}
        cellSize={1}
        sectionSize={5}
        sectionColor={new THREE.Color('#00aaff')}
        cellColor={new THREE.Color('#ffffff')}
        cellThickness={0.5}
        sectionThickness={1}
        backgroundOpacity={0}
    />
)

interface Experience3DProps {
  onSelectItem: (item: PortfolioItem | null) => void;
  selectedItem: PortfolioItem | null;
  genArtParams: GenArtParams;
  messages: ChatMessage[];
  onActivateChat: () => void;
  isChatActive: boolean;
  isCuratorLoading: boolean;
  isListening: boolean;
}

export function Experience3D({ 
    onSelectItem, 
    selectedItem, 
    genArtParams, 
    messages, 
    onActivateChat, 
    isChatActive,
    isCuratorLoading,
    isListening
}: Experience3DProps) {
  return (
    <Canvas style={{ position: 'fixed', top: 0, left: 0, zIndex: 1 }} camera={{ position: [0, 2, 8], fov: 75 }}>
      <fog attach="fog" args={['#050505', 10, 40]} />
      <color attach="background" args={['#050505']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 0]} intensity={1.5} color="#00aaff" />
      <pointLight position={[0, 0, 10]} intensity={1.5} color="#ff477e" />
      <Stars radius={200} depth={100} count={8000} factor={6} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={20} size={1} speed={0.2} color="#555" />
      
      <CuratorEntity onClick={onActivateChat} isChatActive={isChatActive} isLoading={isCuratorLoading} isListening={isListening} />

      {isChatActive && <Conversation messages={messages} />}

      {PORTFOLIO_ITEMS.map(item => {
        if (item.id === 'generative-art') {
            return <GenerativeArtNode key={item.id} item={item} onSelectItem={onSelectItem} params={genArtParams} />
        }
        return <PortfolioNode key={item.id} item={item} onSelectItem={onSelectItem} />
      })}
      
      <Ground />
       <CameraRig selectedItem={selectedItem} isChatActive={isChatActive} />

       <EffectComposer>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} intensity={1.5} />
       </EffectComposer>
    </Canvas>
  );
};