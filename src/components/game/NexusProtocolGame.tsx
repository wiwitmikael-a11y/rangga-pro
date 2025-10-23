// FIX: Added the triple-slash directive to provide types for R3F's custom JSX elements, resolving "Property does not exist on type 'JSX.IntrinsicElements'" errors.
/// <reference types="@react-three/fiber" />
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

interface NexusProtocolGameProps {
  onGameComplete: () => void;
}

const COLORS = ['#ff4444', '#44ff44', '#4444ff', '#ffff44'];
const SEQUENCE_LENGTH = 5;

const GameNode: React.FC<{
  position: [number, number, number];
  color: string;
  onClick: () => void;
  isLit: boolean;
}> = ({ position, color, onClick, isLit }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      const targetIntensity = isLit ? 3 : 0.5;
      material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, targetIntensity, delta * 20);
    }
  });

  return (
    <Box
      ref={meshRef}
      args={[2, 2, 2]}
      position={position}
      onClick={onClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </Box>
  );
};


const NexusProtocolGame: React.FC<NexusProtocolGameProps> = ({ onGameComplete }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'WATCH' | 'PLAY' | 'WIN' | 'LOSE'>('WATCH');
  const [litNode, setLitNode] = useState<number | null>(null);

  const nodePositions: [number, number, number][] = useMemo(() => [
    [-3, 0, 0], [3, 0, 0], [0, 0, -3], [0, 0, 3]
  ], []);

  const generateSequence = useCallback(() => {
    const newSequence = Array.from({ length: SEQUENCE_LENGTH }, () => Math.floor(Math.random() * COLORS.length));
    setSequence(newSequence);
  }, []);
  
  useEffect(() => {
    generateSequence();
  }, [generateSequence]);

  useEffect(() => {
    if (gameState === 'WATCH' && sequence.length > 0) {
      let i = 0;
      const interval = setInterval(() => {
        setLitNode(sequence[i]);
        setTimeout(() => setLitNode(null), 400);
        i++;
        if (i >= sequence.length) {
          clearInterval(interval);
          setTimeout(() => setGameState('PLAY'), 500);
        }
      }, 800);
      return () => clearInterval(interval);
    }
  }, [gameState, sequence]);
  
  useEffect(() => {
    if (gameState !== 'PLAY') return;

    if (playerSequence.length > 0) {
        const index = playerSequence.length - 1;
        if (sequence[index] !== playerSequence[index]) {
            setGameState('LOSE');
            return;
        }
    }
    
    if (playerSequence.length === sequence.length && sequence.length > 0) {
      setGameState('WIN');
    }
  }, [playerSequence, sequence, gameState]);

  const handleNodeClick = (index: number) => {
    if (gameState !== 'PLAY') return;
    setPlayerSequence(prev => [...prev, index]);
    setLitNode(index);
    setTimeout(() => setLitNode(null), 200);
  };
  
  const handleReset = () => {
      generateSequence();
      setPlayerSequence([]);
      setGameState('WATCH');
  }

  return (
    <group position={[0, 10, 0]}>
      <Text position={[0, 5, 0]} fontSize={1} color="white" anchorX="center">
        NEXUS PROTOCOL
      </Text>
      
      {nodePositions.map((pos, i) => (
        <GameNode
          key={i}
          position={pos}
          color={COLORS[i]}
          onClick={() => handleNodeClick(i)}
          isLit={litNode === i}
        />
      ))}
      
      {gameState === 'WIN' && (
        <Text position={[0, -4, 0]} fontSize={0.8} color="#44ff44" anchorX="center" onClick={onGameComplete}>
          ACCESS GRANTED! (Click to Continue)
        </Text>
      )}
      {gameState === 'LOSE' && (
        <Text position={[0, -4, 0]} fontSize={0.8} color="#ff4444" anchorX="center" onClick={handleReset}>
          SEQUENCE FAILED! (Click to Retry)
        </Text>
      )}
       {gameState === 'WATCH' && (
        <Text position={[0, -4, 0]} fontSize={0.6} color="white" anchorX="center">
          ...OBSERVE SEQUENCE...
        </Text>
      )}
       {gameState === 'PLAY' && (
        <Text position={[0, -4, 0]} fontSize={0.6} color="white" anchorX="center">
          ...REPEAT SEQUENCE...
        </Text>
      )}
    </group>
  );
};

export default NexusProtocolGame;