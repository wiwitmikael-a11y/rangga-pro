import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

// Placeholder for enemy drone model
export const EnemyDrone: React.FC<{position: [number, number, number]}> = ({position}) => {
    const { scene } = useGLTF('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/enemy_drone.glb');
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    return <primitive object={clonedScene} position={position} scale={4} />;
};

useGLTF.preload('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/enemy_drone.glb');