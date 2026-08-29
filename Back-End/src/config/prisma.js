import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import mockPrisma from './mock-database.js';

let prisma;

const dataSource = process.env.DATA_SOURCE?.trim().toUpperCase();
const isDbConfigured = process.env.DATABASE_URL && 
                       process.env.DATABASE_URL !== 'postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public' &&
                       process.env.DATA_SOURCE === 'DB';

if (dataSource === 'MOCK' || !isDbConfigured) {
    console.log('\x1b[33m%s\x1b[0m', '--- DATA_SOURCE: MOCK (Usando archivos CSV locales) ---');
    process.env.DATA_SOURCE = 'MOCK';
    prisma = mockPrisma;
} else {
    try {
        prisma = new PrismaClient({
            log: [
                { emit: 'stdout', level: 'query' },
                { emit: 'stdout', level: 'error' }
            ],
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
        });
        console.log('\x1b[32m%s\x1b[0m', '--- DATA_SOURCE: DB (Conectando a Supabase via Prisma) ---');
        
        // Prueba la conexión
        await prisma.$connect();
        console.log('\x1b[32m%s\x1b[0m', '✅ Conexión a Supabase exitosa');
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'Error al conectar a Supabase:', error.message);
        console.log('\x1b[33m%s\x1b[0m', 'Usando Mock de respaldo...');
        prisma = mockPrisma;
    }
}

export default prisma;