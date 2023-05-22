import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/modules/app/app.module';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/static', express.static(path.join(__dirname, '../dist/uploads')));
  await app.listen(8001);
}
bootstrap();
