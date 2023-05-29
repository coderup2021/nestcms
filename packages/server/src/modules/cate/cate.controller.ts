import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { QueryOption, IArticle, ICate } from 'src/interface';
import { buildPageQuery } from 'src/util';
import { FindManyOptions, Like } from 'typeorm';
import { CateService } from './cate.service';

@Controller('api/cate')
export class CateController {
  constructor(private readonly service: CateService) {}
  @Get('/:id')
  async detail(@Param('id') id: number) {
    const cate = await this.service.findOne({ id });
    return { status: 0, payload: cate };
  }

  async buildQuery(option: FindManyOptions, fields: ICate) {
    const where = {};
    Object.keys(fields).forEach((k) => {
      const value = fields[k];
      if (k === 'name') {
        where[k] = Like(`%${value}%`);
      }
    });
    option.where = where;
    return option;
  }

  @Get('/')
  async list(@Query() query: ICate & QueryOption) {
    const queryAttr = await this.buildQuery(...buildPageQuery(query));
    const { list, count } = await this.service.findMany(queryAttr);
    const { current, pageSize } = query;
    return {
      status: 0,
      payload: {
        data: list,
        pageSize,
        current,
        total: count,
      },
    };
  }

  @Post('/')
  async create(@Body() body: ICate) {
    const { name, parentId, path } = body;
    if (parentId !== 0 && !(await this.service.exists({ id: parentId }))) {
      throw new HttpException('parentCateNotExist', HttpStatus.BAD_REQUEST);
    }
    const { id } = await this.service.create({
      name,
      parentId,
      path,
    });
    return { status: 0, payload: { id } };
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() body: ICate) {
    const { name, parentId, path } = body;
    if (parentId !== 0 && !this.service.exists({ parentId })) {
      throw new HttpException('parentCateNotExist', HttpStatus.BAD_REQUEST);
    }
    if (!this.service.exists({ id })) {
      throw new HttpException('CateNotExist', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.service.update({
        id,
        name,
        parentId,
        path,
      });
      return { status: 0, payload: { id } };
    } catch (error) {
      throw new HttpException(error.toString(), 400);
    }
  }

  @Delete('/:ids')
  async delete(@Param('ids') ids: string) {
    await this.service.delete(ids.split(',').map((id) => Number(id)));
    return { status: 0 };
  }
}
