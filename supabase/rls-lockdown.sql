-- =============================================================================
-- Mate+ / QA 04-08: lockdown RLS en Supabase (PostgREST)
-- Ejecutar en Supabase → SQL Editor (proyecto prod) UNA VEZ.
-- Prisma/backend con DATABASE_URL (rol owner) sigue funcionando.
-- La anon/publishable key deja de poder leer/escribir tablas sensibles.
-- =============================================================================

-- Helper: usuario autenticado ve solo su fila
CREATE OR REPLACE FUNCTION public.requesting_user_id()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(auth.uid()::text, '');
$$;

-- ---------- Usuario ----------
ALTER TABLE public."Usuario" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Usuario" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "usuario_select_own" ON public."Usuario";
DROP POLICY IF EXISTS "usuario_update_own_safe" ON public."Usuario";
DROP POLICY IF EXISTS "usuario_insert_deny" ON public."Usuario";
DROP POLICY IF EXISTS "usuario_delete_deny" ON public."Usuario";

-- Solo el dueño puede leer su perfil (sin exponer listados anónimos)
CREATE POLICY "usuario_select_own" ON public."Usuario"
  FOR SELECT TO authenticated
  USING (id = auth.uid()::text);

-- Update limitado: sin rol/puntos/tokens/password vía PostgREST
-- (column-level: denegamos updates peligrosos con WITH CHECK)
CREATE POLICY "usuario_update_own_safe" ON public."Usuario"
  FOR UPDATE TO authenticated
  USING (id = auth.uid()::text)
  WITH CHECK (
    id = auth.uid()::text
    AND rol = (SELECT u.rol FROM public."Usuario" u WHERE u.id = auth.uid()::text)
    AND puntos = (SELECT u.puntos FROM public."Usuario" u WHERE u.id = auth.uid()::text)
    AND tokens = (SELECT u.tokens FROM public."Usuario" u WHERE u.id = auth.uid()::text)
    AND COALESCE(password, '') = COALESCE((SELECT u.password FROM public."Usuario" u WHERE u.id = auth.uid()::text), '')
  );

-- Nadie inserta/borra usuarios por REST (solo backend/service role)
CREATE POLICY "usuario_insert_deny" ON public."Usuario"
  FOR INSERT TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "usuario_delete_deny" ON public."Usuario"
  FOR DELETE TO anon, authenticated
  USING (false);

-- Limpiar passwords en claro (auth real está en Supabase Auth)
UPDATE public."Usuario" SET password = NULL WHERE password IS NOT NULL;

-- ---------- Progreso ----------
ALTER TABLE public."Progreso" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Progreso" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "progreso_select_own" ON public."Progreso";
DROP POLICY IF EXISTS "progreso_mutate_deny" ON public."Progreso";

CREATE POLICY "progreso_select_own" ON public."Progreso"
  FOR SELECT TO authenticated
  USING ("usuarioId" = auth.uid()::text);

CREATE POLICY "progreso_mutate_deny" ON public."Progreso"
  FOR ALL TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- Default updatedAt para inserts directos (si quedara alguno)
ALTER TABLE public."Progreso"
  ALTER COLUMN "updatedAt" SET DEFAULT NOW();

-- ---------- Opcion / Escenario (no filtrar esCorrecta por REST) ----------
ALTER TABLE public."Opcion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Opcion" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "opcion_deny_all" ON public."Opcion";
CREATE POLICY "opcion_deny_all" ON public."Opcion"
  FOR ALL TO anon, authenticated
  USING (false)
  WITH CHECK (false);

ALTER TABLE public."Escenario" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Escenario" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "escenario_deny_all" ON public."Escenario";
CREATE POLICY "escenario_deny_all" ON public."Escenario"
  FOR ALL TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- ---------- Auditoria ----------
ALTER TABLE public."Auditoria" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Auditoria" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auditoria_deny_all" ON public."Auditoria";
CREATE POLICY "auditoria_deny_all" ON public."Auditoria"
  FOR ALL TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- ---------- SeccionAprobada / Recurso / Insignia ----------
ALTER TABLE public."SeccionAprobada" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SeccionAprobada" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "sa_select_own" ON public."SeccionAprobada";
DROP POLICY IF EXISTS "sa_mutate_deny" ON public."SeccionAprobada";
CREATE POLICY "sa_select_own" ON public."SeccionAprobada"
  FOR SELECT TO authenticated
  USING ("usuarioId" = auth.uid()::text);
CREATE POLICY "sa_mutate_deny" ON public."SeccionAprobada"
  FOR INSERT TO anon, authenticated WITH CHECK (false);

ALTER TABLE public."Recurso" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Recurso" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "recurso_select_own" ON public."Recurso";
DROP POLICY IF EXISTS "recurso_mutate_deny" ON public."Recurso";
CREATE POLICY "recurso_select_own" ON public."Recurso"
  FOR SELECT TO authenticated
  USING ("usuarioId" = auth.uid()::text);
CREATE POLICY "recurso_mutate_deny" ON public."Recurso"
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

-- Catálogo pedagógico: lectura pública OK (documentado). Escritura denegada.
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['Seccion','Rama','Leccion','Consejo','Insignia']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_select_public', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_mutate_deny', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (true)',
      t || '_select_public', t
    );
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO anon, authenticated USING (false) WITH CHECK (false)',
      t || '_mutate_deny', t
    );
  END LOOP;
END $$;
