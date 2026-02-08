import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';

export function RotatingEarth() {
    const earthRef = useRef<THREE.Mesh>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);

    // Earth textures load karein (CDN se)
    const [dayTexture, cloudsTexture, nightTexture] = useLoader(TextureLoader, [
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png'
    ]);

    // Rotation animation
    useFrame((_, delta) => {
        if (earthRef.current) {
            earthRef.current.rotation.y += delta * 0.1; // Rotation speed
        }
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += delta * 0.05; // Clouds thode slow
        }
    });

    return (
        <group>
            {/* Background Stars */}
            <Stars radius={300} depth={50} count={5000} factor={4} />

            {/* Main Earth Sphere */}
            <mesh ref={earthRef}>
                <sphereGeometry args={[2.5, 64, 64]} />
                <meshStandardMaterial
                    map={dayTexture}
                    emissiveMap={nightTexture}
                    emissive="#ffffff"
                    emissiveIntensity={0.2}
                />
            </mesh>

            {/* Clouds Layer */}
            <mesh ref={cloudsRef}>
                <sphereGeometry args={[2.52, 64, 64]} />
                <meshStandardMaterial
                    map={cloudsTexture}
                    transparent
                    opacity={0.4}
                    alphaMap={cloudsTexture}
                />
            </mesh>

            {/* Atmospheric Glow */}
            <mesh scale={[1.15, 1.15, 1.15]}>
                <sphereGeometry args={[2.5, 64, 64]} />
                <meshBasicMaterial
                    color="#4488ff"
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    );
}
