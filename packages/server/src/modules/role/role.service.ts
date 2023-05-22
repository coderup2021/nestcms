import { InjectRepository } from '@nestjs/typeorm';
import { Role as RoleEntity } from './role.entity';
import { Id, IRole } from 'src/interface';
import { FindManyOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { ResourceService } from 'src/modules/resource/resource.service';
import { HttpException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RoleService {
  exists: (
    attrs: FindOptionsWhere<RoleEntity> | FindOptionsWhere<RoleEntity>[],
  ) => Promise<RoleEntity> | null;

  constructor(
    @InjectRepository(RoleEntity)
    private readonly model: Repository<RoleEntity>,
    @Inject(ResourceService)
    private readonly resourceService: ResourceService, // private readonly
  ) {
    this.exists = this.findOne;
  }

  async create(param: IRole) {
    const { name, comment, resourceIds } = param;
    const role = new RoleEntity();
    role.name = name;
    role.comment = comment;
    if (resourceIds) {
      const resources = await this.resourceService.findMany({
        where: {
          id: In(resourceIds),
        },
      });
      role.resources = resources || [];
    }
    const { id } = await this.model.save(role);
    return { id };
  }

  async update(param: IRole) {
    const role = await this.model.findOne({
      where: { id: param.id },
    });
    Object.keys(param).forEach((k) => {
      if (k !== 'id' && k !== 'resourceIds') {
        role[k] = param[k];
      }
    });
    if (param.resourceIds) {
      const resources = await this.resourceService.findMany({
        where: {
          id: In(param.resourceIds),
        },
      });
      role.resources = resources;
    }

    return await this.model.update(param.id, role);
  }

  async delete(ids: number[]) {
    return await this.model.delete(ids);
  }

  async findOne(
    attrs: FindOptionsWhere<RoleEntity> | FindOptionsWhere<RoleEntity>[],
  ) {
    return await this.model.findOne({
      where: attrs,
      relations: ['resources'],
    });
  }

  async findMany(attrs?: FindManyOptions<RoleEntity>) {
    return await this.model.find(attrs || undefined);
  }

  async getRolesByIds(ids: Id[]) {
    const roles = await this.model.find({
      where: {
        id: In(ids),
      },
    });
    if (roles.length < ids.length) {
      throw new HttpException('roleMaybeNotExist', 400);
    }
    return roles;
  }
}
