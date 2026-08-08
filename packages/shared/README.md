# @jeo/shared — Tipos Compartidos

Paquete interno con interfaces y DTOs de TypeScript compartidos entre el frontend (`@jeo/web`) y el backend (`@jeo/api`), proporcionando **End-to-End Type Safety**.

## Uso

```typescript
import type { ApiResponse, NewsArticle, Planet } from '@jeo/shared';
```

El paquete se consume directamente desde el source (`src/index.ts`) en el monorepo, sin necesidad de compilar previamente.

## Tipos Disponibles

### Respuesta API

| Tipo | Descripción |
|------|-------------|
| `ApiResponse<T>` | Wrapper genérico: `{ success, data, error? }` |
| `PaginationMeta` | Metadatos de paginación |
| `PaginatedResponse<T>` | Respuesta paginada |

### Dominio

| Tipo | Archivo | Sección del wireframe |
|------|---------|----------------------|
| `StatItem` | `stats.ts` | Franja de estadísticas |
| `NewsArticle` | `news.ts` | Noticias Espaciales |
| `CreateNewsDto` | `news.ts` | DTO para crear noticias |
| `UniverseSection` | `universe.ts` | El Universo |
| `UniverseTab` | `universe.ts` | Pestañas del Universo |
| `Planet` | `solar-system.ts` | Sistema Solar |
| `Moon` | `solar-system.ts` | Lunas |
| `SolarSystemSection` | `solar-system.ts` | Sección completa |
| `Constellation` | `constellation.ts` | Constelaciones |
| `ConstellationResource` | `constellation.ts` | Recursos descargables |
| `ConstellationsSection` | `constellation.ts` | Sección completa |
| `GalleryImage` | `gallery.ts` | Fragmentos de Memoria |
| `GalleryCollection` | `gallery.ts` | Colección de galería |

## Estructura

```
packages/shared/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts              # Barrel export
    └── types/
        ├── api-response.ts   # ApiResponse<T>, PaginatedResponse
        ├── stats.ts          # StatItem
        ├── news.ts           # NewsArticle, CreateNewsDto
        ├── universe.ts       # UniverseSection, UniverseTab
        ├── solar-system.ts   # Planet, Moon, SolarSystemSection
        ├── constellation.ts  # Constellation, ConstellationResource
        └── gallery.ts        # GalleryImage, GalleryCollection
```

## Agregar Nuevos Tipos

1. Crear el archivo en `src/types/<nombre>.ts`
2. Exportar desde `src/index.ts`:
   ```typescript
   export * from './types/<nombre>';
   ```
3. El tipo estará disponible inmediatamente en `@jeo/api` y `@jeo/web`
