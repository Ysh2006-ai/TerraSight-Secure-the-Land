import { motion } from 'framer-motion'
import { AlertTriangle, TrendingUp, Wind, Droplets, Thermometer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const data = [
    { name: 'Critical', value: 35, color: '#ef4444' }, // Red-500
    { name: 'High', value: 45, color: '#f59e0b' },    // Amber-500
    { name: 'Moderate', value: 20, color: '#00ff9d' }, // Brand Green
]

interface RiskCardProps {
    title: string;
    value: string;
    trend: string;
    icon: LucideIcon;
}

const RiskCard = ({ title, value, trend, icon: Icon }: RiskCardProps) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-brand-navy/60 border border-white/10 p-4 rounded-xl flex items-center justify-between"
    >
        <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{title}</p>
            <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-white">{value}</span>
                <span className={`text-xs ${trend.includes('+') ? 'text-red-400' : 'text-brand-green'}`}>{trend}</span>
            </div>
        </div>
        <div className="p-2 bg-white/5 rounded-lg text-brand-cyan">
            <Icon className="w-6 h-6" />
        </div>
    </motion.div>
)

const PredictiveRisk = () => {
    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left: Visualization */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="relative bg-black/40 border border-brand-navy rounded-2xl p-8 backdrop-blur-sm"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-brand-green opacity-50" />
                    <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                        <AlertTriangle className="text-red-500" />
                        Projected Impact Zones (2030)
                    </h3>

                    <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="text-4xl font-bold text-white">85%</div>
                            <div className="text-xs text-gray-400 uppercase">Risk Index</div>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Metrics & Context */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-2 mb-2 text-brand-amber">
                            <TrendingUp className="w-5 h-5" />
                            <span className="font-mono text-sm uppercase">Predictive Analytics Engine</span>
                        </div>
                        <h2 className="text-4xl font-display font-bold text-white mb-4">
                            Future Risk <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
                                Mitigation
                            </span>
                        </h2>
                        <p className="text-gray-400 leading-relaxed mb-8">
                            Our forecasting models ingest climate data, soil degradation rates, and urban expansion plans to predict high-risk zones 5-10 years in advance.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <RiskCard title="Soil Erosion" value="High" trend="+12%" icon={Wind} />
                            <RiskCard title="Water Stress" value="Critical" trend="+24%" icon={Droplets} />
                            <RiskCard title="Heat Islands" value="Mod" trend="-5%" icon={Thermometer} />
                            <RiskCard title="Bio Loss" value="High" trend="+8%" icon={AlertTriangle} />
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    )
}

export default PredictiveRisk
