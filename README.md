# Mate+

*Una plataforma con entrenamientos pensados para adultos, con un enfoque práctico 'gamificado', enfocada en actividades matemáticas puntuales de la vida diaria.*

![Banner](Front-End/src/assets/Visuales_Readme/Banner.png)
![Lupa](Front-End/src/assets/Visuales_Readme/Lupa.png)
---

## Nuestro equipo

<p>
<img src="Front-End/src/assets/Visuales_Readme/Sol.png" alt="Sol" width="80">
<img src="Front-End/src/assets/Visuales_Readme/sofi.png" alt="Sofia" width="80">
<img src="Front-End/src/assets/Visuales_Readme/Romi.png" alt="Romina" width="80">
<img src="Front-End/src/assets/Visuales_Readme/Lis.png" alt="Lisandro" width="80">
<img src="Front-End/src/assets/Visuales_Readme/Isaac.png" alt="Isaac" width="80">
<img src="Front-End/src/assets/Visuales_Readme/Hernan.png" alt="Hernán" width="80">
<img src="Front-End/src/assets/Visuales_Readme/Gus.png" alt="Gustavo" width="80">
<img src="Front-End/src/assets/Visuales_Readme/Flor.png" alt="Flor" width="80">
<img src="Front-End/src/assets/Visuales_Readme/Maribel.png" alt="Maribel" width="80">
<img src="Front-End/src/assets/Visuales_Readme/Cesar.png" alt="César" width="80">
</p>

---

## Estado de desarrollo

La presente es una versión "Beta" implementada para su exposición como slice de prueba conceptual en un "Demo Funcional" que permita una revisión comleta tanto en su carácter de "WebApp", como mediante un "Cliente Local Descargable" (PWA) mediante un escaneo de QR.

---

### Arquitectura

El proyecto se gestiona bajo una estructura de **Monorepo** utilizando `pnpm workspaces`. Esta configuración permite mantener el código del Back-End y del Front-End en un único repositorio "serverless", facilitando la gestión de dependencias compartidas y scripts de automatización desde la raíz del proyecto.


### Stack Tecnológico

- **UX / UI:** Plantilla **FIGMA**
- **Gestión de Paquetes:** `pnpm`
- **Librería Core:** **React** v18+
- **Tooling / Bundler:** **Vite** v6+
- **Enrutamiento:** **React Router DOM** v7+
- **Estilos / CSS:** **Bootstrap** v5.3+
- **Componentes UI:** **React Bootstrap** v2.10+
- **Cliente HTTP:** **Axios** v1.7+
- **Gestión de Formularios:** **React Hook Form** v7+
- **Validación de Esquemas:** **Zod** v3.24+
- **Runtime:** **Node.js** v24+
- **Framework:** **Express.js** v5 (Beta/LTS compatible)
- **ORM:** **Prisma** v6.4.1 (Stable - Native Engines)
- **Base de Datos:** **PostgreSQL** (vía **Supabase**)
- **Gestor de Registro e Inicio de Sesión:** **Supabase Auth**
- **Despliegue:** **Vercel**
- **Integración LLM-CLI:** (en desarrollo)
---

## Objetivos iniciales del Front-End

>
> - Construir una interfaz accesible y amigable
> - Implementar navegación entre pantallas
> - Crear sistema de módulos y micro-lecciones
> - Diseñar experiencia gamificada
> - Mantener una estructura escalable para trabajo en equipo
---

### Nodo Administrativo


Consola de relevamiento y actividades administrativas, con acceso único desde dirección web, con requerimientos de inicio de sesión como "Administrador" para su uso (en fase de desarrollo).

<p align="center">
<img src="./Front-End/src/assets/consola/01_Consola.png" alt="Preview de Consola Admin" width="600">
<p>
brinda información relativa al estado y funcionamiento del Back-End, la conexión con la Base de Datos y el status del LLM-CLI.

<p align="center">
<img src="./Front-End/src/assets/consola/02_LLM_CLI.png" alt="Preview del Módulo de Gestión del LLM_CLI" width="600">
<p>
también es punto de acceso desde el que se manejan y prueban las "condiciones de respuesta" del LLM-CLI

<p align="center">
<img src="./Front-End/src/assets/consola/03_Pauta_Seccion.png" alt="Preview Módulo de Gestión de CRUD de las Secciones" width="600">
<p>
así como donde se crean, editan, buscan, ocultan o eliminan (CRUD) los "contenidos" de las Secciones y Escenarios de la App

<p align="center">
<img src="./Front-End/src/assets/consola/04_Estadistica.png" alt="Preview del Módulo de Gestión de Estadísticas" width="600">
<p>
además es desde dónde se accede a los gráficos para "Analisis de Datos" en tiempo real.

<table>
  <tr>
    <td align="center">
      <img src="./Front-End/src/assets/consola/05_Locacion.png" alt="Captura 05" width="450">
    </td>
    <td align="center">
      <img src="./Front-End/src/assets/consola/06_Genero.png" alt="Captura 06" width="450">
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="./Front-End/src/assets/consola/07_Edad.png" alt="Captura 07" width="450">
    </td>
    <td align="center">
      <img src="./Front-End/src/assets/consola/08_Crecimiento.png" alt="Captura 08" width="450">
    </td>
  </tr>
</table>

---

#### Auditoría
Se mantiene un seguimiento de las actividades de modificación en una tabla de trazabilidad "Auditoría" para posterior revisión estadística y de acceso con permiso restringido.

---

### Estructura del Proyecto (Front-End)

```bash
proyecto-matematicas-grupo8/
├── Front-End/
├── public/
├── src/
│   ├── assets/
│       ├── Fotos/
│       ├── Visuales_Readme/
│   ├── components/
│   ├── config/
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── Images/
│   ├── mascotas/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── App.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── pnpm-lock.yaml
└── README.md
```


### Estructura del Proyecto (Back-End)

```bash
proyecto-matematicas-grupo8/
├── Back-End/
│   ├── api/
│   │   └── index.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── assets
│   │   │   ├── logonodo.png
│   │   │   ├── mascota_32.webp
│   │   │   └── mascota_510.webp
│   │   ├── config/
│   │   │   ├── prisma.js
│   │   │   └── supabase.js
│   │   ├── controllers/
│   │   │   ├── admin.controller.js
│   │   │   ├── auditoria.controller.js
│   │   │   ├── debug.controller.js
│   │   │   ├── escenario.controller.js
│   │   │   ├── progreso.controller.js
│   │   │   ├── seccion.controller.js
│   │   │   └── usuarios.controller.js
│   │   ├── exceptions/
│   │   │   └── api.exception.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── audit.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── routes/
│   │   │   ├── api.routes.js
│   │   │   ├── progreso.routes.js
│   │   │   ├── seccion.routes.js
│   │   │   └── usuarios.routes.js
│   │   ├── services/
│   │   │   └── llm-cli.service.js
│   │   ├── validators/
│   │   │   ├── seccion.validator.js
│   │   │   └── usuarios.validator.js
│   │   └── app.js
│   ├── supabase/
│   │   ├── .gitignore
│   │   └── config.toml
│   ├── .gitignore
│   ├── nodemon.json
│   ├── package.json
│   ├── vercel.json
│   ├── Readme.md
│   └── test.sql
├── Front-End/
├── .gitignore
├── .npmrc
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── Readme.md
```

### Diagrama de Entidad-Relación (ERD)

```mermaid
erDiagram
    Usuario ||--o{ Progreso : "registra"
    Usuario ||--o{ SeccionAprobada : "aprueba"
    Usuario ||--o{ Recurso : "posee"
    Usuario ||--o{ Auditoria : "genera"
    Usuario }o--o{ Insignia : "gana"

    Seccion ||--o{ Escenario : "contiene"
    Seccion ||--o{ SeccionAprobada : "es_aprobada_por"
    Seccion ||--o| Recurso : "otorga"

    Escenario ||--o{ Opcion : "ofrece"
    Escenario ||--o{ Insignia : "recompensa_con"
    Escenario ||--o{ Progreso : "mide"

    Usuario {
        string id PK
        string email UK
        string nombre
        int puntos
        int tokens
        Rol rol
        string password
        string edad
        string genero
        string lugar
        string desafio
        string sentimiento
        int racha
        DateTime ultimaConexion
        DateTime createdAt
    }

    Auditoria {
        int id PK
        string usuarioId FK
        string accion
        string entidad
        string entidadId
        Json detalles
        DateTime timestamp
    }

    Seccion {
        int id PK
        string nombre
        string descripcion
        int grado
        int puntosRequeridos
        int puntosRecompensa
        float umbralAprobacion
    }

    SeccionAprobada {
        string usuarioId PK, FK
        int seccionId PK, FK
    }

    Escenario {
        int id PK
        string titulo
        string descripcion
        string pregunta
        string explicacion
        string categoria
        int seccionId FK
    }

    Opcion {
        int id PK
        string texto
        int puntos
        int escenarioId FK
    }

    Recurso {
        string id PK
        string nombre
        int valor
        string usuarioId FK
        int seccionId UK, FK
        DateTime createdAt
    }

    Insignia {
        string id PK
        string nombre
        string descripcion
        string imagenUrl
        int puntosRequeridos
        int escenarioId FK
        DateTime createdAt
    }

    Progreso {
        int id PK
        string usuarioId FK
        int escenarioId FK
        int puntosObtenidos
        boolean resuelto
        int intentosFallidos
        DateTime updatedAt
    }
```

---


### Diagrama de Clases

```mermaid
classDiagram
    class SeccionController {
        +getSecciones(req, res, next)
        +getSeccionById(req, res, next)
        +crearSeccion(req, res, next)
        +eliminarSeccion(req, res, next)
        +actualizarSeccion(req, res, next)
    }

    class UsuariosController {
        +registrarUsuario(req, res, next)
        +loginUsuario(req, res, next)
        +eliminarUsuario(req, res, next)
        +getUsuarios(req, res, next)
        +actualizarPerfil(req, res, next)
        -cleanEnv(val: String) List
    }

    class AdminController {
        <<Protected_Route>>
        +getAdminMain(req, res)
        +getCheckupStatus(req, res, next)
        +testFeedback(req, res, next)
        +getAnalyticsData(req, res, next)
        -checkIA(models: List, retries: int) Object
    }

    class PrismaClient {
        +usuario
        +seccion
        +auditoria
        +progreso
        +$queryRaw()
    }

    class GroqSDK {
        +chat.completions.create(config)
    }

    class Validators {
        <<Utility>>
        +crearEditarSeccionSchema
        +registroSchema
        +perfilSchema
        +loginSchema
    }

    %% Relaciones de uso y dependencia
    SeccionController --> PrismaClient : "consulta / muta datos"
    SeccionController ..> Validators : "valida con Zod"

    UsuariosController --> PrismaClient : "upsert / auth usuarios"
    UsuariosController ..> Validators : "valida credenciales"

    AdminController --> PrismaClient : "agrega métricas y logs"
    AdminController --> GroqSDK : "verifica estado e interactúa"

    note for AdminController "Middleware de Autenticación
    Acceso como admin / superadmin"
```

---
### Historial

- Revisión de tecnologías y arquitectura propuesta.
- Planteo de Proyecto “Math-Path”.
- Planteo de uso de tecnologías ‘pnpm’ y Prisma.
- Planteo de despliegue Vercel “serverless”.
- Primer commit.
- Definición e implementación de Stack.
  · Configuración de modelo y entorno para la base de datos remota (Prisma).
- Esquema de entidades: Usuarios, Sección, Escenario.
  . Lógica en controladores de Secciones y Escenarios.
  · Lógica en controladores de Usuarios, Admin y Superadmin.
- Documentación en “Back-End Readme.md”.
- Actualización en repositorio
- Configuración de Bd de test en PostgreSQL.
  · Migración de esquema ‘Prisma’.
  · Sembrado de datos mock.
  · Configuración de ‘Auth’.
- Configuración e implementación de ‘servidor modular local’ funcional.
- Listado e implementación de endpoints base para testing y pruebas de impacto.
- Actualización de Documentación y repositorio.
- Implementación de Test de LogIn y Registro.
  · Test “local” de ruteo del CRUD de endpoints.
  · Branch de oficio, acceso para Q&A.
- Infraestructura para Prueba de Concepto.
  · Cuentas Google, Supabase y Vercel.
- Inicio de implementación de validaciones.
  · Implementación de biblioteca y esquemas de validación Zod.
Actualización de Back-End en "main"
- Implementación de doble origen de datos
 · con archivos locales y WebDb
- Mecanismo para respuestas de inicio de sesión,
 · registro de usuarios persistente en archivo local
- Nodo administrativo (beta)
 · Gestión de estado Back-End
 · Gestión de asistencia CLI-LLM (beta)
 · Gestión de CRUDs de contenidos (beta)
 · Gestión de grafos estadísticos
Reunión con integrantes de Front-End y Q&A
Actualización de rama “producción-test” eliminando las implementaciones de simulación para Registro, Inicio de sesión y Db, actualización de Documentación
Test de despliegue de Producción activa en Vercel con conexión a WebDb
Revisión y optimización de Back-End

---


*Proyecto desarrollado para InnovaLab por el "Equipo 8" con integrantes multidisciplinarios de distintas extracciones relativas a la "Agencia de Habilidades para el Futuro" dependiente del Ministerio de Educación de la Ciudad Autónoma de Buenos Aires, entre Mayo y Agosto de 2026.*
