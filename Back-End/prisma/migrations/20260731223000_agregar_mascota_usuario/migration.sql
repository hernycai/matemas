-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS "mascota" TEXT NOT NULL DEFAULT 'multi';
