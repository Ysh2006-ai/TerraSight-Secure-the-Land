import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, ArrowRight } from 'lucide-react'

const faqs = [
    {
        question: "How does TerraSight source satellite data?",
        answer: "We aggregate multi-spectral imagery from a constellation of partners including Sentinel-2, Landsat, and private sub-meter resolution providers. Our pipeline ingests peri-real-time feeds to ensure maximum temporal resolution."
    },
    {
        question: "What kind of anomalies can the AI detect?",
        answer: "Our proprietary computer vision models are trained to detect deforestation, illegal mining activities, infrastructure encroachment, flood risks, and unauthorized construction with 99.8% precision."
    },
    {
        question: "Is the data legally admissible?",
        answer: "Yes. All detected events are timestamped and hashed onto a Layer-1 blockchain for immutable proof of existence, making our reports admissible in legal and compliance frameworks."
    },
    {
        question: "Can I integrate this into my existing GIS?",
        answer: "Absolutely. TerraSight exposes a REST API and WMS/WFS endpoints that seamlessly stream analyzed layers into Esri ArcGIS, QGIS, or custom internal dashboards."
    }
]

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <div className="w-full max-w-7xl mx-auto p-4 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Left Column: Header & CTA */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="mb-8"
                    >
                        <h2 className="text-5xl font-display font-bold text-white mb-6">FAQs</h2>
                        <p className="text-gray-400 leading-relaxed mb-8">
                            Curious how we transform raw orbital data into actionable ground intelligence? Find answers to the most common questions from enterprise teams.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-brand-navy/50 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                    >
                        <h3 className="text-xl font-bold text-white mb-2">Need a custom briefing?</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Our specialists can walk you through a tailored demo for your specific region of interest.
                        </p>
                        <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-brand-green hover:text-black transition-colors group">
                            Contact Sales
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>

                {/* Right Column: Accordion */}
                <div className="lg:col-span-2 space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`border rounded-xl transition-all duration-300 ${openIndex === index
                                ? 'border-brand-green bg-brand-green/5'
                                : 'border-white/10 bg-brand-navy/30 hover:border-white/20'
                                }`}
                        >
                            <button
                                onClick={() => setOpenIndex(index === openIndex ? null : index)}
                                className="flex items-center justify-between w-full p-6 text-left"
                            >
                                <span className={`text-lg font-bold transition-colors ${openIndex === index ? 'text-brand-green' : 'text-white'
                                    }`}>
                                    {faq.question}
                                </span>
                                <span className={`p-2 rounded-full transition-colors ${openIndex === index ? 'bg-brand-green text-black' : 'bg-white/10 text-white'
                                    }`}>
                                    {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </span>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default FAQSection
