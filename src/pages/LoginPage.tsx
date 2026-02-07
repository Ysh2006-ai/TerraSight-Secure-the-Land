import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const LoginPage = () => {
    const [username, setUsername] = useState('codegenesis@gmail.com');
    const [password, setPassword] = useState('123456789');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch {
            setError('Access Denied: Invalid Credentials');
        }
    };

    return (
        <div className="min-h-screen w-full bg-brand-black flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/80 to-transparent"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md p-8 bg-brand-navy/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">TerraSight Access</h1>
                    <p className="text-brand-cyan/60 font-mono text-sm tracking-widest">SECURE SATELLITE UPLINK</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-mono text-brand-green mb-2 uppercase tracking-wider">Email Address</label>
                        <input
                            type="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-brand-green transition-colors font-mono"
                            placeholder="officer@terrasight.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-brand-green mb-2 uppercase tracking-wider">Access Key</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-brand-green transition-colors font-mono"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-xs font-mono border border-red-500/30 bg-red-500/10 p-2 rounded text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-brand-green text-brand-black font-bold py-3 rounded hover:bg-white transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(0,255,157,0.3)]"
                    >
                        INITIATE SESSION
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500 font-mono">
                        AUTHORIZED PERSONNEL ONLY <br />
                        UNAUTHORIZED ACCESS WILL BE LOGGED
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
