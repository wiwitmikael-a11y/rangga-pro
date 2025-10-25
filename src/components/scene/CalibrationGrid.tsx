import React, { useMemo } from 'react';
import { Grid, Text } from '@react-three/drei';
import * as THREE from 'three';

interface CalibrationGridProps {
  size?: number;
}

const GRID_COLOR = '#00ffff'; // Cyan
const FADE_DISTANCE = 50;
const GRID_Y_POSITION = -3; // Positioned just above the terrain base

export const CalibrationGrid: React.FC<CalibrationGridProps> = ({ size = 250 }) => {
  const divisions = 25; // Increased from 10 to 25 for better coverage and granularity

  const gridConfig = {
    cellSize: size / divisions,
    cellThickness: 1,
    cellColor: new THREE.Color(GRID_COLOR).setScalar(0.2),
    sectionSize: size / divisions * 5, // Make major lines every 5 cells
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
    const labelOffset = cellSize / 2; // Offset to center the label within the cell

    // Alphabetical labels (A-Y) along the Z-axis
    for (let i = 0; i < divisions; i++) {
        const char = String.fromCharCode(65 + i);
        generatedLabels.push({
            key: `z-label-${i}`,
            text: char,
            position: [
                halfSize + cellSize, // Place label outside the grid for clarity
                GRID_Y_POSITION,
                -halfSize + i * cellSize + labelOffset // Center in the cell
            ],
        });
    }

    // Numerical labels (1-25) along the X-axis
    for (let i = 0; i < divisions; i++) {
        const num = i + 1;
        generatedLabels.push({
            key: `x-label-${i}`,
            text: num.toString(),
            position: [
                -halfSize + i * cellSize + labelOffset, // Center in the cell
                GRID_Y_POSITION,
                halfSize + cellSize // Place label outside the grid for clarity
            ],
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
                fontSize={3} // Slightly smaller font for more labels
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
