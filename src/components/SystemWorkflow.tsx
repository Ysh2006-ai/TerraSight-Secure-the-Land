import { motion } from 'framer-motion'
import { Satellite, UploadCloud, Workflow, BrainCircuit, Scale, ShieldCheck, LayoutDashboard, ArrowRight } from 'lucide-react'

const steps = [
    {
        id: 'source',
        title: 'Data Source',
        subtitle: 'Sentinel-1/2',
        icon: Satellite,
        color: 'text-blue-400',
        bg: 'bg-blue-400/10 border-blue-400/20'
    },
    {
        id: 'ingestion',
        title: 'Ingestion',
        subtitle: 'AWS S3 + Lambda',
        icon: UploadCloud,
        color: 'text-indigo-400',
        bg: 'bg-indigo-400/10 border-indigo-400/20'
    },
    {
        id: 'orchestration',
        title: 'Orchestration',
        subtitle: 'Step Functions',
        icon: Workflow,
        color: 'text-purple-400',
        bg: 'bg-purple-400/10 border-purple-400/20'
    },
    {
        id: 'ml',
        title: 'ML Engine',
        subtitle: 'SageMaker ViT',
        icon: BrainCircuit,
        color: 'text-brand-green',
        bg: 'bg-brand-green/10 border-brand-green/20'
    },
    {
        id: 'governance',
        title: 'Governance',
        subtitle: 'Legal Logic',
        icon: Scale,
        color: 'text-brand-cyan',
        bg: 'bg-brand-cyan/10 border-brand-cyan/20'
    },
    {
        id: 'accountability',
        title: 'Accountability',
        subtitle: 'Blockchain L1',
        icon: ShieldCheck,
        color: 'text-brand-amber',
        bg: 'bg-brand-amber/10 border-brand-amber/20'
    },
    {
        id: 'output',
        title: 'Output',
        subtitle: 'Dashboard + Alerts',
        icon: LayoutDashboard,
        color: 'text-white',
        bg: 'bg-white/10 border-white/20'
    }
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.4
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 100 } as const
    }
}

const SystemWorkflow = () => {
    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
                    <span className="text-brand-green font-mono text-xs uppercase tracking-widest">End-to-End Pipeline</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                    How We Turn Space Data <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-green">
                        Into Ground-Level Decisions
                    </span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Automated orchestration from satellite acquisition to blockchain-verified accountability.
                </p>
            </motion.div>

            <div className="relative">
                {/* Connecting Line (Base) */}
                <div className="absolute top-[40px] left-0 w-full h-[2px] bg-white/5 hidden md:block" />

                {/* Animated Connecting Line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 2.5, ease: "linear", delay: 0.5 }}
                    viewport={{ once: true }}
                    className="absolute top-[40px] left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-brand-green to-brand-cyan origin-left hidden md:block opacity-50 shadow-[0_0_15px_rgba(0,255,157,0.3)]"
                />

                {/* Traveling Signal Pulse */}
                <motion.div
                    animate={{ left: ["0%", "100%"] }}
                    transition={{ duration: 3, ease: "linear", repeat: Infinity, repeatDelay: 1 }}
                    className="absolute top-[36px] w-20 h-2 bg-gradient-to-r from-transparent via-white to-transparent blur-sm hidden md:block z-0"
                />

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-7 gap-6 relative z-10"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        return (
                            <motion.div
                                key={step.id}
                                variants={itemVariants}
                                className="flex flex-col items-center group"
                            >
                                <div className={`
                    w-20 h-20 rounded-2xl flex items-center justify-center mb-6 
                    backdrop-blur-xl transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-2
                    ${step.bg} border-2 relative z-10 bg-brand-black/50
                  `}>
                                    <Icon className={`w-8 h-8 ${step.color}`} />

                                    {/* Pulsing Dot for Active State */}
                                    <motion.div
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${step.color.replace('text-', 'bg-')} shadow-lg`}
                                    />

                                    {/* Connecting Arrows for Mobile */}
                                    {index !== steps.length - 1 && (
                                        <div className="md:hidden absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/20">
                                            <ArrowRight className="rotate-90" />
                                        </div>
                                    )}
                                </div>

                                <div className="text-center">
                                    <h3 className="text-white font-bold font-display text-lg mb-1 group-hover:text-brand-green transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 font-mono uppercase tracking-tight">
                                        {step.subtitle}
                                    </p>
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </div>
    )
}

export default SystemWorkflow
