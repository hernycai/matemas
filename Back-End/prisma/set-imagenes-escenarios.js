import prisma from '../src/config/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const SUPABASE_URL = process.env.SUPABASE_URL;
if (!SUPABASE_URL) throw new Error("Falta SUPABASE_URL en el entorno");
const BUCKET = "ejercicios";
const imgUrl = (p) => `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${p}`;

const imagenes = [
  {
    match: "figura geométrica predomina",
    path: "escenarios/geometria/figura-predomina.png",
  },
];

async function main() {
  for (const { match, path } of imagenes) {
    const { count } = await prisma.escenario.updateMany({
      where: { pregunta: { contains: match } },
      data: { imagenUrl: imgUrl(path) },
    });
    console.log(`"${match}" → ${count} escenario(s) actualizado(s)`);
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
