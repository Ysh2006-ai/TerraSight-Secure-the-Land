import { motion } from 'framer-motion'
import { BellRing, Users, Rocket, FileCheck } from 'lucide-react'

const steps = [
    { icon: BellRing, title: 'Alert Triggered', time: 'T+00:00' },
    { icon: Users, title: 'Expert Verification', time: 'T+00:15' },
    { icon: Rocket, title: 'Drone Dispatch', time: 'T+01:00' },
    { icon: FileCheck, title: 'Legal Notice Issued', time: 'T+04:00' },
]

const EscalationFlow = () => {
    return (
        <div className="w-full max-w-7xl mx-auto p-4 py-20">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl font-bold text-white mb-4">Rapid Escalation Protocol</h2>
                <p className="text-gray-400">From orbit to on-ground action in under 4 hours.</p>
            </motion.div>

            <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-8 left-0 w-full h-1 bg-white/5 hidden md:block" />
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 2, ease: "linear" }}
                    className="absolute top-8 left-0 w-full h-1 bg-brand-green origin-left hidden md:block shadow-[0_0_10px_#00ff9d]"
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="relative flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 bg-brand-navy border-2 border-brand-green rounded-full flex items-center justify-center relative z-10 mb-6 shadow-xl">
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-white font-bold text-lg">{step.title}</h3>
                                <p className="text-brand-green font-mono text-sm mt-1">{step.time}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default EscalationFlow
