import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, type User } from '../services/auth';
import { supabase } from '../lib/supabase/client';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    signUp: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(authService.mapSessionUser(session.user));
            }
            setLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(authService.mapSessionUser(session.user));
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        await authService.login(email, password);
        // State update handled by onAuthStateChange
    };

    const signUp = async (email: string, password: string) => {
        await authService.signUp(email, password);
        // State update handled by onAuthStateChange if auto-login, 
        // otherwise notification is shown by LoginPage
    };

    const logout = () => {
        authService.logout();
        // State update handled by onAuthStateChange
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            signUp,
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
