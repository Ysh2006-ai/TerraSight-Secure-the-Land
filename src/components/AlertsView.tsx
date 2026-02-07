import { AlertTriangle, MapPin, Clock, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAlerts } from '../hooks/useAlerts'
import { formatDistanceToNow } from 'date-fns'

interface AlertsViewProps {
    limit?: number;
    compact?: boolean;
}

const AlertsView = ({ limit, compact = false }: AlertsViewProps) => {
    const { alerts, loading, error } = useAlerts();

    const displayAlerts = limit ? alerts.slice(0, limit) : alerts;

    if (loading) return <div className="p-8 text-center text-gray-400 font-mono animate-pulse">Scanning surveillance grid...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-mono">Connection Lost: {error}</div>;

    return (
        <div className={`w-full ${compact ? '' : 'max-w-4xl p-8 bg-brand-navy/90 backdrop-blur-xl border border-brand-navy rounded-2xl shadow-2xl'}`}>
            {!compact && (
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                        <Activity className="text-brand-green animate-pulse" />
                        Active Threats
                    </h2>
                    <span className="px-3 py-1 bg-brand-green/20 text-brand-green text-xs font-mono uppercase rounded border border-brand-green/30">
                        Live Feed
                    </span>
                </div>
            )}

            <div className="space-y-4">
                {displayAlerts.map((alert, index) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.02, x: 10 }}
                        className="group flex items-center justify-between p-4 bg-brand-black/50 border border-white/5 rounded-lg hover:border-brand-green/50 transition-all hover:bg-white/5 cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${alert.severity === 'critical' || alert.severity === 'high' ? 'bg-red-500/20 text-red-500' :
                                alert.severity === 'medium' ? 'bg-brand-amber/20 text-brand-amber' :
                                    'bg-blue-500/20 text-blue-500'
                                }`}>
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-medium text-lg capitalize">{alert.type}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {alert.location || `${alert.lat.toFixed(2)}, ${alert.lng.toFixed(2)}`}</span>
                                    <span className="flex items-center gap-1"><Clock size={14} /> {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            {alert.confidence && (
                                <>
                                    <div className="text-2xl font-bold font-mono text-white">{alert.confidence}%</div>
                                    <div className="text-xs text-gray-500 uppercase">Confidence</div>
                                </>
                            )}
                            {!alert.confidence && (
                                <div className="text-xs text-gray-500 uppercase px-2 py-1 bg-white/5 rounded">
                                    {alert.status}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default AlertsView
