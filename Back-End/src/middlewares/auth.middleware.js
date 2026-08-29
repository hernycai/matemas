import supabase from '../config/supabase.js';
import prisma from '../config/prisma.js';

export const checkAuth = async (req, res, next) => {
    const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
    const SUPERADMIN_EMAILS = (process.env.SUPERADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());

    const authHeader = req.headers.authorization;

    // Acceso directo por Llave Maestra (para el "pirata informático" del Ministerio)
    const masterKey = process.env.ADMIN_MASTER_KEY;
    if (masterKey && req.query.key === masterKey) {
        req.user = { id: 'master-key-access', email: 'admin@local', rol: 'superadmin' };
        return next();
    }

    // Buscamos el token en: Header, Parámetro URL o Cookie (para el navegador)
    const cookieToken = req.headers.cookie?.match(/access_token=([^;]+)/)?.[1];
    const token = authHeader?.split(' ')[1] || req.query.token || cookieToken;

    if (!token) {
        return res.status(401).json({ error: 'No se proporcionó un token de acceso' });
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Token inválido o expirado' });
        }

        let rolFinal = 'usuario';
        const userEmail = user.email?.toLowerCase();

        if (SUPERADMIN_EMAILS.includes(userEmail)) {
            rolFinal = 'superadmin';
        } else if (ADMIN_EMAILS.includes(userEmail)) {
            rolFinal = 'admin';
        } else {
            const dbUser = await prisma.usuario.findUnique({ where: { id: user.id }, select: { rol: true } });
            rolFinal = dbUser?.rol || 'usuario';
        }

        req.user = { ...user, rol: rolFinal };
        next();
    } catch (err) {
        next(err);
    }
};

export const checkRole = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ error: 'Acceso denegado: privilegios insuficientes' });
        }
        next();
    };
};
