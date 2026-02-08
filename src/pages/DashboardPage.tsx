import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStats } from '../hooks/useStats';
import AlertsView from '../components/AlertsView';
import MapSection from '../components/MapSection';
import SatelliteGraph from '../components/SatelliteGraph';
import { Activity, Shield, Users, TreeDeciduous, CalendarClock, AlertTriangle } from 'lucide-react';
import { governanceEngine } from '../services/GovernanceEngine';

export const DashboardPage = () => {
    const { user } = useAuth();
    const { stats, loading: statsLoading } = useStats();
    const [isFutureMode, setIsFutureMode] = useState(false);
    const [isEscalated, setIsEscalated] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    const handleSimulation = async (outcome: 'compliant' | 'violation') => {
        setIsFutureMode(true);
        if (outcome === 'violation') {
            setIsEscalated(true);
            setNotification("SIMULATING: 30-Day Check Failed. Activity Detected.");

            // Trigger Escalation
            try {
                const result = await governanceEngine.escalateToMinistry('DEMO-123');
                setNotification(`ESCALATION SENT to ${result.authority}`);
                setTimeout(() => setNotification(null), 5000);
            } catch (e: any) {
                console.error("Simulation failed:", e);
                // Extract useful error text (EmailJS often returns 'text' property)
                const errorMsg = e.text || e.message || "Unknown Error";
                setNotification(`FAILED: ${errorMsg} (Check Console)`);
            }
        } else {
            setIsEscalated(false);
            setNotification("SIMULATING: 30-Day Check Passed. Reforestation Verified.");
            setTimeout(() => setNotification(null), 5000);
        }
    };

    return (
        <div className={`p-6 md:p-10 text-white pb-32 transition-colors duration-500 ${isFutureMode ? (isEscalated ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-brand-black to-brand-black' : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-brand-black to-brand-black') : ''}`}>
            {notification && (
                <div className="fixed top-20 right-10 z-50 bg-brand-navy border border-white/20 p-4 rounded shadow-2xl animate-bounce">
                    <div className="flex items-center gap-2">
                        {isEscalated ? <AlertTriangle className="text-red-500" /> : <Shield className="text-green-500" />}
                        <span className="font-mono font-bold">{notification}</span>
                    </div>
                </div>
            )}

            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold mb-1">Command Center</h1>
                    <p className="font-mono text-brand-green text-sm flex items-center gap-2">
                        {isFutureMode ?
                            (isEscalated ? <span className="text-red-500 animate-pulse font-bold">⚠️ CRITICAL: NON-COMPLIANCE DETECTED (+30 DAYS)</span> :
                                <span className="text-purple-400 animate-pulse">PREDICTIVE SIMULATION MODE: +30 DAYS</span>) :
                            "System Status: ONLINE | Uplink Secure"
                        }
                    </p>
                </div>
                <div className='flex gap-4 items-center flex-wrap justify-end'>
                    {!isFutureMode ? (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleSimulation('compliant')}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-brand-green/20 hover:border-brand-green text-xs font-mono text-gray-300 transition-all"
                            >
                                <CalendarClock size={14} /> SIMULATE: PASSED
                            </button>
                            <button
                                onClick={() => handleSimulation('violation')}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-red-500/20 hover:border-red-500 text-xs font-mono text-gray-300 transition-all"
                            >
                                <AlertTriangle size={14} /> SIMULATE: FAILED
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => { setIsFutureMode(false); setIsEscalated(false); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-500 bg-purple-500/20 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] font-mono text-xs"
                        >
                            RETURN TO PRESENT
                        </button>
                    )}

                    <div className='text-right border-l border-white/10 pl-4'>
                        <div className='text-xs text-gray-400 uppercase tracking-widest'>Current Operator</div>
                        <div className='font-bold flex items-center gap-2'>
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            {user?.name}
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-brand-navy/40 p-6 rounded-xl border border-white/5 backdrop-blur-sm transition-all hover:bg-brand-navy/60">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-500/20 text-red-500 rounded-lg">
                            <Activity size={24} />
                        </div>
                        {statsLoading ? <div className="h-8 w-16 bg-white/10 animate-pulse rounded"></div> :
                            <span className="text-3xl font-mono font-bold">
                                {isFutureMode ? Math.max(0, (stats?.alertsToday || 0) - 2) : (stats?.alertsToday || 0)}
                            </span>
                        }
                    </div>
                    <div className="text-gray-400 text-sm">
                        {isFutureMode ? <span className="text-brand-green">▼ Projected Reduction</span> : "New Alerts Today"}
                    </div>
                </div>

                <div className="bg-brand-navy/40 p-6 rounded-xl border border-white/5 backdrop-blur-sm transition-all hover:bg-brand-navy/60">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-brand-amber/20 text-brand-amber rounded-lg">
                            <Shield size={24} />
                        </div>
                        {statsLoading ? <div className="h-8 w-16 bg-white/10 animate-pulse rounded"></div> :
                            <span className="text-3xl font-mono font-bold">
                                {isFutureMode ? Math.max(0, (stats?.activeRisks || 0) - 1) : (stats?.activeRisks || 0)}
                            </span>
                        }
                    </div>
                    <div className="text-gray-400 text-sm">
                        {isFutureMode ? <span className="text-brand-green">▼ Risk Mitigation</span> : "High Risk Zones"}
                    </div>
                </div>

                <div className="bg-brand-navy/40 p-6 rounded-xl border border-white/5 backdrop-blur-sm transition-all hover:bg-brand-navy/60">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-brand-cyan/20 text-brand-cyan rounded-lg">
                            <Users size={24} />
                        </div>
                        {statsLoading ? <div className="h-8 w-16 bg-white/10 animate-pulse rounded"></div> :
                            <span className="text-3xl font-mono font-bold">
                                {isFutureMode ? (stats?.patrolsActive || 0) + 3 : (stats?.patrolsActive || 0)}
                            </span>
                        }
                    </div>
                    <div className="text-gray-400 text-sm">
                        {isFutureMode ? <span className="text-brand-cyan">▲ Deployment Incr.</span> : "Active Patrols"}
                    </div>
                </div>

                <div className="bg-brand-navy/40 p-6 rounded-xl border border-white/5 backdrop-blur-sm transition-all hover:bg-brand-navy/60">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-brand-green/20 text-brand-green rounded-lg">
                            <TreeDeciduous size={24} />
                        </div>
                        {statsLoading ? <div className="h-8 w-16 bg-white/10 animate-pulse rounded"></div> :
                            <span className="text-xl font-mono font-bold">{stats?.protectedArea || '--'}</span>
                        }
                    </div>
                    <div className="text-gray-400 text-sm">Protected Area</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Alerts Widget */}
                <div className="bg-brand-navy/30 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                    {isFutureMode && <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] px-2 py-1 rounded-bl font-mono">SIMULATION</div>}
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Activity className={isFutureMode ? "text-purple-400" : "text-brand-green"} size={20} />
                        {isFutureMode ? "Projected Alerts (Low Probability)" : "Recent Alerts"}
                    </h3>
                    <AlertsView limit={5} compact={true} />
                </div>

                {/* Live Map Widget */}
                <div className="bg-brand-navy/30 border border-white/10 rounded-2xl overflow-hidden h-[400px] relative">
                    {isFutureMode && (
                        <div className="absolute inset-0 z-10 pointer-events-none bg-purple-900/10 flex items-center justify-center">
                            <div className="bg-black/70 backdrop-blur px-4 py-2 rounded border border-purple-500/50 text-purple-300 font-mono text-xs">
                                VISUALIZING PROJECTED LAND RECOVERY
                            </div>
                        </div>
                    )}
                    <MapSection className="h-full w-full" />
                </div>

                {/* Satellite Graph Widget */}
                <div className={`bg-brand-navy/30 border ${isFutureMode ? 'border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'border-white/10'} rounded-2xl overflow-hidden h-[300px] lg:col-span-2 transition-all`}>
                    <SatelliteGraph mockFuture={isFutureMode} />
                </div>
            </div>
        </div>
    );
};
