/* eslint-disable no-undef */
import prisma from './config/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function checkOptions() {
    const escenarioId = 21;
    
    console.log(`🔍 Verificando opciones del escenario ${escenarioId}...`);
    
    const escenario = await prisma.escenario.findUnique({
        where: { id: escenarioId },
        include: { opciones: true }
    });
    
    console.log(`📊 Escenario: "${escenario.titulo}"`);
    console.log(`📝 Pregunta: ${escenario.pregunta}`);
    console.log('\n📋 Opciones:');
    
    escenario.opciones.forEach((opcion, index) => {
        console.log(`   ${index + 1}. ID: ${opcion.id}`);
        console.log(`      Texto: "${opcion.texto}"`);
        console.log(`      Puntos: ${opcion.puntos}`);
        console.log(`      esCorrecta: ${opcion.esCorrecta}`);
        console.log(`      ${opcion.puntos > 0 ? '✅ CORRECTA' : '❌ INCORRECTA'}`);
        console.log('');
    });
}

checkOptions()
    .catch(console.error)
    .finally(() => process.exit());