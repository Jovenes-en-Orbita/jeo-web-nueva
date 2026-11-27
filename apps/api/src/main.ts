import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { configureApp } from "./app.setup";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = configureApp(app);

  const port = configService.get<number>("PORT", 3001);
  await app.listen(port);

  console.log(`🚀 JEO API running on http://localhost:${port}/api`);
  console.log(
    `📚 Swagger documentation available at http://localhost:${port}/api/docs`,
  );
}

bootstrap();
