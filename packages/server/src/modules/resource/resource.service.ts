import { Resource as ResourceEntity } from './resource.entity';
import { IResource } from 'src/interface';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ResourceService {
  exists: (
    attrs:
      | FindOptionsWhere<ResourceEntity>
      | FindOptionsWhere<ResourceEntity>[],
  ) => Promise<ResourceEntity> | null;

  constructor(
    @InjectRepository(ResourceEntity)
    private readonly model: Repository<ResourceEntity>,
  ) {
    this.exists = this.findOne;
  }

  // save
  async create(param: IResource) {
    const { name, parentId, path } = param;
    const cate = new ResourceEntity();
    cate.name = name;
    cate.parentId = parentId;
    cate.path = path;
    const { id } = await this.model.save(cate);
    return { id };
  }

  async update(param: IResource) {
    const cate = await this.model.findOne({
      where: { id: param.id },
    });
    Object.keys(param).forEach((k) => {
      cate[k] = param[k];
    });
    return await this.model.update(param.id, cate);
  }

  async delete(ids: number[]) {
    // return await this.model.delete(ids)
  }

  async findOne(
    attrs:
      | FindOptionsWhere<ResourceEntity>
      | FindOptionsWhere<ResourceEntity>[],
  ) {
    return await this.model.findOne({
      where: attrs,
    });
  }

  async findMany(attrs?: FindManyOptions<ResourceEntity>) {
    return await this.model.find(attrs || undefined);
  }
}
