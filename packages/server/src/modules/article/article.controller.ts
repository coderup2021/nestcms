import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IArticle } from 'src/interface';
import { buildPageQuery } from 'src/util';
import { FindManyOptions, Like } from 'typeorm';
import { ArticleService } from './article.service';

@Controller('api/article')
export class ArticleController {
  constructor(private readonly service: ArticleService) {}

  @Get('/:id')
  async detail(@Param('id') id: number) {
    const article = await this.service.findOne({ id });
    return { status: 0, payload: article };
  }

  async buildQuery(option: FindManyOptions, fields: IArticle) {
    const where = {};
    Object.keys(fields).forEach((k) => {
      const value = fields[k];
      if (k === 'title') {
        where[k] = Like(`%${value}%`);
      } else if (k === 'cateId') {
        where[k] = value;
      }
    });
    option.where = where;
    return option;
  }
  @Get('/')
  async list(@Query() query) {
    const queryAttr = await this.buildQuery(...buildPageQuery(query));
    const { list, count } = await this.service.findMany(queryAttr);
    return {
      status: 0,
      payload: {
        data: list,
        total: count,
        current: query.current,
        pageSize: query.pageSize,
      },
    };
  }

  @Post('/')
  async create(@Body() body: IArticle) {
    const { title, content, description, editorType, cateId, picture } = body;
    const { id } = await this.service.create({
      title,
      content,
      description,
      editorType,
      cateId,
      picture,
    });
    return { status: 0, payload: { id } };
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() body: IArticle) {
    const { editorType, title, content, description, cateId, picture } = body;
    await this.service.update({
      title,
      content,
      description,
      editorType,
      id,
      cateId,
      picture,
    });
    return { status: 0, payload: { id } };
  }

  @Delete('/:ids')
  async delete(@Param('ids') ids: string) {
    await this.service.delete(ids.split(',').map((id) => Number(id)));
    return { status: 0 };
  }
}
