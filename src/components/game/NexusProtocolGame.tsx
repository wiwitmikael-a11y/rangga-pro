import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

const TILE_SIZE = 2;
const TILE_GAP = 0.2;
const GRID_SIZE = 5;

// 0 = empty, 1 = path, S = start, E = end
const puzzleGrid = [
    ['S', 1, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 0, 'E'],
];

interface NexusProtocolGameProps {
    onUnlock: () => void;
}


const Tile: React.FC<{ type: string | number; position: [number, number, number] }> = ({ type, position }) => {
    let color = '#1a2a4a'; // Base color
    let emissive = '#000000';
    let emissiveIntensity = 0;

    if (type === 1) { // Path
        color = '#00ffff';
        emissive = '#00ffff';
        emissiveIntensity = 1;
    } else if (type === 'S' || type === 'E') { // Start/End
        color = '#ff00ff';
        emissive = '#ff00ff';
        emissiveIntensity = 2;
    }

    return (
        <Box args={[TILE_SIZE, 0.5, TILE_SIZE]} position={position}>
            <meshStandardMaterial 
                color={color} 
                emissive={emissive} 
                emissiveIntensity={emissiveIntensity}
                toneMapped={false}
                roughness={0.3}
                metalness={0.7}
            />
        </Box>
    );
};


const NexusProtocolGame: React.FC<NexusProtocolGameProps> = ({ onUnlock }) => {
    const groupRef = useRef<THREE.Group>(null!);
    const [unlocked, setUnlocked] = useState(false);

    useFrame((state) => {
        if(groupRef.current) {
            groupRef.current.position.y = 15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
            groupRef.current.rotation.y += 0.002;
        }
    });

    const handleClick = () => {
        if (!unlocked) {
            onUnlock();
            setUnlocked(true);
            // Add visual feedback for unlocking
        }
    };

    const offset = -((GRID_SIZE * (TILE_SIZE + TILE_GAP)) - TILE_GAP) / 2 + TILE_SIZE / 2;

    return (
        <group ref={groupRef} onClick={handleClick} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
             <Text
                position={[0, 7, 0]}
                fontSize={0.8}
                color={unlocked ? "#00ffaa" : "#ffff00"}
                anchorX="center"
                textAlign="center"
                maxWidth={20}
            >
               {unlocked ? "DATASTREAMS DECRYPTED" : "CLICK BOARD TO DECRYPT THE VAULT"}
            </Text>
            {puzzleGrid.map((row, z) => 
                row.map((tileType, x) => (
                    <Tile
                        key={`${x}-${z}`}
                        type={tileType}
                        position={[
                            x * (TILE_SIZE + TILE_GAP) + offset,
                            0,
                            z * (TILE_SIZE + TILE_GAP) + offset
                        ]}
                    />
                ))
            )}
        </group>
    );
};

export default NexusProtocolGame;