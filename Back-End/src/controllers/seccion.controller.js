import prisma from '../config/prisma.js';
import { crearEditarSeccionSchema } from '../validators/seccion.validator.js';

export const getSecciones = async (req, res, next) => {
    try {
        const usuarioId = req.user?.id;

        const secciones = await prisma.seccion.findMany({
            include: {
                rama: true,
                escenarios: { select: { id: true } },
            },
            orderBy: [{ ramaId: 'asc' }, { grado: 'asc' }, { id: 'asc' }],
        });

        let aprobadasIds = new Set();
        if (usuarioId) {
            const aprobadas = await prisma.seccionAprobada.findMany({
                where: { usuarioId },
                select: { seccionId: true },
            });
            aprobadasIds = new Set(aprobadas.map((a) => a.seccionId));
        }

        // Desbloqueo secuencial por grado dentro de cada rama:
        // grado 1 libre; grado N libre si el grado N-1 de la misma rama está aprobado.
        const porRama = new Map();
        for (const s of secciones) {
            const key = s.ramaId ?? 'none';
            if (!porRama.has(key)) porRama.set(key, []);
            porRama.get(key).push(s);
        }

        const desbloqueadas = new Set();
        for (const lista of porRama.values()) {
            const ordenadas = [...lista].sort((a, b) => a.grado - b.grado || a.id - b.id);
            ordenadas.forEach((s, idx) => {
                if (idx === 0) {
                    desbloqueadas.add(s.id);
                    return;
                }
                const prev = ordenadas[idx - 1];
                if (aprobadasIds.has(prev.id)) {
                    desbloqueadas.add(s.id);
                }
            });
        }

        const seccionesConEstado = secciones.map((s) => ({
            ...s,
            escenarios: undefined,
            escenariosCount: s.escenarios?.length ?? 0,
            estaAprobada: aprobadasIds.has(s.id),
            estaDesbloqueada: desbloqueadas.has(s.id) || aprobadasIds.has(s.id),
        }));

        return res.json(seccionesConEstado);
    } catch (error) {
        next(error);
    }
};

export const getSeccionById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const seccion = await prisma.seccion.findUnique({
            where: { id: parseInt(id) },
            include: { escenarios: true, rama: true, lecciones: { orderBy: { orden: 'asc' } } },
        });
        if (!seccion) return res.status(404).json({ error: 'Sección no encontrada' });
        return res.json(seccion);
    } catch (error) {
        next(error);
    }
};

export const crearSeccion = async (req, res, next) => {
    try {
        const validacion = crearEditarSeccionSchema.safeParse(req.body);
        if (!validacion.success) {
            return res.status(400).json({ error: validacion.error.errors });
        }

        const { nombre, descripcion, grado, puntosRequeridos, puntosRecompensa, umbralAprobacion } = validacion.data;
        const nuevaSeccion = await prisma.seccion.create({
            data: { nombre, descripcion, grado, puntosRequeridos, puntosRecompensa, umbralAprobacion }
        });

        return res.status(201).json(nuevaSeccion);
    } catch (error) {
        next(error);
    }
};

export const eliminarSeccion = async (req, res, next) => {
    const { id } = req.params;
    try {
        await prisma.seccion.delete({ where: { id: parseInt(id) } });

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const actualizarSeccion = async (req, res, next) => {
    const { id } = req.params;
    try {
        const validacion = crearEditarSeccionSchema.safeParse(req.body);
        if (!validacion.success) {
            return res.status(400).json({ error: validacion.error.errors });
        }

        const { nombre, descripcion, grado, umbralAprobacion, puntosRecompensa, puntosRequeridos } = validacion.data;
        const seccion = await prisma.seccion.update({
            where: { id: parseInt(id) },
            data: { nombre, descripcion, grado, umbralAprobacion, puntosRecompensa, puntosRequeridos }
        });
        return res.json(seccion);
    } catch (error) {
        next(error);
    }
};
