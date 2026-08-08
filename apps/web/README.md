# @jeo/web — Frontend

Aplicación frontend de JEO construida con **Next.js 16** (App Router), **React 19** y **Tailwind CSS 4**.

## Arquitectura

```
src/
├── app/
│   ├── globals.css             # Design system (tokens del wireframe)
│   ├── layout.tsx              # Root layout (fonts + SEO metadata)
│   └── page.tsx                # Home: compone las 11 secciones
├── lib/
│   └── api.ts                  # Cliente HTTP centralizado + fallback data
└── components/
    ├── ui/                     # Componentes reutilizables
    │   ├── Button.tsx          # CTA con flecha y borde rojo
    │   ├── Chip.tsx            # Pills de sub-temas (filled/outlined)
    │   ├── Tag.tsx             # Etiquetas de recursos
    │   ├── SectionHeader.tsx   # Eyebrow + título de sección
    │   ├── StatCard.tsx        # Estadística individual
    │   ├── Dropdown.tsx        # Menú desplegable con animación
    │   └── Placeholder.tsx     # Placeholder visual para imágenes TODO
    └── features/               # Secciones del wireframe
        ├── UtilityStrip.tsx    # Barra superior negra
        ├── Navbar.tsx          # Navegación principal
        ├── Hero.tsx            # Banner principal
        ├── StatsStrip.tsx      # Franja de 4 estadísticas (RSC)
        ├── UniverseSection.tsx # Sección 01 (RSC)
        ├── SolarSystemSection.tsx  # Sección 02 (RSC)
        ├── ConstellationsSection.tsx  # Sección 03 (RSC)
        ├── NewsSection.tsx     # Sección 04 (RSC)
        ├── GallerySection.tsx  # Sección 05 (RSC)
        ├── ExploreSection.tsx  # Sección 06
        └── Footer.tsx          # Footer completo
```

## Estrategia de Componentes

### Server Components (RSC)

Los componentes que obtienen datos de la API son **React Server Components** por defecto:

- `StatsStrip` — Obtiene estadísticas
- `UniverseSection` — Obtiene pestañas del universo
- `SolarSystemSection` — Obtiene planetas y lunas
- `ConstellationsSection` — Obtiene constelaciones y recursos
- `NewsSection` — Obtiene noticias
- `GallerySection` — Obtiene colección destacada

### Client Components (`'use client'`)

Solo los componentes que necesitan interactividad del navegador:

- `Navbar` — Interacción de menús dropdown
- `Dropdown` — Hover + click + teclado

### UI vs Features

| Directorio | Propósito | Ejemplo |
|------------|-----------|---------|
| `components/ui/` | Componentes genéricos reutilizables | `Button`, `Chip`, `Tag` |
| `components/features/` | Secciones específicas del wireframe | `Hero`, `NewsSection`, `Footer` |

## Design System

Los tokens de diseño están definidos en `globals.css` y mapean exactamente al wireframe original:

```css
/* Colores principales */
--color-navy: #0B1B33;
--color-yellow: #FFC72C;
--color-red: #E4002B;

/* Tipografía */
--font-barlow: 'Barlow Condensed';  /* Títulos */
--font-inter: 'Inter';              /* Cuerpo */
```

Las fuentes se cargan vía `next/font/google` para optimización automática.

## Cliente HTTP

El archivo `src/lib/api.ts` centraliza todas las llamadas a la API:

```typescript
import { getStats, getNews, getUniverse } from '@/lib/api';

// En un Server Component:
const stats = await getStats();
```

### Fallback Data

Cuando la API no está disponible, el cliente retorna **datos mock** que replican el contenido del wireframe. Esto permite:

- 🎨 Desarrollar la UI sin levantar el backend
- 🏗️ Build de producción sin base de datos
- ⚡ Previews rápidos en CI/CD

## Configuración

### Variables de Entorno

```bash
cp .env.example .env
```

| Variable | Default | Descripción |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api` | URL base de la API |

## Ejecución

```bash
# Desarrollo (con Turbopack)
pnpm dev

# Build de producción
pnpm build

# Servir producción
pnpm start
```

## Placeholders de Imágenes

Todas las imágenes del wireframe están representadas con el componente `<Placeholder>`. Para reemplazarlas con imágenes reales:

1. Buscar `// TODO:` en los archivos de `components/features/`
2. Reemplazar `<Placeholder>` con `<Image>` de `next/image`
3. Agregar las imágenes a `public/` o servir desde un CDN

## Responsive

El diseño incluye breakpoints responsive (≤ 900px) que adaptan:

- Navbar colapsa a una columna
- Grids de secciones pasan a 1 columna
- Planet grid: 8 cols → 4 cols
- News cards: divider vertical → horizontal
- Footer: 4 cols → 2 cols

## Docker

```dockerfile
# Multi-stage build con output: 'standalone'
# Produce un servidor Node.js autocontenido (~50 MB)
```

Puerto expuesto: `3000`
