<p align="center">
  <strong>JEO</strong><br/>
  <em>Jóvenes en Órbita</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-black?logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/NestJS-10.4-E0234E?logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/Prisma-6.x-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Docker-disabled%20(TODO)-gray?logo=docker&logoColor=white" alt="Docker (Deshabilitado - TODO)" />
</p>

---

Plataforma de **divulgación científica espacial** hecha por y para jóvenes, con foco en el ecosistema espacial argentino. Exploramos el universo, el sistema solar, constelaciones, noticias del espacio y más.

## 📐 Arquitectura

```
jeo-monorepo/
├── apps/
│   ├── api/          → Backend (NestJS + Prisma + PostgreSQL)
│   └── web/          → Frontend (Next.js + Tailwind CSS)
├── packages/
│   └── shared/       → Tipos TypeScript compartidos (End-to-End Type Safety)
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

| Capa | Tecnología | Puerto |
|------|-----------|--------|
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS 4 | `3000` |
| **Backend** | NestJS 10, Prisma ORM | `3001` |
| **Base de datos** | PostgreSQL 16 | `5432` |
| **Monorepo** | pnpm workspaces + Turborepo | — |

## 🚀 Inicio Rápido

### Prerrequisitos

- [Node.js](https://nodejs.org/) ≥ 20
- [pnpm](https://pnpm.io/) ≥ 9 (`corepack enable && corepack prepare pnpm@9.15.4 --activate`)
- [PostgreSQL](https://www.postgresql.org/) 16 (o PostgreSQL local)
- [Docker](https://www.docker.com/) y Docker Compose *(Pospuesto / TODO)*

### Opción A: Desarrollo Local

```bash
# 1. Clonar e instalar dependencias
git clone <repo-url> jeo
cd jeo
pnpm install

# 2. Configurar variables de entorno
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 3. Generar Prisma Client
pnpm db:generate

# 4. Crear tablas en la base de datos
pnpm db:migrate

# 5. Poblar datos iniciales (seed)
pnpm db:seed

# 6. Iniciar en modo desarrollo (ambas apps en paralelo)
pnpm dev
```

> **💡 Tip:** El frontend funciona **sin el backend** gracias al sistema de fallback data integrado. Podés correr solo `pnpm --filter @jeo/web dev` para trabajar en la UI.

### Opción B: Docker Compose *(Pospuesto / TODO)*

> **📌 Nota:** La integración con Docker está deshabilitada temporalmente (TODO: Re-implementar Docker Compose en el futuro).
> 
> ```bash
> # TODO: Descomentar services en docker-compose.yml antes de ejecutar:
> # docker compose up --build
> ```

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Inicia ambas apps en modo desarrollo (Turborepo) |
| `pnpm build` | Build de producción de todas las apps |
| `pnpm lint` | Ejecuta linters en todo el monorepo |
| `pnpm clean` | Limpia carpetas de build (`dist/`, `.next/`) |
| `pnpm db:generate` | Genera el Prisma Client |
| `pnpm db:migrate` | Ejecuta migraciones de Prisma |
| `pnpm db:push` | Sincroniza el schema sin crear migración |
| `pnpm db:seed` | Puebla la base de datos con datos iniciales |

Para ejecutar scripts en una app específica:

```bash
pnpm --filter @jeo/web dev     # Solo frontend
pnpm --filter @jeo/api dev     # Solo backend
```

## 🗄️ Estructura de la Base de Datos

```
┌─────────────┐     ┌──────────┐
│ GalleryCol. │────<│ Gallery  │
│             │     │ Image    │
└─────────────┘     └──────────┘

┌─────────────┐     ┌──────────┐
│   Planet    │────<│   Moon   │
└─────────────┘     └──────────┘

┌─────────────┐  ┌──────────────┐  ┌───────────────┐  ┌──────┐
│ NewsArticle │  │ UniverseTab  │  │ Constellation │  │ Stat │
└─────────────┘  └──────────────┘  └───────────────┘  └──────┘
```

## 🌐 Endpoints de la API

Todos los endpoints están bajo el prefijo `/api` y devuelven el formato estandarizado:

```json
{
  "success": true,
  "data": { ... }
}
```

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/stats` | Estadísticas de la franja superior |
| `GET` | `/api/news` | Lista de noticias espaciales |
| `GET` | `/api/news/:slug` | Detalle de noticia por slug |
| `GET` | `/api/universe` | Datos de la sección El Universo |
| `GET` | `/api/universe/tabs` | Pestañas del universo |
| `GET` | `/api/solar-system` | Sección completa (planetas + lunas) |
| `GET` | `/api/solar-system/planets` | Lista de planetas |
| `GET` | `/api/solar-system/moons` | Lista de lunas |
| `GET` | `/api/constellations` | Sección constelaciones |
| `GET` | `/api/gallery` | Todas las colecciones |
| `GET` | `/api/gallery/featured` | Colección destacada |

## 🐳 Docker *(Pospuesto / TODO)*

> **⚠️ Estado:** La configuración de Docker está deshabilitada temporalmente (archivos comentados con notas `TODO`).

- **`apps/api/Dockerfile`** — *(TODO)* Multi-stage build para NestJS con Prisma
- **`apps/web/Dockerfile`** — *(TODO)* Multi-stage build con Next.js `standalone` output
- **`docker-compose.yml`** — *(TODO)* Orquestación de servicios PostgreSQL, API y Web

### Variables de Entorno

| Variable | App | Default | Descripción |
|----------|-----|---------|-------------|
| `DATABASE_URL` | api | — | Connection string de PostgreSQL |
| `PORT` | api | `3001` | Puerto del servidor |
| `CORS_ORIGIN` | api | `http://localhost:3000` | Origen permitido para CORS |
| `NEXT_PUBLIC_API_URL` | web | `http://localhost:3001/api` | URL base de la API |

## 🧩 Paquete Compartido (`@jeo/shared`)

Tipos TypeScript compartidos entre frontend y backend para **End-to-End Type Safety**:

- `ApiResponse<T>` — Wrapper genérico de respuesta
- `StatItem`, `NewsArticle`, `Planet`, `Moon`, `Constellation`, etc.
- DTOs de creación (`CreateNewsDto`)

```typescript
import type { ApiResponse, NewsArticle } from '@jeo/shared';
```

## 📁 Secciones del Wireframe

El frontend implementa fielmente todas las secciones del wireframe original:

1. **Utility Strip** — Barra superior con links (Newsletter, Libros, Contacto)
2. **Navbar** — Logo centrado, buscador, 3 dropdowns (Cosmos, Multimedia, Quiénes somos)
3. **Hero** — Imagen full-width con overlay azul marino
4. **Stats Strip** — 4 estadísticas (93%, 8, 88, +400)
5. **El Universo** — Sección 01, imagen + chips de sub-temas
6. **Sistema Solar** — Sección 02, 8 planetas + 5 lunas
7. **Constelaciones** — Sección 03, mapa del cielo + recursos
8. **Noticias Espaciales** — 3 tarjetas de noticias
9. **Fragmentos de Memoria** — Collage fotográfico
10. **Seguí explorando** — 3 cards de navegación
11. **Footer** — Branding, links, social icons

> **📌 Nota:** Las imágenes usan placeholders estilizados. Buscar `// TODO:` en los componentes para reemplazarlas con imágenes reales.

## 🛠️ Tech Stack Detallado

| Categoría | Tecnología |
|-----------|-----------|
| **Lenguaje** | TypeScript 5.9 (strict mode) |
| **Frontend** | Next.js 16 (App Router, RSC), React 19, Tailwind CSS 4 |
| **Backend** | NestJS 10, Express |
| **ORM** | Prisma 6 |
| **Base de datos** | PostgreSQL 16 |
| **Validación** | class-validator, class-transformer |
| **Monorepo** | pnpm workspaces, Turborepo |
| **Containerización** | Docker, Docker Compose *(Pospuesto / TODO)* |
| **Fonts** | Barlow Condensed, Inter (via `next/font/google`) |

## 📄 Licencia

Este proyecto es privado. Todos los derechos reservados.
