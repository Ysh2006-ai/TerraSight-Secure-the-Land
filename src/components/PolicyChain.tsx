import { motion } from 'framer-motion'
import { Shield, Scale, Gavel, AlertOctagon } from 'lucide-react'
import { usePolicies } from '../hooks/usePolicies';

const PolicyChain = () => {
    const { policies, loading } = usePolicies();
    return (
        <div className="w-full max-w-7xl mx-auto p-4 py-20">
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 mb-4">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wide">Automated Compliance</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">Instant Regulatory Matching</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        We cross-reference every planetary alert against local and international frameworks (EUDR, COP28, UN SDGs) in real-time.
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading && <div className="col-span-2 text-center text-gray-500 animate-pulse">Scanning regulatory frameworks...</div>}
                {!loading && policies.map((policy, index) => (
                    <motion.div
                        key={policy.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.2 }}
                        className="bg-brand-black border border-white/10 p-6 rounded-2xl relative overflow-hidden hover:border-white/20 transition-all group"
                    >
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Scale className="w-32 h-32" />
                        </div>

                        <div className="flex items-start justify-between mb-6">
                            <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                <Gavel className="w-6 h-6 text-white" />
                            </div>
                            <span className={`px-3 py-1 rounded border text-xs font-bold tracking-wider ${policy.status === 'VIOLATION'
                                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                }`}>
                                {policy.status} DETECTED
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-green transition-colors">{policy.name}</h3>
                        <p className="text-xs text-gray-500 font-mono mb-4">REF: {policy.id}</p>

                        <p className="text-gray-300 text-sm mb-6 border-l-2 border-white/20 pl-4 py-1">
                            {policy.desc}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-brand-amber bg-brand-amber/5 p-3 rounded">
                            <AlertOctagon className="w-4 h-4" />
                            IMPACT: {policy.penalty}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default PolicyChain
