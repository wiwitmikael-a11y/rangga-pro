import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const ENEMY_MODEL_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/PatrollingCore.glb';
const ENEMY_SCALE = 3;

interface EnemyCoreProps {
    position: [number, number, number];
}

export const EnemyCore: React.FC<EnemyCoreProps> = ({ position }) => {
    const { scene } = useGLTF(ENEMY_MODEL_URL);
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    const enemyColor = useMemo(() => new THREE.Color('#ff2222'), []);

    useLayoutEffect(() => {
        clonedScene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material.emissive = enemyColor;
                child.material.emissiveIntensity = 2;
                child.material.color = enemyColor;
            }
        });
    }, [clonedScene, enemyColor]);

    return (
        <primitive 
            object={clonedScene}
            position={position}
            scale={ENEMY_SCALE}
        />
    );
};

useGLTF.preload(ENEMY_MODEL_URL);