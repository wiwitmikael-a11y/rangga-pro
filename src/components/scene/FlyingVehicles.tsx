
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Trail } from '@react-three/drei';
import * as THREE from 'three';

const Vehicle: React.FC<{ curve: THREE.CatmullRomCurve3, speed: number, offset: number }> = ({ curve, speed, offset }) => {
    const lightRef = useRef<THREE.PointLight>(null!);

    useFrame(({ clock }) => {
        const time = (clock.getElapsedTime() * speed + offset) % 1;
        const pos = curve.getPointAt(time);
        if(lightRef.current) {
            lightRef.current.position.copy(pos);
        }
    });

    return (
        <group>
            <Trail
                width={0.4}
                length={3}
                color={new THREE.Color().setHSL(Math.random(), 0.8, 0.6)}
                attenuation={(t) => t * t}
            >
                <pointLight ref={lightRef} intensity={1.5} distance={2} />
            </Trail>
        </group>
    );
};


export const FlyingVehicles = () => {
    const numVehicles = 12; // Reduced from 30

    const curves = useMemo(() => {
        return Array.from({ length: numVehicles }).map(() => {
            const points = [];
            const radius = 7 + Math.random() * 8;
            for (let i = 0; i <= 16; i++) {
                points.push(
                    new THREE.Vector3(
                        Math.sin(i / 16 * Math.PI * 2) * radius,
                        (Math.random() - 0.5) * 8,
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
                    speed={0.02 + Math.random() * 0.02} // Reduced speed
                    offset={Math.random()} 
                />
            ))}
        </group>
    );
};
