import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Stars, MeshDistortMaterial, Billboard, Sparkles, Trail, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom, GodRays } from '@react-three/postprocessing';
import * as THREE from 'three';
import { PortfolioItem, GenArtParams, ChatMessage } from '../types';
import { PORTFOLIO_ITEMS } from '../constants';

// --- Building Components ---
const buildingMaterial = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0.1,
    roughness: 0.2,
    metalness: 0.8,
});

const PortfolioBuilding: React.FC<{ item: PortfolioItem; onSelectItem: (item: PortfolioItem) => void; isSelected: boolean; }> = ({ item, onSelectItem, isSelected }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const buildingHeight = item.category === 'Left Brain / Logic' ? 8 : 6;
  
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(1, 0.5);
    shape.lineTo(1.5, 2);
    shape.lineTo(0.5, 2.5);
    shape.lineTo(-0.5, 2);
    shape.lineTo(0, 0);
    const extrudeSettings = { depth: buildingHeight, bevelEnabled: false };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [buildingHeight]);

  useFrame((state, delta) => {
    if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.05;
        const targetScale = isSelected ? 1.2 : (hovered ? 1.1 : 1);
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);
    }
  });

  return (
    <group 
        position={[item.position3D[0], item.position3D[1] - 2, item.position3D[2]]}
        ref={groupRef}
        onClick={() => onSelectItem(item)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
    >
      <mesh geometry={geometry} material={buildingMaterial} />
      <mesh geometry={geometry} scale={[0.95, 0.95, 0.95]}>
          <meshStandardMaterial color={item.color} emissive={item.color} emissiveIntensity={isSelected ? 3 : (hovered ? 2 : 1)} toneMapped={false} />
      </mesh>
      <Text position={[0, buildingHeight / 2 + 2, 0]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
        {item.title}
      </Text>
    </group>
  );
};

const GenerativeArtBuilding: React.FC<{ item: PortfolioItem; onSelectItem: (item: PortfolioItem) => void; params: GenArtParams; isSelected: boolean }> = ({ item, onSelectItem, params, isSelected }) => {
    const groupRef = useRef<THREE.Group>(null!);
    const [hovered, setHovered] = useState(false);
  
    useFrame((state, delta) => {
        const targetScale = isSelected ? 1.2 : (hovered ? 1.1 : 1);
        if(groupRef.current) {
            groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);
            groupRef.current.rotation.y += delta * 0.1;
        }
    });
  
    return (
      <group 
        position={[item.position3D[0], item.position3D[1] + 1, item.position3D[2]]}
        ref={groupRef}
        onClick={() => onSelectItem(item)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh>
          <sphereGeometry args={[2, 128, 128]} />
          <MeshDistortMaterial
              key={JSON.stringify(params)} 
              color={params.color}
              distort={params.distort}
              speed={params.speed}
              roughness={0.1}
              emissive={params.color}
              emissiveIntensity={isSelected ? 3 : 1.5}
              toneMapped={false}
          />
        </mesh>
        <Text position={[0, 3, 0]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
          {item.title}
        </Text>
      </group>
    );
};

// --- World and Atmosphere ---
const CuratorEntity: React.FC<{ onClick: () => void; isChatActive: boolean; isLoading: boolean; isListening: boolean; ref: React.Ref<THREE.Group> }> = React.forwardRef(({ onClick, isChatActive, isLoading, isListening }, ref) => {
    const innerCoreRef = useRef<THREE.Mesh>(null!);

    useFrame((state, delta) => {
        const group = (ref as React.RefObject<THREE.Group>).current;
        if(group && innerCoreRef.current) {
            const pulseSpeed = isLoading ? 8 : 2;
            const pulse = Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.05 + 1;
            group.scale.set(pulse, pulse, pulse);
            group.rotation.y += 0.01;
            group.rotation.x += 0.005;

            const coreMaterial = innerCoreRef.current.material as THREE.MeshStandardMaterial;
            const targetIntensity = isListening ? 3 : 1;
            coreMaterial.emissiveIntensity += (targetIntensity - coreMaterial.emissiveIntensity) * (delta * 5);
        }
    });

    return (
        <group ref={ref} onClick={onClick}>
            {isLoading && <Sparkles count={50} scale={4} size={8} speed={0.4} color="#00aaff" />}
            <mesh rotation-x={Math.PI / 2}>
                <octahedronGeometry args={[2, 0]} />
                <meshStandardMaterial 
                    color="#ffffff" 
                    emissive="#00aaff" 
                    emissiveIntensity={isChatActive ? 2 : 1}
                    transparent 
                    opacity={0.2} 
                    roughness={0.1}
                    wireframe
                />
            </mesh>
            <mesh ref={innerCoreRef} scale={[0.5, 0.5, 0.5]}>
                 <icosahedronGeometry args={[1, 1]} />
                 <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} roughness={0} toneMapped={false}/>
            </mesh>
        </group>
    )
});

const Conversation: React.FC<{ messages: ChatMessage[] }> = ({ messages }) => {
    return (
        <group position={[0, 1.5, 4]}>
            {messages.map((msg, index) => (
                <Billboard key={msg.id} position={[msg.sender === 'user' ? 2 : -2, (messages.length - 1 - index) * 0.8, 0]}>
                    <mesh position={[0, 0, -0.01]}>
                        <planeGeometry args={[4.2, 0.7]} />
                        <meshBasicMaterial color="black" transparent opacity={0.5} />
                    </mesh>
                    <Text
                        fontSize={0.25}
                        color={msg.sender === 'user' ? '#87CEFA' : '#FFFFFF'}
                        anchorX={msg.sender === 'user' ? 'left' : 'right'}
                        anchorY="middle"
                        textAlign={msg.sender === 'user' ? 'left' : 'right'}
                        maxWidth={4}
                        lineHeight={1.4}
                    >
                        {msg.text}
                    </Text>
                </Billboard>
            ))}
        </group>
    )
}

const FlyingVehicle: React.FC<{ curve: THREE.CatmullRomCurve3, speed: number, offset: number, color: string }> = ({ curve, speed, offset, color }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    
    useFrame((state) => {
        if(meshRef.current) {
            const t = (state.clock.getElapsedTime() * speed + offset) % 1;
            const pos = curve.getPointAt(t);
            meshRef.current.position.copy(pos);
            const tangent = curve.getTangentAt(t);
            meshRef.current.lookAt(pos.clone().add(tangent));
        }
    });

    const geometry = useMemo(() => {
        const geometries = [
            new THREE.BoxGeometry(0.1, 0.1, 0.5),
            new THREE.ConeGeometry(0.15, 0.5, 3),
            new THREE.DodecahedronGeometry(0.2, 0)
        ];
        return geometries[Math.floor(Math.random() * geometries.length)];
    }, []);

    return (
        <group>
            <Trail width={0.2} length={5} color={new THREE.Color(color)} attenuation={(t) => t * t}>
                <mesh ref={meshRef}>
                    <primitive object={geometry} />
                    <meshStandardMaterial emissive={color} color={color} toneMapped={false} />
                </mesh>
            </Trail>
        </group>
    )
};


const Cityscape = () => {
    const circuitTexture = useTexture('https://aistudiocdn.com/Human-V1/circuit_board.png');
    circuitTexture.wrapS = circuitTexture.wrapT = THREE.RepeatWrapping;
    circuitTexture.repeat.set(10, 10);

    const curves = useMemo(() => {
        return Array.from({ length: 5 }, () => {
            const points = [];
            for (let i = 0; i < 10; i++) {
                points.push(new THREE.Vector3(
                    (Math.random() - 0.5) * 40,
                    Math.random() * 10 + 2,
                    (Math.random() - 0.5) * 40
                ));
            }
            return new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.5);
        });
    }, []);

    return (
        <group>
            {/* Ground */}
            <mesh position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial 
                  map={circuitTexture} 
                  emissiveMap={circuitTexture} 
                  emissive={new THREE.Color("#00aaff")} 
                  emissiveIntensity={0.5}
                  toneMapped={false}
                />
            </mesh>
            {/* Flying Vehicles */}
            {curves.map((curve, i) => (
                Array.from({ length: 5 }).map((_, j) => (
                    <FlyingVehicle key={`${i}-${j}`} curve={curve} speed={0.05 + Math.random() * 0.05} offset={j * 0.2} color={['#ff477e', '#00f5d4', '#e047ff'][i % 3]}/>
                ))
            ))}
            {/* Ambient Characters */}
            {Array.from({ length: 50 }).map((_, i) => (
                 <mesh key={i} position={[(Math.random() - 0.5) * 50, -2, (Math.random() - 0.5) * 50]}>
                     <boxGeometry args={[0.2, 1, 0.2]} />
                     <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
                 </mesh>
            ))}
        </group>
    );
};


function CameraRig({ selectedItem, isChatActive }: { selectedItem: PortfolioItem | null, isChatActive: boolean }) {
    const { camera, clock } = useThree();
    const cinematicTime = useRef(0);
    
    const targetPosition = useMemo(() => {
        if (selectedItem) {
            const itemPos = new THREE.Vector3(...selectedItem.position3D);
            const camPos = itemPos.clone();
            camPos.y += 4;
            camPos.x += Math.sign(camPos.x) * 5;
            camPos.z += Math.sign(camPos.z) * 5;
            return camPos;
        }
         // If chat is active but nothing selected, focus on curator
        if (isChatActive) {
            return new THREE.Vector3(0, 3, 8);
        }
        // Default cinematic view
        return new THREE.Vector3();
    }, [selectedItem, isChatActive]);

    const lookAtPosition = useMemo(() => {
        return selectedItem ? new THREE.Vector3(selectedItem.position3D[0], selectedItem.position3D[1] + 2, selectedItem.position3D[2]) : new THREE.Vector3(0, 1, 0);
    }, [selectedItem]);
    
    useFrame((state, delta) => {
        let finalTargetPosition = targetPosition;
        if (!selectedItem && !isChatActive) {
            // Cinematic camera movement
            cinematicTime.current += delta * 0.05;
            const angle = cinematicTime.current;
            finalTargetPosition = new THREE.Vector3(Math.sin(angle) * 18, 5, Math.cos(angle) * 18);
        }

        state.camera.position.lerp(finalTargetPosition, 1 * delta);
        
        if (!state.camera.userData.lookAt) state.camera.userData.lookAt = lookAtPosition.clone();
        
        state.camera.userData.lookAt.lerp(lookAtPosition, 1 * delta);
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
    const curatorRef = useRef<THREE.Group>(null!);
    const [godRaysSource, setGodRaysSource] = useState<THREE.Group | null>(null);
    useEffect(() => setGodRaysSource(curatorRef.current), [curatorRef]);

  return (
    <Canvas style={{ position: 'fixed', top: 0, left: 0, zIndex: 1 }} camera={{ position: [0, 5, 20], fov: 75 }}>
      <fog attach="fog" args={['#050505', 15, 50]} />
      <color attach="background" args={['#050505']} />
      <ambientLight intensity={0.1} />
      <Stars radius={200} depth={100} count={8000} factor={6} saturation={0} fade speed={1} />

      <Cityscape />
      
      <CuratorEntity ref={curatorRef} onClick={onActivateChat} isChatActive={isChatActive} isLoading={isCuratorLoading} isListening={isListening} />

      {isChatActive && <Conversation messages={messages} />}

      {PORTFOLIO_ITEMS.map(item => {
        const isSelected = selectedItem?.id === item.id;
        if (item.id === 'generative-art') {
            return <GenerativeArtBuilding key={item.id} item={item} onSelectItem={onSelectItem} params={genArtParams} isSelected={isSelected} />
        }
        return <PortfolioBuilding key={item.id} item={item} onSelectItem={onSelectItem} isSelected={isSelected}/>
      })}
      
       <CameraRig selectedItem={selectedItem} isChatActive={isChatActive} />

       <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.8} />
        {godRaysSource && <GodRays sun={godRaysSource} config={{
            samples: 60,
            density: 0.97,
            decay: 0.97,
            weight: 0.6,
            exposure: 0.4
        }}/>}
       </EffectComposer>
    </Canvas>
  );
};