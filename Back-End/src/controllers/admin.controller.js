import prisma from '../config/prisma.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generarFeedbackPedagogico } from '../services/gemini.service.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAdminMain = async (req, res) => {
    res.json({
        MANDO: "ADMIN-BE",
        ACTIONS: ["checkup", "analytics", "upsert_manual"]
    });
};

export const upsertManual = async (req, res, next) => {
    try {
        const filePath = path.join(__dirname, '../../data/usuarios.csv');
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "Archivo usuarios.csv no encontrado" });
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.replace(/\r/g, '').split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',').map(h => h.trim());
        const usuarios = lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index]?.trim();
                return obj;
            }, {});
        });

        const adminEmail = req.user.email.toLowerCase();

        // Cambiamos a procesamiento secuencial controlado para evitar saturar conexiones
        let syncedCount = 0;
        for (const u of usuarios) {
            try {
                // PROTECCIÓN NÚCLEO: Si el usuario del CSV es el admin actual, lo saltamos.
                // Esto evita que Supabase dispare eventos de sesión que generen loops.
                if (u.email.toLowerCase() === adminEmail) continue;

                await prisma.usuario.upsert({
                    where: { email: u.email.toLowerCase() },
                    update: {
                        nombre: u.nombre,
                        rol: u.rol,
                    },
                    create: {
                        id: u.id || `legacy-${Date.now()}-${Math.random()}`,
                        email: u.email.toLowerCase(),
                        nombre: u.nombre,
                        rol: u.rol,
                        password: u.password || 'User123!'
                    }
                });
                syncedCount++;
            } catch (err) {
                console.error(`Error sincronizando a ${u.email}:`, err.message);
            }
        }

        res.json({ status: "SUCCESS", synced: syncedCount });
    } catch (error) {
        console.error("Error en upsert manual:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getCheckupStatus = async (req, res, next) => {
    try {
        const start = Date.now();
        const dbCheck = await prisma.$queryRaw`SELECT 1`.catch(() => null);

        const apiKey = process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY !== 'api_key' ? process.env.GOOGLE_API_KEY : null;

        if (!apiKey) {
            return res.json({
                nucleo: { STATUS: "ONLINE", version: "1.0.0-Slice", SOURCE: process.env.DATA_SOURCE || 'DB' },
                ia: { STATUS: "MISSING_KEY", LAT: "N/A", TIER: "N/A", QUOTA: "N/A", REF: "N/A" },
                db: { ID: "SUPABASE_PG", STATUS: "CONNECTED" }
            });
        }

        let iaStatus = { STATUS: "INIT", LAT: "N/A", TIER: "FREE", QUOTA: "15RPM/1500RPD", REF: "tutor_matematico_v1" };

        const checkIA = async (models, retries = 1) => {
            const modelName = models[0];
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Respondé solo la palabra OK.", { timeout: 3000 });
                const response = await result.response;
                return { ok: response.text().toUpperCase().includes("OK"), ref: modelName };
            } catch (err) {
                if (retries > 0 && (err.message.includes("503") || err.message.includes("429"))) {
                    return new Promise(resolve => setTimeout(() => resolve(checkIA(models, retries - 1)), 1000));
                }
                if (models.length > 1) return checkIA(models.slice(1), 0);
                throw err;
            }
        };
        try {
            const check = await checkIA(['gemini-2.5-flash']);
            iaStatus.STATUS = check.ok ? "READY" : "UNEXPECTED_RESP";
            iaStatus.REF = check.ref;
            iaStatus.LAT = `${Date.now() - start}ms`;
        } catch (err) {
            iaStatus.STATUS = "FAIL";
            iaStatus.ERROR = err.message.includes("429") ? "CUOTA_EXCEDIDA_DIARIA" : err.message;
            iaStatus.LAT = `${Date.now() - start}ms`;
        }

        res.json({
            nucleo: {
                STATUS: "ONLINE",
                version: "1.0.0-Slice",
                UPSERT: "ACTIVE",
                SOURCE: process.env.DATA_SOURCE || 'DB'
            },
            ia: iaStatus,
            db: {
                ID: "SUPABASE_PG",
                STATUS: dbCheck ? "CONNECTED" : "DISCONNECTED"
            }
        });
    } catch (error) {
        next(error);
    }
};

export const testFeedback = async (req, res, next) => {
    const { dificultad = 'media' } = req.body;
    const mocks = {
        facil: { p: "¿Cuánto es 5 + 5?", e: "Suma simple de dígitos.", r: "11" },
        media: { p: "Si tenés 100 y gastás el 20%, ¿cuánto queda?", e: "Cálculo de porcentajes.", r: "70" },
        dificil: { p: "Interés compuesto: 1000 al 10% mensual en 2 meses.", e: "Fórmula de capitalización.", r: "1100" }
    };

    const current = mocks[dificultad] || mocks.media;

    try {
        const feedback = await generarFeedbackPedagogico(current.p, current.e, current.r);
        res.json({
            pregunta: current.p,
            respuesta_erronea: current.r,
            feedback_ia: feedback
        });
    } catch (error) {
        res.status(500).json({ error: "Fallo el motor de IA", static_fallback: current.e });
    }
};

export const getAnalyticsData = async (req, res, next) => {
    try {
        const results = await Promise.all([
            prisma.usuario.count({ where: { rol: 'usuario' } }).catch(() => 0),
            prisma.usuario.count({ where: { rol: 'usuario', racha: { gt: 0 } } }),
            prisma.auditoria.findMany({
                take: 5,
                orderBy: { timestamp: 'desc' },
                include: { usuario: { select: { nombre: true } } }
            }),
            prisma.usuario.findMany({
                where: { rol: 'usuario' },
                take: 100,
                orderBy: { createdAt: 'asc' },
                select: { createdAt: true }
            }),
            prisma.progreso.findMany({
                where: { usuario: { rol: 'usuario' } },
                take: 15,
                orderBy: { updatedAt: 'desc' },
                select: { updatedAt: true, puntosObtenidos: true }
            }),
            prisma.usuario.groupBy({
                by: ['genero'],
                _count: { genero: true },
                where: { rol: 'usuario', NOT: { genero: null } }
            }),
            prisma.usuario.groupBy({
                by: ['edad'],
                _count: { edad: true },
                where: { rol: 'usuario', NOT: { edad: null } }
            }),
            prisma.usuario.groupBy({
                by: ['lugar'],
                _count: { lugar: true },
                where: { rol: 'usuario', NOT: { lugar: null } }
            })
        ]);

        const [totalUsers, activeUsers, logs, userGrowth, progressActivity, genderStats, ageStats, locationStats] = results;

        res.json({
            ST: { // Stats
                U_TOTAL: totalUsers,
                U_ACT: activeUsers, // Reemplazamos "logros" por "usuarios activos"
                // L_OK (logros completados) fue removido
            },
            CH: { // Charts Data
                PIE_GENDER: (genderStats && genderStats.length > 0)
                    ? genderStats.map(g => ({ name: g.genero, value: g._count.genero }))
                    : [],
                BAR: Object.entries(
                    (userGrowth || []).reduce((acc, u) => {
                        try {
                            const dateStr = new Date(u.createdAt).toISOString().split('T')[0];
                            acc[dateStr] = (acc[dateStr] || 0) + 1;
                        } catch (e) { }
                        return acc;
                    }, {})
                ).map(([fecha, cantidad]) => ({ fecha, cantidad }))
                 .sort((a, b) => a.fecha.localeCompare(b.fecha)),
                PIE_AGE: (ageStats && ageStats.length > 0)
                    ? ageStats.map(a => ({ name: a.edad, value: a._count.edad }))
                    : [],
                PIE_LOCATION: (locationStats && locationStats.length > 0)
                    ? locationStats.map(l => ({ name: l.lugar, value: l._count.lugar }))
                    : [],
                LINE: progressActivity.length > 0 ? progressActivity.map((p, i) => ({
                    x: i,
                    y: p.puntosObtenidos
                })) : [{ x: 'Sin datos', y: 0 }]
            },
            LG: logs.map(l => ({ // Logs
                u: l.usuario?.nombre || 'SYS',
                op: l.accion,
                tg: l.entidad,
                ts: l.timestamp
            }))
        });
    } catch (error) {
        next(error);
    }
};
