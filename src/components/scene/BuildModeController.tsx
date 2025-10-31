import React, { useMemo, useCallback } from 'react';
// FIX: Add side-effect import to ensure R3F's JSX types are globally available.
import '@react-three/fiber';
import { useThree, useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { CityDistrict } from '../../types';

interface BuildModeControllerProps {
    districts: CityDistrict[];
    setDistricts: React.Dispatch<React.SetStateAction<CityDistrict[]>>;
    heldDistrictId: string | null;
    onPlaceDistrict: () => void;
    gridSize: number;
    gridDivisions: number;
}

const GRID_Y_POSITION = -3; // Must match the visual grid's Y position

export const BuildModeController: React.FC<BuildModeControllerProps> = ({
    setDistricts,
    heldDistrictId,
    onPlaceDistrict,
    gridSize,
    gridDivisions
}) => {
    const { camera, raycaster, mouse } = useThree();
    
    // An invisible plane for raycasting mouse position in the 3D world
    const groundPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -(GRID_Y_POSITION + 5)), []);

    const intersectionPoint = useMemo(() => new THREE.Vector3(), []);
    
    const cellSize = useMemo(() => gridSize / gridDivisions, [gridSize, gridDivisions]);
    const halfGridSize = useMemo(() => gridSize / 2, [gridSize]);

    const snapToGrid = useCallback((point: THREE.Vector3) => {
        // Clamp the position to within the grid boundaries
        const clampedX = THREE.MathUtils.clamp(point.x, -halfGridSize, halfGridSize);
        const clampedZ = THREE.MathUtils.clamp(point.z, -halfGridSize, halfGridSize);
        
        // Snap to the nearest cell center
        const snappedX = Math.round(clampedX / cellSize) * cellSize;
        const snappedZ = Math.round(clampedZ / cellSize) * cellSize;
        
        return new THREE.Vector3(snappedX, 0, snappedZ); // Y will be the district's original Y
    }, [cellSize, halfGridSize]);

    useFrame(() => {
        if (!heldDistrictId) return;

        raycaster.setFromCamera(mouse, camera);
        if (raycaster.ray.intersectPlane(groundPlane, intersectionPoint)) {
            const snappedPosition = snapToGrid(intersectionPoint);
            
            setDistricts(prevDistricts =>
                prevDistricts.map(d => {
                    if (d.id === heldDistrictId) {
                        // Keep original height, but update X and Z
                        return { ...d, position: [snappedPosition.x, d.position[1], snappedPosition.z], isDirty: true };
                    }
                    return d;
                })
            );
        }
    });

    const handlePlace = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        if (heldDistrictId) {
            onPlaceDistrict();
        }
    }
    
    return (
        // This mesh acts as the invisible interactive floor for placing objects
        <mesh 
            visible={false} 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, GRID_Y_POSITION, 0]}
            onPointerDown={handlePlace}
        >
            <planeGeometry args={[gridSize, gridSize]} />
            <meshBasicMaterial />
        </mesh>
    );
};
