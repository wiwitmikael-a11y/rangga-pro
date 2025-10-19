import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
// `PointLight` is not exported from `drei`. Use the R3F primitive `<pointLight />` instead.
import { Trail } from '@react-three/drei';
import * as THREE from 'three';

const Vehicle: React.FC<{ curve: THREE.CatmullRomCurve3, speed: number, offset: number }> = ({ curve, speed, offset }) => {
    const lightRef = useRef<THREE.PointLight>(null!);

    useFrame(({ clock }) => {
        const time = (clock.getElapsedTime() * speed + offset) % 1;
        const pos = curve.getPointAt(time);
        lightRef.current.position.copy(pos);
    });

    return (
        <group>
            <Trail
                width={0.5}
                length={4}
                color={new THREE.Color(Math.random(), Math.random(), Math.random())}
                attenuation={(t) => t * t}
            >
                <pointLight ref={lightRef} intensity={2} distance={2} />
            </Trail>
        </group>
    );
};


export const FlyingVehicles = () => {
    const numVehicles = 30;

    const curves = useMemo(() => {
        return Array.from({ length: numVehicles }).map(() => {
            const points = [];
            const radius = 6 + Math.random() * 8;
            for (let i = 0; i <= 16; i++) {
                points.push(
                    new THREE.Vector3(
                        Math.sin(i / 16 * Math.PI * 2) * radius,
                        (Math.random() - 0.5) * 10,
                        Math.cos(i / 16 * Math.PI * 2) * radius
                    )
                );
            }
            return new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.5);
        });
    }, [numVehicles]);

    return (
        <group>
            {curves.map((curve, i) => (
                <Vehicle 
                    key={i} 
                    curve={curve} 
                    speed={0.05 + Math.random() * 0.05} 
                    offset={Math.random()} 
                />
            ))}
        </group>
    );
};
