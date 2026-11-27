import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";

/**
 * Configuración compartida de la aplicación NestJS.
 * Se utiliza tanto en `src/main.ts` (desarrollo/Docker) como en `api/index.ts` (Vercel Serverless).
 */
export function configureApp(app: INestApplication): ConfigService {
  const configService = app.get(ConfigService);

  // Helmet - Cabeceras de seguridad HTTP
  app.use(helmet());

  // Global prefix
  app.setGlobalPrefix("api");

  // CORS dinámico (soporta múltiples orígenes separados por coma y previews *.vercel.app)
  const rawOrigins = configService.get<string>(
    "CORS_ORIGIN",
    "http://localhost:3000",
  );
  const allowedOrigins = rawOrigins
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  const allowVercelPreviews =
    configService.get<string>("ALLOW_VERCEL_PREVIEWS", "true") !== "false";

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (
        allowVercelPreviews &&
        /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origen CORS no permitido: ${origin}`), false);
    },
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters & interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle("JEO API - Jóvenes en Órbita")
    .setDescription(
      "Documentación interactiva de la API backend de la plataforma Jóvenes en Órbita.",
    )
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("Health", "Estado de salud de la API")
    .addTag("News", "Gestión y consulta de noticias/novedades")
    .addTag("Solar System", "Exploración de planetas y sistema solar")
    .addTag("Universe", "Fichas del universo y cosmología")
    .addTag("Gallery", "Galería astronómica")
    .addTag("Constellations", "Constelaciones y mitología")
    .addTag("Stats", "Estadísticas globales de la plataforma")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    customSiteTitle: "JEO API Docs",
  });

  return configService;
}
