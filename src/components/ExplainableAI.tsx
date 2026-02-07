import { motion } from 'framer-motion'
import { CheckCircle2, ChevronRight, Binary, Eye, Lock } from 'lucide-react'
import { useExplanation } from '../hooks/useExplanation';

const ExplainableAI = () => {
    const { explanation, loading } = useExplanation();

    // Use default features if loading or null (shim for smooth transition)
    const features = explanation?.features || [];

    return (
        <div className="w-full max-w-7xl mx-auto p-4 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left: Text */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="order-2 lg:order-1"
                >
                    <div className="flex items-center gap-2 mb-4 text-brand-cyan">
                        <Eye className="w-5 h-5" />
                        <span className="font-mono text-sm uppercase tracking-widest">Glass Box AI</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                        Trust, verify, then act. <br />
                        <span className="text-brand-green">No black boxes.</span>
                    </h2>
                    <p className="text-gray-400 leading-relaxed mb-8">
                        Every alert comes with a complete reasoning chain. We visualize exactly which features triggers the AI, giving your analysts the confidence to escalate.
                    </p>

                    <button className="text-white border-b border-brand-green hover:text-brand-green transition-colors pb-1 flex items-center gap-1 group">
                        Read our Whitepaper <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>

                {/* Right: UI Panel */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="order-1 lg:order-2 bg-brand-black/80 border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-brand-cyan/5 group-hover:bg-brand-cyan/10 transition-colors pointer-events-none" />

                    <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                        <div>
                            <h4 className="text-white font-bold">Alert Analysis #{explanation?.id || '...'}</h4>
                            <p className="text-xs text-gray-500 font-mono">Model: {explanation?.model || 'Loading...'}</p>
                        </div>
                        <div className="px-3 py-1 bg-brand-green/20 text-brand-green text-xs rounded-full border border-brand-green/30 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Verifiable
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loading && <div className="text-brand-cyan animate-pulse">Analyzing neural activations...</div>}
                        {!loading && features.map((feat, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: 20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.15 }}
                                className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-brand-cyan/30 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-300 font-medium flex items-center gap-2">
                                        <Binary className="w-4 h-4 text-brand-cyan" /> {feat.name}
                                    </span>
                                    <span className="text-brand-cyan font-bold font-mono">{feat.score}%</span>
                                </div>
                                <div className="w-full bg-black/50 h-1.5 rounded-full mb-2 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${feat.score}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className="h-full bg-brand-cyan"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 justify-center">
                        <CheckCircle2 className="w-4 h-4 text-brand-green" /> Human-in-the-loop review ready
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default ExplainableAI
