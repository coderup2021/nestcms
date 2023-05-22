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
} from '@nestjs/common';
import { IResource } from 'src/interface';
import { ResourceService } from './resource.service';

@Controller('/api/resource')
export class ResourceController {
  constructor(private readonly service: ResourceService) {}

  @Get('/:id')
  async detail(@Param('id') id: number) {
    const resource = await this.service.findOne({ id });
    return { status: 0, data: resource };
  }

  @Get('/')
  async list() {
    const list = await this.service.findMany({});
    return { status: 0, data: list };
  }

  @Post('/')
  async create(@Body() body: IResource) {
    const { name, langKey, url, method, parentId, path, type, order, show } =
      body;
    if (parentId !== 0 && !(await this.service.exists({ id: parentId }))) {
      throw new HttpException('parentResourceNotExist', HttpStatus.BAD_REQUEST);
      return;
    }
    const { id } = await this.service.create({
      name,
      langKey,
      url,
      method,
      parentId,
      path,
      type,
      order,
      show,
    });
    return { status: 0, data: { id } };
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() body: IResource) {
    const { name, langKey, url, method, parentId, path, type, order, show } =
      body;
    if (parentId !== 0 && !this.service.exists({ parentId })) {
      throw new HttpException('parentResourceNotExist', HttpStatus.BAD_REQUEST);
      return;
    }
    if (!this.service.exists({ id })) {
      throw new HttpException('ResourceNotExist', HttpStatus.BAD_REQUEST);
      return;
    }
    await this.service.update({
      id,
      name,
      langKey,
      url,
      method,
      parentId,
      path,
      type,
      order,
      show,
    });
    return { status: 0, data: { id } };
  }

  @Delete('/:ids')
  async delete(@Param('ids') ids: string) {
    await this.service.delete(ids.split(',').map((id) => Number(id)));
    return { status: 0 };
  }
}
