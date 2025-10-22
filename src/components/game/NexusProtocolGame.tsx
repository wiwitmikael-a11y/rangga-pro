// Fix: Add a type-only import to explicitly load TypeScript definitions for react-three-fiber,
// which extends the JSX namespace and allows using R3F elements like <group> and <mesh>.
import type { ThreeElements } from '@react-three/fiber';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import DataTrail from '../scene/DataTrail';

interface NexusProtocolGameProps {
  onGameComplete: () => void;
}

const NODE_COUNT = 5;
const CONNECTION_RADIUS = 15;

interface Node {
  id: number;
  position: THREE.Vector3;
  connected: boolean;
}

const GameNode: React.FC<{
  position: [number, number, number];
  isConnected: boolean;
  isTarget: boolean;
  onClick: () => void;
}> = ({ position, isConnected, isTarget, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const color = isConnected ? '#00ff00' : isTarget ? '#ffff00' : '#ff0000';
  const emissiveIntensity = isConnected || isTarget ? 2 : 1;

  useFrame(({ clock }) => {
      if (meshRef.current) {
          meshRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 2 + position[0]) * 0.5;
      }
  });

  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        toneMapped={false}
      />
    </mesh>
  );
};

const NexusProtocolGame: React.FC<NexusProtocolGameProps> = ({ onGameComplete }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [targetNodeIndex, setTargetNodeIndex] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won'>('playing');

  useEffect(() => {
    // Initialize nodes in a circle
    const newNodes: Node[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const angle = (i / NODE_COUNT) * Math.PI * 2;
      newNodes.push({
        id: i,
        position: new THREE.Vector3(
          Math.cos(angle) * CONNECTION_RADIUS,
          5,
          Math.sin(angle) * CONNECTION_RADIUS
        ),
        connected: false,
      });
    }
    setNodes(newNodes);
  }, []);

  const handleNodeClick = (clickedIndex: number) => {
    if (gameStatus !== 'playing' || clickedIndex !== targetNodeIndex) return;

    const newNodes = [...nodes];
    newNodes[clickedIndex].connected = true;
    setNodes(newNodes);

    if (targetNodeIndex === NODE_COUNT - 1) {
      setGameStatus('won');
      setTimeout(onGameComplete, 2000);
    } else {
      setTargetNodeIndex(targetNodeIndex + 1);
    }
  };
  
  const linePoints = useMemo(() => {
      const points: THREE.Vector3[] = [new THREE.Vector3(0,5,0)];
      for(let i = 0; i < targetNodeIndex; i++) {
          if (nodes[i]?.connected) {
              points.push(nodes[i].position);
          }
      }
       if (nodes[targetNodeIndex]?.connected) {
           points.push(nodes[targetNodeIndex].position);
       }
      return points;
  }, [nodes, targetNodeIndex]);


  return (
    <group>
      <DataTrail />
      {nodes.map((node, index) => (
        <GameNode
          key={node.id}
          position={node.position.toArray()}
          isConnected={node.connected}
          isTarget={index === targetNodeIndex && gameStatus === 'playing'}
          onClick={() => handleNodeClick(index)}
        />
      ))}
      <line>
          <bufferGeometry setFromPoints={linePoints} />
          <lineBasicMaterial color="#00ffff" linewidth={3} />
      </line>
      {gameStatus === 'won' && (
          <Text position={[0, 15, 0]} fontSize={2} color="#00ff00">
              NEXUS ESTABLISHED
          </Text>
      )}
       <Text position={[0, 20, 0]} fontSize={1} color="white" anchorY="top" textAlign="center">
         Connect the data nodes in sequence to establish the nexus protocol.
       </Text>
    </group>
  );
};

export default NexusProtocolGame;
