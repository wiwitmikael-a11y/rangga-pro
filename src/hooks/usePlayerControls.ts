import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const useInput = () => {
    const keys = useRef<{ [key: string]: boolean }>({}).current;
    useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => (keys[e.code] = true);
      const onKeyUp = (e: KeyboardEvent) => (keys[e.code] = false);
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
      return () => {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
      };
    }, [keys]);
    return keys;
};

export const usePlayerControls = (enabled: boolean) => {
    const { camera, gl } = useThree();
    const keys = useInput();
    const velocity = useRef(new THREE.Vector3()).current;
    const moveSpeed = 20;

    useEffect(() => {
        if (!enabled) {
            if (document.pointerLockElement) {
                document.exitPointerLock();
            }
            return;
        }

        const handlePointerLockChange = () => {
            if (document.pointerLockElement !== gl.domElement) {
                // Logic if pointer lock is lost, maybe pause game
            }
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (document.pointerLockElement === gl.domElement) {
                const euler = new THREE.Euler(0, 0, 0, 'YXZ');
                euler.setFromQuaternion(camera.quaternion);
                euler.y -= event.movementX * 0.002;
                euler.x -= event.movementY * 0.002;
                euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
                camera.quaternion.setFromEuler(euler);
            }
        };

        const handleClick = () => {
            gl.domElement.requestPointerLock();
        };

        gl.domElement.addEventListener('click', handleClick);
        document.addEventListener('pointerlockchange', handlePointerLockChange);
        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            gl.domElement.removeEventListener('click', handleClick);
            document.removeEventListener('pointerlockchange', handlePointerLockChange);
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [enabled, camera, gl.domElement]);

    useFrame((_, delta) => {
        if (!enabled || !document.pointerLockElement) {
            velocity.set(0, 0, 0); // Stop movement if not active
            return;
        }

        const forward = keys['KeyW'] || keys['ArrowUp'] ? 1 : 0;
        const backward = keys['KeyS'] || keys['ArrowDown'] ? 1 : 0;
        const left = keys['KeyA'] || keys['ArrowLeft'] ? 1 : 0;
        const right = keys['KeyD'] || keys['ArrowRight'] ? 1 : 0;
        
        const direction = new THREE.Vector3();
        direction.z = backward - forward;
        direction.x = right - left;
        direction.normalize(); // Ensure consistent speed in all directions

        // Apply movement relative to camera direction
        const moveVector = new THREE.Vector3();
        moveVector.copy(direction).applyQuaternion(camera.quaternion);

        const targetVelocity = moveVector.multiplyScalar(moveSpeed);
        velocity.lerp(targetVelocity, 0.2); // Smooth acceleration
        
        camera.position.add(velocity.clone().multiplyScalar(delta));
    });
};
