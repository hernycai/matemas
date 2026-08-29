import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidConfig = supabaseUrl &&
                     supabaseKey &&
                     !supabaseUrl.includes('[TU_PROYECTO]') &&
                     !supabaseKey.includes('[ANON_KEY]');

const authStorage = {
    getItem: (key) => {
        return sessionStorage.getItem(key) ?? localStorage.getItem(key);
    },
    setItem: (key, value) => {
        const ephemeral = sessionStorage.getItem('mate_auth_ephemeral') === '1';
        if (ephemeral) {
            sessionStorage.setItem(key, value);
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, value);
            sessionStorage.removeItem(key);
        }
    },
    removeItem: (key) => {
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
    },
};

let supabase;

if (isValidConfig) {
    if (import.meta.env.DEV) {
        console.log('Supabase Client (Front-End): Intentando inicializar con credenciales reales.');
    }
    try {
        supabase = createClient(supabaseUrl, supabaseKey, {
            auth: {
                storage: authStorage,
                persistSession: true,
                autoRefreshToken: true,
            },
        });
        // Limpieza de seguridad para evitar sesiones "fantasma" del modo mock
        if (localStorage.getItem('supabase.mock.session')) localStorage.removeItem('supabase.mock.session');
    } catch (error) {
        console.error("Error al inicializar Supabase Client:", error);
        console.warn('Supabase Client (Front-End): Falló la inicialización con credenciales reales, se usará el mock.');
    }
}

// Si la configuración no es válida o falló la creación, proporcionamos un objeto mock
// para evitar errores de referencia y permitir que el AuthContext funcione en modo local.
if (!supabase) {
    const MOCK_STORAGE_KEY = 'supabase.mock.session';

    supabase = {
        auth: {
            getSession: async () => {
                const saved = localStorage.getItem(MOCK_STORAGE_KEY);
                return { data: { session: saved ? JSON.parse(saved) : null } };
            },
            onAuthStateChange: (callback) => {
                const saved = localStorage.getItem(MOCK_STORAGE_KEY);
                callback('INITIAL_SESSION', saved ? JSON.parse(saved) : null);
                return { data: { subscription: { unsubscribe: () => {} } } };
            },
            signInWithPassword: async () => Promise.reject(new Error("SUPABASE_UNAVAILABLE_MOCK")),
            signInWithOAuth: async () => Promise.reject(new Error("SUPABASE_UNAVAILABLE_MOCK")),
            signUp: async () => Promise.reject(new Error("SUPABASE_UNAVAILABLE_MOCK")),
            signOut: async () => {
                localStorage.removeItem(MOCK_STORAGE_KEY);
                return { error: null };
            },
            _updateMockSession: (session) => {
                if (session) localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(session));
                else localStorage.removeItem(MOCK_STORAGE_KEY);
            }
        }
    };
    console.warn('\x1b[33m%s\x1b[0m', '--- Supabase Client (Front-End): MOCK/Placeholder mode (no conexión real) ---');
}

export { supabase };
