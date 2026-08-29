import prisma from "../config/prisma.js";
import ApiError from "../exceptions/api.error.js";
import {
  registroSchema,
  perfilSchema,
  loginSchema,
} from "../validators/usuarios.validator.js";
import { obtenerUbicacionPorIP } from "../services/geolocation.service.js";
import { resolveRamaIdFromDesafio } from "../utils/desafioRama.js";
import { sanitizeUsuario, sanitizeUsuarios } from "../utils/sanitizeUsuario.js";

const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

export const registrarUsuario = async (req, res, next) => {
  try {
    const validacion = registroSchema.safeParse(req.body);

    if (!validacion.success) {
      throw validacion.error;
    }

    const {
      email,
      nombre,
      edad,
      genero,
      lugar,
      desafio,
      sentimiento,
      mascota,
    } = validacion.data;
    const uid = req.body.uid;

    if (!uid) {
      return res.status(400).json({ error: "Falta UID de autenticación" });
    }

    let lugarFinal = lugar;
    if (!lugarFinal) {
      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket.remoteAddress;
      const ubicacion = await obtenerUbicacionPorIP(ip);
      lugarFinal = ubicacion
        ? [ubicacion.region, ubicacion.pais].filter(Boolean).join(", ")
        : null;
    }

    const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());
    const SUPERADMIN_EMAILS = (process.env.SUPERADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());

    let rolAsignado = "usuario";
    if (SUPERADMIN_EMAILS.includes(email.toLowerCase())) {
      rolAsignado = "superadmin";
    } else if (ADMIN_EMAILS.includes(email.toLowerCase())) {
      rolAsignado = "admin";
    }

    // Si quedó un usuario "obsoleto" con el mismo email pero otro uid (p.ej. mock vs Supabase),
    // lo eliminamos para poder sincronizar con el uid actual de Auth.
    const existentePorEmail = await prisma.usuario.findUnique({ where: { email } });
    if (existentePorEmail && existentePorEmail.id !== uid) {
      console.warn(
        `⚠️ Usuario obsoleto detectado para ${email}: ${existentePorEmail.id} → ${uid}. Reasignando...`,
      );
      await prisma.$transaction([
        prisma.progreso.deleteMany({ where: { usuarioId: existentePorEmail.id } }),
        prisma.seccionAprobada.deleteMany({ where: { usuarioId: existentePorEmail.id } }),
        prisma.recurso.deleteMany({ where: { usuarioId: existentePorEmail.id } }),
        prisma.auditoria.deleteMany({ where: { usuarioId: existentePorEmail.id } }),
        prisma.usuario.update({
          where: { id: existentePorEmail.id },
          data: { insignias: { set: [] } },
        }),
        prisma.usuario.delete({ where: { id: existentePorEmail.id } }),
      ]);
    }

    const ramaIdFromDesafio = await resolveRamaIdFromDesafio(prisma, desafio);

    const usuario = await prisma.usuario.upsert({
      where: { id: uid },
      update: {
        nombre,
        rol: rolAsignado,
        // Auth real en Supabase: no persistir password en claro (BUG-002/043)
        password: null,
        edad,
        genero,
        lugar: lugarFinal,
        desafio,
        sentimiento,
        ...(mascota ? { mascota } : {}),
        ...(ramaIdFromDesafio ? { desafioActualId: ramaIdFromDesafio } : {}),
      },
      create: {
        id: uid,
        email,
        nombre,
        rol: rolAsignado,
        password: null,
        edad,
        genero,
        lugar: lugarFinal,
        desafio,
        sentimiento,
        mascota: mascota || "multi",
        ...(ramaIdFromDesafio ? { desafioActualId: ramaIdFromDesafio } : {}),
      },
      include: { desafioActual: true },
    });
    console.log(`✅ Usuario sincronizado: ${usuario.email} [${usuario.rol}]`);

    // Si ya tenía desafío textual pero sin rama, intentar linkear.
    let usuarioFinal = usuario;
    if (!usuario.desafioActualId && usuario.desafio) {
      const ramaId = await resolveRamaIdFromDesafio(prisma, usuario.desafio);
      if (ramaId) {
        usuarioFinal = await prisma.usuario.update({
          where: { id: uid },
          data: { desafioActualId: ramaId },
          include: { desafioActual: true },
        });
      }
    }

    const ramaFilter = usuarioFinal.desafioActualId
      ? { ramaId: usuarioFinal.desafioActualId }
      : {};

    const [totalSecciones, seccionesAprobadasCount] = await Promise.all([
      prisma.seccion.count({ where: ramaFilter }),
      prisma.seccionAprobada.count({
        where: {
          usuarioId: uid,
          ...(usuarioFinal.desafioActualId
            ? { seccion: { ramaId: usuarioFinal.desafioActualId } }
            : {}),
        },
      }),
    ]);

    res.status(201).json({
      ...sanitizeUsuario(usuarioFinal),
      totalSecciones,
      seccionesAprobadasCount,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUsuario = async (req, res, next) => {
  try {
    // En producción la sesión válida es Supabase Auth (BUG-003/012/021).
    if (isProd) {
      return res.status(410).json({
        error:
          "Este endpoint de login legacy está deshabilitado. Usá el login de la app (Supabase Auth).",
      });
    }

    const validacion = loginSchema.safeParse(req.body);
    if (!validacion.success) {
      throw validacion.error;
    }

    const { email, password } = validacion.data;

    const usuario = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!usuario || !usuario.password || usuario.password !== password) {
      throw ApiError.unauthorized(
        "Credenciales inválidas (email o contraseña incorrectos)",
      );
    }

    res.status(200).json({
      message: "Login exitoso (solo desarrollo/mock)",
      user: {
        ...sanitizeUsuario(usuario),
        token: "dev-bypass-token",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const eliminarUsuario = async (req, res, next) => {
  try {
    const uid = req.user.id;
    const { confirmacion, password } = req.body || {};

    if (confirmacion !== "ELIMINAR") {
      throw ApiError.badRequest(
        'Para borrar la cuenta enviá confirmacion: "ELIMINAR"',
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: uid },
    });

    if (!usuario) {
      throw ApiError.unauthorized("Usuario no encontrado");
    }

    // Si aún queda password legacy en DB, exigir coincidencia.
    // Si es null (flujo Supabase), alcanza con JWT + confirmacion (BUG-036).
    if (usuario.password) {
      if (!password || usuario.password !== password) {
        throw ApiError.unauthorized(
          "Contraseña incorrecta. No se puede borrar la cuenta",
        );
      }
    }

    await prisma.usuario.delete({
      where: { id: uid },
    });

    res.status(200).json({ message: "Cuenta borrada correctamente" });
  } catch (error) {
    next(error);
  }
};

export const getUsuarios = async (req, res, next) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        puntos: true,
        tokens: true,
        rol: true,
        racha: true,
        mascota: true,
        createdAt: true,
      },
    });
    res.status(200).json(sanitizeUsuarios(usuarios));
  } catch (error) {
    next(error);
  }
};

export const actualizarPerfil = async (req, res, next) => {
  try {
    const uid = req.user.id;
    const validacion = perfilSchema.safeParse(req.body);

    if (!validacion.success) {
      throw validacion.error;
    }

    const { nombre, email } = validacion.data;
    const data = {};
    if (nombre !== undefined) data.nombre = nombre;
    if (email !== undefined) data.email = email;

    if (email) {
      const otro = await prisma.usuario.findFirst({
        where: { email, NOT: { id: uid } },
      });
      if (otro) {
        return res.status(409).json({ error: "Ese email ya está en uso" });
      }
    }

    const usuario = await prisma.usuario.update({
      where: { id: uid },
      data,
      include: { desafioActual: true },
    });
    return res.status(200).json(sanitizeUsuario(usuario));
  } catch (error) {
    next(error);
  }
};

export const getDesafioActual = async (req, res, next) => {
  try {
    const uid = req.user.id;
    const usuario = await prisma.usuario.findUnique({
      where: { id: uid },
      select: {
        desafioActualId: true,
        desafioActual: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
};

export const actualizarDesafioActual = async (req, res, next) => {
  try {
    const uid = req.user.id;
    const { desafioActualId } = req.body || {};

    if (
      desafioActualId !== null &&
      (typeof desafioActualId !== "number" || desafioActualId < 1)
    ) {
      return res.status(400).json({
        error: "desafioActualId debe ser un número entero positivo o null",
      });
    }

    if (desafioActualId !== null) {
      const rama = await prisma.rama.findUnique({
        where: { id: desafioActualId },
      });
      if (!rama) {
        return res.status(404).json({ error: "La rama indicada no existe" });
      }
    }

    const usuario = await prisma.usuario.update({
      where: { id: uid },
      data: { desafioActualId },
      include: { desafioActual: true },
    });

    return res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
};
