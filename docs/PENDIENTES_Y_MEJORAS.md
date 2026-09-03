# 📋 Análisis de Pendientes, Mejoras y Roadmap (JEO)

Documento de seguimiento sobre las tareas pendientes (`TODO`s), mejoras de arquitectura, funcionalidades faltantes y plan de desarrollo para la plataforma **Jóvenes en Órbita (JEO)**.

---

## ✅ 0. Estado de Avance - Etapas Completadas

### 🚀 Etapa 2: Buscador de Imágenes Gratuitas (NASA/Unsplash), Caché & Paginación (`COMPLETADA`)
- **🚀 Buscador de Imágenes Gratuitas Libres de Derechos (`FreeImagePicker`):**
  - **Backend (`MediaModule`):** Implementado `media.service.ts` y `media.controller.ts` para consultar las APIs oficiales de la **NASA** y **Unsplash** (libres para uso comercial público).
  - **Frontend UI:** Creado el componente modal `FreeImagePicker.tsx` e integrado en la Intranet Admin (`/admin/noticias`). Permite buscar por etiquetas (*marte, nebulosa, apollo, hubble*), previsualizar fotos y autocompletar la URL y los créditos de autor con un solo clic.
- **⚡ Caché & Rendimiento de API (`@nestjs/cache-manager`):**
  - Configurado `CacheModule` globalmente en `apps/api/src/app.module.ts` (5 min de TTL).
  - Decorados endpoints de lectura masiva con `@UseInterceptors(CacheInterceptor)` en `/api/solar-system` y `/api/stats`.
- **📄 Paginación Estandarizada:**
  - Incorporados parámetros `page` y `limit` en `/api/news` y retorno estructurado con metadatos (`items`, `total`, `page`, `totalPages`).
- **🧪 Cobertura de Pruebas Unitarias (Jest):**
  - **22 de 22 tests unitarios pasados exitosamente** (5 test suites pasados: `media`, `news`, `newsletter`, `applications`, `auth`).

### 🛡️ Etapa 1: Seguridad, Cabeceras HTTP y Rate Limiting (`COMPLETADA`)
- **Cabeceras HTTP (`helmet`):** Integrado en `apps/api/src/main.ts` para proteger la API NestJS contra vulnerabilidades como XSS, Clickjacking, MIME sniffing, etc.
- **Protección Anti-Spam (`@nestjs/throttler`):**
  - Configurado `ThrottlerGuard` globalmente en `apps/api/src/app.module.ts` (60 req/min).
  - Aplicados límites estrictos en: `/api/newsletter/subscribe` (5/min), `/api/applications` (3/hora), `/api/auth/login` (5/min contra fuerza bruta).
- **Frontend E2E (Playwright):** Test E2E `tests/application-flow.spec.ts` para validar el flujo completo de postulación de voluntarios (`/unite`).

---

## 📌 1. Pendientes Explícitos (`TODO`s en Código y Docs)

### 🐳 Docker y Docker Compose (Pospuesto / Inactivo)
- **Estado actual:** Archivos como `docker-compose.yml`, `apps/api/Dockerfile` y `apps/web/Dockerfile` se encuentran deshabilitados o comentados con notas `TODO`.
- **Falta:** 
  - Re-implementar la configuración multi-stage para NestJS/Prisma.
  - Re-implementar Next.js con soporte `output: 'standalone'`.
  - Descomentar y validar el orquestado en `docker-compose.yml`.

### ✉️ Servicio de Emails / Newsletter Masivo
- **Estado actual:** El backend incluye `mail.service.ts` y `newsletter.service.ts` preparados para integraciones con proveedores como Resend.
- **Falta:** 
  - Configurar las credenciales reales (`RESEND_API_KEY`) en entorno de producción.
  - Diseñar y validar la plantilla HTML definitiva para la emisión de boletines.

---

## 🛠️ 2. Mejoras y Funcionalidades Faltantes (Próximas Etapas)

### 🎨 Frontend (Next.js 16 + Tailwind 4)
- **Manejo Global de Sesión / Auth State:**
  - Optimizar el refresco de token o la experiencia ante expiración de sesión en la Intranet Admin sin perder cambios no guardados.
- **Subida Local Directa (Cloud Storage):**
  - Opcional: Integrar un bucket de almacenamiento (S3 / Cloudinary / Supabase Storage) si se requiere subir archivos locales de los administradores en lugar de usar la biblioteca libre de la NASA/Unsplash.

---

## 📊 Matriz de Prioridades Actualizada

| Prioridad | Tarea | Estado | Componentes Afectados |
| :--- | :--- | :--- | :--- |
| ✅ **Completado** | **Helmet, Rate Limiting & Testing Base** | `FINALIZADO` | Backend (`api`), Frontend (`web`) |
| ✅ **Completado** | **Buscador de Fotos Gratis (NASA/Unsplash), Caché y Paginación** | `FINALIZADO` | Backend (`api`), Frontend (`web`) |
| 🟡 **Media** | **Almacenamiento Directo de Archivos Locales (S3/Cloudinary)** | `PENDIENTE` | Backend (`api`), Frontend (`web`) |
| 🟢 **Baja** | **Docker & Docker Compose** | `POSPUESTO` | Infraestructura / DevOps |
