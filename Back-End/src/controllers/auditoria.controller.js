import prisma from '../config/prisma.js';

export const getLogs = async (req, res, next) => {
    const { limit } = req.query;
    try {
        const logs = await prisma.auditoria.findMany({
            take: limit ? parseInt(limit) : undefined,
            include: {
                usuario: {
                    select: {
                        nombre: true,
                        email: true
                    }
                }
            },
            orderBy: {
                timestamp: 'desc'
            }
        });
        return res.json(logs);
    } catch (error) {
        next(error);
    }
};
