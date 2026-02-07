import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import { Scene } from '../components/Scene'
import { Overlay } from '../components/Overlay'
import HUDNavigation from '../components/HUDNavigation'

export const LandingPage = () => {
    return (
        <main className="h-screen w-full bg-brand-black">
            <HUDNavigation />
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ScrollControls pages={12.3} damping={0.1}>

                    {/* 3D Content that reacts to scroll */}
                    <Scene />

                    {/* HTML Overlay Content that scrolls */}
                    <Overlay />
                </ScrollControls>
            </Canvas>

            <div className="hidden md:block fixed bottom-4 right-4 text-xs text-brand-green/70 font-mono pointer-events-none z-50">
                SYSTEM STATUS: ONLINE | 24°12'N 56°22'E
            </div>
        </main >
    )
}
