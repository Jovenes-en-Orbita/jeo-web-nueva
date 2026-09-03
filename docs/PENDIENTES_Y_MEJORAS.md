# 📋 Análisis de Pendientes, Mejoras y Roadmap (JEO)

Documento de seguimiento sobre las tareas pendientes (`TODO`s), mejoras de arquitectura, funcionalidades faltantes y plan de desarrollo para la plataforma **Jóvenes en Órbita (JEO)**.

---

## 📌 1. Pendientes Explícitos (`TODO`s en Código y Docs)

### 🐳 Docker y Docker Compose (Pospuesto / Inactivo)
- **Estado actual:** Archivos como `docker-compose.yml`, `apps/api/Dockerfile` y `apps/web/Dockerfile` se encuentran deshabilitados o comentados con notas `TODO`.
- **Falta:** 
  - Re-implementar la configuración multi-stage para NestJS/Prisma.
  - Re-implementar Next.js con soporte `output: 'standalone'`.
  - Descomentar y validar el orquestado en `docker-compose.yml`.

### 🖼️ Reemplazo de Imágenes y Placeholders
- **Estado actual:** Componentes como `Placeholder.tsx`, portadas del Universo en la API y tarjetas del frontend utilizan SVG/placeholders estilizados CSS.
- **Falta:** 
  - Subir/conectar imágenes reales del espacio (Hubble, JWST, etc.).
  - Integrar un servicio de almacenamiento en la nube (Cloudinary, S3, Supabase Storage) en lugar de depender únicamente de URLs estáticas.

### ✉️ Servicio de Emails / Newsletter Masivo
- **Estado actual:** El backend incluye `mail.service.ts` y `newsletter.service.ts` preparados para integraciones con proveedores como Resend.
- **Falta:** 
  - Configurar las credenciales reales (`RESEND_API_KEY`) en entorno de producción.
  - Diseñar y validar la plantilla HTML definitiva para la emisión de boletines.

---

## 🛠️ 2. Mejoras y Funcionalidades Faltantes

### 🎨 Frontend (Next.js 16 + Tailwind 4)
- **Paginación y Filtros Dinámicos:**
  - Implementar paginación (offset o cursor-based) y búsqueda por texto libre en secciones como Noticias y Galería.
- **Subida de Archivos en Panel Admin (`/admin`):**
  - Actualmente las URLs de imágenes se ingresan como campos de texto (`string`). Se requiere un componente de carga drag-and-drop con vista previa.
- **Manejo Global de Sesión / Auth State:**
  - Optimizar el refresco de token o la experiencia ante expiración de sesión en la Intranet Admin sin perder cambios no guardados.

### ⚙️ Backend (NestJS 10 + Prisma)
- **Caché y Optimización de API:**
  - Implementar memoria caché (`@nestjs/cache-manager` o Redis) en endpoints de alta frecuencia de lectura (`/api/stats`, `/api/solar-system`, `/api/constellations`).
- **Rate Limiting (Protección Anti-Spam):**
  - Agregar `@nestjs/throttler` a endpoints de formularios públicos (`/api/newsletter`, `/api/applications`) para prevenir ataques de denegación o spam.

---

## 🧪 3. Pruebas y Calidad de Código (Testing)

### 🃏 Pruebas Unitarias e Integración (Jest)
- Crear cobertura de tests unitarios para los servicios principales de NestJS (`NewsService`, `NewsletterService`, `ApplicationsService`).
- Crear tests unitarios para utilidades y componentes clave en el Frontend.

### 🎭 Pruebas End-to-End (Playwright)
- Configurar y escribir flujos E2E críticos:
  1. Formulario de postulación de voluntarios (`/unite`).
  2. Suscripción al Newsletter.
  3. Login de administrador y publicación de noticias (`/admin/noticias`).

---

## 📊 Prioridades Sugeridas

| Prioridad | Tarea | Componentes Afectados |
| :--- | :--- | :--- |
| 🔴 **Alta** | **Subida de Imágenes / Assets Reales** | Frontend (`web`), Backend (`api`) |
| 🟡 **Media** | **Rate Limiting & Seguridad** | Backend (`api`) |
| 🟡 **Media** | **Pruebas Automatizadas (Jest & Playwright)** | Frontend (`web`), Backend (`api`) |
| 🟢 **Baja** | **Docker & Docker Compose** | Infraestructura / DevOps |
