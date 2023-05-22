import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  HttpException,
  Delete,
} from '@nestjs/common';
import { IRole } from 'src/interface';
import { RoleService } from './role.service';

@Controller('/api/role')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @Get('/:id')
  async detail(@Param('id') id: number) {
    const role = await this.service.findOne({ id });
    return { status: 0, data: role };
  }

  @Get('/')
  async list() {
    const list = await this.service.findMany({
      relations: ['resources'],
    });
    return { status: 0, data: list };
  }

  @Post('/')
  async create(@Body() body: IRole) {
    const { name, comment, resourceIds } = body;
    if (await this.service.exists({ name })) {
      throw new HttpException(`roleNameExist: ${name}`, 400);
      return;
    }
    const { id } = await this.service.create({
      name,
      comment,
      resourceIds,
    });

    return { status: 0, data: { id } };
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() body: IRole) {
    const { name, comment, resourceIds } = body;
    if (!(await this.service.exists({ id }))) {
      throw new HttpException('RoleNotExist', 400);
      return;
    }
    await this.service.update({
      id,
      name,
      comment,
      resourceIds,
    });
    return { status: 0, data: { id } };
  }

  @Delete('/:ids')
  async delete(@Param('ids') ids: string) {
    await this.service.delete(ids.split(',').map((id) => Number(id)));
    return { status: 0 };
  }
}
