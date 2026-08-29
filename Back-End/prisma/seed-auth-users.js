/**
 * Sincroniza usuarios del CSV con Supabase Auth + tabla Usuario (Prisma).
 *
 * Problema: seed.js solo inserta en Postgres. El login real usa
 * supabase.auth.signInWithPassword, así que sin este script no podés loguear.
 *
 * Requiere en Back-End/.env:
 *   SUPABASE_URL=
 *   SUPABASE_SERVICE_ROLE_KEY=   (Settings → API → service_role, NO la anon key)
 *   DATA_SOURCE=DB
 *   DATABASE_URL= / DIRECT_URL=
 *
 * Uso:
 *   node prisma/seed-auth-users.js
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import prisma from '../src/config/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readCSV = (fileName) => {
  const filePath = path.join(__dirname, '../data', fileName);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter((line) => line.trim() !== '');
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines
    .slice(1)
    .map((line) => {
      const values = line.split(',');
      if (values.length < headers.length) return null;
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index]?.trim();
        return obj;
      }, {});
    })
    .filter((row) => row !== null && row.id && !row.id.startsWith('`') && row.email);
};

function getAdminClient() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey || serviceKey.includes('[') || url.includes('[TU_PROYECTO]')) {
    throw new Error(
      'Falta SUPABASE_SERVICE_ROLE_KEY (o SUPABASE_URL) en Back-End/.env. ' +
        'La service_role key está en Supabase → Settings → API. Nunca la subas al front.',
    );
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function findAuthUserByEmail(admin, email) {
  // Pagina usuarios hasta encontrar el email (ok para seeds chicos)
  let page = 1;
  const perPage = 200;
  while (page <= 20) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const found = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (found) return found;
    if (!data.users.length || data.users.length < perPage) return null;
    page += 1;
  }
  return null;
}

async function ensureAuthUser(admin, { email, password, nombre }) {
  let authUser = await findAuthUserByEmail(admin, email);

  if (!authUser) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: nombre || email.split('@')[0] },
    });
    if (error) throw error;
    authUser = data.user;
    console.log(`  🔐 Auth creado: ${email}`);
  } else {
    // Asegura password conocida del CSV para poder loguear en pruebas
    const { error } = await admin.auth.admin.updateUserById(authUser.id, {
      password,
      email_confirm: true,
      user_metadata: { full_name: nombre || email.split('@')[0] },
    });
    if (error) throw error;
    console.log(`  🔄 Auth actualizado: ${email}`);
  }

  return authUser;
}

async function upsertPrismaUser(authUser, csvUser) {
  const authId = authUser.id;
  const email = csvUser.email.toLowerCase();

  const byEmail = await prisma.usuario.findUnique({ where: { email } });

  // Si existe con el id viejo del CSV (user-001) y no coincide con Auth UUID, migrar
  if (byEmail && byEmail.id !== authId) {
    console.warn(`  ⚠️ Reasignando Prisma ${email}: ${byEmail.id} → ${authId}`);
    await prisma.$transaction([
      prisma.progreso.deleteMany({ where: { usuarioId: byEmail.id } }),
      prisma.seccionAprobada.deleteMany({ where: { usuarioId: byEmail.id } }),
      prisma.recurso.deleteMany({ where: { usuarioId: byEmail.id } }),
      prisma.auditoria.deleteMany({ where: { usuarioId: byEmail.id } }),
      prisma.usuario.update({
        where: { id: byEmail.id },
        data: { insignias: { set: [] } },
      }),
      prisma.usuario.delete({ where: { id: byEmail.id } }),
    ]);
  }

  const payload = {
    email,
    nombre: csvUser.nombre || null,
    rol: csvUser.rol || 'usuario',
    password: csvUser.password || null,
    puntos: parseInt(csvUser.puntos, 10) || 0,
    racha: parseInt(csvUser.racha, 10) || 0,
    edad: csvUser.edad || null,
    genero: csvUser.genero || null,
    lugar: csvUser.lugar || null,
    desafio: csvUser.desafio || null,
    sentimiento: csvUser.sentimiento || null,
  };

  await prisma.usuario.upsert({
    where: { id: authId },
    update: payload,
    create: { id: authId, tokens: 0, ...payload },
  });

  console.log(`  ✅ Prisma OK: ${email} (${authId})`);
}

async function main() {
  console.log('🚀 Sincronizando usuarios CSV → Supabase Auth + Prisma...');
  const admin = getAdminClient();
  const usuarios = readCSV('usuarios.csv');

  let ok = 0;
  let fail = 0;

  for (const u of usuarios) {
    try {
      if (!u.password) {
        console.warn(`  ⏭️  Sin password, salto: ${u.email}`);
        continue;
      }
      const authUser = await ensureAuthUser(admin, {
        email: u.email,
        password: u.password,
        nombre: u.nombre,
      });
      await upsertPrismaUser(authUser, u);
      ok += 1;
    } catch (err) {
      fail += 1;
      console.error(`  ❌ ${u.email}:`, err.message || err);
    }
  }

  console.log(`\n🎉 Listo. OK=${ok}  FAIL=${fail}`);
  console.log('Podés loguear con los emails del CSV y sus passwords (ej. User123! / Admin123!).');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed-auth-users:', e.message || e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
