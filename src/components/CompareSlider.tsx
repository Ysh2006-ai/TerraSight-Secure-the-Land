import { useState, useRef, useEffect } from 'react';
import img2020 from '../assets/2020.png';
import img2024 from '../assets/2024.png';

const CompareSlider = () => {
    const [sliderPosition, setSliderPosition] = useState(50)
    const isDragging = useRef(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
        if (!containerRef.current) return

        // If dragging or just hovering (optional: drag only is better for mobile)
        // Let's support drag interaction
        if (!isDragging.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
        const percentage = (x / rect.width) * 100
        setSliderPosition(percentage)
    }

    const handleMouseDown = () => {
        isDragging.current = true
    }

    const handleMouseUp = () => {
        isDragging.current = false
    }

    // Add global mouse up
    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp)
        return () => window.removeEventListener('mouseup', handleMouseUp)
    }, [])

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[500px] overflow-hidden rounded-xl border border-brand-navy cursor-ew-resize select-none group"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
        >
            {/* After Image (Background) - 2024 Destruction/Construction */}
            <div className="absolute inset-0 bg-brand-black">
                <img
                    src={img2024}
                    alt="After 2024"
                    className="w-full h-full object-cover opacity-80 grayscale-[0.2]"
                />
                <div className="absolute top-4 right-4 bg-red-500/20 px-3 py-1 text-xs text-red-200 uppercase tracking-wider border border-red-500/50 backdrop-blur-md">
                    2024 (After)
                </div>
            </div>

            {/* Before Image (Foreground) - 2020 Lush Forest */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
                <img
                    src={img2020}
                    alt="Before 2020"
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-brand-green/20 px-3 py-1 text-xs text-brand-green font-bold uppercase tracking-wider border border-brand-green/50 backdrop-blur-md">
                    2020 (Before)
                </div>
            </div>

            {/* Slider bar */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-brand-green shadow-[0_0_15px_rgba(0,255,157,0.5)] z-20"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-brand-green rounded-full flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="m9 18 6-6-6-6" /></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black rotate-180 absolute"><path d="m9 18 6-6-6-6" /></svg>
                </div>
            </div>
        </div>
    )
}

export default CompareSlider
