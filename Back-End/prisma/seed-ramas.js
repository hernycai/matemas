import prisma from '../src/config/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


async function main() {
  // 1. Obtener todas las categorías únicas existentes en los Escenarios
  const categoriasUnicas = await prisma.escenario.findMany({
    distinct: ["categoria"],
    select: { categoria: true },
  });

  console.log(
    `🔍 Categorías encontradas: ${categoriasUnicas.map((c) => c.categoria).join(", ")}`,
  );

  // 2. Crear/actualizar la Rama para cada categoría
  const ramas = {};
  for (let i = 0; i < categoriasUnicas.length; i++) {
    const nombre = categoriasUnicas[i].categoria;
    const rama = await prisma.rama.upsert({
      where: { nombre },
      update: {},
      create: { nombre, orden: i + 1, activo: true },
    });
    ramas[nombre] = rama.id;
    console.log(`✅ Rama: ${nombre} (id ${rama.id})`);
  }

  // 3. Para cada Sección, determinar su Rama mirando la categoría de sus Escenarios
  const secciones = await prisma.seccion.findMany({
    include: { escenarios: { select: { categoria: true }, take: 1 } },
  });

  for (const seccion of secciones) {
    if (seccion.escenarios.length === 0) {
      console.log(
        `⚠️  Sección "${seccion.nombre}" no tiene escenarios, no se asigna rama`,
      );
      continue;
    }
    const categoria = seccion.escenarios[0].categoria;
    const ramaId = ramas[categoria];
    if (!ramaId) {
      console.log(
        `⚠️  Sección "${seccion.nombre}" tiene categoría "${categoria}" pero no matchea ninguna Rama`,
      );
      continue;
    }
    await prisma.seccion.update({
      where: { id: seccion.id },
      data: { ramaId },
    });
    console.log(`   → "${seccion.nombre}" asignada a Rama "${categoria}"`);
  }

  console.log("🎉 Seed de ramas completado.");
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
