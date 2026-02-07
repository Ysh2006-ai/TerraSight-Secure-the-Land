import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useSatelliteData } from '../hooks/useSatelliteData';
import { Satellite } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const SatelliteGraph = () => {
    const { data, loading, error } = useSatelliteData();

    if (loading) return <div className="h-full flex items-center justify-center text-brand-green/50 font-mono animate-pulse">Acquiring signal...</div>;
    if (error) return <div className="h-full flex items-center justify-center text-red-500 font-mono">Signal Lost</div>;

    return (
        <div className="w-full h-full p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                    <Satellite size={18} className="text-brand-cyan" />
                    Spectral Analysis
                </h3>
                <div className="flex gap-4 text-xs font-mono">
                    <div className="flex items-center gap-1 text-brand-green">
                        <div className="w-2 h-2 rounded-full bg-brand-green"></div> Sentinel-2 (NDVI)
                    </div>
                    <div className="flex items-center gap-1 text-brand-cyan">
                        <div className="w-2 h-2 rounded-full bg-brand-cyan"></div> Sentinel-1 (SAR)
                    </div>
                </div>
            </div>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorNdvi" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00ff9d" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorSar" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(str) => format(parseISO(str), 'dd MMM')}
                            stroke="#666"
                            tick={{ fontSize: 10, fill: '#666' }}
                            tickMargin={10}
                        />
                        <YAxis
                            yAxisId="left"
                            stroke="#00ff9d"
                            tick={{ fontSize: 10, fill: '#00ff9d' }}
                            domain={[0, 1]}
                            tickFormatter={(val) => val.toFixed(1)}
                            label={{ value: 'NDVI', angle: -90, position: 'insideLeft', fill: '#00ff9d', fontSize: 10 }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#00f3ff"
                            tick={{ fontSize: 10, fill: '#00f3ff' }}
                            domain={[-20, 0]}
                            label={{ value: 'Backscatter (dB)', angle: 90, position: 'insideRight', fill: '#00f3ff', fontSize: 10 }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(11, 16, 27, 0.9)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                            itemStyle={{ fontSize: 12 }}
                            labelStyle={{ color: '#aaa', marginBottom: 5 }}
                        />
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="ndvi"
                            stroke="#00ff9d"
                            fillOpacity={1}
                            fill="url(#colorNdvi)"
                            name="Vegetation Index"
                        />
                        <Area
                            yAxisId="right"
                            type="monotone"
                            dataKey="sar"
                            stroke="#00f3ff"
                            fillOpacity={1}
                            fill="url(#colorSar)"
                            name="SAR Backscatter"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SatelliteGraph;
