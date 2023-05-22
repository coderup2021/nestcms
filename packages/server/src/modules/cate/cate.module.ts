import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CateService } from './cate.service';
import { CateController } from './cate.controller';
import { Cate as CateEntity } from './cate.entity';
import { Article as ArticleEntity } from 'src/modules/article/article.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([CateEntity, ArticleEntity]),
    ConfigModule,
  ],
  providers: [CateService],
  controllers: [CateController],
  exports: [CateService],
})
export class CateModule {}
