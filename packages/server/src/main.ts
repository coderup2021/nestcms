import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/modules/app/app.module';
import * as express from 'express';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(path.join(__dirname, '..', 'public'));
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/static',
  });
  app.setBaseViewsDir(path.join(__dirname, '..', 'src/views'));
  //   app.setViewEngine('ejs');
  app.setViewEngine('ejs');
  await app.listen(8001, '0.0.0.0');
}
bootstrap();
