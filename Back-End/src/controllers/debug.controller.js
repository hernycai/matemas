import prisma from '../config/prisma.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const getDebugInfo = async (req, res) => {
    const status = {
        database: { connected: false, error: null },
        gemini: { active: false, model: 'gemini-2.5-flash', error: null },
        timestamp: new Date().toISOString()
    };

    try {
        await prisma.$queryRaw`SELECT 1`;
        status.database.connected = true;
    } catch (err) {
        status.database.error = err.message;
    }

    try {
        const start = Date.now();
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey || apiKey === 'api_key' || apiKey === '') {
            throw new Error('API Key de Gemini no configurada');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: status.gemini.model });

        const testPrompt = "Hola, respondé solo con la palabra OK.";
        const result = await model.generateContent(testPrompt);
        const response = await result.response;

        if (response.text().trim().toUpperCase().includes('OK')) {
            status.gemini.active = true;
            status.gemini.latency = `${Date.now() - start}ms`;
            status.gemini.tier = "Free Tier (15 RPM / 1500 RPD)";
            status.gemini.currentPrompt = "Sos un tutor de matemáticas para adultos... [Analizar por qué esa opción es incorrecta...]";
        } else {
            throw new Error('Respuesta inesperada del modelo Gemini');
        }
    } catch (err) {
        status.gemini.error = err.message;
    }

    if (status.database.connected) {
        const [totalUsuarios, usuariosActivos, totalAprobaciones] = await Promise.all([
            prisma.usuario.count(),
            prisma.usuario.count({ where: { racha: { gt: 0 } } }),
            prisma.seccionAprobada.count()
        ]);
        status.analytics = {
            totalUsuarios,
            usuariosActivos,
            totalLogrosAprobados: totalAprobaciones
        };
    }

    const statusCode = (status.database.connected && status.gemini.active) ? 200 : 207;
    res.status(statusCode).json(status);
};
