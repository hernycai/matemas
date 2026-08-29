# Mate+ — Reporte QA bugs (informe 01-08)

**Fecha:** 2026-08-01  
**Ambiente prod:** https://matemas.vercel.app / https://matemas-back.vercel.app/api  
**Alcance:** Revisión del PDF *Test - Mate + - BUGS 01-08* (BUG-001 a BUG-038)

---

## Resumen

| Estado | Cantidad |
|--------|----------|
| Corregidos en código (listos tras deploy) | ~32 |
| Pendientes / parciales | ~6 |
| Ya OK / no reproducibles como se reportó | ~1–2 |

---

## Corregidos (para re-test en producción)

Tras el deploy de este push, revalidar:

| ID | Título | Qué verificar |
|----|--------|---------------|
| BUG-001 | Login credenciales inválidas | Mensaje claro (alert/toast); email no se borra; password puede limpiarse |
| BUG-002 | Rutas aprendizaje sin auth | `/desafios`, `/ejercicios`, `/ejercicios2` → redirect a `/login` |
| BUG-003 | Reset password → localhost | Link del mail apunta a prod `/reset-password` *(ver nota Supabase abajo)* |
| BUG-004 | Form login method GET | `<form method="post">` |
| BUG-005 / 027 | Headers seguridad FE | XFO, nosniff, Referrer-Policy, Permissions-Policy, CSP `frame-ancestors` |
| BUG-006 | CORS `*` + credentials | ACAO whitelist (`matemas.vercel.app` / localhost) |
| BUG-007 | Rate limit login API | Tras ~10 intentos → 429 |
| BUG-008 | JSON malformado → 500 | Body inválido → 400 |
| BUG-009 | Navbar Calculadora | Abre modal de calculadora |
| BUG-010 | ¿Qué es MATE+? | Scroll a `#about` / deep-link `/#about` |
| BUG-011 | Footer links | Legal a `/terminos` y `/privacidad`; Equipo → `/nosotros`; Foro/Blog “próximamente” |
| BUG-012 | 404 copy dominio | Texto “inicio de Mate+”, link a `/` |
| BUG-013 | `GET /usuarios/desafio-actual` | Existe (auth); PATCH sigue vigente |
| BUG-015 | Contraste footer | Links oscuros `#0A3D91` |
| BUG-016 | Brand sin nombre a11y | `aria-label="Mate+ inicio"` |
| BUG-017 | Landmark main / skip | Landing con skip link + `<main>` |
| BUG-018 | autocomplete / required | Login y registro |
| BUG-019 | Focus visible | Outline visible al tabular |
| BUG-020 | SEO básico | meta description, OG, `robots.txt`, `sitemap.xml` |
| BUG-021 | PWA manifest | `lang=es`, `display=standalone`, `start_url=/` |
| BUG-022 | Logs verbosos en prod | Sin `console.log` de debug en producción |
| BUG-024 | `/profile` vs `/perfil` | `/profile` redirige a `/perfil` |
| BUG-025 | Claim “+100 CURSOS” | Copy: “RUTAS DE ESTUDIO” |
| BUG-026 | Iconos sociales Nosotros | Ya tenían `aria-label` |
| BUG-028 | Recordarme | Sin marcar → sesión solo del navegador (sessionStorage) |
| BUG-029 | `/auth/callback` sin sesión | Mensaje + botón a login (sin redirect silencioso) |
| BUG-030 | YouTube embed | Uso de `youtube-nocookie` + title *(OAuth Google: re-test manual)* |
| BUG-031 | Admin `/admin-be` | Front exige rol `admin` o `superadmin` |
| BUG-034 | Toast tapa navbar | Toast top-center bajo navbar |
| BUG-036 | Paths legales | Aliases `/terminos` y `/privacidad` |
| BUG-037 | Validación password registro | Front alineado: 8+, mayúscula y especial |
| BUG-038 | Icono Google en register | Mismo SVG de Google que login |

### Nota operativa (BUG-003)

En Supabase → Authentication → URL Configuration → Redirect URLs, debe figurar:

`https://matemas.vercel.app/reset-password`

Sin eso, el mail de recuperación puede fallar aunque el front ya envíe el `redirectTo` correcto.

---

## Pendientes (enviar a desarrollo / siguiente sprint)

### 1. BUG-014 — Performance / Lighthouse (Alta)

- Bundle principal ~1.2MB; LCP alto; Performance ~66.
- **Causa:** poco code-splitting; libs pesadas en el entry.
- **Sugerencia:** `React.lazy` por rutas (dashboard, ejercicios, charts), diferir recharts, optimizar imágenes LCP.
- **Estado:** no abordado en este ciclo (cambio grande de bundling).

### 2. BUG-023 — RLS / seguridad Supabase (Media–Alta residual)

- La anon/publishable key en el front es esperable; el riesgo real es **RLS débil**.
- **Pendiente:** auditoría en Supabase de políticas RLS en todas las tablas expuestas por PostgREST; confirmar que nunca hay `service_role` en front.
- **Estado:** fuera de este PR de app; requiere checklist en dashboard + tests de acceso anónimo.

### 3. BUG-032 — Ejercicio `/ejercicios2` sin teclado (Alta a11y)

- Drag-and-drop de precios solo con pointer; sin alternativa teclado / ARIA live.
- **Sugerencia:** botones Mover/Seleccionar, patrón listbox o teclado con `aria-grabbed`, instrucciones visibles.
- **Estado:** pendiente (rediseño UX del componente DnD).

### 4. BUG-035 — Service Worker / cache stale post-deploy (Baja)

- Ya hay `skipWaiting` + `clientsClaim`.
- Falta UX de “Hay una nueva versión — Recargar”.
- **Estado:** parcial.

### 5. BUG-030 (parte OAuth) — Google login E2E (Media)

- Embeds YouTube mejorados; flujo Google OAuth **no automatizado** en QA.
- **Pendiente de test manual:** login con Google en prod tras consent screen / usuarios de prueba.

### 6. BUG-033 (residual) — Alts / copy EN-ES (Baja)

- Manifest e idioma principal alineados a `es`.
- Pueden quedar alts genéricos en assets viejos (`button`, etc.).
- **Estado:** parcial; cleanup cosmético.

---

## Checklist sugerido para re-test (QA)

1. Deploy Front + Back en Vercel completado.  
2. Agregar Redirect URL de reset en Supabase.  
3. Re-ejecutar casos **críticos**: 001, 002, 003, 004, 006, 009, 013.  
4. Smoke a11y: tab focus, footer contraste, logo SR.  
5. Confirmar que `/desafios` sin sesión no muestra contenido.  
6. Abrir informe de **pendientes** (014, 023, 032) como issues del próximo sprint.

---

## Contacto / alcance de este ciclo

Correcciones aplicadas en rama `main` (auth, rutas, CORS, headers, footer/legal, reset password, rate limit, SEO/PWA básicos, a11y básicos).  

Los ítems de la sección **Pendientes** quedan fuera del alcance inmediato y requieren trabajo aparte.
