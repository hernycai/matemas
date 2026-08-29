// Back-End/controllers/ranking.controller.js
import prisma from '../config/prisma.js';

/**
 * Obtiene el ranking de usuarios ordenados por puntos
 * GET /api/ranking
 * Query params:
 * - limit: número de usuarios a retornar (default: 10)
 * - includeCurrentUser: si se debe incluir al usuario actual (default: true)
 */
export const getRanking = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const limit = parseInt(req.query.limit) || 10;
        const includeCurrentUser = req.query.includeCurrentUser !== 'false';

        // 1. Obtener top usuarios por puntos
        const topUsuarios = await prisma.usuario.findMany({
            where: {
                // Excluir usuarios sin nombre o con 0 puntos (opcional)
                nombre: { not: null },
                puntos: { gt: 0 }
            },
            select: {
                id: true,
                nombre: true,
                puntos: true,
                tokens: true,
                racha: true,
                mascota: true,
                createdAt: true,
                // Contar secciones aprobadas
                _count: {
                    select: {
                        seccionesAprobadas: true,
                        progreso: {
                            where: { resuelto: true }
                        }
                    }
                }
            },
            orderBy: {
                puntos: 'desc'
            },
            take: limit
        });

        // 2. Si el usuario actual no está en el top, obtener su posición
        let usuarioActual = null;
        let posicionUsuario = null;

        if (userId && includeCurrentUser) {
            const usuario = await prisma.usuario.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    nombre: true,
                    puntos: true,
                    tokens: true,
                    racha: true,
                    mascota: true,
                    createdAt: true,
                    _count: {
                        select: {
                            seccionesAprobadas: true,
                            progreso: {
                                where: { resuelto: true }
                            }
                        }
                    }
                }
            });

            if (usuario) {
                // Calcular posición del usuario
                const usuariosConMasPuntos = await prisma.usuario.count({
                    where: {
                        puntos: { gt: usuario.puntos }
                    }
                });
                posicionUsuario = usuariosConMasPuntos + 1;

                // Verificar si el usuario está en el top
                const estaEnTop = topUsuarios.some(u => u.id === userId);
                if (!estaEnTop) {
                    usuarioActual = {
                        ...usuario,
                        posicion: posicionUsuario,
                        esUsuarioActual: true
                    };
                }
            }
        }

        // 3. Formatear respuesta
        const ranking = topUsuarios.map((usuario, index) => ({
            id: usuario.id,
            nombre: usuario.nombre || 'Usuario Anónimo',
            puntos: usuario.puntos,
            tokens: usuario.tokens,
            racha: usuario.racha,
            mascota: usuario.mascota,
            seccionesAprobadas: usuario._count.seccionesAprobadas,
            ejerciciosResueltos: usuario._count.progreso,
            posicion: index + 1,
            esUsuarioActual: usuario.id === userId,
            // Calcular título según puntos o secciones aprobadas
            titulo: getTituloUsuario(usuario.puntos, usuario._count.seccionesAprobadas)
        }));

        // 4. Respuesta final
        const response = {
            ranking,
            totalUsuarios: await prisma.usuario.count(),
            usuarioActual: usuarioActual || null,
            posicionUsuario: posicionUsuario || null
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Obtiene solo el top 3 para el podio
 * GET /api/ranking/podio
 */
export const getPodio = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        // Obtener top 3 usuarios
        const topTres = await prisma.usuario.findMany({
            where: {
                nombre: { not: null },
                puntos: { gt: 0 }
            },
            select: {
                id: true,
                nombre: true,
                puntos: true,
                tokens: true,
                racha: true,
                mascota: true,
                _count: {
                    select: {
                        seccionesAprobadas: true,
                        progreso: {
                            where: { resuelto: true }
                        }
                    }
                }
            },
            orderBy: {
                puntos: 'desc'
            },
            take: 3
        });

        // Formatear podio
        const podio = topTres.map((usuario, index) => ({
            id: usuario.id,
            nombre: usuario.nombre || 'Usuario Anónimo',
            puntos: usuario.puntos,
            tokens: usuario.tokens,
            racha: usuario.racha,
            mascota: usuario.mascota,
            seccionesAprobadas: usuario._count.seccionesAprobadas,
            ejerciciosResueltos: usuario._count.progreso,
            posicion: index + 1,
            esUsuarioActual: usuario.id === userId,
            titulo: getTituloUsuario(usuario.puntos, usuario._count.seccionesAprobadas),
            // Medalla según posición
            medalla: index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'
        }));

        // Si el usuario actual no está en el podio, obtenerlo para saber su posición
        let usuarioActual = null;
        if (userId) {
            const usuarioEnPodio = podio.some(u => u.id === userId);
            if (!usuarioEnPodio) {
                const usuario = await prisma.usuario.findUnique({
                    where: { id: userId },
                    select: {
                        id: true,
                        nombre: true,
                        puntos: true,
                        tokens: true,
                        racha: true,
                        mascota: true,
                        _count: {
                            select: {
                                seccionesAprobadas: true,
                                progreso: {
                                    where: { resuelto: true }
                                }
                            }
                        }
                    }
                });

                if (usuario) {
                    const usuariosConMasPuntos = await prisma.usuario.count({
                        where: {
                            puntos: { gt: usuario.puntos }
                        }
                    });
                    usuarioActual = {
                        ...usuario,
                        posicion: usuariosConMasPuntos + 1,
                        esUsuarioActual: true,
                        titulo: getTituloUsuario(usuario.puntos, usuario._count.seccionesAprobadas)
                    };
                }
            }
        }

        res.status(200).json({
            podio,
            usuarioActual,
            totalUsuarios: await prisma.usuario.count()
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Función auxiliar para determinar el título del usuario
 */
function getTituloUsuario(puntos, seccionesAprobadas) {
    if (puntos >= 1000 && seccionesAprobadas >= 10) {
        return '🏆 Mente Matemática Suprema';
    }
    if (puntos >= 500 && seccionesAprobadas >= 5) {
        return '🧠 Genio Matemático';
    }
    if (puntos >= 200 && seccionesAprobadas >= 3) {
        return '📐 Maestro de la Geometría';
    }
    if (puntos >= 100 && seccionesAprobadas >= 2) {
        return '📊 As de la Suma';
    }
    if (puntos >= 50 && seccionesAprobadas >= 1) {
        return '⚡ Imparable de las Fracciones';
    }
    if (puntos >= 20) {
        return '🌟 Aprendiz Veloz';
    }
    if (puntos >= 10) {
        return '📝 Curioso Matemático';
    }
    return '🌱 Explorador de Números';
}

/**
 * Obtiene estadísticas del usuario actual para el ranking
 * GET /api/ranking/mi-estadistica
 */
export const getMiEstadistica = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const usuario = await prisma.usuario.findUnique({
            where: { id: userId },
            select: {
                id: true,
                nombre: true,
                puntos: true,
                tokens: true,
                racha: true,
                mascota: true,
                createdAt: true,
                _count: {
                    select: {
                        seccionesAprobadas: true,
                        progreso: {
                            where: { resuelto: true }
                        }
                    }
                }
            }
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Calcular posición
        const usuariosConMasPuntos = await prisma.usuario.count({
            where: {
                puntos: { gt: usuario.puntos }
            }
        });
        const posicion = usuariosConMasPuntos + 1;

        // Calcular total de usuarios
        const totalUsuarios = await prisma.usuario.count();

        // Calcular percentil
        const percentil = Math.round((1 - (posicion - 1) / totalUsuarios) * 100);

        res.status(200).json({
            usuario: {
                ...usuario,
                posicion,
                totalUsuarios,
                percentil,
                titulo: getTituloUsuario(usuario.puntos, usuario._count.seccionesAprobadas)
            }
        });
    } catch (error) {
        next(error);
    }
};