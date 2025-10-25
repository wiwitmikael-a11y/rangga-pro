import React, { useMemo } from 'react';
import { Grid, Text } from '@react-three/drei';
import * as THREE from 'three';

interface CalibrationGridProps {
  size?: number;
  divisions?: number;
}

const GRID_COLOR = '#00ffff'; // Cyan
const FADE_DISTANCE = 50;
const GRID_Y_POSITION = -3; // Positioned just above the terrain base

export const CalibrationGrid: React.FC<CalibrationGridProps> = ({ size = 200, divisions = 20 }) => {
  const gridConfig = {
    cellSize: size / divisions,
    cellThickness: 1,
    cellColor: new THREE.Color(GRID_COLOR).setScalar(0.2),
    sectionSize: size / divisions * 2,
    sectionThickness: 1.5,
    sectionColor: new THREE.Color(GRID_COLOR).setScalar(0.5),
    fadeDistance: FADE_DISTANCE,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: false,
  };
  
  const labels = useMemo(() => {
    const generatedLabels: { key: string, text: string, position: [number, number, number] }[] = [];
    const halfSize = size / 2;
    const cellSize = size / divisions;

    // Alphabetical labels (A, B, C...) along the Z-axis
    for (let i = 0; i <= divisions; i++) {
        const char = String.fromCharCode(65 + i); // 65 is ASCII for 'A'
        if (i > 9) break; // Limit to J for now
        generatedLabels.push({
            key: `z-label-${i}`,
            text: char,
            position: [halfSize + cellSize * 2, GRID_Y_POSITION, -halfSize + i * cellSize],
        });
    }

    // Numerical labels (1, 2, 3...) along the X-axis
    for (let i = 0; i <= divisions; i++) {
        if (i === 0 || i > 10) continue; // Skip 0, limit to 10
        generatedLabels.push({
            key: `x-label-${i}`,
            text: i.toString(),
            position: [-halfSize + (i - 1) * cellSize, GRID_Y_POSITION, halfSize + cellSize * 2],
        });
    }

    return generatedLabels;
  }, [size, divisions]);

  return (
    <group>
        <Grid position={[0, GRID_Y_POSITION, 0]} args={[size, size]} {...gridConfig} />
        {labels.map(label => (
            <Text
                key={label.key}
                position={label.position}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={4}
                color={GRID_COLOR}
                anchorX="center"
                anchorY="middle"
            >
                {label.text}
                <meshBasicMaterial
                    color={GRID_COLOR}
                    toneMapped={false}
                    transparent
                    opacity={0.7}
                />
            </Text>
        ))}
    </group>
  );
};