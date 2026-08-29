import prisma from '../config/prisma.js';

export const getLeccionesBySeccion = async (req, res, next) => {
    const { seccionId } = req.params;
    try {
        const lecciones = await prisma.leccion.findMany({
            where: { seccionId: parseInt(seccionId) },
            orderBy: { orden: 'asc' }
        });
        return res.json(lecciones);
    } catch (error) {
        next(error);
    }
};

export const crearLeccion = async (req, res, next) => {
    const { seccionId } = req.params;
    const { titulo, videoUrl, orden } = req.body;
    try {
        const nuevaLeccion = await prisma.leccion.create({
            data: { titulo, videoUrl, orden: orden ?? 0, seccionId: parseInt(seccionId) }
        });
        return res.status(201).json(nuevaLeccion);
    } catch (error) {
        next(error);
    }
};

export const actualizarLeccion = async (req, res, next) => {
    const { leccionId } = req.params;
    const { titulo, videoUrl, orden } = req.body;
    try {
        const leccion = await prisma.leccion.update({
            where: { id: parseInt(leccionId) },
            data: { titulo, videoUrl, orden }
        });
        return res.json(leccion);
    } catch (error) {
        next(error);
    }
};

export const eliminarLeccion = async (req, res, next) => {
    const { leccionId } = req.params;
    try {
        await prisma.leccion.delete({ where: { id: parseInt(leccionId) } });
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};
