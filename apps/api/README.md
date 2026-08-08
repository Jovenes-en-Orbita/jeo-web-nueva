# @jeo/api — Backend API

Servidor backend de JEO construido con **NestJS**, **Prisma** y **PostgreSQL**.

## Arquitectura

```
src/
├── main.ts                     # Bootstrap (CORS, ValidationPipe, prefijo /api)
├── app.module.ts               # Root module
├── prisma/
│   ├── prisma.service.ts       # PrismaClient con lifecycle hooks
│   └── prisma.module.ts        # Módulo global
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts    # Normaliza errores → ApiResponse
│   └── interceptors/
│       └── transform.interceptor.ts    # Envuelve respuestas → { success, data }
└── modules/
    ├── stats/                  # GET /api/stats
    ├── news/                   # GET /api/news, /api/news/:slug
    ├── universe/               # GET /api/universe, /api/universe/tabs
    ├── solar-system/           # GET /api/solar-system, /planets, /moons
    ├── constellations/         # GET /api/constellations
    └── gallery/                # GET /api/gallery, /api/gallery/featured
```

### Patrón de Módulos

Cada módulo sigue la arquitectura **feature-based** de NestJS:

```
modules/<feature>/
├── <feature>.module.ts       # Registra controller y service
├── <feature>.controller.ts   # Define rutas HTTP
└── <feature>.service.ts      # Lógica de negocio + queries Prisma
```

## Configuración

### Variables de Entorno

```bash
cp .env.example .env
```

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PORT` | `3001` | Puerto del servidor |
| `DATABASE_URL` | — | PostgreSQL connection string |
| `CORS_ORIGIN` | `http://localhost:3000` | Origen permitido para CORS |

### Base de Datos (Prisma)

```bash
# Generar Prisma Client
pnpm exec prisma generate

# Crear/aplicar migraciones
pnpm exec prisma migrate dev

# Poblar datos iniciales
pnpm exec prisma db seed

# Abrir Prisma Studio (GUI)
pnpm exec prisma studio
```

### Modelos de la Base de Datos

| Modelo | Tabla | Descripción |
|--------|-------|-------------|
| `Stat` | `stats` | Estadísticas de la franja superior |
| `NewsArticle` | `news_articles` | Noticias espaciales |
| `UniverseTab` | `universe_tabs` | Pestañas de la sección Universo |
| `Planet` | `planets` | Planetas del sistema solar |
| `Moon` | `moons` | Lunas (relación con Planet) |
| `Constellation` | `constellations` | Constelaciones |
| `GalleryCollection` | `gallery_collections` | Colecciones de galería |
| `GalleryImage` | `gallery_images` | Imágenes (relación con Collection) |

## Ejecución

```bash
# Desarrollo (hot-reload)
pnpm dev

# Producción
pnpm build
pnpm start
```

## Formato de Respuesta

Todas las respuestas siguen el formato estandarizado:

```json
// Éxito
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "data": null,
  "error": "Mensaje descriptivo del error"
}
```

Esto se logra mediante:
- **`TransformInterceptor`** — Envuelve automáticamente toda respuesta exitosa
- **`HttpExceptionFilter`** — Captura excepciones y las normaliza

## Validación

Los DTOs usan `class-validator` con `ValidationPipe` global configurado con:
- `whitelist: true` — Remueve propiedades no definidas en el DTO
- `forbidNonWhitelisted: true` — Rechaza propiedades desconocidas
- `transform: true` — Transforma automáticamente tipos primitivos

## Docker

```dockerfile
# Multi-stage build (3 stages)
# deps → build (con prisma generate) → production (node:20-alpine)
```

Puerto expuesto: `3001`
