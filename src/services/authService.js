import portalRules from '../utils/portalRules.cjs';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const SIGN_IN_FUNCTION = 'sign-in-with-code';

export async function signInWithAccessCode(code, password) {
    if (!isSupabaseConfigured || !supabase) {
        throw new Error('La conexión con TTUTIS no está configurada en este dispositivo.');
    }

    const normalizedCode = code.trim().toUpperCase();
    if (!portalRules.isValidAccessCode(normalizedCode) || !password) {
        throw new Error('Ingresa un código válido y tu contraseña.');
    }

    const { data, error } = await supabase.functions.invoke(SIGN_IN_FUNCTION, {
        body: { code: normalizedCode, password },
    });

    if (error || !data?.session?.access_token || !data?.session?.refresh_token) {
        // Keep responses generic so login does not reveal whether a code exists.
        throw new Error('No se pudo iniciar sesión. Revisa tus datos o inténtalo más tarde.');
    }

    const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
    });

    if (sessionError) {
        throw new Error('No se pudo iniciar sesión. Revisa tus datos o inténtalo más tarde.');
    }
}

export async function signOut() {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) throw new Error('No se pudo cerrar la sesión. Inténtalo de nuevo.');
}
