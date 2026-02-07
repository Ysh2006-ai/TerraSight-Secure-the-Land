import { useFrame, useLoader } from '@react-three/fiber'
import { useScroll, Stars } from '@react-three/drei'
import { useRef, useMemo, Suspense } from 'react'
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
uniform sampler2D normalMap;
uniform vec3 sunDirection;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 viewDirection = normalize(-vPosition);
  vec3 normal = normalize(vNormal);
  vec3 sunDir = normalize(sunDirection);
  
  // Normal map perturbation (simple approximation for sphere)
  // Note: For a perfect normal map on a sphere we'd need tangent/bitangent attributes, 
  // but for a globe this simple perturbation often suffices or we can skip if complex.
  // Actually, let's keep it simple first to avoid tangent artifacts. 
  // We'll use the normal map for "texture details" in mixing if not full displacement.
  
  // Day/Night mixing factor
  // Smooth the transition for a "twilight" feel
  float dotProd = dot(normal, sunDir);
  float mixFactor = smoothstep(-0.25, 0.25, dotProd);

  // Sample textures
  vec3 dayColor = texture2D(dayTexture, vUv).rgb;
  vec3 nightColor = texture2D(nightTexture, vUv).rgb;
  vec3 specMapColor = texture2D(specularMap, vUv).rgb;
  
  // Enhance night lights: make them pop more
  // Night lights usually look yellow/orange-ish from space, allow tinting if texture is white
  // nightColor *= vec3(1.0, 0.9, 0.6); 

  // Specular reflection (Sun on ocean)
  // Mask specularity by continent (specularMap is black on land)
  vec3 reflectDir = reflect(-sunDir, normal);
  float spec = pow(max(dot(viewDirection, reflectDir), 0.0), 64.0) * specMapColor.r;
  vec3 specularColor = vec3(1.0, 1.0, 0.9) * spec * 0.8;

  // Fresnel / Rim Light (Atmospheric scattering on the ground)
  // Adds a blue-ish haze on edges looking at the earth
  float fresnel = pow(1.0 - max(dot(viewDirection, normal), 0.0), 4.0);
  vec3 atmosphereColor = vec3(0.3, 0.6, 1.0) * fresnel * 0.5 * mixFactor; // Only visible on day side mostly

  // Combine
  vec3 finalDayColor = dayColor + specularColor + atmosphereColor;
  
  // Night side should be dark but with city lights
  // We can add a tiny bit of blue ambient to night side so it's not pitch black
  vec3 nightAmbient = vec3(0.01, 0.02, 0.05); 
  vec3 finalNightColor = nightColor * 2.0 + nightAmbient; // Boost lights

  vec3 finalColor = mix(finalNightColor, finalDayColor, mixFactor);

  gl_FragColor = vec4(finalColor, 1.0);

  // Color grading / Tone mapping
  // Increase contrast slightly
  gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.1)); 
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
  // Softer, more realistic outer glow (Rayleigh scattering)
  float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
  // Color: Light atmospheric blue
  gl_FragColor = vec4(0.4, 0.7, 1.0, 1.0) * intensity * 2.0;
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
                depthWrite={false}
            />
        </mesh>
    )
}

function Earth() {
    const meshRef = useRef<THREE.Group>(null)
    const earthMeshRef = useRef<THREE.Mesh>(null)
    const cloudsRef = useRef<THREE.Mesh>(null)

    const scroll = useScroll()

    // Added Normal Map for detail
    const [colorMap, normalMap, specularMap, cloudsMap, nightMap] = useLoader(TextureLoader, [
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png'
    ])

    const uniforms = useMemo(() => ({
        dayTexture: { value: colorMap },
        nightTexture: { value: nightMap },
        specularMap: { value: specularMap },
        normalMap: { value: normalMap },
        sunDirection: { value: new THREE.Vector3(5, 3, 5).normalize() }
    }), [colorMap, nightMap, specularMap, normalMap])

    useFrame((_, delta) => {
        if (!meshRef.current) return

        // Base loop rotation
        meshRef.current.rotation.y += delta * 0.05

        // Cloud rotation
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += delta * 0.02
        }

        // Scroll interactions
        const offset = scroll.offset

        // More dramatic dynamic rotation based on scroll
        meshRef.current.rotation.x = offset * Math.PI * 0.2
        meshRef.current.rotation.z = offset * Math.PI * 0.1

        // Smooth Scale transition
        const scale = 1 + Math.sin(offset * Math.PI) * 0.2
        meshRef.current.scale.set(scale, scale, scale)

        // Position "flythrough" feel
        meshRef.current.position.z = Math.sin(offset * Math.PI * 1.5) * 3

        // Section specific moves
        if (scroll.visible(1 / 4, 2 / 4)) {
            meshRef.current.rotation.y += delta * 1.5
        }
    })

    return (
        <group ref={meshRef}>
            {/* Earth Surface with Custom Day/Night Shader */}
            <mesh ref={earthMeshRef}>
                <sphereGeometry args={[2.5, 64, 64]} />
                <shaderMaterial
                    uniforms={uniforms}
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

            {/* Satellites and Orbits - Constellation Pattern */}
            {/* Polar Orbit - Scanning */}
            <group rotation={[0, 0, Math.PI / 2]}>
                <OrbitRing radius={3.2} color="#00ff9d" opacity={0.4} />
                <Satellite radius={3.2} speed={1.0} phase={1} color="#00ff9d" size={0.08} />
            </group>

            {/* Inclined Orbit 1 - GPS Style */}
            <group rotation={[0.5, 0.5, 0]}>
                <OrbitRing radius={3.8} color="#00f3ff" opacity={0.2} />
                <Satellite radius={3.8} speed={0.7} phase={2} color="#00f3ff" size={0.06} />
                <Satellite radius={3.8} speed={0.7} phase={4} color="#00f3ff" size={0.06} />
            </group>

            {/* Inclined Orbit 2 - Cross Coverage */}
            <group rotation={[-0.5, 0.5, 0]}>
                <OrbitRing radius={4.2} color="#ffbe0b" opacity={0.15} />
                <Satellite radius={4.2} speed={0.5} phase={3} color="#ffbe0b" size={0.05} />
            </group>

            {/* Equatorial - Geosynchronous feel */}
            <group rotation={[Math.PI / 6, 0, 0]}>
                <OrbitRing radius={5.0} color="#ffffff" opacity={0.1} />
            </group>

            {/* Low Earth Orbit Cluster */}
            <group rotation={[0.2, 0.2, 0.2]}>
                <OrbitRing radius={2.8} color="#00ff9d" opacity={0.1} />
            </group>
        </group>
    )
}

function OrbitRing({ radius, color = "#ffffff", opacity = 0.1 }: { radius: number, color?: string, opacity?: number }) {
    return (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
            {/* TorusGeometry for a thin line: radius, tubeRadius, radialSegments, tubularSegments */}
            <torusGeometry args={[radius, 0.002, 16, 128]} />
            <meshBasicMaterial color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
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
    size = 0.1
}: {
    radius?: number,
    speed?: number,
    inclination?: number,
    phase?: number,
    color?: string,
    size?: number
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
            <Suspense fallback={null}>
                <Earth />
            </Suspense>
        </>
    )
}
