import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from 'src/modules/file/file.module';
import { CateModule } from 'src/modules/cate/cate.module';
import { ArticleModule } from 'src/modules/article/article.module';
import { RoleModule } from 'src/modules/role/role.module';
import { ResourceModule } from 'src/modules/resource/resource.module';
import { UserModule } from 'src/modules/user/user.module';
import configuration from 'src/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      entities: [__dirname + '../../**/*.entity{.ts,.js}'],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
    }),
    FileModule,
    CateModule,
    ArticleModule,
    RoleModule,
    ResourceModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
