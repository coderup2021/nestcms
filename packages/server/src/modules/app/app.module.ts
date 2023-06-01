import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from 'src/modules/file/file.module';
import { CateModule } from 'src/modules/cate/cate.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ArticleModule } from 'src/modules/article/article.module';
import { RoleModule } from 'src/modules/role/role.module';
import { ResourceModule } from 'src/modules/resource/resource.module';
import { UserModule } from 'src/modules/user/user.module';
import configuration from 'src/configuration';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { HomeModule } from 'src/modules/front/home/home.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    JwtModule.register({secret: 'hardtoguess'}),
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
    AuthModule,
    FileModule,
    CateModule,
    ArticleModule,
    RoleModule,
    ResourceModule,
    UserModule,
    HomeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('');
  }
}
