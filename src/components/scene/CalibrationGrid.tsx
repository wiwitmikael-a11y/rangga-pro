import React from 'react';
import { Grid } from '@react-three/drei';
import * as THREE from 'three';

interface CalibrationGridProps {
  size?: number;
}

const GRID_COLOR = '#00ffff'; // Cyan
const FADE_DISTANCE = 50;
const GRID_Y_POSITION = -3; // Positioned just above the terrain base

export const CalibrationGrid: React.FC<CalibrationGridProps> = ({ size = 250 }) => {
  const divisions = 25;

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

  return (
    <group>
        <Grid position={[0, GRID_Y_POSITION, 0]} args={[size, size]} {...gridConfig} />
    </group>
  );
};
