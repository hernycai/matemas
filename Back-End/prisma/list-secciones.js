/**
 * Lista id + nombre + grado + rama de cada sección.
 * Uso (desde Back-End): npm run list:secciones
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env"), override: true });

const prisma = new PrismaClient();

async function main() {
  const secciones = await prisma.seccion.findMany({
    orderBy: [{ ramaId: "asc" }, { grado: "asc" }, { id: "asc" }],
    include: { rama: true, _count: { select: { lecciones: true, escenarios: true } } },
  });

  if (!secciones.length) {
    console.log("No hay secciones en la DB. Corré primero: npm run seed:ejercicios");
    return;
  }

  console.log("\n=== SECCIONES (usá esta columna id en lecciones.csv) ===\n");
  console.log(
    "id".padEnd(6) +
      "grado".padEnd(8) +
      "rama".padEnd(16) +
      "videos".padEnd(8) +
      "ejer.".padEnd(8) +
      "nombre",
  );
  console.log("-".repeat(90));

  for (const s of secciones) {
    console.log(
      String(s.id).padEnd(6) +
        String(s.grado).padEnd(8) +
        String(s.rama?.nombre || "-").padEnd(16) +
        String(s._count.lecciones).padEnd(8) +
        String(s._count.escenarios).padEnd(8) +
        s.nombre,
    );
  }

  console.log("\nEjemplo CSV:");
  console.log("seccionId,titulo,videoUrl,orden");
  const ejemplo = secciones[0];
  if (ejemplo) {
    console.log(
      `${ejemplo.id},${ejemplo.nombre} - Intro,https://res.cloudinary.com/TU_CLOUD/video/upload/v1/mate/video.mp4,1`,
    );
  }
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
