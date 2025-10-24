import React, { useMemo } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
// Vendored simplex-noise library to avoid adding new dependencies.
// Source: https://github.com/jwagner/simplex-noise.js
const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

const grad3 = new Float32Array([1, 1, 0,
  -1, 1, 0,
  1, -1, 0,

  -1, -1, 0,
  1, 0, 1,
  -1, 0, 1,

  1, 0, -1,
  -1, 0, -1,
  0, 1, 1,

  0, -1, 1,
  0, 1, -1,
  0, -1, -1]);

function createNoise2D(random: () => number = Math.random) {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    let n;
    let q;
    for (let i = 255; i > 0; i--) {
        n = Math.floor((i + 1) * random());
        q = p[i];
        p[i] = p[n];
        p[n] = q;
    }
    const perm = new Uint8Array(512);
    const permMod12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
        perm[i] = p[i & 255];
        permMod12[i] = perm[i] % 12;
    }

    return (x: number, y: number): number => {
        let n0 = 0, n1 = 0, n2 = 0;
        const s = (x + y) * F2;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = x - X0;
        const y0 = y - Y0;
        let i1, j1;
        if (x0 > y0) {
            i1 = 1; j1 = 0;
        } else {
            i1 = 0; j1 = 1;
        }
        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1.0 + 2.0 * G2;
        const y2 = y0 - 1.0 + 2.0 * G2;
        const ii = i & 255;
        const jj = j & 255;
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
            t0 *= t0;
            const gi0 = permMod12[ii + perm[jj]] * 3;
            n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0);
        }
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
            t1 *= t1;
            const gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
            n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
        }
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
            t2 *= t2;
            const gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
            n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
        }
        return 70.0 * (n0 + n1 + n2);
    };
}

interface ProceduralTerrainProps {
    onDeselect: () => void;
}

const noise2D = createNoise2D(Math.random);

export const ProceduralTerrain: React.FC<ProceduralTerrainProps> = React.memo(({ onDeselect }) => {

    const geometry = useMemo(() => {
        const size = 500;
        // OPTIMIZATION: Reduced segments from 150 to 80 to prevent blocking the main thread during initial load.
        const segments = 80;
        const geo = new THREE.PlaneGeometry(size, size, segments, segments);
        const positionAttribute = geo.getAttribute('position');

        const amplitude = 8; // How high the mountains are
        // Adjusted frequency slightly to maintain detail with fewer segments
        const frequency = 0.015;

        for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i);
            const y = positionAttribute.getY(i);

            // The z-coordinate of the vertex is its height
            const z = noise2D(x * frequency, y * frequency) * amplitude;
            positionAttribute.setZ(i, z);
        }

        geo.computeVertexNormals(); // Recalculate normals for correct lighting
        positionAttribute.needsUpdate = true;
        
        return geo;
    }, []);

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onDeselect();
    };

    return (
        <mesh
            geometry={geometry}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -5.5, 0]} // Lowered slightly to prevent z-fighting with city base
            receiveShadow
            onClick={handleClick}
        >
            <meshStandardMaterial
                color="#0a0a1a" // Dark purple-ish ground
                metalness={0.7}
                roughness={0.5}
                wireframe={true}
            />
        </mesh>
    );
});