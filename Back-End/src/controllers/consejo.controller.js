import prisma from '../config/prisma.js';

export const getConsejosByEscenario = async (req, res, next) => {
    const { escenarioId } = req.params;
    try {
        const consejos = await prisma.consejo.findMany({
            where: { escenarioId: parseInt(escenarioId), activo: true }
        });
        return res.json(consejos);
    } catch (error) {
        next(error);
    }
};

export const crearConsejo = async (req, res, next) => {
    const { escenarioId } = req.params;
    const { descripcion, activo } = req.body;
    try {
        const nuevoConsejo = await prisma.consejo.create({
            data: { descripcion, activo: activo ?? true, escenarioId: parseInt(escenarioId) }
        });
        return res.status(201).json(nuevoConsejo);
    } catch (error) {
        next(error);
    }
};

export const actualizarConsejo = async (req, res, next) => {
    const { consejoId } = req.params;
    const { descripcion, activo } = req.body;
    try {
        const consejo = await prisma.consejo.update({
            where: { id: parseInt(consejoId) },
            data: { descripcion, activo }
        });
        return res.json(consejo);
    } catch (error) {
        next(error);
    }
};

export const eliminarConsejo = async (req, res, next) => {
    const { consejoId } = req.params;
    try {
        await prisma.consejo.delete({ where: { id: parseInt(consejoId) } });
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};
