import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { motion } from 'framer-motion'

const data = [
    { name: 'Jan', loss: 4000 },
    { name: 'Feb', loss: 3000 },
    { name: 'Mar', loss: 2000 },
    { name: 'Apr', loss: 2780 },
    { name: 'May', loss: 1890 },
    { name: 'Jun', loss: 2390 },
    { name: 'Jul', loss: 3490 },
]

const pieData = [
    { name: 'Forest', value: 400 },
    { name: 'Urban', value: 300 },
    { name: 'Water', value: 300 },
    { name: 'Agriculture', value: 200 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const InsightsView = () => {
    return (
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 pointer-events-auto">
            {/* Chart 1 */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 bg-brand-navy/90 backdrop-blur-xl border border-brand-navy rounded-2xl shadow-2xl"
            >
                <h3 className="text-xl font-display font-bold text-white mb-6">Deforestation Trend (Hectares)</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#00ff9d" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#030304', borderColor: '#333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="loss" stroke="#00ff9d" fillOpacity={1} fill="url(#colorLoss)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Chart 2 */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 bg-brand-navy/90 backdrop-blur-xl border border-brand-navy rounded-2xl shadow-2xl"
            >
                <h3 className="text-xl font-display font-bold text-white mb-6">Land Use Distribution</h3>
                <div className="h-[300px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#030304', borderColor: '#333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    )
}

export default InsightsView
