import prisma from '../config/prisma.js';

export const auditMiddleware = async (req, res, next) => {
    const methodsToLog = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (!methodsToLog.includes(req.method)) return next();

    const rol = req.user?.rol;
    if (rol !== 'admin' && rol !== 'superadmin') {
        return next();
    }

    const originalSend = res.send;
    res.send = function (body) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const usuarioId = req.user?.id || 'sistema';
            const entidad = req.originalUrl.split('/')[2]?.toUpperCase() || 'GENERAL';
            prisma.auditoria.create({
                data: {
                    usuarioId,
                    accion: req.method === 'POST' ? 'CREAR' : req.method === 'DELETE' ? 'ELIMINAR' : 'ACTUALIZAR',
                    entidad,
                    entidadId: req.params.id || req.params.escenarioId || null,
                    detalles: { path: req.originalUrl, method: req.method }
                }
            }).catch(() => {});
        }
        return originalSend.apply(res, arguments);
    };
    next();
};
