import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Helmet - Cabeceras de seguridad HTTP
  app.use(helmet());

  // Global prefix
  app.setGlobalPrefix('api');


  // CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', 'http://localhost:3000'),
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
    .setTitle('JEO API - Jóvenes en Órbita')
    .setDescription('Documentación interactiva de la API backend de la plataforma Jóvenes en Órbita.')
    .setVersion('1.0')
    .addTag('Health', 'Estado de salud de la API')
    .addTag('News', 'Gestión y consulta de noticias/novedades')
    .addTag('Solar System', 'Exploración de planetas y sistema solar')
    .addTag('Universe', 'Fichas del universo y cosmología')
    .addTag('Gallery', 'Galería astronómica')
    .addTag('Constellations', 'Constelaciones y mitología')
    .addTag('Stats', 'Estadísticas globales de la plataforma')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'JEO API Docs',
  });

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);

  console.log(`🚀 JEO API running on http://localhost:${port}/api`);
  console.log(`📚 Swagger documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();

