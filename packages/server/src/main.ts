import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/modules/app/app.module';
import * as express from 'express';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use('/static', express.static(path.join(__dirname, '../dist/uploads')));
  //   app.setVi('ejs');
  app.useStaticAssets(path.join(__dirname, '..', 'public'));
  app.setBaseViewsDir(path.join(__dirname, '..', 'src/views'));
  //   app.setViewEngine('ejs');
  app.setViewEngine('ejs');
  await app.listen(8001);
}
bootstrap();
