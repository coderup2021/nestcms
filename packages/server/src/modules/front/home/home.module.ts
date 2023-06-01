import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HomeController } from './home.controller';

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [HomeController],
})
export class HomeModule {}
