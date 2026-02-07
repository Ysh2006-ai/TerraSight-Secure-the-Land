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
    }
};
