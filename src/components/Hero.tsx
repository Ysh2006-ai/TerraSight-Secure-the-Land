import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function Earth() {
    const earthRef = useRef<THREE.Mesh>(null)

    useFrame((_, delta) => {
        if (earthRef.current) {
            earthRef.current.rotation.y += delta * 0.1
        }
    })

    return (
        <mesh ref={earthRef}>
            <sphereGeometry args={[2.5, 64, 64]} />
            <meshStandardMaterial
                color="#2233ff"
                emissive="#112244"
                emissiveIntensity={0.2}
                roughness={0.7}
                metalness={0.1}
                wireframe={true} // Temporary futuristic look
            />
        </mesh>
    )
}

function Hero() {
    return (
        <div className="relative w-full h-screen bg-brand-black overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ff9d" />
                    <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <Earth />
                    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                </Canvas>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none text-center px-4">
                <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight text-white mb-6">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-green">
                        Planetary
                    </span> Intelligence
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 max-w-2xl font-light font-body">
                    monitoring earth's vital signs in real-time
                </p>

                <div className="mt-12 flex space-x-6 pointer-events-auto">
                    <button className="px-8 py-3 bg-brand-green/10 border border-brand-green/50 hover:bg-brand-green/20 text-brand-green rounded-full font-medium transition-all backdrop-blur-md cursor-pointer">
                        Access Command
                    </button>
                    <button className="px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full font-medium transition-all backdrop-blur-md cursor-pointer">
                        Explore Data
                    </button>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-brand-black to-transparent pointer-events-none" />
        </div>
    )
}

export default Hero
