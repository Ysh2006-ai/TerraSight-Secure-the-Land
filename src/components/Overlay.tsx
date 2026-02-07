import { Scroll } from '@react-three/drei'
import MapSection from './MapSection'
import CompareSlider from './CompareSlider'
import AlertsView from './AlertsView'
import InsightsView from './InsightsView'
import SystemWorkflow from './SystemWorkflow'
import FAQSection from './FAQSection'
import PredictiveRisk from './PredictiveRisk'


import EscalationFlow from './EscalationFlow'
import Footer from './Footer'

// Add motion imports
import { motion } from 'framer-motion'

interface SectionProps {
    children: React.ReactNode
    className?: string
    id?: string
}

const Section = ({ children, className = "", id = "" }: SectionProps) => {
    return (
        <section id={id} className={`min-h-screen w-full flex flex-col justify-center p-4 md:p-10 scroll-mt-20 md:scroll-mt-32 ${className}`}>
            {children}
        </section>
    )
}

export const Overlay = () => {
    return (
        <Scroll html>
            <div className="w-screen overflow-x-hidden">
                {/* 1. Hero */}
                <Section id="hero" className="items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, type: "spring" }}
                        viewport={{ once: true }}
                        className="text-center pointer-events-none w-full max-w-4xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold font-display tracking-tight text-white mb-6 glow-text">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-green">
                                Planetary
                            </span> Intelligence
                        </h1>
                        <p className="text-lg md:text-2xl text-gray-300 font-light font-body max-w-2xl mx-auto px-4 leading-relaxed">
                            The world's first AI-powered planetary monitoring command center.
                        </p>
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="mt-12 text-brand-green/70 font-mono text-xs md:text-sm tracking-[0.2em] uppercase"
                        >
                            System Online • Monitoring Grid Active
                        </motion.div>
                    </motion.div>
                </Section>

                {/* 2. Story: Data Ingestion */}
                <Section id="ingestion" className="items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ margin: "-20%" }}
                        className="max-w-xl bg-brand-navy/80 backdrop-blur-md p-6 md:p-8 border-l-4 border-brand-green md:ml-10 rounded-r-xl shadow-[0_0_30px_rgba(0,255,157,0.1)] w-full mx-auto md:mx-0"
                    >
                        <div className="flex items-center gap-3 mb-4 text-brand-green">
                            <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse"></div>
                            <span className="text-xs font-mono uppercase tracking-widest">Ingestion Pipeline</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Satellite Data Ingestion</h2>
                        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
                            Ingesting petabytes of multi-spectral imagery daily from Sentinel-2, Landsat, and commercial constellations.
                            Our pipeline cleans clouds, atmospheric noise, and sensor artifacts in milliseconds.
                        </p>
                    </motion.div>
                </Section>

                {/* 3. Story: AI Analysis */}
                <Section id="ai-analysis" className="items-end">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ margin: "-20%" }}
                        className="max-w-xl bg-brand-navy/80 backdrop-blur-md p-6 md:p-8 border-r-4 border-brand-cyan md:mr-10 text-left md:text-right rounded-l-xl shadow-[0_0_30px_rgba(0,243,255,0.1)] w-full mx-auto md:mx-0"
                    >
                        <div className="flex items-center justify-end gap-3 mb-4 text-brand-cyan">
                            <span className="text-xs font-mono uppercase tracking-widest">Neural Processing</span>
                            <div className="w-2 h-2 bg-brand-cyan rounded-full animate-pulse"></div>
                        </div>
                        <h2 className="text-4xl font-display font-bold text-white mb-4">AI Change Detection</h2>
                        <p className="text-lg text-gray-200 leading-relaxed">
                            Proprietary computer vision models detect sub-meter land changes.
                            From deforestation to illegal mining, no pixel goes unanalyzed.
                        </p>
                    </motion.div>
                </Section>

                {/* 4. Interactive Map */}
                <Section id="map" className="items-center bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-4xl font-bold text-white mb-2">Global Live Feed</h2>
                        <p className="text-brand-green font-mono">Real-time anomaly detection across monitored zones</p>
                    </motion.div>
                    <div className="w-full max-w-6xl pointer-events-auto shadow-2xl border border-white/10 rounded-xl">
                        <MapSection />
                    </div>
                </Section>

                {/* 5. Comparison */}
                <Section className="items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-4xl font-bold text-white mb-2">Evidence Validation</h2>
                        <p className="text-brand-cyan font-mono">Historical vs Current Analysis</p>
                    </motion.div>
                    <div className="w-full max-w-4xl pointer-events-auto shadow-2xl border border-white/10 rounded-xl">
                        <CompareSlider />
                    </div>
                </Section>

                {/* 6. System Workflow */}
                <Section className="items-center justify-center bg-brand-black/40">
                    <SystemWorkflow />
                </Section>

                {/* 6. Alerts Dashboard */}
                <Section className="items-center justify-center bg-brand-navy/30">
                    <AlertsView limit={5} />
                </Section>

                {/* 7. Insights */}
                <Section className="items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center mb-10"
                    >
                        <h2 className="text-4xl font-bold text-white mb-2">Impact Analytics</h2>
                        <p className="text-brand-amber font-mono">Quantifying environmental changes over time</p>
                    </motion.div>
                    <InsightsView />
                </Section>

                {/* 8. Predictive Risk Zones */}
                <Section id="risk" className="items-center justify-center bg-brand-navy/20">
                    <PredictiveRisk />
                </Section>



                {/* 10. Policy & Escalation */}
                <Section id="policy" className="items-center justify-start py-20 bg-brand-black/60">

                    <div className="mt-10 md:mt-20 w-full">
                        <EscalationFlow />
                    </div>
                </Section>

                {/* 11. FAQ Section */}
                <Section id="faq" className="items-center justify-center bg-brand-black/40">
                    <FAQSection />
                </Section>

                {/* 12. Conclusion / Footer details handled by Footer component inside Section or separate? 
                   The user wants a "perfect footer". A full screen section might be too tall if we force it.
                   Let's perform a minor layout adjustment: Content -> Footer.
                   We'll keep the "Protect the Future" CTA block as the final content section, 
                   and then the Footer component below it.
                */}


                {/* 13. Footer - We place it in a section that allows pointer events */}
                <div className="w-screen pointer-events-auto relative z-10">
                    <Footer />
                </div>
            </div >
        </Scroll >
    )
}
