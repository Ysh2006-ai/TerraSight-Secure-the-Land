import { useAuth } from '../context/AuthContext';
import { useStats } from '../hooks/useStats';
import AlertsView from '../components/AlertsView';
import MapSection from '../components/MapSection';
import SatelliteGraph from '../components/SatelliteGraph';
import { Activity, Shield, Users, TreeDeciduous } from 'lucide-react';

export const DashboardPage = () => {
    const { user } = useAuth();
    const { stats, loading: statsLoading } = useStats();

    return (
        <div className="p-6 md:p-10 text-white pb-32">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold mb-1">Command Center</h1>
                    <p className="font-mono text-brand-green text-sm">System Status: ONLINE | Uplink Secure</p>
                </div>
                <div className='flex gap-4 items-center'>

                    <div className='text-right'>
                        <div className='text-xs text-gray-400 uppercase tracking-widest'>Current Operator</div>
                        <div className='font-bold'>{user?.name}</div>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-brand-navy/40 p-6 rounded-xl border border-white/5 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-500/20 text-red-500 rounded-lg">
                            <Activity size={24} />
                        </div>
                        {statsLoading ? <div className="h-8 w-16 bg-white/10 animate-pulse rounded"></div> :
                            <span className="text-3xl font-mono font-bold">{stats?.alertsToday || 0}</span>
                        }
                    </div>
                    <div className="text-gray-400 text-sm">New Alerts Today</div>
                </div>

                <div className="bg-brand-navy/40 p-6 rounded-xl border border-white/5 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-brand-amber/20 text-brand-amber rounded-lg">
                            <Shield size={24} />
                        </div>
                        {statsLoading ? <div className="h-8 w-16 bg-white/10 animate-pulse rounded"></div> :
                            <span className="text-3xl font-mono font-bold">{stats?.activeRisks || 0}</span>
                        }
                    </div>
                    <div className="text-gray-400 text-sm">High Risk Zones</div>
                </div>

                <div className="bg-brand-navy/40 p-6 rounded-xl border border-white/5 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-brand-cyan/20 text-brand-cyan rounded-lg">
                            <Users size={24} />
                        </div>
                        {statsLoading ? <div className="h-8 w-16 bg-white/10 animate-pulse rounded"></div> :
                            <span className="text-3xl font-mono font-bold">{stats?.patrolsActive || 0}</span>
                        }
                    </div>
                    <div className="text-gray-400 text-sm">Active Patrols</div>
                </div>

                <div className="bg-brand-navy/40 p-6 rounded-xl border border-white/5 backdrop-blur-sm">
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
                <div className="bg-brand-navy/30 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Activity className="text-brand-green" size={20} />
                        Recent Alerts
                    </h3>
                    <AlertsView limit={5} compact={true} />
                </div>

                {/* Placeholder for Map Widget or other content */}
                {/* Live Map Widget */}
                <div className="bg-brand-navy/30 border border-white/10 rounded-2xl overflow-hidden h-[400px] relative">
                    <MapSection className="h-full w-full" />
                </div>

                {/* Satellite Graph Widget */}
                <div className="bg-brand-navy/30 border border-white/10 rounded-2xl overflow-hidden h-[300px] lg:col-span-2">
                    <SatelliteGraph />
                </div>
            </div>
        </div>
    );
};
