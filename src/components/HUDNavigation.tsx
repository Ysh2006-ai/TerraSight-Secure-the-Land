import { motion } from 'framer-motion'
import { Globe, Database, Brain, Map as MapIcon, ShieldAlert, FileText, Activity, HelpCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import Logo from '../assets/Logo.png'

const navItems = [
    { id: 'hero', label: 'Command', icon: Globe },
    // { id: 'ingestion', label: 'Feeds', icon: Database },
    // { id: 'ai-analysis', label: 'AI', icon: Brain },
    { id: 'map', label: 'Map', icon: MapIcon },
    { id: 'risk', label: 'Risk', icon: Activity },
    { id: 'policy', label: 'Policy', icon: ShieldAlert },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
]

const HUDNavigation = () => {
    const [activeId, setActiveId] = useState('hero')
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setActiveId(id)
        }
    }

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 pointer-events-none ${scrolled ? 'bg-brand-black/80 backdrop-blur-xl border-b border-white/10 py-2 md:py-3' : 'bg-transparent py-4 md:py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center md:justify-between pointer-events-auto gap-4 md:gap-0">

                {/* Logo Area */}
                <div className="flex items-center gap-2 cursor-pointer self-start md:self-auto" onClick={() => scrollToSection('hero')}>
                    <img src={Logo} alt="TerraSight" className="h-30 md:h-30 w-auto object-contain drop-shadow-[0_0_15px_rgba(45,212,191,0.3)]" />
                </div>

                {/* Navigation Items */}
                <div className="w-full md:w-auto overflow-x-auto no-scrollbar mask-image-scroll relative flex items-center justify-center md:justify-end gap-4">
                    {/* Fade masks for scrolling indication */}
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/20 to-transparent pointer-events-none md:hidden z-10"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-black/20 to-transparent pointer-events-none md:hidden z-10"></div>

                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-md w-max mx-auto md:mx-0">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = activeId === item.id

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`
                  relative px-3 py-2 md:px-4 md:py-2 rounded-full flex items-center gap-2 transition-all duration-300 min-w-[44px] justify-center
                  ${isActive
                                            ? 'text-brand-black bg-brand-green shadow-[0_0_15px_rgba(0,255,157,0.4)]'
                                            : 'text-gray-400 hover:text-white hover:bg-white/10'}
                `}
                                >
                                    <Icon className={`w-4 h-4 md:w-4 md:h-4 ${isActive ? 'scale-110' : ''}`} />
                                    <span className={`text-[10px] md:text-xs font-bold uppercase ${isActive ? 'block' : 'hidden lg:block'}`}>
                                        {item.label}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    <a
                        href="/login"
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-brand-nav/50 hover:bg-brand-green/20 border border-white/10 rounded-full text-xs font-mono text-brand-green uppercase tracking-wider transition-colors"
                    >
                        <span>Operator Login</span>
                    </a>
                </div>

            </div>
        </motion.nav>
    )
}

export default HUDNavigation
