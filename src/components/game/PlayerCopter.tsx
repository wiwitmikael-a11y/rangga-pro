import React, { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { usePlayerControls } from '../../hooks/usePlayerControls';
import { ThrustTrail } from '../scene/ThrustTrail';

const PLAYER_MODEL_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/ship_copter.glb';

interface PlayerCopterProps {
    initialPosition: THREE.Vector3;
}

const MOVEMENT_SPEED = 20;
const ALTITUDE_SPEED = 15;
const ROTATION_SPEED = 2.5;

export const PlayerCopter = React.forwardRef<THREE.Group, PlayerCopterProps>(({ initialPosition }, _ref) => {
    const groupRef = useRef<THREE.Group>(null!);
    const { scene } = useGLTF(PLAYER_MODEL_URL);
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    const controls = usePlayerControls();
    
    const velocity = useMemo(() => new THREE.Vector3(), []);
    const rotationVelocity = useMemo(() => new THREE.Vector2(), []);
    const euler = useMemo(() => new THREE.Euler(0, 0, 0, 'YXZ'), []);
    const quaternion = useMemo(() => new THREE.Quaternion(), []);

    useFrame((_, delta) => {
        if (!groupRef.current) return;
        const { forward, backward, left, right, up, down } = controls.current;

        // --- Calculate velocity based on input ---
        const moveDirection = new THREE.Vector3(
            (left ? -1 : 0) + (right ? 1 : 0),
            (down ? -1 : 0) + (up ? 1 : 0),
            (forward ? -1 : 0) + (backward ? 1 : 0)
        ).normalize();
        
        const targetVelocity = new THREE.Vector3();
        targetVelocity.z = moveDirection.z * MOVEMENT_SPEED; // Forward/backward
        targetVelocity.y = moveDirection.y * ALTITUDE_SPEED; // Up/down
        
        // --- Smoothly interpolate velocity (damping) ---
        velocity.lerp(targetVelocity, delta * 10);

        // --- Apply velocity based on copter's current rotation ---
        const moveVector = new THREE.Vector3(0, velocity.y, velocity.z).applyQuaternion(groupRef.current.quaternion);
        groupRef.current.position.add(moveVector.multiplyScalar(delta));

        // --- Calculate rotation ---
        rotationVelocity.x = THREE.MathUtils.lerp(rotationVelocity.x, moveDirection.x * ROTATION_SPEED, delta * 5);
        euler.setFromQuaternion(groupRef.current.quaternion);
        euler.y -= rotationVelocity.x * delta;
        quaternion.setFromEuler(euler);
        groupRef.current.quaternion.slerp(quaternion, delta * 10);
    });

    return (
        <Suspense fallback={null}>
            <group ref={groupRef} position={initialPosition}>
                <primitive object={clonedScene} scale={0.08} rotation-y={Math.PI} />
                <ThrustTrail position={[0.7, -0.5, 0]} width={0.15} length={2} />
                <ThrustTrail position={[-0.7, -0.5, 0]} width={0.15} length={2} />
            </group>
        </Suspense>
    );
});

useGLTF.preload(PLAYER_MODEL_URL);