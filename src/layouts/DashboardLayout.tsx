import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Map, AlertTriangle, Settings, LogOut, Home } from 'lucide-react';
import { motion } from 'framer-motion';

import Logo from '../assets/Logo.png';

export const DashboardLayout = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: Map, label: 'Live Map', path: '/dashboard/map' },
        { icon: AlertTriangle, label: 'Alerts', path: '/dashboard/alerts' },
        { icon: Home, label: 'Home', path: '/' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ];

    return (
        <div className="flex h-screen w-full bg-brand-black text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-brand-navy/30 border-r border-white/10 flex flex-col backdrop-blur-md">
                <div className="p-6 border-b border-white/10 flex flex-col items-center">
                    <div className="flex items-center justify-center w-full mb-6">
                        <img src={Logo} alt="TerraSight" className="h-40 w-auto object-contain drop-shadow-[0_0_20px_rgba(45,212,191,0.2)]" />
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg border border-white/5 w-full">
                        <img
                            src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=random"}
                            alt="User"
                            className="w-8 h-8 rounded-full border border-brand-cyan/50"
                        />
                        <div className="overflow-hidden flex-1">
                            <div className="text-xs font-bold truncate">{user?.name || 'Commander'}</div>
                            <div className="text-[10px] text-brand-green font-mono uppercase truncate">{user?.role || 'Guest'}</div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                                    ${isActive
                                        ? 'bg-brand-green/10 text-brand-green border border-brand-green/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                                `}
                            >
                                <Icon size={18} />
                                <span className="text-sm font-medium">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="ml-auto w-1 h-1 bg-brand-green rounded-full shadow-[0_0_8px_brand-green]"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Disconnect</span>
                    </button>
                    <div className="mt-4 text-[10px] text-center text-gray-600 font-mono">
                        v1.0.4 stable • latency: 24ms
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative">
                {/* Background Grid */}
                <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                ></div>

                <div className="relative z-10 w-full min-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
