import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User as UserEntity } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from 'src/modules/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ConfigModule, RoleModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
