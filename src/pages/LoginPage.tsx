import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Satellite } from 'lucide-react';

export const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const { login, signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setError('');

        try {
            if (isSignUp) {
                await signUp(username, password);
                // If successful (no error thrown), we might need to check if auto-login happened or if we need to show "Check Email"
                // For Supabase, usually auto-login happens unless email confirm is on.
                // We'll assume if no error, we can try to navigate, but auth provider will handle state.
                // Let's just wait a moment for AuthContext to update.
            } else {
                await login(username, password);
            }
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Access Denied: Invalid Credentials');
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-brand-black flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/80 to-transparent"></div>

            <AnimatePresence mode="wait">
                {isLoggingIn ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 flex flex-col items-center justify-center p-8 text-center"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="bg-brand-green/10 p-4 rounded-full border border-brand-green mb-6"
                        >
                            <Satellite className="w-12 h-12 text-brand-green" />
                        </motion.div>
                        <h2 className="text-xl font-display font-bold text-white mb-2">Establishing Uplink...</h2>
                        <p className="text-brand-cyan/60 font-mono text-sm tracking-widest animate-pulse">
                            AUTHENTICATING WITH SATELLITE NETWORK
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="login-form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
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
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-brand-green mb-2 uppercase tracking-wider">Access Key</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-brand-green transition-colors font-mono"
                                    placeholder="••••••••"
                                    required
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
                                {isSignUp ? "INITIALIZE NEW PROFILE" : "INITIATE SESSION"}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-xs text-gray-500 font-mono mb-4">
                                AUTHORIZED PERSONNEL ONLY <br />
                                UNAUTHORIZED ACCESS WILL BE LOGGED
                            </p>
                            <button
                                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                                className="text-brand-cyan text-xs font-mono hover:text-white transition-colors border-b border-brand-cyan/30 pb-0.5"
                            >
                                {isSignUp ? "ALREADY HAVE CREDENTIALS? LOG IN" : "NEW OFFICER? REQUEST ACCESS"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
