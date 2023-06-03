import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HomeController } from './home.controller';
import { ArticleModule } from 'src/modules/article/article.module';

@Module({
  imports: [ConfigModule, ArticleModule],
  controllers: [HomeController],
})
export class HomeModule {}
