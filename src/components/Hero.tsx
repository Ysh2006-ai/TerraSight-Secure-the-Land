import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useRef, Suspense } from 'react'
import * as THREE from 'three'
import { TextureLoader } from 'three'

const earthVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const earthFragmentShader = `
uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform sampler2D specularMap;
uniform vec3 sunDirection;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 viewDirection = normalize(-vPosition);
  vec3 normal = normalize(vNormal);
  vec3 sunDir = normalize(sunDirection);

  // Day/Night mixing factor based on dot product
  float dotProd = dot(normal, sunDir);
  float mixFactor = smoothstep(-0.2, 0.2, dotProd);

  // Textures
  vec3 dayColor = texture2D(dayTexture, vUv).rgb;
  vec3 nightColor = texture2D(nightTexture, vUv).rgb;
  float specularStrength = texture2D(specularMap, vUv).r;

  // Specular reflection (Sun on ocean)
  vec3 reflectDir = reflect(-sunDir, normal);
  float spec = pow(max(dot(viewDirection, reflectDir), 0.0), 32.0) * specularStrength;
  vec3 specularColor = vec3(1.0) * spec * 0.5;

  // Final color mixing
  // Day side: Day Texture + Specular
  // Night side: Night Texture (Cities)
  
  vec3 finalDayColor = dayColor + specularColor;
  vec3 finalColor = mix(nightColor, finalDayColor, mixFactor);

  gl_FragColor = vec4(finalColor, 1.0);

  // Tonemapping/Gamma correction rough approximation
  gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0/2.2));
}
`

const atmosphereVertexShader = `
varying vec3 vNormal;
void main() {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const atmosphereFragmentShader = `
varying vec3 vNormal;
void main() {
  // Simple rim lighting/glow
  float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
  gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity * 1.5;
}
`

function Atmosphere() {
    return (
        <mesh scale={[1.2, 1.2, 1.2]}>
            <sphereGeometry args={[2.5, 64, 64]} />
            <shaderMaterial
                vertexShader={atmosphereVertexShader}
                fragmentShader={atmosphereFragmentShader}
                blending={THREE.AdditiveBlending}
                side={THREE.BackSide}
                transparent={true}
            />
        </mesh>
    )
}

function Earth() {
    const earthRef = useRef<THREE.Mesh>(null)
    const cloudsRef = useRef<THREE.Mesh>(null)
    const groupRef = useRef<THREE.Group>(null)

    const [colorMap, specularMap, cloudsMap, nightMap] = useLoader(TextureLoader, [
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png'
    ])

    const uniforms = useRef({
        dayTexture: { value: colorMap },
        nightTexture: { value: nightMap },
        specularMap: { value: specularMap },
        sunDirection: { value: new THREE.Vector3(5, 3, 5).normalize() }
    })

    useFrame((_, delta) => {
        if (earthRef.current) {
            earthRef.current.rotation.y += delta * 0.05
        }
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += delta * 0.07
        }
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.02
        }
    })

    return (
        <group ref={groupRef}>
            {/* Earth Surface with Custom Day/Night Shader */}
            <mesh ref={earthRef}>
                <sphereGeometry args={[2.5, 64, 64]} />
                <shaderMaterial
                    uniforms={uniforms.current}
                    vertexShader={earthVertexShader}
                    fragmentShader={earthFragmentShader}
                />
            </mesh>
            {/* Clouds Layer */}
            <mesh ref={cloudsRef}>
                <sphereGeometry args={[2.53, 64, 64]} />
                <meshStandardMaterial
                    map={cloudsMap}
                    transparent={true}
                    opacity={0.8}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                    alphaMap={cloudsMap}
                />
            </mesh>
            <Atmosphere />
        </group>
    )
}

function Hero() {
    return (
        <div className="relative w-full h-screen bg-brand-black overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                    <ambientLight intensity={0.1} /> {/* Low ambient to let night lights shine */}
                    <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <Suspense fallback={null}>
                        <Earth />
                    </Suspense>
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
