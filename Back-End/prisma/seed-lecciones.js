/**
 * Carga videos (Cloudinary u otros) en la tabla Leccion.
 *
 * 1) Editá Back-End/data/lecciones.csv
 *    Columnas: seccionId,titulo,videoUrl,orden
 * 2) Pegá la URL completa de Cloudinary (Delivery URL) en videoUrl
 * 3) Corré: npm run seed:lecciones
 *
 * Relación: seccionId = id de Seccion (el mismo del módulo "Porcentajes", etc.)
 * Un módulo puede tener N lecciones (videos) ordenadas por `orden`.
 * El front las lee con GET /api/secciones/:seccionId/lecciones
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env"), override: true });

const prisma = new PrismaClient();
const csvPath = path.resolve(__dirname, "../data/lecciones.csv");

function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    // soporta comas dentro de URLs sin comillas (URL no debería tener comas)
    const cols = line.split(",");
    const row = {};
    headers.forEach((h, i) => {
      row[h] = (cols[i] ?? "").trim();
    });
    // si videoUrl tenía comas raras, unir resto
    if (cols.length > headers.length) {
      const urlStart = headers.indexOf("videoUrl");
      if (urlStart >= 0) {
        row.videoUrl = cols.slice(urlStart, cols.length - (headers.length - urlStart - 1)).join(",").trim();
        // fallback más simple: último campo orden, penúltimo... mejor:
        row.orden = cols[cols.length - 1]?.trim();
        row.videoUrl = cols.slice(urlStart, -1).join(",").trim();
      }
    }
    return row;
  });
}

async function main() {
  if (!fs.existsSync(csvPath)) {
    console.error(`No existe ${csvPath}`);
    console.error("Creá el archivo con: seccionId,titulo,videoUrl,orden");
    process.exit(1);
  }

  const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
  if (!rows.length) {
    console.error("CSV vacío o sin filas de datos.");
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;

  for (const row of rows) {
    const seccionId = Number(row.seccionId);
    const orden = Number(row.orden || 0);
    const titulo = row.titulo;
    const videoUrl = row.videoUrl;

    if (!seccionId || !titulo || !videoUrl) {
      console.warn("Fila inválida, se salta:", row);
      skipped += 1;
      continue;
    }

    if (videoUrl.includes("TU_CLOUD")) {
      console.warn(
        `⚠️ Placeholder Cloudinary en seccion ${seccionId} "${titulo}". Reemplazá TU_CLOUD y el path real antes de prod.`,
      );
    }

    const seccion = await prisma.seccion.findUnique({ where: { id: seccionId } });
    if (!seccion) {
      console.warn(`Sección ${seccionId} no existe. Saltando "${titulo}".`);
      skipped += 1;
      continue;
    }

    const existing = await prisma.leccion.findFirst({
      where: { seccionId, orden },
    });

    if (existing) {
      await prisma.leccion.update({
        where: { id: existing.id },
        data: { titulo, videoUrl },
      });
      console.log(`↻ Actualizada lección #${existing.id} (seccion ${seccionId}, orden ${orden})`);
    } else {
      const nueva = await prisma.leccion.create({
        data: { seccionId, titulo, videoUrl, orden },
      });
      console.log(`✓ Creada lección #${nueva.id} (seccion ${seccionId}, orden ${orden})`);
      created += 1;
    }
  }

  console.log(`\nListo. Nuevas: ${created}. Omitidas/errores: ${skipped}.`);
  console.log("Tip: listá secciones con sus ids en Prisma Studio o GET /api/secciones");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
