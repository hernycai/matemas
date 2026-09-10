-- Idempotent Enums
DO $$ BEGIN
    CREATE TYPE "Rol" AS ENUM ('usuario', 'admin', 'superadmin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TipoEjercicio" AS ENUM ('opcion_multiple', 'numerico');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable Usuario
CREATE TABLE IF NOT EXISTS "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT,
    "puntos" INTEGER NOT NULL DEFAULT 0,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "rol" "Rol" NOT NULL DEFAULT 'usuario',
    "password" TEXT,
    "edad" TEXT,
    "genero" TEXT,
    "lugar" TEXT,
    "desafio" TEXT,
    "sentimiento" TEXT,
    "mascota" TEXT NOT NULL DEFAULT 'multi',
    "racha" INTEGER NOT NULL DEFAULT 0,
    "ultimaConexion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "desafioActualId" INTEGER,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable Auditoria
CREATE TABLE IF NOT EXISTS "Auditoria" (
    "id" SERIAL NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidadId" TEXT,
    "detalles" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable Rama
CREATE TABLE IF NOT EXISTS "Rama" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Rama_pkey" PRIMARY KEY ("id")
);

-- CreateTable Seccion
CREATE TABLE IF NOT EXISTS "Seccion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "grado" INTEGER NOT NULL DEFAULT 1,
    "puntosRequeridos" INTEGER NOT NULL DEFAULT 0,
    "puntosRecompensa" INTEGER NOT NULL DEFAULT 0,
    "umbralAprobacion" DOUBLE PRECISION NOT NULL DEFAULT 0.66,
    "ramaId" INTEGER,

    CONSTRAINT "Seccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable SeccionAprobada
CREATE TABLE IF NOT EXISTS "SeccionAprobada" (
    "usuarioId" TEXT NOT NULL,
    "seccionId" INTEGER NOT NULL,

    CONSTRAINT "SeccionAprobada_pkey" PRIMARY KEY ("usuarioId","seccionId")
);

-- CreateTable Escenario
CREATE TABLE IF NOT EXISTS "Escenario" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "pregunta" TEXT NOT NULL,
    "explicacion" TEXT,
    "categoria" TEXT NOT NULL,
    "tipo" "TipoEjercicio" NOT NULL DEFAULT 'opcion_multiple',
    "respuestaCorrecta" TEXT,
    "imagenUrl" TEXT,
    "seccionId" INTEGER NOT NULL,

    CONSTRAINT "Escenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable Opcion
CREATE TABLE IF NOT EXISTS "Opcion" (
    "id" SERIAL NOT NULL,
    "texto" TEXT NOT NULL,
    "puntos" INTEGER NOT NULL DEFAULT 0,
    "esCorrecta" BOOLEAN NOT NULL DEFAULT false,
    "escenarioId" INTEGER NOT NULL,

    CONSTRAINT "Opcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable Recurso
CREATE TABLE IF NOT EXISTS "Recurso" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "valor" INTEGER NOT NULL DEFAULT 1,
    "usuarioId" TEXT NOT NULL,
    "seccionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recurso_pkey" PRIMARY KEY ("id")
);

-- CreateTable Insignia
CREATE TABLE IF NOT EXISTS "Insignia" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagenUrl" TEXT,
    "puntosRequeridos" INTEGER NOT NULL DEFAULT 0,
    "escenarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Insignia_pkey" PRIMARY KEY ("id")
);

-- CreateTable Progreso
CREATE TABLE IF NOT EXISTS "Progreso" (
    "id" SERIAL NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "escenarioId" INTEGER NOT NULL,
    "puntosObtenidos" INTEGER NOT NULL DEFAULT 0,
    "resuelto" BOOLEAN NOT NULL DEFAULT false,
    "intentosFallidos" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Progreso_pkey" PRIMARY KEY ("id")
);

-- CreateTable Leccion
CREATE TABLE IF NOT EXISTS "Leccion" (
    "id" SERIAL NOT NULL,
    "seccionId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Leccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable Consejo
CREATE TABLE IF NOT EXISTS "Consejo" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "escenarioId" INTEGER NOT NULL,

    CONSTRAINT "Consejo_pkey" PRIMARY KEY ("id")
);

-- CreateTable _InsigniaToUsuario
CREATE TABLE IF NOT EXISTS "_InsigniaToUsuario" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_InsigniaToUsuario_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Usuario_email_key" ON "Usuario"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Recurso_seccionId_key" ON "Recurso"("seccionId");
CREATE UNIQUE INDEX IF NOT EXISTS "Rama_nombre_key" ON "Rama"("nombre");
CREATE INDEX IF NOT EXISTS "_InsigniaToUsuario_B_index" ON "_InsigniaToUsuario"("B");

-- Foreign Keys with Exception Handling
DO $$ BEGIN
    ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_desafioActualId_fkey" FOREIGN KEY ("desafioActualId") REFERENCES "Rama"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Seccion" ADD CONSTRAINT "Seccion_ramaId_fkey" FOREIGN KEY ("ramaId") REFERENCES "Rama"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "SeccionAprobada" ADD CONSTRAINT "SeccionAprobada_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "SeccionAprobada" ADD CONSTRAINT "SeccionAprobada_seccionId_fkey" FOREIGN KEY ("seccionId") REFERENCES "Seccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Escenario" ADD CONSTRAINT "Escenario_seccionId_fkey" FOREIGN KEY ("seccionId") REFERENCES "Seccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Opcion" ADD CONSTRAINT "Opcion_escenarioId_fkey" FOREIGN KEY ("escenarioId") REFERENCES "Escenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Recurso" ADD CONSTRAINT "Recurso_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Recurso" ADD CONSTRAINT "Recurso_seccionId_fkey" FOREIGN KEY ("seccionId") REFERENCES "Seccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Insignia" ADD CONSTRAINT "Insignia_escenarioId_fkey" FOREIGN KEY ("escenarioId") REFERENCES "Escenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Progreso" ADD CONSTRAINT "Progreso_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Progreso" ADD CONSTRAINT "Progreso_escenarioId_fkey" FOREIGN KEY ("escenarioId") REFERENCES "Escenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Leccion" ADD CONSTRAINT "Leccion_seccionId_fkey" FOREIGN KEY ("seccionId") REFERENCES "Seccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Consejo" ADD CONSTRAINT "Consejo_escenarioId_fkey" FOREIGN KEY ("escenarioId") REFERENCES "Escenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "_InsigniaToUsuario" ADD CONSTRAINT "_InsigniaToUsuario_A_fkey" FOREIGN KEY ("A") REFERENCES "Insignia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "_InsigniaToUsuario" ADD CONSTRAINT "_InsigniaToUsuario_B_fkey" FOREIGN KEY ("B") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
