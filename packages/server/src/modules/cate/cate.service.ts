import { Cate as CateEntity } from './cate.entity';
import { ICate } from 'src/interface';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CateService {
  exists: (
    attrs: FindOptionsWhere<CateEntity> | FindOptionsWhere<CateEntity>[],
  ) => Promise<CateEntity> | null;

  constructor(
    @InjectRepository(CateEntity)
    private readonly model: Repository<CateEntity>,
  ) {
    this.exists = this.findOne;
  }

  // save
  async create(param: ICate) {
    const { name, parentId, path } = param;
    const cate = new CateEntity();
    cate.name = name;
    cate.parentId = parentId;
    cate.path = path;
    const { id } = await this.model.save(cate);
    return { id };
  }

  async update(param: ICate) {
    const cate = await this.model.findOne({
      where: { id: param.id },
    });
    Object.keys(param).forEach((k) => {
      cate[k] = param[k];
    });
    return await this.model.update(param.id, cate);
  }

  async delete(ids: number[]) {
    return await this.model.delete(ids);
  }

  async findOne(
    attrs: FindOptionsWhere<CateEntity> | FindOptionsWhere<CateEntity>[],
  ) {
    return await this.model.findOne({
      where: attrs,
    });
  }

  async findMany(attrs?: FindManyOptions<CateEntity>) {
    console.log('attr======================', attrs)
    const count = await this.model.count({where: attrs.where||{}} || undefined);
    const list = await this.model.find(attrs || undefined);
    return { list, count };
  }

  //   async clear() {
  //     if (process.env.NODE_ENV === 'test') {
  //       return this.model.clear();
  //     }
  //   }
}
