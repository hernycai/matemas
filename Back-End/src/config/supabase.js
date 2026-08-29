import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const dataSource = process.env.DATA_SOURCE?.trim().toUpperCase();

let supabase;

// Solo inicializamos el cliente de Supabase si estamos en modo DB
// y si las credenciales no son los placeholders
console.log(`Supabase Client (Back-End): DATA_SOURCE es ${dataSource}`);
if (dataSource === 'DB' && supabaseUrl && supabaseAnonKey &&
    !supabaseUrl.includes('[TU_PROYECTO]') && !supabaseAnonKey.includes('[ANON_KEY]')) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    // Si estamos en modo MOCK o las credenciales no están configuradas,
    // proporcionamos un objeto mock básico para evitar errores de referencia
    // en el resto del código del Back-End.
    supabase = {
        auth: {
            signInWithPassword: async () => ({ data: { user: { id: 'mock-user', email: 'mock@example.com' } }, error: null }),
            signUp: async () => ({ data: { user: { id: 'mock-user', email: 'mock@example.com' } }, error: null }),
            signOut: async () => ({ error: null }),
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            // Mock getUser para el middleware de autenticación en desarrollo local
            getUser: async (token) => {
                if (token === 'dev-bypass-token') {
                    // Retorna un usuario mock con rol de admin para las pruebas locales
                    return {
                        data: {
                            user: { id: 'mock-admin-id', email: 'elmoteroloco@gmail.com', user_metadata: { full_name: 'Mock Admin' } }
                        },
                        error: null
                    };
                }
                return { data: { user: null }, error: { message: 'Invalid mock token' } };
            }
        },
        // Puedes extender este mock con más métodos si tu Back-End los usa
        from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: null, error: null }) }) }) })
    };
    console.warn('\x1b[33m%s\x1b[0m', '--- Supabase Client: MOCK/Placeholder mode (no conexión real) ---');
}

export default supabase;
