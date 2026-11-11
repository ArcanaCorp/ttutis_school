import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { signInWithAccessCode, signOut } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(Boolean(supabase));
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        if (!supabase) return undefined;

        let mounted = true;
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            if (mounted) {
                setSession(nextSession);
                setLoading(false);
            }
        });

        supabase.auth.getSession().then(({ data, error }) => {
            if (!mounted) return;
            if (error) setAuthError('No se pudo recuperar la sesión guardada.');
            setSession(data?.session ?? null);
            setLoading(false);
        });

        let appStateSubscription;
        if (Platform.OS !== 'web') {
            appStateSubscription = AppState.addEventListener('change', (state) => {
                if (state === 'active') supabase.auth.startAutoRefresh();
                else supabase.auth.stopAutoRefresh();
            });
        }

        return () => {
            mounted = false;
            subscription.unsubscribe();
            appStateSubscription?.remove();
        };
    }, []);

    const profile = useMemo(() => {
        const user = session?.user;
        if (!user) return null;

        // Display metadata only; authorization is always enforced by backend policies.
        const fullName = user.user_metadata?.full_name || user.email || 'Usuario TTUTIS';
        return { id: user.id, fullName, academic: null };
    }, [session]);

    const contextValue = useMemo(() => ({
        session,
        loading,
        profile,
        isConfigured: isSupabaseConfigured,
        authError,
        signIn: async (code, password) => {
            setAuthError(null);
            try {
                await signInWithAccessCode(code, password);
            } catch (error) {
                setAuthError(error.message);
                throw error;
            }
        },
        signOut,
    }), [session, loading, profile, authError]);

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
