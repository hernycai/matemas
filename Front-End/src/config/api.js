import axios from 'axios';
import { supabase } from './supabaseClient';

const rawBaseURL = import.meta.env.VITE_API_URL;

const normalizeBaseURL = (url) => {
    if (!url || typeof url !== 'string') return null;

    // Limpia comillas y casos donde pegaron "VITE_API_URL=https://..."
    let cleaned = url
        .replace(/['"]/g, '')
        .replace(/^VITE_API_URL\s*[=:]\s*/i, '')
        .trim();

    // Si quedó basura + URL, extrae la primera http(s)
    const matched = cleaned.match(/https?:\/\/[^\s]+/i);
    if (matched) cleaned = matched[0];

    cleaned = cleaned.replace(/\/+$/, '');
    if (!/^https?:\/\//i.test(cleaned)) return null;

    // El back monta las rutas bajo /api. Si falta, lo agregamos.
    if (!cleaned.endsWith('/api')) {
        cleaned = `${cleaned}/api`;
    }
    return cleaned;
};

const cleanBaseURL = normalizeBaseURL(rawBaseURL);

console.log('📡 API BaseURL:', cleanBaseURL || 'Usando fallback');

const api = axios.create({
    baseURL: cleanBaseURL || (
        import.meta.env.MODE === 'production'
        ? '/api'
        : 'http://localhost:3001/api'),
    timeout: 30000
});

api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
