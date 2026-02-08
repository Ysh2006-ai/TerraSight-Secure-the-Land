import { supabase } from '../lib/supabase/client';

export interface User {
    id: string;
    name: string;
    role: 'admin' | 'officer' | 'analyst' | 'public';
    avatar?: string;
    email?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export const authService = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        if (!data.session || !data.user) throw new Error('Login failed: No session created');

        const roleValue = data.user.user_metadata?.role;
        const validRoles: User['role'][] = ['admin', 'officer', 'analyst', 'public'];
        const role: User['role'] = validRoles.includes(roleValue) ? roleValue : 'public';

        const user: User = {
            id: data.user.id,
            name: data.user.user_metadata?.name || email.split('@')[0],
            role,
            avatar: data.user.user_metadata?.avatar,
            email: data.user.email
        };

        return {
            token: data.session.access_token,
            user
        };
    },

    logout: async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    getCurrentUser: (): User | null => {
        // Fallback to local storage for synchronous access, 
        // but AuthContext should prefer async session check
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    },

    signUp: async (email: string, password: string): Promise<AuthResponse> => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error;
        if (!data.session || !data.user) {
            // If email confirmation is required, session might be null. 
            // For demo, we assume auto-confirm or we handle the "check email" state.
            // But for now, let's just return a mock user state if session is missing 
            // (or throw if we strictly want immediate login).
            if (data.user && !data.session) {
                // Return user without token - frontend handles "Check Email" message
                throw new Error('Please check your email to confirm your account.');
            }
            throw new Error('Signup failed: No session created');
        }

        const user: User = authService.mapSessionUser(data.user);

        return {
            token: data.session.access_token,
            user
        };
    },

    mapSessionUser: (user: any): User => {
        const roleValue = user.user_metadata?.role;
        const validRoles: User['role'][] = ['admin', 'officer', 'analyst', 'public'];
        const role: User['role'] = validRoles.includes(roleValue) ? roleValue : 'public';

        return {
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            role,
            avatar: user.user_metadata?.avatar,
            email: user.email
        };
    }
};
