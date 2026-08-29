# Reporte QA bugs 04-08-2026 — estado post-fix

Punto de rollback local (antes de estos cambios):

```bash
git reset --hard pre-qa-bugs-04-08-2026
# o
git checkout backup/pre-qa-bugs-04-08-2026
```

## Acción manual OBLIGATORIA (P0 RLS)

El código **no alcanza** para cerrar BUG-001/002/004/005/006/007/047 vía PostgREST.
Hay que ejecutar en Supabase → SQL Editor el script:

`Back-End/supabase/rls-lockdown.sql`

Eso habilita RLS, bloquea CRUD anónimo sensible, limpia `password` en claro y pone default en `Progreso.updatedAt`.

También en Supabase Auth (dashboard):

- `mailer_autoconfirm` / confirm email → **OFF** (BUG-010)
- Revisar Redirect URLs (solo prod + localhost dev) (BUG-042)
- Rotar/eliminar seeds con `User123!` / `Admin123!` de la DB de producción (BUG-039)

## Estado por bug

| ID | Estado | Notas |
|----|--------|-------|
| BUG-001 | Código + SQL | Requiere ejecutar `rls-lockdown.sql` |
| BUG-002 | Código + SQL | Ya no se guardan passwords; SQL los anula |
| BUG-003 | FIXED (código) | Login legacy → 410 en prod; sin password ni bypass |
| BUG-004 | Código + SQL | RLS |
| BUG-005 | FIXED (API) + SQL | API sanea `esCorrecta`/`respuestaCorrecta`; RLS niega REST |
| BUG-006 | FIXED (API) + SQL | `/logs` solo admin; RLS |
| BUG-007 | FIXED (API) + SQL | Perfil no acepta `rol`; RLS bloquea PATCH |
| BUG-008 | FIXED | CSP ampliada en `vercel.json` |
| BUG-009 | Ya estaba | Rate limit login |
| BUG-010 | MANUAL | Dashboard Supabase |
| BUG-011 | OK / documentado | Anon key es pública; crítica sin RLS |
| BUG-012 | FIXED | Sin fallback login backend en prod |
| BUG-013 | Ya estaba | Admin server-side |
| BUG-014 | FIXED | Avatars + `fondo-mixto.jpg` |
| BUG-015 | Aceptado SPA | Soft-404 típico de SPA; assets reales ya no caen a HTML |
| BUG-016 | FIXED | Misma política FE/BE |
| BUG-017/018 | FIXED | Sitemap + links legales |
| BUG-019 | FIXED | Sin links genéricos a redes |
| BUG-020 | FIXED | Un solo registro SW (vite-plugin-pwa) |
| BUG-021 | FIXED | Legacy login deshabilitado en prod |
| BUG-022 | Ya estaba | Alias profile |
| BUG-023 | PARTIAL | Fondo + Jugar → dashboard |
| BUG-024 | FIXED | Copy sin nombre de tabla |
| BUG-025 | SQL | Default `updatedAt` en script RLS |
| BUG-026 | PARTIAL | aria-labels en Register toggles; Login ya tenía labels |
| BUG-027 | SKIP | Dark mode / contraste amplio (fuera de alcance seguro) |
| BUG-028–031 | SKIP | A11y onboarding profunda / perf bundle / imagen login |
| BUG-032 | FIXED | og:image / twitter:image |
| BUG-033 | FIXED | `x-powered-by` off |
| BUG-034 | SKIP | Header ACAO en HTML estático Vercel |
| BUG-035 | Ya OK | Calculadora sin eval app |
| BUG-036 | FIXED | Re-auth password + `confirmacion: ELIMINAR` |
| BUG-037 | PARTIAL | Copy alineado en puntos tocados |
| BUG-038 | SKIP | E2E / entorno |
| BUG-039 | MANUAL | Limpiar seeds en prod |
| BUG-040–050 | SKIP / doc | Catálogo, tests cross-browser, insignias vacías, etc. |
| BUG-043 | FIXED | Password no se devuelve |
| BUG-047 | FIXED (API) + SQL | IDOR historial + RLS |

## Cómo verificar rápido

1. Ejecutar SQL RLS.
2. `GET` anónimo a `/rest/v1/Usuario` → debe fallar (401/empty).
3. Login UI con usuario Supabase real → dashboard OK.
4. Hacer un ejercicio → feedback desde backend.
5. Configuración → eliminar cuenta pide contraseña.
