import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import express, { type Request, type Response } from "express";
import { AppModule } from "../src/app.module";
import { configureApp } from "../src/app.setup";

const expressApp = express();
let isInitialized = false;

async function bootstrapServerless() {
  if (isInitialized) return;
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  configureApp(app);
  await app.init();
  isInitialized = true;
}

export default async function handler(req: Request, res: Response) {
  await bootstrapServerless();
  return expressApp(req, res);
}
