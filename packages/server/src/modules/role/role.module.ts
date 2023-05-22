import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role as RoleEntity } from './role.entity';
import { ConfigModule } from '@nestjs/config';
import { ResourceModule } from 'src/modules/resource/resource.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity]),
    ConfigModule,
    ResourceModule,
  ],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
