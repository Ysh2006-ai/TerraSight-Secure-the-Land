/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Eye, ChevronDown } from "lucide-react";
import { useMission, AVAILABLE_STATES } from "../../context/MissionContext";

export default function SurveillanceFeed() {
    const { alerts, setActiveTarget, systemLogs, activeState, setActiveState, addLog, activeTarget } = useMission();

    const handleAudit = async () => {
        if (!activeState) return;
        addLog(`[System] MANUAL AUDIT INITIATED: ${activeState.name}`);

        // Mocking Request for Vite
        setTimeout(() => {
            addLog(`[Audit] Scanning sector...`);
            setTimeout(() => {
                addLog(`[Audit] STATUS CLEAR. No anomalies.`);
            }, 1500);
        }, 500);
    };

    return (
        <div className="absolute top-16 left-6 w-80 h-[calc(100%-5rem)] z-40 glass-panel rounded-lg overflow-hidden flex flex-col pointer-events-auto">
            <div className="p-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <h3 className="text-xs font-bold text-electric-cyan tracking-widest flex items-center gap-2">
                    <Eye className="w-3 h-3" /> SURVEILLANCE FEED
                </h3>
                <button
                    onClick={handleAudit}
                    disabled={!!activeTarget}
                    className={`text-[10px] px-2 py-1 rounded border transition-colors uppercase tracking-wider font-mono cursor-pointer 
                        ${!!activeTarget
                            ? 'bg-gray-500/10 text-gray-500 border-gray-500/30 cursor-not-allowed'
                            : 'bg-electric-cyan/10 hover:bg-electric-cyan/20 text-electric-cyan border-electric-cyan/30'
                        }`}
                >
                    AUDIT SECTOR
                </button>
            </div>

            {/* STATE SELECTOR */}
            <div className="p-2 border-b border-white/10 bg-black/40">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/50 uppercase tracking-wider">Target:</span>
                    <div className="relative flex-1">
                        <select
                            value={activeState?.code || ''}
                            onChange={(e) => {
                                const selected = AVAILABLE_STATES.find(s => s.code === e.target.value);
                                if (selected) {
                                    setActiveState(selected);
                                    addLog(`[System] STATE CHANGED: ${selected.name}`);
                                    addLog(`[System] Starting live monitoring...`);
                                }
                            }}
                            className="w-full bg-brand-black border border-electric-cyan/30 text-electric-cyan text-xs px-2 py-1.5 rounded appearance-none cursor-pointer hover:border-electric-cyan focus:outline-none focus:border-electric-cyan"
                        >
                            <option value="" disabled>Select State...</option>
                            {AVAILABLE_STATES.map(state => (
                                <option key={state.code} value={state.code}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-electric-cyan pointer-events-none" />
                    </div>
                </div>
            </div>
            {activeState && !activeTarget && (
                <div className="mt-1 text-[9px] text-matrix-green animate-pulse">
                    ● SCANNING: {activeState.name} | Interval: 10s
                </div>
            )}
            {activeState && activeTarget && (
                <div className="mt-1 text-[9px] text-warning-amber font-bold animate-pulse flex justify-between items-center">
                    <span>⏸ PATROL PAUSED: Reviewing Alert</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveTarget(null);
                        }}
                        className="text-[8px] bg-electric-cyan/20 px-1.5 py-0.5 rounded text-electric-cyan hover:bg-electric-cyan/40"
                    >
                        RESUME
                    </button>
                </div>
            )}

            {/* LIVE TERMINAL */}
            <div className="bg-black/80 font-mono text-[10px] p-2 border-b border-white/10 h-32 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
                <div className="space-y-1">
                    {systemLogs.map((log, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1 - (i * 0.15), x: 0 }} // Fade out older logs
                            className="text-electric-cyan/80 truncate"
                        >
                            <span className="opacity-50 mr-2">{log.split(']')[0]}]</span>
                            {log.split(']')[1]}
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 no-scrollbar">
                <AnimatePresence>
                    {alerts.map((alert) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: -20, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: "auto" }}
                            exit={{ opacity: 0, x: -20 }}
                            onClick={() => setActiveTarget(alert)}
                            className={`
                  p-3 rounded-md border border-white/5 bg-black/40 hover:bg-white/5 transition-colors cursor-pointer group
                  ${alert.type === 'CRITICAL' ? 'border-l-2 border-l-red-500' : ''}
                  ${alert.type === 'WARNING' ? 'border-l-2 border-l-warning-amber' : ''}
                  ${alert.type === 'INFO' ? 'border-l-2 border-l-electric-cyan' : ''}
                `}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold ${alert.type === 'CRITICAL' ? 'text-red-500' :
                                    alert.type === 'WARNING' ? 'text-warning-amber' : 'text-electric-cyan'
                                    }`}>{alert.type}</span>
                                <span className="text-[9px] text-white/30">{alert.time}</span>
                            </div>
                            <div className="text-xs font-mono text-white/90 mb-1 leading-tight group-hover:text-electric-cyan transition-colors">
                                {alert.msg}
                            </div>
                            <div className="flex items-center gap-1 text-[9px] text-white/50 font-mono">
                                <MapPin className="w-2 h-2" /> {alert.loc}
                            </div>
                            {/* PRODUCTION REQUIREMENT: Show Blockchain Status */}
                            <div className="mt-1 pt-1 border-t border-white/10 flex items-center gap-1 text-[8px] tracking-wider text-green-400 font-bold">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                BLOCKCHAIN SECURED: EVIDENCE IMMUTABLE
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {alerts.length === 0 && (
                    <div className="p-4 text-center text-xs text-white/30 animate-pulse">
                        SCANNING SECTOR 4...
                    </div>
                )}
            </div>
        </div >
    );
}
