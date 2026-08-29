import prisma from "../config/prisma.js";
import {
  sanitizeEscenario,
  sanitizeEscenarios,
} from "../utils/sanitizeEscenario.js";

export const getEscenariosBySeccion = async (req, res, next) => {
  const { seccionId } = req.params;
  try {
    const escenarios = await prisma.escenario.findMany({
      where: { seccionId: parseInt(seccionId) },
      include: { opciones: true },
    });
    return res.json(sanitizeEscenarios(escenarios));
  } catch (error) {
    next(error);
  }
};

export const getEscenarioBySeccionAndId = async (req, res, next) => {
  const { seccionId, escenarioId } = req.params;
  try {
    const escenario = await prisma.escenario.findFirst({
      where: {
        id: parseInt(escenarioId),
        seccionId: parseInt(seccionId),
      },
      include: { opciones: true, consejos: true },
    });
    if (!escenario)
      return res
        .status(404)
        .json({ error: "No existe el escenario en esta sección" });
    return res.json(sanitizeEscenario(escenario));
  } catch (error) {
    next(error);
  }
};

export const crearEscenario = async (req, res, next) => {
  const { seccionId } = req.params;
  const {
    titulo,
    descripcion,
    pregunta,
    explicacion,
    categoria,
    tipo,
    respuestaCorrecta,
    imagenUrl,
    opciones,
  } = req.body;
  try {
    const nuevoEscenario = await prisma.escenario.create({
      data: {
        titulo,
        descripcion,
        pregunta,
        explicacion,
        categoria,
        tipo: tipo || "opcion_multiple",
        respuestaCorrecta,
        imagenUrl,
        seccionId: parseInt(seccionId),
        ...(Array.isArray(opciones) && opciones.length > 0
          ? {
              opciones: {
                create: opciones.map((o) => ({
                  texto: o.texto,
                  puntos: o.puntos ?? (o.esCorrecta ? 10 : 0),
                  esCorrecta: !!o.esCorrecta,
                })),
              },
            }
          : {}),
      },
      include: { opciones: true },
    });

    return res.status(201).json(nuevoEscenario);
  } catch (error) {
    next(error);
  }
};

export const eliminarEscenario = async (req, res, next) => {
  const { escenarioId } = req.params;
  try {
    await prisma.escenario.delete({ where: { id: parseInt(escenarioId) } });

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const actualizarEscenario = async (req, res, next) => {
  const { escenarioId } = req.params;
  const {
    titulo,
    descripcion,
    pregunta,
    explicacion,
    categoria,
    tipo,
    respuestaCorrecta,
    imagenUrl,
  } = req.body;
  try {
    const escenario = await prisma.escenario.update({
      where: { id: parseInt(escenarioId) },
      data: {
        titulo,
        descripcion,
        pregunta,
        explicacion,
        categoria,
        tipo,
        respuestaCorrecta,
        imagenUrl,
      },
    });

    return res.json(escenario);
  } catch (error) {
    next(error);
  }
};
