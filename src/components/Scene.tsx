import { useFrame } from '@react-three/fiber'
import { useScroll, Stars } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function Earth() {
    const meshRef = useRef<THREE.Group>(null)
    const scroll = useScroll()

    // Use memo for geometry to avoid recreation
    const globeGeometry = useMemo(() => new THREE.IcosahedronGeometry(2, 24), []) // Smoother sphere

    useFrame((_, delta) => {
        if (!meshRef.current) return

        // Base loop rotation (faster for more dynamism)
        meshRef.current.rotation.y += delta * 0.08

        // Scroll interactions
        const offset = scroll.offset

        // More dramatic dynamic rotation based on scroll
        meshRef.current.rotation.x = offset * Math.PI * 0.5
        meshRef.current.rotation.z = offset * Math.PI * 0.2

        // Smooth Scale transition
        // Start normal, zoom in Middle, Zoom out End
        const scale = 1 + Math.sin(offset * Math.PI) * 0.2
        meshRef.current.scale.set(scale, scale, scale)

        // Position "flythrough" feel
        meshRef.current.position.z = Math.sin(offset * Math.PI * 1.5) * 3

        // Section specific moves (e.g., rapid spin on data ingestion)
        if (scroll.visible(1 / 4, 2 / 4)) {
            meshRef.current.rotation.y += delta * 1.5
        }
    })

    return (
        <group ref={meshRef}>
            {/* Main Globe - Darker, High Tech */}
            <mesh geometry={globeGeometry}>
                <meshStandardMaterial
                    color="#0B101B"
                    emissive="#000000"
                    roughness={0.4}
                    metalness={0.8}
                    flatShading={false}
                />
            </mesh>

            {/* Wireframe Overlay - Pulsing Effect would be cool, but static for now */}
            <mesh scale={[1.002, 1.002, 1.002]} geometry={globeGeometry}>
                <meshBasicMaterial color="#00ff9d" wireframe transparent opacity={0.15} />
            </mesh>

            {/* Secondary Wireframe (Cyan) for depth */}
            <mesh scale={[1.01, 1.01, 1.01]} geometry={globeGeometry}>
                <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.05} />
            </mesh>

            {/* Atmosphere Glow */}
            <mesh scale={[1.2, 1.2, 1.2]}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshBasicMaterial color="#00f3ff" transparent opacity={0.1} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
            </mesh>

            {/* Satellites and Orbits */}
            <group rotation={[0.5, 0.5, 0]}>
                <OrbitRing radius={3} color="#00ff9d" opacity={0.1} />
                <Satellite radius={3} speed={0.8} phase={0} color="#00ff9d" size={0.08} />
            </group>

            <group rotation={[-0.4, 0.2, 0]}>
                <OrbitRing radius={3.5} color="#00f3ff" opacity={0.05} />
                <Satellite radius={3.5} speed={0.6} phase={2} color="#00f3ff" size={0.06} />
            </group>

            <group rotation={[0.8, -0.4, 0.2]}>
                <OrbitRing radius={2.8} color="#ffbe0b" opacity={0.05} />
                <Satellite radius={2.8} speed={1.2} phase={4} color="#ffbe0b" size={0.05} />
            </group>
        </group>
    )
}

function OrbitRing({ radius, color = "#ffffff", opacity = 0.1 }: { radius: number, color?: string, opacity?: number }) {
    return (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius, radius + 0.02, 64]} />
            <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
        </mesh>
    )
}


// Detailed Satellite Component
function Satellite({
    radius = 3,
    speed = 1,
    inclination = 0,
    phase = 0,
    color = "#cccccc",
    size = 0.1,
    type = 'comm' // 'comm' | 'spy' | 'gps'
}: {
    radius?: number,
    speed?: number,
    inclination?: number,
    phase?: number,
    color?: string,
    size?: number,
    type?: 'comm' | 'spy' | 'gps'
}) {
    const satelliteRef = useRef<THREE.Group>(null)

    useFrame(({ clock }) => {
        if (!satelliteRef.current) return
        const t = clock.getElapsedTime() * speed * 0.2 + phase

        const x = Math.cos(t) * radius
        const z = Math.sin(t) * radius

        const pos = new THREE.Vector3(x, 0, z)
        pos.applyAxisAngle(new THREE.Vector3(1, 0, 1).normalize(), inclination)
        satelliteRef.current.position.copy(pos)

        satelliteRef.current.lookAt(0, 0, 0)
        satelliteRef.current.rotateY(-Math.PI / 2) // Orient panels correctly
        satelliteRef.current.rotateX(Math.PI / 2) // Face "down" to earth
    })

    return (
        <group ref={satelliteRef}>
            {/* Main Body */}
            <mesh>
                <boxGeometry args={[size, size * 1.5, size]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.8}
                    roughness={0.3}
                    emissive={color}
                    emissiveIntensity={0.2}
                />
            </mesh>

            {/* Solar Panels */}
            <mesh position={[size * 1.8, 0, 0]}>
                <boxGeometry args={[size * 2.5, size * 0.05, size * 0.8]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    metalness={0.8}
                    roughness={0.2}
                    emissive="#004488"
                    emissiveIntensity={0.5}
                />
            </mesh>
            <mesh position={[-size * 1.8, 0, 0]}>
                <boxGeometry args={[size * 2.5, size * 0.05, size * 0.8]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    metalness={0.8}
                    roughness={0.2}
                    emissive="#004488"
                    emissiveIntensity={0.5}
                />
            </mesh>

            {/* Detail: Dish antenna */}
            <mesh position={[0, -size * 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[size * 0.4, size * 0.2, 16]} />
                <meshStandardMaterial color="#888888" metalness={0.6} />
            </mesh>

            {/* Indicator Light */}
            <mesh position={[0, size * 0.8, 0]}>
                <sphereGeometry args={[size * 0.15]} />
                <meshBasicMaterial color="#00ff00" />
            </mesh>
        </group>
    )
}

function ItemLight() {
    return <spotLight position={[-10, 0, 20]} angle={0.3} penumbra={1} intensity={1} color="#00f3ff" />
}

export const Scene = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2.0} color="#ffffff" />
            <ItemLight />
            <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Earth />
        </>
    )
}
