import prisma from '../src/config/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readCSV = (fileName) => {
    const filePath = path.join(__dirname, '../data', fileName);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = line.split(',');
        if (values.length < headers.length) return null;
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
        }, {});
    }).filter(row => row !== null && row.id && !row.id.startsWith('`'));
};

async function main() {
    const secciones = readCSV('secciones.csv');
    for (const s of secciones) {
        await prisma.seccion.upsert({
            where: { id: parseInt(s.id) },
            update: {
                grado: parseInt(s.grado),
                puntosRequeridos: parseInt(s.puntosRequeridos),
                puntosRecompensa: parseInt(s.puntosRecompensa),
                umbralAprobacion: parseFloat(s.umbralAprobacion) || 0.66
            },
            create: {
                id: parseInt(s.id),
                nombre: s.nombre,
                descripcion: s.descripcion,
                grado: parseInt(s.grado),
                puntosRequeridos: parseInt(s.puntosRequeridos),
                puntosRecompensa: parseInt(s.puntosRecompensa),
                umbralAprobacion: parseFloat(s.umbralAprobacion) || 0.66
            }
        });
    }

    const escenarios = readCSV('escenarios.csv');
    for (const e of escenarios) {
        await prisma.escenario.upsert({
            where: { id: parseInt(e.id) },
            update: {},
            create: {
                id: parseInt(e.id),
                titulo: e.titulo,
                descripcion: e.descripcion,
                pregunta: e.pregunta,
                explicacion: e.explicacion,
                categoria: e.categoria,
                seccionId: parseInt(e.seccionId)
            }
        });
    }

    // Nota: insertar solo en Prisma NO alcanza para loguear.
    // El login usa Supabase Auth. Si tenés SERVICE_ROLE_KEY, sincronizá con:
    //   npm run seed:auth
    const usuarios = readCSV('usuarios.csv');
    for (const u of usuarios) {
        await prisma.usuario.upsert({
            where: { email: u.email },
            update: {
                nombre: u.nombre,
                rol: u.rol,
                edad: u.edad || null,
                genero: u.genero || null,
                lugar: u.lugar || null,
                desafio: u.desafio || null,
                sentimiento: u.sentimiento || null,
                createdAt: u.createdAt ? new Date(u.createdAt) : new Date()
            },
            create: {
                id: u.id,
                email: u.email,
                nombre: u.nombre,
                rol: u.rol,
                password: u.password,
                puntos: parseInt(u.puntos) || 0,
                tokens: 0,
                racha: parseInt(u.racha) || 0,
                edad: u.edad || null,
                genero: u.genero || null,
                lugar: u.lugar || null,
                desafio: u.desafio || null,
                sentimiento: u.sentimiento || null,
                createdAt: u.createdAt ? new Date(u.createdAt) : new Date()
            }
        });
    }

    console.log('Base de datos poblada con éxito');
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('[')) {
        console.log('ℹ️  Detecté SERVICE_ROLE_KEY. Para poder loguear esos usuarios corré: npm run seed:auth');
    } else {
        console.log('⚠️  Usuarios solo en Postgres. Sin Supabase Auth no van a poder loguear. Corré npm run seed:auth con SUPABASE_SERVICE_ROLE_KEY.');
    }
}

main()
    .catch((e) => {
        console.error('Error en el seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
