import prisma from "../config/prisma.js";

export const getRamas = async (req, res, next) => {
  try {
    const ramas = await prisma.rama.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
      include: {
        secciones: {
          orderBy: { grado: "asc" },
          select: { id: true, nombre: true, grado: true },
        },
      },
    });
    return res.json(ramas);
  } catch (error) {
    next(error);
  }
};
